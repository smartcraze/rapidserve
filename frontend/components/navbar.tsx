"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getAuthUser } from "@/lib/auth-custom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/full-logo.png"
            alt="RapidServe"
            width={140}
            height={140}
            className="object-contain dark:mix-blend-screen  filter invert dark:invert-0"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Desktop & Mobile Actions) */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Desktop Auth Section */}
          <div className="hidden items-center gap-4 md:flex">
            {activeUser ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2   px-3 py-1.5 text-xs font-medium text-foreground/80 "
              >
                <span className="relative h-6 w-6 overflow-hidden rounded-full border border-border/80 bg-foreground/10">
                  {activeUser.image ? (
                    <Image
                      src={activeUser.image}
                      alt={activeUser.name || "User profile"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-foreground/80">
                      {(activeUser.name || activeUser.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="max-w-28 truncate">
                  {activeUser.name || "Your profile"}
                </span>
              </Link>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Link href="/signin">Sign in</Link>
              </Button>
            )}

            <Button asChild size="sm">
              <Link href={activeUser ? "/dashboard" : "/signup"}>
                {activeUser ? "Dashboard" : "Get started"}
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l border-border bg-background/95 backdrop-blur-md p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <SheetHeader className="text-left px-0 pb-4 border-b border-border/40">
                    <SheetTitle>
                      <Link href="/" onClick={() => setIsOpen(false)}>
                        <Image
                          src="/full-logo.png"
                          alt="RapidServe"
                          width={130}
                          height={130}
                          className="object-contain dark:mix-blend-screen mix-blend-difference filter invert dark:invert-0"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Nav Links */}
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground py-2 border-b border-border/10"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Mobile Auth Actions */}
                <div className="flex flex-col gap-3 pt-6 border-t border-border/40">
                  {activeUser ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-foreground/5 border border-border/40">
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
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground truncate max-w-40">
                            {activeUser.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-40">
                            {activeUser.email}
                          </span>
                        </div>
                      </div>
                      <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        <Link href="/signin">Sign in</Link>
                      </Button>
                      <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                        <Link href="/signup">Get started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}