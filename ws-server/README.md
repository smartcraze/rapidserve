# WebSocket Log Streaming Server

This WebSocket server provides real-time log streaming capabilities using Redis pub/sub and WebSocket connections.

## Getting Started

To install dependencies:

```bash
bun install
```

To run the server:

```bash
bun run index.ts
```

## Overview

The server allows clients to:

- Subscribe to log streams for specific projects
- Receive real-time logs through WebSocket connections
- Handle multiple projects and clients simultaneously

## Connection Details

- WebSocket Server URL: `ws://localhost:8080`
- Protocol: WebSocket
- Port: 8080

## Usage

### 1. Connecting to the WebSocket Server

Connect to the WebSocket server using any WebSocket client. Example using JavaScript:

```javascript
const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("Disconnected from WebSocket server");
};
```

### 2. Subscribing to Log Streams

To subscribe to logs for a specific project, send a subscription message:

```javascript
const subscriptionMessage = {
  action: "subscribe",
  projectId: "your_project_id",
};

ws.send(JSON.stringify(subscriptionMessage));
```

### 3. Server Responses

The server will respond with one of these message types:

#### Successful Subscription

```json
{
  "status": "subscribed",
  "channel": "logs:your_project_id",
  "message": "Successfully subscribed to logs:your_project_id"
}
```

#### Error Response

```json
{
  "status": "error",
  "message": "Error description here"
}
```

### 4. Log Messages

Once subscribed, you will receive log messages in real-time. The format of the log messages depends on what is published to Redis, but they will be sent directly to your WebSocket connection.

## Client Implementation Example

Here's a complete example of a client implementation:

```javascript
class LogStreamClient {
  constructor(projectId) {
    this.projectId = projectId;
    this.ws = null;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket("ws://localhost:8080");

    this.ws.onopen = () => {
      console.log("Connected to log stream");
      this.subscribe();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "error") {
          console.error("Server error:", data.message);
        } else {
          console.log("Log received:", data);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("Disconnected from log stream");
      // Implement reconnection logic here if needed
    };
  }

  subscribe() {
    const message = {
      action: "subscribe",
      projectId: this.projectId,
    };
    this.ws.send(JSON.stringify(message));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const logStream = new LogStreamClient("your_project_id");

// Cleanup when done
// logStream.disconnect();
```

## Best Practices

1. Implement reconnection logic in clients
2. Handle connection errors gracefully
3. Validate all messages before processing
4. Use proper error handling
5. Clean up WebSocket connections when no longer needed

## Redis Channel Format

The Redis channels follow this format:

```
logs:{projectId}
```

Example: `logs:project123`

---

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
