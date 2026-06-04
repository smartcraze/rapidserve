import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../lib/ApiError";
import { env } from "../lib/env";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Unauthorized: Invalid token format");
    }

    const jwtSecret = env.JWT_SECRET;

    try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid or expired token");
    }
};
