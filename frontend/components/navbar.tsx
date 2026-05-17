"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signInWithGooglePopup } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

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
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSignIn = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      await signInWithGooglePopup(`${window.location.origin}/deploy?auth=google`);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <header className="w-full py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 px-6 py-4 backdrop-blur bg-foreground/5">
        <Image
          src="/full-logo.png"
          alt="RapidServe"
          width={150}
          height={150}
          className="object-contain mix-blend-screen"
          priority
        />
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
          {session?.user ? (
            <Link
              href="/deploy"
              className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 md:inline-flex"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/15 bg-white/10">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/80">
                    {(session.user.name || session.user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </span>
              <span className="max-w-40 truncate">
                {session.user.name || "Your profile"}
              </span>
            </Link>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="hidden text-[15px] font-medium text-white/70 hover:bg-white/5 hover:text-white md:inline-flex"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? "Opening..." : "Sign in"}
            </Button>
          )}

          <Button asChild variant="secondary">
            <Link href="/deploy">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}