"use client";

import { useState, useEffect, useRef } from "react";
import { useWebSocket, WebSocketMessage } from "@/lib/websocket-client";

interface LogViewerProps {
  projectSlug?: string;
}

export default function LogViewer({ projectSlug }: LogViewerProps) {
  const [channel, setChannel] = useState<string>(
    projectSlug ? `logs:${projectSlug}` : "",
  );
  const { messages, isConnected, error, subscribe, clearMessages } =
    useWebSocket(projectSlug ? `logs:${projectSlug}` : undefined);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Handle manual scrolling
  const handleScroll = () => {
    if (!logsContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;

    setAutoScroll(isScrolledToBottom);
  };

  // Handle subscribe form submission
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (channel) {
      subscribe(channel);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-medium">Project Logs</h2>

        <form onSubmit={handleSubscribe} className="flex mt-2 gap-2">
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="Enter channel (e.g. logs:project-slug)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                      bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 
                      focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Subscribe
          </button>
        </form>

        {isConnected ? (
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Connected
          </div>
        ) : (
          <div className="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            Disconnected {error && `- ${error}`}
          </div>
        )}
      </div>

      <div
        ref={logsContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4 font-mono text-sm"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No logs yet. Subscribe to a channel to see logs.
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-1 ${msg.type === "system" ? "text-blue-600 dark:text-blue-400" : ""}`}
            >
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {msg.content}
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between">
        <button
          onClick={clearMessages}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200
                    dark:hover:bg-gray-800 rounded transition-colors"
        >
          Clear logs
        </button>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoscroll"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="mr-2"
          />
          <label
            htmlFor="autoscroll"
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            Auto-scroll
          </label>
        </div>
      </div>
    </div>
  );
}
