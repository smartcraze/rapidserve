import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../lib/env";
import { asyncHandler } from "../lib/asyncHandler";
import { ApiError } from "../lib/ApiError";
import { ApiResponse } from "../lib/ApiResponse";
import {
    findUserByEmail,
    findUserByResetToken,
    updateUserResetToken,
    updateUserPassword
} from "../repository/user.repository";



const forgotPasswordSchema = z.object({
    email: z.email()
});

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8)
});

export const ForgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid payload");
    }
    const { email } = parsed.data;

    const user = await findUserByEmail(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const jwtSecret = env.JWT_SECRET;

    const token = jwt.sign(
        { userId: user.id, email: user.email, purpose: "password_reset" },
        jwtSecret,
        { expiresIn: "1h" }
    );
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await updateUserResetToken(user.id, token, expires);

    console.log(`Password reset requested for ${email}. Token: ${token}`);

    return res
        .status(200)
        .json(new ApiResponse(200, { token }, "Password reset link generated. Check console/logs in dev environment."));
});

export const ResetPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid payload");
    }
    const { token, password } = parsed.data;

    const jwtSecret = env.JWT_SECRET;

    let payload: any;
    try {
        payload = jwt.verify(token, jwtSecret);

    } catch (error) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    if (!payload || typeof payload !== "object" || payload.purpose !== "password_reset") {
        throw new ApiError(400, "Invalid token purpose");
    }

    const user = await findUserByResetToken(token);
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await updateUserPassword(user.id, passwordHash);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password reset successful"));
});