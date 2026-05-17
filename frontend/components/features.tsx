"use client";

import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { featureCards } from "@/components/landing/content";
import {
    fadeInUp,
    staggerContainer,
} from "@/components/landing/motion-presets";

export function FeaturesSection() {
    const cardsToShow = featureCards.slice(0, 3);

    return (
        <section
            id="features"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-yellow-500/5 blur-3xl" />
            </div>

            <div className="mx-auto w-full max-w-[1600px] px-6">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-80px" }}
                    className="flex flex-col items-center"
                >
                    {/* Heading */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col items-center text-center"
                    >
                        <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl lg:whitespace-nowrap">
                            A calm, precise deployment console
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                            Deploy from your repository and get clear, live feedback — fast
                            and focused on the experience.
                        </p>
                    </motion.div>

                    {/* Cards */}
                    <div className="relative mt-20 w-full">
                        {/* Ambient Glow */}
                        <div className="absolute -inset-x-10 -top-10 -bottom-10 -z-10 rounded-[40px] bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent" />

                        <div className="grid gap-8 md:grid-cols-3">
                            {cardsToShow.map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    variants={fadeInUp}
                                    className="w-full"
                                >
                                    <CardSpotlight
                                        className={`group relative flex h-[320px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-yellow-500/30 ${idx === 1 ? "md:mt-8" : ""
                                            }`}
                                    >
                                        {/* Top Content */}
                                        <div className="relative z-20 flex flex-col">
                                            <div className="flex items-start gap-5">
                                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20">
                                                    <feature.icon className="size-6 text-yellow-400" />
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-semibold leading-tight text-white">
                                                        {feature.title}
                                                    </h3>

                                                    <p className="mt-3 max-w-xs text-base leading-7 text-neutral-300">
                                                        {feature.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom CTA */}
                                        <div className="relative z-20 mt-auto pt-8">
                                            <button className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400 transition-colors duration-300 hover:text-yellow-300">
                                                Learn More →
                                            </button>
                                        </div>

                                        {/* Hover Glow */}
                                        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-yellow-500/0 transition-all duration-500 group-hover:border-yellow-500/20" />
                                    </CardSpotlight>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}