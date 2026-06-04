"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { setCookie, getAuthToken } from "@/lib/auth-custom";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const token = getAuthToken();
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !username) {
      toast.error("Please fill in all required fields.");
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up. Please try again.");
      }

      setSuccess(true);
      toast.success("Account created successfully!");

      // Proactively log the user in to make the experience smooth
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.data && loginData.data.token) {
        setCookie("rapidserve_token", loginData.data.token, 7);
        localStorage.setItem("rapidserve_user", JSON.stringify(loginData.data.user));
        // Dispatch auth-change event
        window.dispatchEvent(new Event("auth-change"));
        
        toast.success("Signed in successfully. Redirecting...");
        // Wait a short moment to show success state, then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Redirect to signin if autologin fails
        toast.info("Please sign in with your credentials.");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    } catch (err: any) {
      const errMsg = err.message || "An unexpected error occurred.";
      setError(errMsg);
      toast.error(errMsg);
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
            Create an account to deploy your applications.
          </p>
        </div>

        <Card className="border-border bg-card/60 backdrop-blur shadow-2xl">
          <CardHeader className="flex flex-col gap-1 pb-4">
            <CardTitle className="text-2xl font-semibold tracking-tight text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter details below to start deploying
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {success ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <Check className="size-4 shrink-0" />
                <p className="flex-1">Account created successfully! Logging you in...</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm leading-relaxed">
                <AlertCircle className="size-4 shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/40 border-border focus:border-primary/50 h-10"
                    disabled={loading || success}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    className="bg-background/40 border-border focus:border-primary/50 h-10"
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/40 border-border focus:border-primary/50 h-10"
                  disabled={loading || success}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••• (Min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/40 border-border focus:border-primary/50 h-10"
                  disabled={loading || success}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full font-medium h-10 mt-2"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin size-4" data-icon="inline-start" />
                    Registering...
                  </>
                ) : (
                  <>
                    Sign Up <ArrowRight className="size-4" data-icon="inline-end" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4 bg-muted/20 rounded-b-xl">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-foreground hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
