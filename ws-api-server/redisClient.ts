import Redis from "ioredis";

// Use environment variable, gracefully handle TLS if needed
const subscriber = new Redis(process.env.REDIS_URL!, {
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

subscriber.on("error", (err) => {
  console.error("Redis error:", err);
});
subscriber.on("connect", () => {
  console.log("Redis connected successfully");
});

export { subscriber };
