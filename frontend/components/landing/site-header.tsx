import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { githubUrl } from "@/components/landing/content";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "#demo", label: "Demo" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-border bg-card shadow-sm">
            <Image
              src="/rapidserve-cicon.png"
              alt="RapidServe"
              width={20}
              height={20}
              className="size-5 object-contain"
              priority
            />
          </div>
          <div className="leading-none">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              RapidServe
            </div>
            <div className="text-xs text-muted-foreground/80">
              Deployment console
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={githubUrl} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
              <Github className="size-4" />
              GitHub
            </Button>
          </Link>
          <Link href="/deploy">
            <Button size="sm" className="gap-2 shadow-sm">
              Enter Console
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
