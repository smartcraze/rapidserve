"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAuthUser } from "@/lib/auth-custom";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Demo",
    href: "#demo-video",
  },
  {
    label: "Docs",
    href: "https://blog.surajv.dev",
  },
];

export function Navbar() {
  const [customUser, setCustomUser] = useState<any>(null);

  useEffect(() => {
    // Load custom user on mount (client-side only to prevent hydration mismatch)
    setCustomUser(getAuthUser());
  }, []);

  // Determine active user profile (Custom JWT login only)
  const activeUser = customUser
    ? {
        name: customUser.name,
        email: customUser.email,
        image: customUser.image,
      }
    : null;

  return (
    <header className="w-full py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/60 px-6 py-4 backdrop-blur bg-foreground/5">
        <Link href="/">
          <Image
            src="/full-logo.png"
            alt="RapidServe"
            width={150}
            height={150}
            className="object-contain dark:mix-blend-screen mix-blend-difference filter invert dark:invert-0"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-base font-medium text-foreground/60 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {activeUser ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-3 rounded-full border border-border/60 bg-foreground/5 px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-foreground/10 md:inline-flex"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border/80 bg-foreground/10">
                {activeUser.image ? (
                  <Image
                    src={activeUser.image}
                    alt={activeUser.name || "User profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-foreground/80">
                    {(activeUser.name || activeUser.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </span>
              <span className="max-w-40 truncate">
                {activeUser.name || "Your profile"}
              </span>
            </Link>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="hidden text-base font-medium text-foreground/70 hover:bg-foreground/5 hover:text-foreground md:inline-flex"
            >
              <Link href="/signin">Sign in</Link>
            </Button>
          )}

          <Button asChild variant="secondary">
            <Link href={activeUser ? "/dashboard" : "/signup"}>
              {activeUser ? "Dashboard" : "Get started"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}