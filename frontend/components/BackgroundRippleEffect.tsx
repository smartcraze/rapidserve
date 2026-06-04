"use client";

import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export function BackgroundRippleEffectDemo() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />

      <div className="mt-60 w-full px-4">
        <h2 className="relative z-10 mx-auto max-w-6xl text-center text-4xl font-black tracking-tight text-zinc-900 dark:text-white md:text-6xl lg:text-7xl font-display leading-[1.1] md:leading-[1.05]">
          Turn repo into a <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">live URL</span>
          <br />
          with <span className="bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">Lightning Speed</span>
        </h2>

        <p className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-xl">
          Rapidserve helps developers deploy scalable AI workloads,
          cloud-native applications, and modern backend infrastructure
          with performance,
          <br />
          reliability,  and developer experience at
          the core.
        </p>
      </div>
    </div>
  );
}