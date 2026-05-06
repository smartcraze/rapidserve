"use client";

import { motion } from "framer-motion";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { featureCards } from "@/components/landing/content";
import { fadeInUp, staggerContainer } from "@/components/landing/motion-presets";

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/70 bg-muted/25 py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-10"
        >
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Built like a control room, not a marketing billboard.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              The landing page mirrors the product: structured, readable, and designed to make the deployment flow easy to understand at a glance.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="group h-full border-border/80 bg-card/75 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                  <CardHeader className="flex flex-col gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl border border-border bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl tracking-[-0.03em]">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-sm leading-6 text-muted-foreground">
                        {feature.desc}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
