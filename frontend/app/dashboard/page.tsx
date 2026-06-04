"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Github,
  ExternalLink,
  ChevronRight,
  Terminal,
  Clock,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
  Activity,
  User as UserIcon,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchWithAuth, getAuthUser, User } from "@/lib/auth-custom";
import { toast } from "sonner";

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

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "projects";
  const deployParam = searchParams.get("deploy");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Deploy Dialog Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gitUrl, setGitUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [slugError, setSlugError] = useState("");
  const [checkingSlug, setCheckingSlug] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
    fetchProjects();
  }, []);

  useEffect(() => {
    if (deployParam === "true") {
      setDialogOpen(true);
    }
  }, [deployParam]);

  useEffect(() => {
    if (!dialogOpen) {
      setGitUrl("");
      setSlug("");
      setSlugError("");
      setDeployError("");
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (!slug) {
      setSlugError("");
      return;
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (cleanSlug !== slug) {
      setSlugError("Slug contains invalid characters.");
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      setSlugError("");
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/check-slug/${slug}`
        );
        const data = await response.json();
        if (response.ok && data.data) {
          if (data.data.exists) {
            if (data.data.ownedByUser) {
              setSlugError("You already have a project using this slug. Choose a different one to deploy a new project.");
            } else {
              setSlugError("This project slug/subdomain is already taken by another user.");
            }
          } else {
            setSlugError("");
          }
        }
      } catch (err) {
        console.error("Error checking slug availability:", err);
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects.");
      }
      
      if (Array.isArray(data.data)) {
        setProjects(data.data);
      } else if (data.data && Array.isArray(data.data.projects)) {
        setProjects(data.data.projects);
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      setError(err.message || "Error retrieving projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUrl) {
      toast.error("GitHub URL is required.");
      setDeployError("GitHub URL is required.");
      return;
    }

    setDeployLoading(true);
    setDeployError("");

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/deploy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gitURL: gitUrl, slug: slug || undefined }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to trigger deployment.");

      toast.success("Deployment initiated successfully!");
      setDialogOpen(false);
      setGitUrl("");
      setSlug("");
      
      const newProjectId = data.data?.project?.id;
      if (newProjectId) {
        router.push(`/dashboard/${newProjectId}`);
      } else {
        fetchProjects();
      }
    } catch (err: any) {
      const errMsg = err.message || "An error occurred starting the deployment.";
      setDeployError(errMsg);
      toast.error(errMsg);
    } finally {
      setDeployLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.githubUrl && project.githubUrl.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCleanGitRepo = (url: string) => {
    if (!url) return "";
    return url.replace("https://github.com/", "").replace(".git", "");
  };

  // Rendering Helper Components for Tabs

  // 1. Projects tab content
  const renderProjects = () => (
    <div className="flex flex-col gap-6">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-background/40 border-border"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed max-w-2xl">
          <AlertCircle className="size-5 shrink-0" />
          <p className="flex-1 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 bg-card/45 animate-pulse h-48" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/25 min-h-[300px] text-center gap-4">
          <Terminal className="size-10 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No projects found</h3>
          <Button onClick={() => setDialogOpen(true)}>Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="border-border bg-card/45 hover:bg-card/75 transition-all flex flex-col justify-between group h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold truncate max-w-[70%]">{project.name}</h2>
                  <Badge variant="outline" className="border-green-500/30 bg-green-500/5 text-green-400 gap-1 text-[10px]">
                    <CheckCircle className="size-3" /> Ready
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Github className="size-3 shrink-0" />
                  <span className="truncate">{getCleanGitRepo(project.githubUrl)}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <a href={`https://${project.subdomain}.proxy.surajv.dev`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 bg-background/50 rounded border border-border text-xs text-muted-foreground hover:text-foreground">
                  <span className="font-mono truncate">{project.subdomain}.proxy.surajv.dev</span>
                  <ExternalLink className="size-3" />
                </a>
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/10 py-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3" /> {new Date(project.createdAt).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => router.push(`/dashboard/${project.id}`)}>
                  Details <ChevronRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // 2. Deployments tab content
  const renderDeployments = () => (
    <Card className="border-border bg-card/45">
      <CardHeader>
        <CardTitle className="text-lg">Recent Deployments</CardTitle>
        <CardDescription>Container builds and executions across your projects</CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No deployments found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Deployment ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((proj) => (
                <TableRow key={proj.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-primary font-semibold">dep-{proj.id.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium">{proj.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground flex items-center gap-1.5 pt-4">
                    <Github className="size-3.5" /> {getCleanGitRepo(proj.githubUrl)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/5 text-green-400 text-[10px] py-0">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(proj.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  // 3. Activity tab content
  const renderActivity = () => (
    <Card className="border-border bg-card/45">
      <CardHeader>
        <CardTitle className="text-lg">Account Activity Feed</CardTitle>
        <CardDescription>Log of actions completed within this workspace</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {projects.map((proj, idx) => (
            <div key={idx} className="flex gap-4 items-start border-l-2 border-primary/25 pl-4 pb-2">
              <div className="size-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mt-0.5">
                <Activity className="size-3.5" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm font-medium">
                  Deployed application <strong className="font-semibold text-foreground">{proj.name}</strong>
                </p>
                <p className="text-xs text-muted-foreground">{new Date(proj.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-4 items-start border-l-2 border-primary/25 pl-4">
            <div className="size-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mt-0.5">
              <Shield className="size-3.5" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm font-medium">Workspace session created</p>
              <p className="text-xs text-muted-foreground">Authenticating successfully with credentials token.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 4. Settings tab content
  const renderSettings = () => {
    if (!user) return null;
    return (
      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Card className="border-border bg-card/45">
          <CardHeader>
            <CardTitle className="text-lg">Personal Account Profile</CardTitle>
            <CardDescription>Manage user credentials and name settings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Full Name</Label>
                <Input value={user.name || ""} className="bg-background/40" readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Username</Label>
                <Input value={user.username || ""} className="bg-background/40 font-mono" readOnly />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email Address</Label>
              <Input value={user.email} className="bg-background/40" readOnly />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-4 text-xs text-muted-foreground flex items-center gap-1.5">
            <Shield className="size-4 text-primary" /> Session active. Credentials managed via Express JWT tokens.
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Welcome banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight capitalize">{currentTab}</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal Fargate cloud containers, builds, and settings.
          </p>
        </div>

        {/* Deploy Project Dialog Trigger */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-semibold gap-1.5 h-10 shadow-lg">
              <Plus className="size-4" data-icon="inline-start" />
              Deploy New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card max-w-md">
            <DialogHeader className="flex flex-col gap-1">
              <DialogTitle className="text-xl">Create and Deploy Project</DialogTitle>
              <DialogDescription>
                Connect a GitHub repository to trigger a Fargate container build.
              </DialogDescription>
            </DialogHeader>

            {deployError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed">
                <AlertCircle className="size-4 shrink-0" />
                <p className="flex-1">{deployError}</p>
              </div>
            )}

            <form onSubmit={handleDeploy} className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gitUrl">GitHub Repository URL</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="gitUrl"
                    placeholder="https://github.com/username/repo"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    className="pl-9 bg-background/40 border-border"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="slug">Project Slug (Optional)</Label>
                  <span className="text-[10px] text-muted-foreground">Auto-generated if blank</span>
                </div>
                <div className="relative">
                  <Input
                    id="slug"
                    placeholder="my-cool-app"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    className={`bg-background/40 border-border pr-8 ${
                      slugError ? "border-destructive/60 focus-visible:ring-destructive" : ""
                    }`}
                  />
                  {checkingSlug && (
                    <div className="absolute right-2.5 top-3">
                      <Loader2 className="animate-spin size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {slugError && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">{slugError}</p>
                )}
                {!slugError && slug && !checkingSlug && (
                  <p className="text-[11px] text-green-400 font-medium mt-0.5">Slug is available!</p>
                )}
              </div>

              <DialogFooter className="border-t border-border pt-4 mt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setDialogOpen(false);
                    // Clear search params
                    router.replace("/dashboard");
                  }}
                  disabled={deployLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={deployLoading || checkingSlug || !!slugError}>
                  {deployLoading ? (
                    <>
                      <Loader2 className="animate-spin size-4" data-icon="inline-start" />
                      Deploying...
                    </>
                  ) : (
                    "Deploy Now"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Conditionally Render Content based on currentTab */}
      <div className="flex-1">
        {currentTab === "projects" && renderProjects()}
        {currentTab === "deployments" && renderDeployments()}
        {currentTab === "activity" && renderActivity()}
        {currentTab === "settings" && renderSettings()}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
