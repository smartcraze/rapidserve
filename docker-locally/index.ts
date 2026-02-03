import { $ } from "bun";

interface RunDockerRequest {
  projectId: string;
  gitURL: string;
}

async function runDocker(projectId: string, gitURL: string) {
  try {
    const command = $`docker run --rm \
      --env PROJECT_ID=${projectId} \
      --env GIT_REPOSITORY__URL=${gitURL} \
      --env REDIS_URL=${process.env.REDIS_URL} \
      --env AWS_REGION=${process.env.AWS_REGION} \
      --env AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID} \
      --env AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY} \
      rapidserve-builder`;

    // We don't await the command here to allow "fire-and-forget"
    // The logs will be streamed via Redis
    command.catch((err) => {
      console.error("Docker build failed:", err);
    });

    return "Build started in background";
  } catch (err: any) {
    console.error("Error:", err.message);
    throw err;
  }
}

const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);

    // Common CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/") {
      return new Response("Docker Runner is running.", {
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/rundocker" && req.method === "POST") {
      try {
        const data = (await req.json()) as RunDockerRequest;

        if (!data.projectId || !data.gitURL) {
          return Response.json(
            {
              status: "error",
              message: "projectId and gitURL are required",
            },
            { status: 400, headers: corsHeaders },
          );
        }

        const output = await runDocker(data.projectId, data.gitURL);
        return Response.json(
          { status: "success", output },
          { headers: corsHeaders },
        );
      } catch (err: any) {
        return Response.json(
          { status: "error", message: err.message },
          { status: 500, headers: corsHeaders },
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Server running on http://${server.hostname}:${server.port}`);
