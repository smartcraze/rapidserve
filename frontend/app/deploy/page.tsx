"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Terminal,
  Loader2,
  Rocket,
  Cloud,
  Github,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default function DeployPage() {
  const [gitUrl, setGitUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<
    "idle" | "deploying" | "deployed" | "error"
  >("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

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
      socket.emit("subscribe", `logs:${projectSlug}`);
      setLogs((prev) => [...prev, "🔌 Connected to build server..."]);
    });

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.log) {
          const logMsg = data.log;
          setLogs((prev) => [...prev, logMsg]);

          // Check for exact success message in logs to trigger "Deployed" state
          if (logMsg.includes("Deployment process completed successfully.")) {
            setStatus("deployed");
          }
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

  const handlePreDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (gitUrl && slug) {
      setShowConfirm(true);
    }
  };

  const handleDeploy = async () => {
    if (!gitUrl || !slug) return;
    setShowConfirm(false);

    setStatus("deploying");
    setLogs([]);
    setPreviewUrl("");

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

      const url = `http://${slug}.localhost:8000`;
      setPreviewUrl(url);

      // CHANGED: Removed polling as per user request to rely on logs
      // The success status will be triggered by the "Deployed" message in the logs
    } catch (err) {
      console.error(err);
      setStatus("error");
      setLogs((prev) => [...prev, "❌ API Error: Failed to start ECS Task"]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary font-sans flex flex-col">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Cloud className="w-5 h-5 text-primary" />
              </div>
              <span>
                Rapid<span className="text-primary">Serve</span>
              </span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 hidden md:flex"
            >
              <Zap className="w-3 h-3 mr-1" /> Beta
            </Badge>
            <a
              href="https://github.com/suraj/rapidserve"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Panel: Hero & Form */}
        <div className="w-full lg:w-5/12 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Deploy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                Ship Faster.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              The developer-first platform for deploying React, Next.js, and
              Node.js apps straight from GitHub.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === "idle" && !showConfirm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-border bg-card/50 backdrop-blur shadow-2xl">
                  <CardHeader>
                    <CardTitle>Start New Project</CardTitle>
                    <CardDescription>
                      Enter your repository details to deploy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreDeploy} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="slug">Project Name</Label>
                        <Input
                          id="slug"
                          placeholder="my-awesome-app"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          disabled={status === "deploying"}
                          className="bg-background/40 border-border focus:border-primary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gitUrl">GitHub URL</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="gitUrl"
                            placeholder="https://github.com/user/repo"
                            className="pl-9 bg-background/40 border-border focus:border-primary/50"
                            value={gitUrl}
                            onChange={(e) => setGitUrl(e.target.value)}
                            disabled={status === "deploying"}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full font-bold"
                        size="lg"
                        disabled={status === "deploying" || !slug || !gitUrl}
                      >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {showConfirm && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-primary/30 bg-card/80 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Ready to Launch?
                    </CardTitle>
                    <CardDescription>
                      Please review your deployment details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-md bg-background/40 border border-border space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Project:
                        </span>
                        <span className="font-mono text-sm">{slug}</span>
                      </div>
                      <Separator className="bg-border" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">
                          Repository:
                        </span>
                        <span className="font-mono text-xs text-primary/80 break-all">
                          {gitUrl}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 border-border hover:bg-secondary hover:text-foreground"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleDeploy}
                        className="flex-1 font-bold"
                      >
                        Deploy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {status === "deploying" && (
              <motion.div
                key="deploying"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/30 bg-card/50 backdrop-blur shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-primary w-6 h-6" />
                      Building Your Project...
                    </CardTitle>
                    <CardDescription>
                      Hold on! This might take a few minutes. Check the logs for
                      real-time progress.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-primary font-semibold">
                          Provisioning & Building
                        </span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress-indeterminate" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {status === "deployed" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="bg-green-500/10 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Deployed Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 p-2 bg-background/40 rounded border border-green-500/20">
                    <a
                      href={previewUrl}
                      target="_blank"
                      className="truncate text-green-400 hover:underline flex-1 text-sm font-mono"
                    >
                      {previewUrl}
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                      onClick={() => navigator.clipboard.writeText(previewUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    <Button
                      className="w-full bg-green-500 text-black hover:bg-green-400 font-bold h-12"
                      asChild
                    >
                      <a href={previewUrl} target="_blank">
                        Visit Site <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      onClick={() => {
                        setStatus("idle");
                        setSlug("");
                        setGitUrl("");
                      }}
                    >
                      Deploy Another Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Deployment Failed
                  </CardTitle>
                  <CardDescription className="text-red-400/70">
                    Check the logs for details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => setStatus("idle")}
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Panel: Terminal / Logs */}
        <div className="w-full lg:w-7/12 h-[600px] lg:h-[700px] flex flex-col">
          <Card className="flex-1 border-border bg-card/80 backdrop-blur flex flex-col overflow-hidden shadow-2xl relative">
            <div
              className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse"
              style={{ opacity: status === "deploying" ? 1 : 0 }}
            />
            <CardHeader className="bg-muted/30 border-b border-border py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground/80">
                  build_logs.log
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 bg-card p-4 font-mono text-sm">
              <div className="space-y-1">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 mt-20 opacity-50">
                    <Terminal className="w-12 h-12" />
                    <p>Waiting for deployment...</p>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-foreground/80 break-all"
                    >
                      <span className="text-muted-foreground mr-2">$</span>
                      {log}
                    </motion.div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}
