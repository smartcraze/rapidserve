/**
 * WebSocket client for RapidServe backend
 */
import { useEffect, useRef, useState, useCallback } from "react";

export interface LogMessage {
  log: string;
  timestamp?: number;
}

export interface WebSocketMessage {
  type: "log" | "system";
  content: string;
  timestamp: number;
}

// Base URL for WebSocket connections
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

// Message queue processor with delay
class MessageQueue {
  private queue: WebSocketMessage[] = [];
  private processing: boolean = false;
  private setMessagesFn: React.Dispatch<
    React.SetStateAction<WebSocketMessage[]>
  >;

  constructor(
    setMessagesFn: React.Dispatch<React.SetStateAction<WebSocketMessage[]>>,
  ) {
    this.setMessagesFn = setMessagesFn;
  }

  push(message: WebSocketMessage) {
    this.queue.push(message);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const message = this.queue.shift()!;

    this.setMessagesFn((prev) => [...prev, message]);

    // Add a small delay between messages (50ms)
    await new Promise((resolve) => setTimeout(resolve, 50));

    this.processQueue();
  }

  clear() {
    this.queue = [];
    this.processing = false;
  }
}

/**
 * Hook for using WebSocket connections with auto-reconnect
 * @param channelId The channel ID to subscribe to (e.g. "logs:project-slug")
 */
export function useWebSocket(channelId?: string) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const messageQueueRef = useRef<MessageQueue>(new MessageQueue(setMessages));

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    messageQueueRef.current?.clear();
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      // Clean up any existing connection
      if (socketRef.current) {
        socketRef.current.close();
      }

      // Clear previous timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Create new WebSocket connection
      const socket = new WebSocket(WS_BASE_URL);

      socket.onopen = () => {
        setIsConnected(true);
        setError(null);

        // Subscribe to channel if provided
        if (channelId) {
          socket.send(
            JSON.stringify({
              action: "subscribe",
              projectId: channelId,
            }),
          );
        }
        console.log("WebSocket connected");
      };

      socket.onclose = (event) => {
        setIsConnected(false);

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => connect(), 5000);

        if (event.code !== 1000) {
          setError("Connection lost. Reconnecting...");
        }
      };

      socket.onerror = () => {
        setError("WebSocket error occurred");
        socket.close();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);

          // Handle different message types
          if (data.status === "error") {
            setError(data.message);
          } else if (data.status === "subscribed") {
            messageQueueRef.current?.push({
              type: "system",
              content: data.message || `Subscribed to channel ${data.channel}`,
              timestamp: Date.now(),
            });
          } else {
            // Handle log messages that come as {log: string}
            const logContent =
              data.log ||
              (typeof data === "string" ? data : JSON.stringify(data));
            messageQueueRef.current?.push({
              type: "log",
              content: logContent,
              timestamp: Date.now(),
            });
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      socketRef.current = socket;
    } catch (err) {
      setError("Failed to connect to WebSocket server");

      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => connect(), 5000);
    }
  }, [channelId]);

  // Subscribe to a channel
  const subscribe = useCallback(
    (newChannelId: string) => {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        setError("WebSocket not connected");
        return;
      }

      clearMessages();

      socketRef.current.send(
        JSON.stringify({
          action: "subscribe",
          projectId: newChannelId,
        }),
      );
    },
    [clearMessages],
  );

  // Connect when component mounts or channelId changes
  useEffect(() => {
    connect();

    // Clean up WebSocket connection when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    messages,
    isConnected,
    error,
    subscribe,
    clearMessages,
  };
}
