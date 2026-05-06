"use client";

import { CheckCircle2, Cpu, Workflow } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { pipelineLines } from "@/components/landing/content";

function PipelineField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-sm text-foreground/90">{value}</div>
    </div>
  );
}

function getLineClassName(line: string, index: number) {
  if (index === 0) return "text-primary";
  return line.startsWith("✓") ? "text-foreground" : "text-muted-foreground";
}

export function PipelinePreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-6 bottom-8 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
      <Card className="relative overflow-hidden border-border/80 bg-card/85 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Workflow className="size-5 text-primary" />
                Deployment pipeline
              </CardTitle>
              <CardDescription className="mt-1">
                Live preview of the active build session.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <CheckCircle2 className="mr-1 size-3.5 text-primary" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <PipelineField label="Source" value="github.com/your-team/app" />
            <PipelineField label="Destination" value="my-app.localhost:8000" />
          </div>
          <Separator />
          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 font-mono text-sm">
            {pipelineLines.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className={getLineClassName(line, index)}
              >
                {line}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-primary/7 p-4">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/12 text-primary">
              <Cpu className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">
                ECS-backed runtime with container isolation
              </div>
              <div className="text-sm text-muted-foreground">
                Logs, routing, and preview links stay in sync through the same pipeline.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
