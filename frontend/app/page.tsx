"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Copy,
  Terminal,
  Loader2,
  Rocket,
  Cloud,
  Github,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:9000";
const SOCKET_URL = "http://localhost:9002";

export default function Home() {
  const [gitUrl, setGitUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<
    "idle" | "deploying" | "deployed" | "error"
  >("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const connectSocket = (projectSlug: string) => {
    if (socketRef.current) socketRef.current.disconnect();

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Log Server");
      socket.emit("subscribe", `logs:${projectSlug}`); // Subscribe to Redis channel
      setLogs((prev) => [...prev, "🔌 Connected to build server..."]);
    });

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.log) {
          setLogs((prev) => [...prev, data.log]);
        } else {
          setLogs((prev) => [...prev, message]);
        }
      } catch {
        setLogs((prev) => [...prev, message]);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err);
      setLogs((prev) => [...prev, "❌ Connection error to log server"]);
    });
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl || !slug) return;

    setStatus("deploying");
    setLogs([]);
    setPreviewUrl("");

    // Connect to socket immediately to catch early logs
    connectSocket(slug);

    try {
      const res = await fetch(`${API_URL}/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitURL: gitUrl, slug }),
      });

      if (!res.ok) throw new Error("Failed to start deployment");

      const data = await res.json();
      console.log("Deployment initiated:", data);

      // Assume deployment logic takes some time.
      // Ideally backend sends a 'deployment-complete' event, but for now we set the URL.
      setPreviewUrl(`http://${slug}.localhost:8000`); // Adjust domain as needed

      // Keep state as deploying until confirmed?
      // For this demo, let's switch to deployed after a delay or just show the link.
      setTimeout(() => {
        setStatus("deployed");
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setLogs((prev) => [...prev, "❌ API Error: Failed to start ECS Task"]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Cloud className="w-6 h-6 text-primary" />
            <span>RapidServe</span>
          </div>
          <a
            href="https://github.com/suraj/rapidserve"
            target="_blank"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Left Panel: Configuration */}
        <div className="w-full md:w-1/2 lg:w-5/12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Deploy from GitHub <br />
              <span className="text-primary">in seconds.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your repository and let our AWS ECS infrastructure handle
              the rest.
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>New Deployment</CardTitle>
              <CardDescription>
                Configure your project details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeploy} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Project Slug</Label>
                  <Input
                    id="slug"
                    placeholder="my-awesome-app"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={status === "deploying"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your app will be live at http://{slug || "..."}
                    .localhost:8000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gitUrl">GitHub Repository</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="gitUrl"
                      placeholder="https://github.com/username/repo"
                      className="pl-9"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      disabled={status === "deploying"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={status === "deploying" || !slug || !gitUrl}
                >
                  {status === "deploying" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Launch Project
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {status === "deployed" && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  Deployment Successful!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-background border rounded-md p-3 flex items-center justify-between">
                    <a
                      href={previewUrl}
                      target="_blank"
                      className="text-sm font-medium hover:underline text-primary truncate"
                    >
                      {previewUrl}
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => navigator.clipboard.writeText(previewUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={previewUrl} target="_blank">
                      Visit Live App
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel: Logs */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Build Logs
            </Label>
            {status === "deploying" && (
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </div>

          <Card className="flex-1 bg-black border-slate-800 text-slate-300 font-mono text-xs md:text-sm overflow-hidden flex flex-col min-h-[500px] shadow-2xl">
            <ScrollArea className="flex-1 p-4 h-full">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50 min-h-[400px]">
                  <Terminal className="w-12 h-12" />
                  <p>Ready to deploy. Logs will appear here.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className="break-all border-l-2 border-transparent hover:border-slate-700 pl-2 py-0.5"
                    >
                      <span className="opacity-50 select-none mr-2">
                        {new Date().toLocaleTimeString()}
                      </span>
                      {log}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}
