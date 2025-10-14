import { exec } from "child_process";
import { promisify } from "util";
import { generateSlug } from "random-word-slugs";

const execAsync = promisify(exec);

interface RunContainerOptions {
  gitURL: string;
  projectSlug: string;
  redisURL?: string;
}

/**
 * Runs a builder Docker container locally in detached mode
 * @param options Container configuration options
 * @returns Container ID and project information
 */

export async function runBuilderContainer(options: RunContainerOptions) {
  const {
    gitURL,
    projectSlug,
    redisURL = process.env.REDIS_URL || "redis://localhost:6379",
  } = options;

  try {
    console.log(`Starting local Docker container for project: ${projectSlug}`);

    // Create network if it doesn't exist (ignoring errors if it already exists)
    try {
      await execAsync("docker network create rapidserve-network");
      console.log("Created rapidserve-network");
    } catch (err) {}

    const { stdout } = await execAsync(`docker run -d \
      --name rapidserve-builder-${projectSlug} \
      --network rapidserve-network \
      -e GIT_REPOSITORY__URL="${gitURL}" \
      -e PROJECT_ID="${projectSlug}" \
      -e REDIS_URL="${redisURL}" \
      -e AWS_ACCESS_KEY_ID="${process.env.AWS_ACCESS_KEY_ID || ""}" \
      -e AWS_SECRET_ACCESS_KEY="${process.env.AWS_SECRET_ACCESS_KEY || ""}" \
      build-server`);

    const containerId = stdout.trim();
    console.log(`Started container with ID: ${containerId}`);

    return {
      containerId,
      projectSlug,
      url: `http://${projectSlug}.localhost:8000`,
    };
  } catch (err: any) {
    console.error("Failed to start Docker container:", err.message);
    throw new Error(`Failed to start builder container: ${err.message}`);
  }
}

/**
 * Generates a unique project slug if none is provided
 */

export function getProjectSlug(slug?: string): string {
  return slug || generateSlug();
}
