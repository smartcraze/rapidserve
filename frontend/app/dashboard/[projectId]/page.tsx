"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import {
  ArrowLeft,
  CheckCircle,
  Loader2,
  Globe,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchWithAuth } from "@/lib/auth-custom";
import { toast } from "sonner";

// Import custom split components
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ProjectLogs } from "@/components/dashboard/ProjectLogs";
import { ProjectSettings } from "@/components/dashboard/ProjectSettings";

interface Project {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const router = useRouter();
  const { projectId } = use(params);

  // Core states
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Redeployment & Logs states
  const [redeploying, setRedeploying] = useState(false);
  const [redeployStatus, setRedeployStatus] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchProject();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [projectId]);

  const fetchProject = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/${projectId}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load project details.");
      setProject(data.data);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching project detail.");
    } finally {
      setLoading(false);
    }
  };

  const connectLogs = (subdomain: string) => {
    socketRef.current?.disconnect();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:9000";
    setLogs(["🔌 Connecting to build log server..."]);

    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("subscribe", `logs:${subdomain}`);
      setLogs((prev) => [...prev, `🟢 Connected. Subscribed to logs:${subdomain}`]);
    });

    socket.on("message", (message: string) => {
      try {
        const data = JSON.parse(message);
        setLogs((prev) => [...prev, data.log || message]);
      } catch {
        setLogs((prev) => [...prev, message]);
      }
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      setLogs((prev) => [...prev, "🔴 Disconnected from log server."]);
    });

    socket.on("connect_error", () => {
      setSocketConnected(false);
      setLogs((prev) => [...prev, "❌ Failed to connect to socket server."]);
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "logs" && project) {
      connectLogs(project.subdomain);
    } else if (value !== "logs") {
      socketRef.current?.disconnect();
      setSocketConnected(false);
    }
  };

  const handleRedeploy = async () => {
    if (!project) return;
    setRedeploying(true);
    setRedeployStatus("");
    handleTabChange("logs");
    toast.info("Triggering redeployment...");

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/deploy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gitURL: project.githubUrl, slug: project.slug }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to trigger redeployment.");
      toast.success("Redeployment initiated successfully!");
      setRedeployStatus("Deployment triggered successfully. Monitoring live build logs...");
    } catch (err: any) {
      const errMsg = err.message || "Failed to trigger redeployment.";
      setRedeployStatus(`Deployment failed: ${errMsg}`);
      toast.error(errMsg);
    } finally {
      setRedeploying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-background min-h-[400px]">
        <Loader2 className="animate-spin size-8 text-primary mb-4" />
        <p className="text-sm text-muted-foreground font-mono">Retrieving project configuration...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col gap-6">
        <Button variant="ghost" asChild className="w-fit gap-1 pl-2">
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col gap-4 border border-destructive/20 bg-destructive/10 p-6 rounded-xl">
          <h2 className="text-lg font-bold text-destructive flex items-center gap-3">
            <Loader2 className="size-6 shrink-0" />
            Error Loading Project
          </h2>
          <p className="text-sm text-muted-foreground">{error || "Project could not be found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-6 font-sans">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Projects
        </Link>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-mono text-foreground font-semibold">{project.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight font-display">{project.name}</h1>
            <Badge variant="outline" className="border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400 gap-1 text-[11px] font-semibold py-0.5">
              <CheckCircle className="size-3" />
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
            <Globe className="size-3" />
            <a href={`https://${project.subdomain}.rapidserve.fun`} target="_blank" rel="noreferrer" className="hover:underline hover:text-foreground">
              {project.subdomain}.rapidserve.fun
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleRedeploy} disabled={redeploying} variant="outline" className="border-border hover:bg-muted font-medium gap-1.5">
            {redeploying ? <Loader2 className="animate-spin size-4" /> : <RefreshCw className="size-4" />}
            Redeploy
          </Button>
          <Button asChild className="font-semibold gap-1.5">
            <a href={`https://${project.subdomain}.rapidserve.fun`} target="_blank" rel="noreferrer">
              Visit Site
            </a>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col gap-6">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
          <TabsTrigger value="overview" className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground rounded-none px-1 py-3 text-sm font-medium transition-colors">
            Overview
          </TabsTrigger>
          <TabsTrigger value="logs" className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground rounded-none px-1 py-3 text-sm font-medium transition-colors">
            Build Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground rounded-none px-1 py-3 text-sm font-medium transition-colors">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="outline-none">
          <ProjectOverview project={project} redeploying={redeploying} redeployStatus={redeployStatus} handleRedeploy={handleRedeploy} />
        </TabsContent>

        <TabsContent value="logs" className="outline-none">
          <ProjectLogs project={project} logs={logs} setLogs={setLogs} socketConnected={socketConnected} />
        </TabsContent>

        <TabsContent value="settings" className="outline-none">
          <ProjectSettings projectId={projectId} project={project} setProject={setProject} onDeleteSuccess={() => router.push("/dashboard")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
