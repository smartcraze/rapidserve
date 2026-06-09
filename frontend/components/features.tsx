"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/components/landing/motion-presets";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  Copy,
  Check,
  Globe,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Lock,
  GitBranch,
  ShieldCheck,
  CloudLightning,
  Layers3,
  Gauge,
  Sparkles,
} from "lucide-react";

// --- TERMINAL MOCKUP FOR LIVE LOGS ---
function TerminalMockup() {
  const [copied, setCopied] = useState(false);
  const command = "npm i -g rapidserve-cli";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = [
    { text: "⚡ rapidserve deploy ./node-app", type: "input", delay: 0 },
    { text: "⠋ Analyzing repository configuration...", type: "info", delay: 0.8 },
    { text: "✓ Found Dockerfile (Node.js 20 environment)", type: "success", delay: 1.6 },
    { text: "⠙ Building optimized container image...", type: "info", delay: 2.4 },
    { text: "✓ Build finished in 4.7 seconds", type: "success", delay: 3.5 },
    { text: "⠸ Provisioning isolated container instance...", type: "info", delay: 4.2 },
    { text: "✓ Routed auto-subdomain: node-app.localhost:8000", type: "success", delay: 5.0 },
    { text: "🚀 Deployment is LIVE!", type: "highlight", delay: 5.6 },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-zinc-950/80 font-mono text-sm text-zinc-300 shadow-[0_30px_80px_rgba(0,0,0,0.12),0_0_50px_rgba(234,179,8,0.01)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(234,179,8,0.02)] md:text-base overflow-hidden group">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/40 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-zinc-500 dark:text-zinc-500 text-xs font-sans">sh - rapidserve deploy</div>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors p-1 rounded"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-6 flex flex-col gap-3 min-h-[290px] bg-zinc-950">
        {lines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: line.delay, duration: 0.4 }}
            className={`flex items-start gap-2 leading-relaxed ${
              line.type === "success" ? "text-emerald-400" :
              line.type === "info" ? "text-zinc-500" :
              line.type === "highlight" ? "text-yellow-400 font-bold" :
              "text-zinc-100"
            }`}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- BROWSER MOCKUP FOR APP PREVIEW ---
function BrowserMockup() {
  return (
    <div className="relative w-full rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/80 font-sans shadow-[0_30px_80px_rgba(0,0,0,0.06),0_0_50px_rgba(59,130,246,0.01)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(59,130,246,0.02)] overflow-hidden">
      {/* Browser Header */}
      <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/40 px-4 py-3">
        {/* Navigation Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md mx-auto flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">node-app.localhost:8000</span>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono hidden sm:inline">HTTPS</span>
        </div>
      </div>

      {/* Browser Body Mockup */}
      <div className="bg-white dark:bg-zinc-950 p-6 sm:p-8 min-h-[250px] flex flex-col justify-between relative">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
            <div className="flex items-center gap-2">
              <Image
                src="/rapidservelogo.png"
                alt="RapidServe"
                width={20}
                height={20}
                className="object-contain dark:mix-blend-screen mix-blend-difference filter invert dark:invert-0"
              />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-300">Live Application</span>
            </div>
            <div className="h-5 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/90 p-3 flex flex-col gap-1.5">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
                  {card === 1 ? "CPU Load" : card === 2 ? "Memory" : "Requests"}
                </span>
                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                  {card === 1 ? "1.4%" : card === 2 ? "128MB" : "2.4k"}
                </span>
              </div>
            ))}
          </div>

          {/* Bar Graph visualization */}
          <div className="h-16 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/90 p-3 flex items-end gap-1 overflow-hidden">
            {[40, 25, 45, 60, 55, 30, 45, 75, 90, 85, 60, 40, 30, 50, 65, 80, 95, 70, 55, 40, 50, 65, 80, 95].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-sm bg-gradient-to-t from-yellow-500/40 to-yellow-500"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PIPELINE COMPONENT ---
function PipelineShowcase() {
  const steps = [
    {
      icon: GitBranch,
      title: "Connect Repository",
      desc: "Paste a public GitHub URL and choose a project slug that becomes the app subdomain.",
      color: "from-blue-500 to-cyan-500",
      glow: "rgba(59,130,246,0.05)",
    },
    {
      icon: CloudLightning,
      title: "Build and Ship",
      desc: "RapidServe creates the image, provisions the service, and streams logs from the build system.",
      color: "from-yellow-500 to-amber-500",
      glow: "rgba(234,179,8,0.05)",
    },
    {
      icon: Globe,
      title: "Open Deployment",
      desc: "Once the build completes, the deployment is live at the generated localhost subdomain.",
      color: "from-emerald-500 to-teal-500",
      glow: "rgba(16,185,129,0.05)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mt-16 w-full max-w-5xl">
      {/* Decorative line for desktop */}
      <div className="absolute top-[48px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-blue-500/10 via-yellow-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-yellow-500/20 dark:to-emerald-500/20 hidden md:block z-0" />

      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div
            key={idx}
            className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-900/60 bg-white/60 dark:bg-zinc-950/30 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300"
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${step.glow} 0%, transparent 70%)`
              }}
            />

            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${step.color} p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300`}>
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-950 flex items-center justify-center">
                <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-100" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-6 tracking-tight font-display">{step.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xs leading-relaxed">{step.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function FeaturesSection() {
  const extraFeatures = [
    {
      icon: ShieldCheck,
      title: "Isolated runs",
      desc: "Each deployment runs in its own environment so builds stay predictable and secure.",
    },
    {
      icon: Layers3,
      title: "Framework aware",
      desc: "React, Next.js, and Node.js projects can be detected and launched without custom setup.",
    },
    {
      icon: Gauge,
      title: "Fast feedback",
      desc: "A small, focused console keeps the path from repo URL to running app short and obvious.",
    },
    {
      icon: Sparkles,
      title: "Clear deployment story",
      desc: "The UI is built to explain what is happening at each step instead of hiding the pipeline.",
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden py-24 lg:py-32 bg-background">
      {/* Background ambient light */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[600px] rounded-full bg-yellow-500/5 blur-3xl opacity-30" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[600px] rounded-full bg-blue-500/5 blur-3xl opacity-30" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          {/* Main Title */}
          <motion.div variants={fadeInUp} className="text-center max-w-3xl">
            <span className="text-xs font-semibold tracking-widest text-yellow-600 dark:text-yellow-500 uppercase">FEATURES</span>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl font-display leading-tight">
              A calm, precise deployment console
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Deploy from your repository and get clear, live feedback — fast and focused on the developer experience.
            </p>
          </motion.div>

          {/* Showcase 1: Live Logs Terminal */}
          <div className="w-full mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20">
                <Terminal className="h-3 w-3" /> Live stream logs
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
                Understand your builds in real-time
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Stream each container step as it happens. No refreshes, no waiting, just a clear view into the pipeline. Know exactly what fails and why.
              </p>
            </div>
            <div className="lg:col-span-7 w-full">
              <TerminalMockup />
            </div>
          </div>

          {/* Showcase 2: Preview Deployments Browser */}
          <div className="w-full mt-28 lg:mt-36 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 w-full order-2 lg:order-1">
              <BrowserMockup />
            </div>
            <div className="lg:col-span-5 flex flex-col items-start gap-4 order-1 lg:order-2 lg:pl-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20">
                <Globe className="h-3 w-3" /> Instant app URLs
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display">
                Instant container preview routing
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Every project gets a clean preview domain automatically mapped to the deployed container. Simply push, complete build, and view your application live.
              </p>
            </div>
          </div>

          {/* Showcase 3: The Connected Pipeline (Visual Workflow) */}
          <div className="w-full mt-32 lg:mt-44 flex flex-col items-center">
            <div className="text-center max-w-2xl">
              <span className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">THE PIPELINE</span>
              <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-display mt-2">
                Three steps to a running container
              </h3>
            </div>
            <PipelineShowcase />
          </div>

          {/* Grid of Other Features (Minimal borderless blocks) */}
          <div className="w-full mt-32 lg:mt-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-zinc-200 dark:border-zinc-900 pt-16">
            {extraFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex flex-col items-start gap-4 p-2">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 tracking-tight font-display">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </motion.div>
      </div>
    </section>
  );
}