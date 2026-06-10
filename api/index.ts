import express from "express";
import http from "http";
import { Server } from "socket.io";
import Redis from "ioredis";
import cors from "cors";

import { userRouter } from "./routes/user.routes";
import { projectRouter } from "./routes/project.routes";
import { errorHandler } from "./middleware/error.middleware";
import { env } from "./lib/env";

const app = express();

const PORT = 9000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const REDIS_URL = env.REDIS_URL;

if (!REDIS_URL) {
  console.warn("Missing REDIS_URL");
}

const subscriber = new Redis(REDIS_URL!);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("subscribe", (channel: string) => {
    console.log(`Socket subscribed to ${channel}`);

    socket.join(channel);

    socket.emit("message", `Joined ${channel}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);

async function initRedisSubscribe() {
  console.log("Subscribed to logs....");

  await subscriber.psubscribe("logs:*");

  subscriber.on("pmessage", (_, channel, message) => {
    io.to(channel).emit("message", message);
  });

  subscriber.on("error", (err) => {
    console.error("Redis Error:", err);
  });
}

initRedisSubscribe();

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`API + Socket Server Running on ${PORT}`);
});

process.on("SIGINT", async () => {
  await subscriber.quit();

  process.exit(0);
});