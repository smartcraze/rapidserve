"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { LogOut, LayoutGrid, Terminal, Menu, Compass, Settings, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getAuthToken, getAuthUser, logout, User } from "@/lib/auth-custom";

function DashboardNav({ user, handleLogout }: { user: User; handleLogout: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "projects";
  const isDeployOpen = searchParams.get("deploy") === "true";

  // Sidebar navigation links definitions
  const sidebarLinks = [
    { label: "Overview", href: "/dashboard?tab=projects", icon: LayoutGrid, active: pathname === "/dashboard" && currentTab === "projects" && !isDeployOpen },
    { label: "Deploy Console", href: "/dashboard?deploy=true", icon: Terminal, active: pathname === "/dashboard" && isDeployOpen },
    { label: "Activity", href: "/dashboard?tab=activity", icon: Activity, active: pathname === "/dashboard" && currentTab === "activity" },
    { label: "Settings", href: "/dashboard?tab=settings", icon: Settings, active: pathname === "/dashboard" && currentTab === "settings" },
  ];

  return (
    <>
      {/* 1. PERSISTENT SIDEBAR FOR DESKTOP (Always open) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/30 fixed top-0 bottom-0 left-0 z-30 justify-between py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center px-2">
            <Image
              src="/full-logo.png"
              alt="RapidServe"
              width={130}
              height={32}
              className="object-contain mix-blend-screen"
              priority
            />
          </Link>

          {/* Scope Selector */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
            <Avatar className="size-6 border border-border">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold text-foreground/80 max-w-36 truncate">
              {user.username || user.name || "Personal"}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {sidebarLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    link.active
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile dropdown and Logout */}
        <div className="border-t border-border pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto hover:bg-muted/40 rounded-lg">
                <Avatar className="size-8 border border-border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left truncate">
                  <span className="text-sm font-medium leading-none truncate">{user.name || "User"}</span>
                  <span className="text-[11px] text-muted-foreground truncate mt-0.5">{user.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-border bg-card" align="start" side="top" forceMount>
              <DropdownMenuItem onClick={handleLogout} className="focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer flex items-center gap-2">
                <LogOut className="size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* 2. MOBILE TOP HEADER (Hides on desktop) */}
      <header className="flex md:hidden sticky top-0 z-40 w-full h-16 border-b border-border bg-background/80 backdrop-blur-md items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="border-border bg-card/95 backdrop-blur flex flex-col gap-6 pt-12 w-64 justify-between">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6">
                <Link href="/dashboard" className="flex items-center">
                  <Image
                    src="/full-logo.png"
                    alt="RapidServe"
                    width={110}
                    height={28}
                    className="object-contain mix-blend-screen"
                  />
                </Link>
                <nav className="flex flex-col gap-1.5">
                  {sidebarLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={idx}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          link.active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile logout action */}
              <div className="border-t border-border pt-4">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                  <LogOut className="size-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard">
            <Image
              src="/full-logo.png"
              alt="RapidServe"
              width={100}
              height={26}
              className="object-contain mix-blend-screen"
            />
          </Link>
        </div>

        {/* Mini profile avatar on mobile header */}
        <Avatar className="size-8 border border-border">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </header>

      {/* Global Sub-tabs (Vercel Style Tab Bar, only shown when on the overview/main dashboard page) */}
      {pathname === "/dashboard" && (
        <div className="border-b border-border/60 bg-muted/5 sticky top-16 md:top-0 z-20 backdrop-blur-md md:pl-64">
          <div className="flex h-12 items-center gap-6 px-6 max-w-7xl mx-auto overflow-x-auto scrollbar-none">
            <Link
              href="/dashboard?tab=projects"
              className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                currentTab === "projects" && !isDeployOpen
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
            </Link>
            <Link
              href="/dashboard?tab=deployments"
              className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                currentTab === "deployments"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Deployments
            </Link>
            <Link
              href="/dashboard?tab=activity"
              className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                currentTab === "activity"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Activity
            </Link>
            <Link
              href="/dashboard?tab=settings"
              className={`text-sm font-medium border-b-2 px-1 py-3 transition-colors ${
                currentTab === "settings"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const currentUser = getAuthUser();
    
    if (!token || !currentUser) {
      logout();
      router.push("/signin");
    } else {
      setUser(currentUser);
    }
    setLoading(false);

    const handleAuthChange = () => {
      const u = getAuthUser();
      setUser(u);
      if (!u) {
        router.push("/signin");
      }
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin size-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-muted-foreground font-mono">Loading your space...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Suspense fallback={<div className="hidden md:block w-64 border-r border-border bg-card/30" />}>
        <DashboardNav user={user} handleLogout={handleLogout} />
      </Suspense>

      {/* 3. MAIN WORKSPACE CONTAINER (Shifted left on desktop to prevent overlap) */}
      <main className="flex-1 md:pl-64 w-full bg-background flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
