import { ECSClient } from "@aws-sdk/client-ecs";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

export const config = {
    CLUSTER: "rapidserve-builder-cluster",
    TASK: "builder-task-def:3",
    BUCKET_NAME: "rapidserve.surajv.dev",
    S3_REGION: "eu-north-1"
};

export const ecsClient = new ECSClient({
    region: "eu-north-1",
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export const s3Client = new S3Client({
    region: config.S3_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});