import express from "express";
import { generateSlug } from "random-word-slugs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { Server } from "socket.io";
import Redis from "ioredis";
import cors from "cors";

const app = express();
const PORT = 9000;
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const config = {
  CLUSTER: "builder-cluster-rapidserve",
  TASK: "builder-task-def:2",
};

if (!REDIS_URL) console.warn("Missing REDIS_URL");

const subscriber = new Redis(REDIS_URL!);

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

io.listen(9002);
console.log("Socket Server running on port 9002");

const ecsClient = new ECSClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

app.use(cors());

app.post("/project", async (req, res): Promise<any> => {
  // Correct destructuring with fail-safe logging
  const { gitURL, slug } = req.body || {};
  console.log("Received payload:", req.body);

  const projectSlug = slug ? slug : generateSlug();

  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-0e26ab4c4831c0cf1",
          "subnet-0e32138468b835aab",
          "subnet-0d18d1ab519e9fc7c",
        ],
        securityGroups: ["sg-03fd9e711f664ddab"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "rapidserveimagebuildier",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: gitURL },
            { name: "PROJECT_ID", value: projectSlug },
          ],
        },
      ],
    },
  });

  try {
    await ecsClient.send(command);
    return res.json({
      status: "queued",
      data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
    });
  } catch (error: any) {
    console.error("ECS Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

async function initRedisSubscribe() {
  console.log("Subscribed to logs....");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("message", message);
  });
}

initRedisSubscribe();

app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
