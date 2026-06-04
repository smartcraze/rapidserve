"use client";

import React, { useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ProjectLogsProps {
  project: Project;
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  socketConnected: boolean;
}

export function ProjectLogs({
  project,
  logs,
  setLogs,
  socketConnected,
}: ProjectLogsProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(logs.join("\n"));
  };

  return (
    <Card className="flex-1 border-border bg-card/85 flex flex-col overflow-hidden shadow-xl min-h-[400px]">
      <CardHeader className="bg-muted/40 border-b border-border py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="size-4 text-primary" />
          <span className="font-mono text-xs text-foreground/80 font-medium">
            {project.slug}_build.log
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] uppercase font-bold py-0 ${
              socketConnected
                ? "border-green-500/30 text-green-400 bg-green-500/5"
                : "border-amber-500/30 text-amber-400 bg-amber-500/5"
            }`}
          >
            {socketConnected ? "Streaming" : "Disconnected"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Copy Logs"
            onClick={copyToClipboard}
          >
            <Copy className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-muted font-mono"
            onClick={() => setLogs(["🗑️ Logs cleared."])}
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 bg-background/50 p-4 font-mono text-[12px] leading-relaxed select-text min-h-[350px]">
        <div className="flex flex-col gap-1.5 text-foreground/90">
          {logs.map((log, i) => (
            <div key={i} className="break-all whitespace-pre-wrap">
              <span className="text-muted-foreground/60 mr-2">$</span>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </ScrollArea>
    </Card>
  );
}
