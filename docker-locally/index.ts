import express from "express";
import Dockerode from "dockerode";

interface RunDockerRequest {
  projectId: string;
  gitURL: string;
}

const app = express();
const PORT = 9000;
const docker = (() => {
  if (process.platform === "win32") {
    // Docker Desktop on Windows exposes the engine over a named pipe
    return new Dockerode({ socketPath: "//./pipe/docker_engine" });
  }

  return new Dockerode({ socketPath: "/var/run/docker.sock" });
})();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

app.use(express.json());

app.use((req, res, next) => {
  Object.entries(corsHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function toDockerEnv(entries: Array<[string, string | undefined]>) {
  return entries.reduce<string[]>((env, [key, value]) => {
    if (value) {
      env.push(`${key}=${value}`);
    }

    return env;
  }, []);
}

async function runDocker(projectId: string, gitURL: string) {
  const imageName = process.env.BUILDER_IMAGE ?? "rapidserve-builder";
  let container: any;

  try {
    container = await docker.createContainer({
      Image: imageName,
      Tty: false,
      AttachStdout: true,
      AttachStderr: true,
      Env: toDockerEnv([
        ["PROJECT_ID", projectId],
        ["GIT_REPOSITORY__URL", gitURL],
        ["REDIS_URL", process.env.REDIS_URL],
        ["AWS_REGION", process.env.AWS_REGION],
        ["AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID],
        ["AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY],
      ]),
      HostConfig: {
        AutoRemove: true,
      },
    });

    await container.start();

    void container.wait().catch((error: unknown) => {
      console.error(`Container ${container.id} failed:`, error);
    });

    return {
      containerId: container.id,
      image: imageName,
    };
  } catch (err) {
    console.error("Failed to create/start container:", err);
    throw err;
  }
}

app.get("/", (_req, res) => {
  res.send("Docker Runner is running.");
});

app.post("/project", async (req, res) => {
  try {
    const { projectId, gitURL } = req.body as RunDockerRequest;

    if (!projectId || !gitURL) {
      return res.status(400).json({
        status: "error",
        message: "projectId and gitURL are required",
      });
    }

    getRequiredEnv("REDIS_URL");
    getRequiredEnv("AWS_REGION");
    getRequiredEnv("AWS_ACCESS_KEY_ID");
    getRequiredEnv("AWS_SECRET_ACCESS_KEY");

    const output = await runDocker(projectId, gitURL);

    return res.status(202).json({
      status: "success",
      output,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Docker runner error:", error);
    return res.status(500).json({
      status: "error",
      message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
