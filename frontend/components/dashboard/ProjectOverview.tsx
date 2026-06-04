"use client";

import React from "react";
import Link from "next/link";
import { Clock, Github, ExternalLink, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ProjectOverviewProps {
  project: Project;
  redeploying: boolean;
  redeployStatus: string;
  handleRedeploy: () => Promise<void>;
}

export function ProjectOverview({
  project,
  redeploying,
  redeployStatus,
  handleRedeploy,
}: ProjectOverviewProps) {
  const getCleanGitRepo = (url: string) => {
    if (!url) return "";
    return url.replace("https://github.com/", "").replace(".git", "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Meta details column */}
      <Card className="border-border bg-card/45 md:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Deployment Information</CardTitle>
          <CardDescription>Details about current active container provisioning</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Project Name</span>
              <span className="text-sm font-medium">{project.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Subdomain Domain</span>
              <span className="text-sm font-mono text-primary hover:underline">
                <a href={`https://${project.subdomain}.proxy.surajv.dev`} target="_blank" rel="noreferrer">
                  {project.subdomain}.proxy.surajv.dev
                </a>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-border/60 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Created At</span>
              <span className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                {new Date(project.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase">Repository Source</span>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium flex items-center gap-1.5 hover:underline hover:text-foreground text-muted-foreground transition-colors"
              >
                <Github className="size-3.5 text-foreground shrink-0" />
                <span className="truncate">{getCleanGitRepo(project.githubUrl)}</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground uppercase">Docker Deploy Target</span>
            <span className="text-sm font-medium font-mono text-foreground/80 bg-background/50 border border-border/60 px-2 py-1 rounded w-fit text-xs">
              AWS ECS Fargate Task Definition
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick action card */}
      <Card className="border-border bg-card/45 shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Build & Redeploy</CardTitle>
            <CardDescription>Rebuild and roll out container static assets</CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed flex flex-col gap-3">
            <p>
              Triggering a build fetches the latest changes from your GitHub repository, bundles the assets, and pushes the built output to static storage.
            </p>
            {redeployStatus && (
              <div className="p-3 bg-muted/30 border border-border rounded text-[11px] font-mono leading-normal text-foreground/90 max-h-24 overflow-y-auto">
                {redeployStatus}
              </div>
            )}
          </CardContent>
        </div>
        <CardFooter className="border-t border-border bg-muted/5 pt-4">
          <Button
            onClick={handleRedeploy}
            disabled={redeploying}
            className="w-full font-semibold gap-1.5 h-10"
          >
            {redeploying ? (
              <Loader2 className="animate-spin size-4" data-icon="inline-start" />
            ) : (
              <Play className="size-4" data-icon="inline-start" />
            )}
            Trigger Build
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
