"use client";

import Link from "next/link";
import { Github, Rocket, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { launchSignals } from "@/components/landing/content";
import { PipelinePreview } from "@/components/landing/pipeline-preview";

export function HeroSection() {
  return (
    <section className="relative border-b border-border/70">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,--theme(--color-primary/14),transparent_35%),radial-gradient(circle_at_top_right,--theme(--color-accent/18),transparent_30%),linear-gradient(to_bottom,--theme(--color-background),--theme(--color-background))]" />
      <div className="absolute left-1/2 top-24 h-64 w-2xl -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <Badge variant="outline" className="mb-6 gap-2 rounded-full border-border bg-card/70 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-foreground shadow-sm">
              <Zap className="size-3.5 text-primary" />
              Design system is token-first
            </Badge>

            <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Deploy from GitHub with a console that feels calm, precise, and fast.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              RapidServe turns a repository URL into a live deployment, streaming the build in real time and keeping every surface tied to the same global shadcn theme.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/deploy">
                <Button size="lg" className="h-12 gap-2 px-6 text-base shadow-md">
                  <Rocket className="size-4" />
                  Start Deploying
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="h-12 gap-2 px-6 text-base">
                  <Github className="size-4" />
                  See the demo
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {launchSignals.map((signal) => (
                <Card key={signal.label} className="border-border/80 bg-card/75 shadow-sm backdrop-blur">
                  <CardContent className="p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {signal.label}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-foreground">
                      {signal.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <PipelinePreview />
        </div>
      </div>
    </section>
  );
}
