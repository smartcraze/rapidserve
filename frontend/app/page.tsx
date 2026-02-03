"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Zap,
  Github,
  Cloud,
  Terminal,
  Cpu,
  ShieldCheck,
  Globe,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <span>
              Rapid<span className="text-primary">Serve</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="https://github.com/suraj/rapidserve"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/deploy">
              <Button variant="secondary" size="sm" className="font-semibold">
                Enter Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_mt_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />

          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <Badge
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-sm rounded-full mx-auto w-fit"
              >
                <Zap className="w-3 h-3 mr-2 fill-primary" />
                v2.0 Now Available on AWS ECS
              </Badge>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-1.1">
                Deploy your code <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                  at the speed of thought.
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The fully automated deployment platform designed for developers.
                Push to GitHub, and we handle the containerization, scaling, and
                domain management.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/deploy">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-bold w-full sm:w-auto"
                  >
                    <Rocket className="mr-2 h-5 w-5" /> Start Deploying
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-border hover:bg-secondary hover:text-foreground w-full sm:w-auto"
                >
                  <Github className="mr-2 h-5 w-5" /> View on GitHub
                </Button>
              </div>

              <div className="pt-12 flex items-center justify-center gap-8 text-muted-foreground grayscale opacity-50">
                {/* Fake Logos for social proof */}
                <div className="flex items-center gap-2 font-semibold">
                  <Cpu /> AWS Fargate
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Terminal /> Redis
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Cloud /> Docker
                </div>
              </div>
            </motion.div>

            {/* Hand-drawn Arrow pointing to video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 right-10 xl:right-32 hidden lg:block"
            >
              <div className="flex flex-col items-center gap-2 rotate-12">
                <span className="text-xl font-medium text-muted-foreground font-serif italic">
                  Watch the demo!
                </span>
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary/70 -mt-2"
                >
                  <path
                    d="M30 10C50 10 70 30 70 90"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M45 75L70 90L95 65"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="py-20 bg-muted/10 border-b border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                See it in action
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Watch the full walkthrough of RapidServe deploying an
                application from scratch.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-2xl mx-auto mt-6 text-left space-y-3">
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Why watch this video?
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>
                    <strong>Full System Tour:</strong> See the complete Backend,
                    AWS ECS, and Frontend integration working together.
                  </li>
                  <li>
                    <strong>Live Environment Paused:</strong> Due to AWS cost
                    constraints, the live demo backend is currently paused.
                  </li>
                  <li>
                    <strong>Real-time Pipeline:</strong> Observe the actual
                    build and deployment logs as they happen.
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-black/5">
              <iframe
                src="https://www.tella.tv/video/vid_cml6lghgs00e104jr2zxa0u56/embed?b=0&title=0&a=1&loop=0&t=0&muted=0&wt=0"
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="RapidServe Demo"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-muted/30 border-y border-border"
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for Modern Applications
              </h2>
              <p className="text-muted-foreground">
                Everything you need to deploy, scale, and monitor your
                applications without the DevOps headache.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Terminal,
                  title: "Real-time Logs",
                  desc: "Watch your build process live via WebSocket streaming directly from our builder containers.",
                },
                {
                  icon: Cloud,
                  title: "AWS Powered",
                  desc: "Backed by AWS ECS Fargate for serverless container orchestration that scales with you.",
                },
                {
                  icon: Globe,
                  title: "Instant Subdomains",
                  desc: "Every project gets a unique subdomain automatically mapped to your running container.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Isolation",
                  desc: "Each build runs in its own isolated environment ensuring maximum security and stability.",
                },
                {
                  icon: Zap,
                  title: "Zero Config",
                  desc: "Auto-detection of frameworks like Next.js, React, and simple Node.js applications.",
                },
                {
                  icon: Github,
                  title: "Git Integration",
                  desc: "Simply paste your repository URL and we handle the cloning, building, and deployment.",
                },
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 text-primary">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                  From Code to Cloud in 3 Steps
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      step: "01",
                      title: "Connect Repository",
                      desc: "Paste your GitHub repository URL. We support public repositories out of the box.",
                    },
                    {
                      step: "02",
                      title: "Build & Containerize",
                      desc: "Our builder service creates a Docker image and pushes it to ECR automatically.",
                    },
                    {
                      step: "03",
                      title: "Global Deploy",
                      desc: "Your container starts on ECS and your unique URL goes live instantly.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="text-primary font-mono font-bold text-xl pt-1">
                        /{item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative rounded-xl border border-border bg-card p-1 shadow-2xl overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                  <div className="h-full w-full bg-card/80 rounded-lg p-6 font-mono text-sm text-muted-foreground overflow-hidden">
                    <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-2 opacity-80">
                      <div className="text-primary">
                        $ rapidserve deploy ./my-app
                      </div>
                      <div>➜ Building Docker image...</div>
                      <div>➜ Pushing to ECR...</div>
                      <div className="text-green-500">✔ Build Complete</div>
                      <div>➜ Provisioning ECS Task...</div>
                      <div>➜ Configuring Load Balancer...</div>
                      <div className="text-green-500">
                        ✔ Deployed to https://my-app.rapidserve.com
                      </div>
                      <div className="animate-pulse">_</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="bg-primary rounded-2xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-background/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <h2 className="text-3xl md:text-5xl font-extrabold text-primary-foreground mb-6 relative z-10">
                Ready to ship your next big idea?
              </h2>
              <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-8 relative z-10">
                Join developers deploying their applications with RapidServe
                today.
              </p>
              <Link href="/deploy">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-10 text-lg font-bold relative z-10"
                >
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-background text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 RapidServe Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
