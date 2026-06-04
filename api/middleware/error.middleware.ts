import type { Request, Response, NextFunction } from "express";
import type { ApiError } from "../lib/ApiError";
import { env } from "../lib/env";

export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack:
            env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};
