import rateLimit from "express-rate-limit";

export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many requests, please try again later.",
    },
});


export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10, // 10 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many authentication attempts, please try again later.",
    },
});


export const projectDeploymentRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // 5 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many project deployment attempts, please try again later.",
    },
});

export const passwordResetRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // 5 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message:
            "Too many password reset attempts, please try again later.",
    },
});
