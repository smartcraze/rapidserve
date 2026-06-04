import {
    DeleteObjectsCommand,
    ListObjectsV2Command,
    S3Client,
    CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "./env";
import { ApiError } from "./ApiError";

export const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

export const S3_BUCKET = env.BUCKET_NAME;

type DeleteS3FolderOptions = {
    bucket?: string;
    prefix: string;
};

export const deleteS3Folder = async ({
    bucket = S3_BUCKET,
    prefix,
}: DeleteS3FolderOptions): Promise<void> => {
    if (!prefix.trim()) {
        throw new ApiError(400, "S3 prefix is required");
    }

    try {
        let continuationToken: string | undefined;
        do {
            const response = await s3Client.send(
                new ListObjectsV2Command({
                    Bucket: bucket,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                })
            );

            const objects =
                response.Contents?.map((item) => ({
                    Key: item.Key,
                })).filter((item): item is { Key: string } => Boolean(item.Key)) ?? [];

            if (objects.length > 0) {
                await s3Client.send(
                    new DeleteObjectsCommand({
                        Bucket: bucket,
                        Delete: {
                            Objects: objects,
                            Quiet: true,
                        },
                    })
                );
            }

            continuationToken = response.NextContinuationToken;
        } while (continuationToken);
    } catch (error) {
        console.error("Failed to delete S3 folder:", error);
        throw new ApiError(500, "Failed to delete S3 folder");
    }
};

export const renameS3Folder = async ({
    bucket = S3_BUCKET,
    oldPrefix,
    newPrefix,
}: {
    bucket?: string;
    oldPrefix: string;
    newPrefix: string;
}): Promise<void> => {
    if (!oldPrefix.trim() || !newPrefix.trim()) {
        throw new ApiError(400, "Old and new S3 prefixes are required");
    }

    try {
        let continuationToken: string | undefined;
        do {
            const listResponse = await s3Client.send(
                new ListObjectsV2Command({
                    Bucket: bucket,
                    Prefix: oldPrefix,
                    ContinuationToken: continuationToken,
                })
            );

            const contents = listResponse.Contents ?? [];
            if (contents.length > 0) {
                // Copy each object
                for (const item of contents) {
                    if (!item.Key) continue;
                    
                    const newKey = item.Key.replace(oldPrefix, newPrefix);
                    
                    await s3Client.send(
                        new CopyObjectCommand({
                            Bucket: bucket,
                            CopySource: `${bucket}/${item.Key}`,
                            Key: newKey,
                        })
                    );
                }

                // Delete the old objects
                const deleteObjects = contents
                    .map((item) => ({ Key: item.Key }))
                    .filter((item): item is { Key: string } => Boolean(item.Key));

                await s3Client.send(
                    new DeleteObjectsCommand({
                        Bucket: bucket,
                        Delete: {
                            Objects: deleteObjects,
                            Quiet: true,
                        },
                    })
                );
            }

            continuationToken = listResponse.NextContinuationToken;
        } while (continuationToken);
    } catch (error) {
        console.error("Failed to rename S3 folder:", error);
        throw new ApiError(500, "Failed to rename S3 folder");
    }
};