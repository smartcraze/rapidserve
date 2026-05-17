"use client";

import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export function BackgroundRippleEffectDemo() {
  return (
    <div className="relative flex min-h-[70vh] w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />

      <div className="mt-60 w-full px-4">
        <h2 className="relative z-10 mx-auto max-w-6xl text-center text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl">
          Turn repo into live url
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Lightning Speed
          </span>
        </h2>

        <p className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-neutral-400 md:text-lg">
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