import { $ } from "bun";

interface RunDockerRequest {
  projectId: string;
}

async function runDocker(projectId: string) {
  try {
    const command = $`docker run --rm \
      --env PROJECT_ID=${projectId} \
      --env GIT_REPOSITORY__URL=${process.env.GIT_REPOSITORY__URL} \
      --env REDIS_URL=${process.env.REDIS_URL} \
      --env AWS_REGION=${process.env.AWS_REGION} \
      --env AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID} \
      --env AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY} \
      build-server`;

    const result = await command;
    return result.stdout.toString();
  } catch (err: any) {
    console.error("Error:", err.message);
    throw err;
  }
}

const server = Bun.serve({
  port: 4000,
  routes: {
    "/": new Response("Docker Runner is running."),
    "/rundocker": {
      POST: async (req) => {
        try {
          const data = (await req.json()) as RunDockerRequest;

          if (!data.projectId) {
            return Response.json(
              {
                status: "error",
                message: "projectId is required",
                live: `http://${data.projectId}localhost:8000`,
              },
              { status: 400 },
            );
          }

          const output = await runDocker(data.projectId);
          return Response.json({ status: "success", output });
        } catch (err: any) {
          return Response.json(
            { status: "error", message: err.message },
            { status: 500 },
          );
        }
      },
    },
  },
});

console.log(`Server running on http://${server.hostname}:${server.port}`);
