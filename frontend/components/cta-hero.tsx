"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTAHero() {
  return (
    <section className="py-8 relative overflow-hidden bg-background">
      {/* Ambient background glow */}
      <div className="absolute inset-y-0 right-0 -z-10 w-[400px] rounded-full bg-yellow-500/5 blur-3xl opacity-50 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/60 px-6 py-8 md:px-10 md:py-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden group">
          {/* Inner accent glow */}
          <div className="absolute right-0 top-0 bottom-0 w-[200px] -z-10 rounded-full bg-yellow-500/5 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            {/* Left Content (Text) */}
            <div className="md:col-span-8 flex flex-col text-left">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl font-display leading-tight">
                Ready to turn your repo into a <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">live deployment</span>?
              </h2>
              
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Paste your public GitHub URL, watch the pipeline stream live, and access your app instantly. No complex setup or cloud config required.
              </p>
            </div>

            {/* Right Content (Actions) */}
            <div className="md:col-span-4 flex justify-start md:justify-end items-center">
              <div className="flex flex-row gap-3 w-full md:w-auto">
                <Button asChild className="flex-1 md:flex-none font-medium text-xs px-6 shadow-[0_4px_12px_rgba(234,179,8,0.15)] dark:shadow-[0_4px_12px_rgba(234,179,8,0.2)] bg-yellow-500 hover:bg-yellow-600 text-zinc-950">
                  <Link href="/dashboard">Open console</Link>
                </Button>

                <Button asChild variant="outline" className="flex-1 md:flex-none font-medium text-xs px-6 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  <Link href="https://github.com/smartcraze/rapidserve" target="_blank">
                    View source
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
