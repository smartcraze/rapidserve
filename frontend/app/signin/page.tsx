"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setCookie, getAuthToken } from "@/lib/auth-custom";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const token = getAuthToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Save token in cookie & user info in localStorage
      if (data.data && data.data.token) {
        setCookie("rapidserve_token", data.data.token, 7);
        localStorage.setItem("rapidserve_user", JSON.stringify(data.data.user));
        // Dispatch auth-change event
        window.dispatchEvent(new Event("auth-change"));
        
        toast.success("Welcome back! Signed in successfully.");
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      const errMsg = err.message || "An unexpected error occurred.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/50 via-background to-background pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 flex flex-col gap-6"
      >
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Image
              src="/full-logo.png"
              alt="RapidServe Logo"
              width={160}
              height={40}
              className="object-contain mix-blend-screen"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your RapidServe applications.
          </p>
        </div>

        <Card className="border-border bg-card/60 backdrop-blur shadow-2xl">
          <CardHeader className="flex flex-col gap-1 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed">
                <AlertCircle className="size-4 shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/40 border-border focus:border-primary/50 h-10"
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/40 border-border focus:border-primary/50 h-10"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full font-medium h-10 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-4" data-icon="inline-start" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="size-4" data-icon="inline-end" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4 bg-muted/20 rounded-b-xl">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
