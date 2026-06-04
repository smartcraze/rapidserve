"use client";

import React, { useState, useEffect } from "react";
import { Github, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchWithAuth } from "@/lib/auth-custom";
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

interface ProjectSettingsProps {
  projectId: string;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  onDeleteSuccess: () => void;
}

export function ProjectSettings({
  projectId,
  project,
  setProject,
  onDeleteSuccess,
}: ProjectSettingsProps) {
  // Update state
  const [name, setName] = useState(project.name);
  const [subdomain, setSubdomain] = useState(project.subdomain);
  const [gitUrl, setGitUrl] = useState(project.githubUrl);
  const [savingSettings, setSavingSettings] = useState(false);
  const [subdomainError, setSubdomainError] = useState("");
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (subdomain === project.subdomain) {
      setSubdomainError("");
      return;
    }

    if (!subdomain) {
      setSubdomainError("Subdomain prefix is required.");
      return;
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (cleanSubdomain !== subdomain) {
      setSubdomainError("Subdomain contains invalid characters.");
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSubdomain(true);
      setSubdomainError("");
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/check-slug/${subdomain}`
        );
        const data = await response.json();
        if (response.ok && data.data) {
          if (data.data.exists && !data.data.ownedByUser) {
            setSubdomainError("This subdomain is already taken by another user.");
          } else if (data.data.exists && data.data.ownedByUser && data.data.projectId !== projectId) {
            setSubdomainError("You already have another project using this subdomain.");
          } else {
            setSubdomainError("");
          }
        }
      } catch (err) {
        console.error("Error checking subdomain:", err);
      } finally {
        setCheckingSubdomain(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain, project.subdomain, projectId]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gitUrl || !subdomain) {
      toast.error("All settings fields are required.");
      return;
    }

    setSavingSettings(true);

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/${projectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, githubUrl: gitUrl, subdomain }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update project settings.");

      setProject(data.data);
      toast.success("Settings updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred saving settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteProject = async () => {
    if (deleteConfirmText !== project.slug) {
      toast.error("Confirmation text does not match project slug.");
      return;
    }

    setDeleting(true);

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/projects/${projectId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete project.");
      }

      toast.success("Project deleted successfully!");
      setDeleteOpen(false);
      onDeleteSuccess();
    } catch (err: any) {
      toast.error(err.message || "An error occurred deleting the project.");
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 max-w-3xl">
      {/* General Settings */}
      <Card className="border-border bg-card/45 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">General Project Configuration</CardTitle>
          <CardDescription>Update your project name, Git connection, and slug subdomain</CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdateSettings}>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="projName">Project Name</Label>
                <Input
                  id="projName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/40 border-border h-10"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subdomain">Subdomain Prefix</Label>
                <div className="relative">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    className={`bg-background/40 border-border h-10 font-mono text-xs pr-8 ${
                      subdomainError ? "border-destructive/60 focus-visible:ring-destructive" : ""
                    }`}
                    required
                  />
                  {checkingSubdomain && (
                    <div className="absolute right-2.5 top-3">
                      <Loader2 className="animate-spin size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {subdomainError && (
                  <p className="text-[11px] text-destructive font-medium mt-0.5">{subdomainError}</p>
                )}
                {!subdomainError && subdomain && subdomain !== project.subdomain && !checkingSubdomain && (
                  <p className="text-[11px] text-green-400 font-medium mt-0.5">Subdomain is available!</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gitUrl">GitHub Connection URL</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  id="gitUrl"
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                  className="pl-9 bg-background/40 border-border h-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border bg-muted/5 pt-4 flex justify-end">
            <Button type="submit" disabled={savingSettings || checkingSubdomain || !!subdomainError} className="font-semibold">
              {savingSettings && <Loader2 className="animate-spin size-4 mr-2" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-red-400">Danger Zone</CardTitle>
          <CardDescription className="text-red-300/60">
            Irreversible administrative tasks that could delete your project and built assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-200/70 leading-relaxed">
            Deleting this project will permanently remove it from the databases and wipe all associated static files hosted on the AWS S3 buckets. You cannot undo this step.
          </p>
        </CardContent>
        <CardFooter className="border-t border-red-500/10 bg-red-500/10 pt-4 flex justify-end">
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="font-semibold gap-1.5">
                <Trash2 className="size-4" data-icon="inline-start" />
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card max-w-md">
              <DialogHeader className="flex flex-col gap-1">
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Delete {project.name}?
                </DialogTitle>
                <DialogDescription>
                  Are you absolutely sure you want to proceed? This will delete the project metadata, all deployments, and S3 assets.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 py-3">
                <p className="text-xs text-muted-foreground">
                  Please type <strong className="font-mono text-foreground font-semibold">{project.slug}</strong> to confirm deletion.
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={project.slug}
                  className="bg-background/40 border-border font-mono text-sm"
                />
              </div>

              <DialogFooter className="border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteOpen(false);
                    setDeleteConfirmText("");
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                  disabled={deleting || deleteConfirmText !== project.slug}
                >
                  {deleting ? <Loader2 className="animate-spin size-4 mr-2" /> : "Delete Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
