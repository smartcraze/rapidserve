import { serve } from "bun";
import { generateSlug } from "random-word-slugs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import Redis from "ioredis";
import { runBuilderContainer, getProjectSlug } from "./docker-runner";

const PORT = 9000;
const USE_LOCAL_DOCKER = process.env.USE_LOCAL_DOCKER !== "false"; // Default to using local Docker

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const config = {
  CLUSTER: process.env.ECS_CLUSTER || "",
  TASK: process.env.ECS_TASK || "",
};

// Set up Redis connection with proper error handling
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const subscriber = new Redis(REDIS_URL, {
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    console.log(`Retrying Redis connection in ${delay}ms...`);
    return delay;
  },
});

const channels: Record<string, Set<import("bun").ServerWebSocket<any>>> = {};

// Store WebSocket data
const wsData = new WeakMap<
  import("bun").ServerWebSocket<any>,
  { joinedChannels: string[] }
>();

// Handle Redis connection events
subscriber.on("connect", () => {
  console.log("Redis connected successfully");
});

subscriber.on("ready", () => {
  console.log("Redis ready, subscribing to channels");
  subscriber.psubscribe("logs:*", (err) => {
    if (err) {
      console.error("Failed to subscribe to logs:* pattern:", err);
    } else {
      console.log("Successfully subscribed to logs:* pattern");
    }
  });
});

subscriber.on("error", (err) => {
  console.error("Redis error:", err);
});

subscriber.on("close", () => {
  console.log("Redis connection closed");
});

subscriber.on("pmessage", (pattern, channel, message) => {
  try {
    if (channels[channel]) {
      for (const ws of channels[channel]) {
        ws.send(message);
      }
    }
  } catch (error) {
    console.error("Error sending WebSocket message:", error);
  }
});

serve({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrade
    if (req.headers.get("upgrade") === "websocket") {
      const success = server.upgrade(req);
      if (success) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    }

    if (req.method === "POST" && url.pathname === "/project") {
      return handleProjectCreation(req);
    }

    if (url.pathname === "/") {
      return new Response("RapidServe API is running", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("WebSocket connection opened");
      wsData.set(ws, { joinedChannels: [] });
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());

        if (data.action === "subscribe" && data.channel) {
          const channel = data.channel;
          const clientData = wsData.get(ws);

          if (clientData) {
            clientData.joinedChannels.push(channel);

            if (!channels[channel]) {
              channels[channel] = new Set();
            }
            channels[channel].add(ws);

            ws.send(JSON.stringify({ message: `Joined ${channel}` }));
            console.log(`Client subscribed to channel: ${channel}`);
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    },

    close(ws, code, message) {
      console.log(`WebSocket connection closed with code: ${code}`);
      const clientData = wsData.get(ws);

      if (clientData) {
        // Remove the WebSocket from all channels it joined
        for (const channel of clientData.joinedChannels) {
          channels[channel]?.delete(ws);

          if (channels[channel]?.size === 0) {
            delete channels[channel];
          }
        }

        wsData.delete(ws);
      }
    },

    drain(ws) {
      console.log("WebSocket is ready to receive more data");
    },
  },
});

async function handleProjectCreation(req: Request) {
  try {
    const body = (await req.json()) as {
      gitURL?: string;
      slug?: string;
      useECS?: boolean;
    };
    const { gitURL, slug, useECS } = body;

    if (!gitURL) {
      return new Response(
        JSON.stringify({ error: "Git repository URL is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const projectSlug = getProjectSlug(slug);
    const useEcsDeployment = useECS || !USE_LOCAL_DOCKER;

    let result: any;

    if (useEcsDeployment) {
      // ECS deployment method (for production)
      console.log(`Using ECS deployment for project ${projectSlug}`);

      if (!config.CLUSTER || !config.TASK) {
        return new Response(
          JSON.stringify({
            error:
              "ECS configuration missing. Set ECS_CLUSTER and ECS_TASK environment variables",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }

      const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: "ENABLED",
            subnets: ["", "", ""],
            securityGroups: [""],
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: "builder-image",
              environment: [
                { name: "GIT_REPOSITORY__URL", value: gitURL },
                { name: "PROJECT_ID", value: projectSlug },
              ],
            },
          ],
        },
      });

      await ecsClient.send(command);

      result = {
        deploymentType: "ecs",
        projectSlug,
        url: `http://${projectSlug}.localhost:8000`,
      };
    } else {
      // Local Docker deployment method (for development)
      console.log(`Using local Docker deployment for project ${projectSlug}`);

      try {
        const containerInfo = await runBuilderContainer({
          gitURL,
          projectSlug,
          redisURL: process.env.REDIS_URL,
        });

        result = {
          deploymentType: "docker",
          containerId: containerInfo.containerId,
          projectSlug,
          url: `http://${projectSlug}.localhost:8000`,
        };
      } catch (error: any) {
        return new Response(
          JSON.stringify({
            error: `Docker deployment failed: ${error.message}`,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(
      JSON.stringify({
        status: "queued",
        data: result,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`);
