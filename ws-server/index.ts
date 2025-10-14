import { subscriber } from "./redisClient";

// Store WebSocket connections by channel
const channels: Record<string, Set<WebSocket>> = {};

// Handle Redis messages globally
subscriber.on("pmessage", (_pattern, channel, message) => {
  if (channels[channel]) {
    console.log(
      `Broadcasting message from channel ${channel} to ${channels[channel].size} clients`,
    );
    channels[channel].forEach((client) => {
      try {
        client.send(message);
      } catch (error) {
        console.error(`Error sending message to client:`, error);
        // Remove failed client
        if (channels[channel]) {
          channels[channel].delete(client);
        }
      }
    });
  }
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

subscriber.on("close", () => {
  console.log("Redis connection closed");
});

Bun.serve({
  port: 8080,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log("New WebSocket connection established");
    },

    message(ws, message) {
      try {
        const msg = message.toString();
        const data = JSON.parse(msg);

        if (!data.action || !data.projectId) {
          throw new Error("Missing required fields: action and projectId");
        }

        switch (data.action) {
          case "subscribe": {
            const channel = `logs:${data.projectId}`;

            if (!channels[channel]) {
              channels[channel] = new Set();
            }

            channels[channel].add(ws as unknown as WebSocket);

            (ws as any).subscribedChannel = channel;

            ws.send(
              JSON.stringify({
                status: "subscribed",
                channel,
                message: `Successfully subscribed to ${channel}`,
              }),
            );

            console.log(`Client subscribed to channel: ${channel}`);
            break;
          }

          default:
            ws.send(
              JSON.stringify({
                status: "error",
                message: `Unknown action: ${data.action}`,
              }),
            );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        ws.send(
          JSON.stringify({
            status: "error",
            message:
              error instanceof Error ? error.message : "Invalid message format",
          }),
        );
      }
    },

    close(ws, code, message) {
      const channel = (ws as any).subscribedChannel;
      if (channel && channels[channel]) {
        channels[channel].delete(ws as unknown as WebSocket);

        if (channels[channel].size === 0) {
          delete channels[channel];
          console.log(`Removed empty channel: ${channel}`);
        }
      }
      console.log(`WebSocket connection closed. Code: ${code}`);
    },
  },
});
