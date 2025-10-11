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
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9000";

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

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
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
              channel: channelId,
            }),
          );
        }
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

          // Handle different message types
          if (data.log) {
            setMessages((prev) => [
              ...prev,
              {
                type: "log",
                content: data.log,
                timestamp: Date.now(),
              },
            ]);
          } else if (data.message) {
            setMessages((prev) => [
              ...prev,
              {
                type: "system",
                content: data.message,
                timestamp: Date.now(),
              },
            ]);
          } else if (data.error) {
            setError(data.error);
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
          channel: newChannelId,
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
