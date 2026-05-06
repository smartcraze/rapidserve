"use client";

import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DemoCard() {
  return (
    <motion.div
      id="demo"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-border/80 bg-card/80 shadow-2xl">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">See it in action</CardTitle>
              <CardDescription className="mt-1">
                The live walkthrough shows the same pipeline the deploy console uses.
              </CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full">
              <AlertCircle className="mr-1 size-3.5 text-amber-500" />
              Demo paused
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-6">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-4 text-sm leading-6 text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <AlertCircle className="size-4 text-amber-500" />
              Why the demo is embedded here
            </div>
            <p className="mt-2">
              It shows the current product shape without adding extra UI clutter. The video explains the backend flow, live logs, and the deployment result in one place.
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/80 bg-muted/30 shadow-lg">
            <iframe
              src="https://www.tella.tv/video/vid_cml6lghgs00e104jr2zxa0u56/embed?b=0&title=0&a=1&loop=0&t=0&muted=0&wt=0"
              className="absolute inset-0 h-full w-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="RapidServe Demo"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
