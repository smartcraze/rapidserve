import Link from "next/link";
import { Github, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { githubUrl } from "@/components/landing/content";

export function CtaSection() {
  return (
    <section className="border-t border-border/70 bg-primary py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-4xl border border-primary-foreground/10 bg-primary px-6 py-12 shadow-2xl sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,--theme(--color-primary-foreground/16),transparent_25%),radial-gradient(circle_at_bottom_left,--theme(--color-background/10),transparent_30%)]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-primary-foreground/70">
                Get started
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-primary-foreground sm:text-4xl lg:text-5xl">
                Ready to turn the repo into a running deployment?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/80 sm:text-lg">
                Open the console, enter the GitHub URL, and let the pipeline stream back a clean, understandable deployment flow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/deploy">
                <Button size="lg" variant="secondary" className="h-12 gap-2 px-6 text-base shadow-sm">
                  <Rocket className="size-4" />
                  Open console
                </Button>
              </Link>
              <Link href={githubUrl} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="h-12 gap-2 border-primary-foreground/15 bg-primary-foreground/10 px-6 text-base text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">
                  <Github className="size-4" />
                  Source code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
