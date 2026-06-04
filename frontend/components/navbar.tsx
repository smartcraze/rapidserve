"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAuthUser } from "@/lib/auth-custom";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 px-6 py-4 backdrop-blur bg-foreground/5">
        <Link href="/">
          <Image
            src="/full-logo.png"
            alt="RapidServe"
            width={150}
            height={150}
            className="object-contain mix-blend-screen"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-white/60 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {activeUser ? (
            <Link
              href="/dashboard"
              className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 md:inline-flex"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-white/10">
                {activeUser.image ? (
                  <Image
                    src={activeUser.image}
                    alt={activeUser.name || "User profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/80">
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
              className="hidden text-[15px] font-medium text-white/70 hover:bg-white/5 hover:text-white md:inline-flex"
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