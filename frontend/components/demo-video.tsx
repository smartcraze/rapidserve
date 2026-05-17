"use client";

import { motion } from "motion/react";

export function DemoVideo() {
    return (
        <motion.div
            id="demo-video"
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.6,
                delay: 1.2,
                ease: "easeOut",
            }}
            className="relative z-10 mt-20 flex w-full justify-center px-4"
        >
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="h-100 w-[70%] rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="group relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-3 shadow-2xl backdrop-blur-xl">

                <div className="absolute inset-0 rounded-[28px] border border-blue-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">

                    <iframe
                        src="https://www.tella.tv/video/vid_cml6lghgs00e104jr2zxa0u56/embed?b=0&title=0&a=1&loop=1&t=0&muted=1&wt=0"
                        className="absolute inset-0 h-full w-full"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                        title="RapidServe Demo"

                    />

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/40 to-transparent" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/50 to-transparent" />

                    <div className="pointer-events-none absolute inset-0 ring-1 ring-blue-500/10" />
                </div>
            </div>
        </motion.div>
    );
}