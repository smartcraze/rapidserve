import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL!);

subscriber.on("error", (err) => {
  console.error("Redis error:", err);
});
subscriber.on("connect", () => {
  console.log("Redis connected successfully");
});

export { subscriber };
