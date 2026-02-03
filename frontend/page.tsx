"use client";

import { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:4000"; // Docker Runner
const WS_URL = "ws://localhost:8080"; // WS Server

export default function Home() {
  const [gitUrl, setGitUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState<"idle" | "deploying" | "deployed">(
    "idle",
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const socketRef = useRef<WebSocket | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const connectSocket = (id: string) => {
    if (socketRef.current) socketRef.current.close();

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to logs");
      ws.send(JSON.stringify({ action: "subscribe", projectId: id }));
      setLogs((prev) => [...prev, "🔌 Connected to log stream..."]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // If the message is a JSON object with a log field, use that
        if (data.log) {
          // Check if log is valid string
          const cleanLog =
            typeof data.log === "string" ? data.log : JSON.stringify(data.log);
          setLogs((prev) => [...prev, cleanLog]);
        } else if (typeof data === "string") {
          setLogs((prev) => [...prev, data]);
        }
      } catch (e) {
        // Fallback for plain text
        setLogs((prev) => [...prev, event.data]);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl || !projectId) return;

    setStatus("deploying");
    setLogs([]);
    connectSocket(projectId);

    try {
      const res = await fetch(`${API_URL}/rundocker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, gitURL: gitUrl }),
      });

      if (!res.ok) throw new Error("Failed to start deployment");

      const data = await res.json();
      console.log("Deployment started:", data);

      // Assume success, set preview URL (using the subdomain logic)
      setPreviewUrl(`http://${projectId}.localhost:8000`);
    } catch (err) {
      console.error(err);
      setLogs((prev) => [...prev, "❌ Error starting deployment"]);
      setStatus("idle");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-950 text-gray-100 font-sans">
      <div className="z-10 max-w-3xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-blue-400">RapidServe</h1>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl mb-8">
          <form onSubmit={handleDeploy} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Project ID (Slug)
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="my-app-1"
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={gitUrl}
                onChange={(e) => setGitUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "deploying"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "deploying" ? "Deploying..." : "Deploy 🚀"}
            </button>
          </form>
        </div>

        {status !== "idle" && (
          <div className="space-y-4">
            {previewUrl && (
              <div className="bg-green-900/20 border border-green-800 p-4 rounded text-center">
                <p className="text-green-400">Application deployed to:</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  className="text-xl font-bold hover:underline"
                >
                  {previewUrl}
                </a>
              </div>
            )}

            <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">Build Logs</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div
                ref={logContainerRef}
                className="h-[400px] overflow-y-auto p-4 font-mono text-xs md:text-sm text-green-400 bg-black space-y-1"
              >
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="break-all border-b border-gray-900/50 pb-1"
                  >
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <span className="text-gray-600">Waiting for logs...</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
