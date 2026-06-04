import express from "express";
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

const REDIS_URL = env.REDIS_URL;
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



app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", userRouter);
app.use("/projects", projectRouter);



async function initRedisSubscribe() {
  console.log("Subscribed to logs....");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("message", message);
  });
}

initRedisSubscribe();

app.use(errorHandler);

app.listen(PORT, () => console.log(`API Server Running..${PORT}`));
