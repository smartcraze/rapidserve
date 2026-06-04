import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../lib/env";
import { asyncHandler } from "../lib/asyncHandler";
import { ApiError } from "../lib/ApiError";
import { ApiResponse } from "../lib/ApiResponse";
import {
    createUser,
    findUserByEmail,
    findUserByUsername,
} from "../repository/user.repository";

const signupSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    image: z.url().optional()
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

const toSafeUser = (user: { passwordHash: string } & Record<string, unknown>) => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

export const SignupController = asyncHandler(async (req: Request, res: Response) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid signup payload");
    }
    const payload = parsed.data;

    const existingByEmail = await findUserByEmail(payload.email);
    if (existingByEmail) {
        throw new ApiError(409, "Email already in use");
    }

    if (payload.username) {
        const existingByUsername = await findUserByUsername(payload.username);
        if (existingByUsername) {
            throw new ApiError(409, "Username already in use");
        }
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await createUser({
        email: payload.email,
        passwordHash,
        name: payload.name ?? null,
        username: payload.username ?? null,
        image: payload.image ?? null
    });

    return res
        .status(201)
        .json(new ApiResponse(201, toSafeUser(user), "User created"));
});

export const LoginController = asyncHandler(async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid login payload");
    }
    const payload = parsed.data;
    const user = await findUserByEmail(payload.email);

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const jwtSecret = env.JWT_SECRET;

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: "7d" }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { token, user: toSafeUser(user) }, "Login success"));
});

export const LogoutController = asyncHandler(async (_req: Request, res: Response) => {
    return res
        .status(200)
        .json(new ApiResponse(200, { loggedOut: true }, "Logout success"));
});


