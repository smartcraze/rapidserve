import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string().default("eu-north-1"),
    BUCKET_NAME: z.string().default("rapidserve.surajv.dev"),
    REDIS_URL: z.string(),
    NODE_ENV: z.string().default("development")
});

type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
    const missing = result.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n");
    console.warn(`[env] Missing or invalid environment variables:\n${missing}`);
}

export const env = (result.success ? result.data : process.env) as Env;