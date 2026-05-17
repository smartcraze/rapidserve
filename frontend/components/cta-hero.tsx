"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTAHero() {
  return (
    <section className="py-4">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl border border-border/20 bg-primary/90 px-8 py-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            <div className="md:col-span-7">
              <h2 className="mt-3 text-4xl font-extrabold leading-tight  sm:text-5xl text-zinc-950">
                Ready to turn the repo into a running deployment?
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-neutral-800 ">
                Open the console, enter the GitHub URL, and let the pipeline <br /> stream back a clean, understandable deployment flow.
              </p>
            </div>

            <div className="md:col-span-5 flex justify-start md:justify-end">
              <div className="flex gap-4">
                <Link href="/deploy">
                  <Button size="lg">Open console</Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" size="lg">Source code</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
