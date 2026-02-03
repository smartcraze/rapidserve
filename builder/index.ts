import { spawn } from "child_process";
import path from "path";
import fs from "fs";
//@ts-ignore
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";
import Redis from "ioredis";

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = "rapidserve.surajv.dev";
const PROJECT_ID = process.env.PROJECT_ID;
const GIT_REPOSITORY__URL = process.env.GIT_REPOSITORY__URL;

if (!BUCKET_NAME || !PROJECT_ID || !GIT_REPOSITORY__URL) {
  console.error(
    "Error: AWS_S3_BUCKET or PROJECT_ID or GIT_REPOSITORY__URL is missing in environment variables.",
  );
  process.exit(1);
}

const publisher = new Redis(process.env.REDIS_URL!, {
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

// Optional: Add event listeners to debug connection issues
publisher.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

publisher.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

function publishLog(log: string) {
  console.log(log);
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function executeCommand(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(command, args, { cwd, shell: true });

    p.stdout.on("data", (data) => {
      publishLog(data.toString());
    });

    p.stderr.on("data", (data) => {
      publishLog(data.toString());
    });

    p.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`));
      }
    });
  });
}

/**
 * Recursively retrieves all files from a directory, including subdirectories.
 */
function getAllFiles(directoryPath: string): string[] {
  let filesList: string[] = [];
  if (!fs.existsSync(directoryPath)) return filesList;

  const directoryContents = fs.readdirSync(directoryPath);

  directoryContents.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    const itemStats = fs.statSync(itemPath);

    if (itemStats.isDirectory()) {
      filesList = filesList.concat(getAllFiles(itemPath));
    } else {
      filesList.push(itemPath);
    }
  });

  return filesList;
}

/**
 * Runs the build process for the project.
 */
async function buildProject() {
  try {
    publishLog("Starting the build process...");

    const outputDirectory = path.join(__dirname, "output");

    publishLog("Cloning repository...");
    await executeCommand(
      "git",
      ["clone", GIT_REPOSITORY__URL!, outputDirectory],
      __dirname,
    );

    if (!fs.existsSync(outputDirectory)) {
      const error = "Error: Output directory not found after cloning.";
      console.error(error);
      publishLog(error);
      process.exit(1);
    }

    publishLog("Running npm install...");
    await executeCommand("npm", ["install"], outputDirectory);

    publishLog("Running npm build...");
    await executeCommand("npm", ["run", "build"], outputDirectory);

    publishLog("Build process completed successfully.");

    const buildOutputDirectory = path.join(outputDirectory, "dist");

    if (!fs.existsSync(buildOutputDirectory)) {
      const error = "Error: Build output directory (dist) not found.";
      console.error(error);
      publishLog(error);
      process.exit(1);
    }

    const filesToUpload = getAllFiles(buildOutputDirectory);
    publishLog(`Found ${filesToUpload.length} files to upload.`);

    await uploadFilesToS3(filesToUpload, buildOutputDirectory);

    publishLog("Deployment process completed successfully.");

    // Cleanup
    await publisher.quit();
    process.exit(0);
  } catch (error: any) {
    const msg = `Error: Build process failed. ${error.message}`;
    console.error(msg, error);
    publishLog(msg);
    process.exit(1);
  }
}

/**
 * Uploads all files to the configured AWS S3 bucket.
 */
async function uploadFilesToS3(files: string[], baseDirectory: string) {
  publishLog("Uploading files...");

  const uploadPromises = files.map(async (filePath) => {
    const relativeFilePath = path.relative(baseDirectory, filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    publishLog(`Uploading: ${relativeFilePath}`);

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `__outputs/${PROJECT_ID}/${relativeFilePath}`,
      Body: fs.createReadStream(filePath),
      ContentType: mimeType,
    });

    try {
      await s3Client.send(uploadCommand);
      publishLog(`Upload successful: ${relativeFilePath}`);
    } catch (error: any) {
      const msg = `Error: Failed to upload ${relativeFilePath}. ${error.message}`;
      console.error(msg);
      publishLog(msg);
      throw error;
    }
  });

  await Promise.all(uploadPromises);
}

buildProject();
