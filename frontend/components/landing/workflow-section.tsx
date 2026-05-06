import { processSteps } from "@/components/landing/content";
import { DemoCard } from "@/components/landing/demo-card";

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Workflow
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              The path from repo URL to running app stays short.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              RapidServe keeps the interaction model intentionally small. That lets the user focus on the project slug, the repository, and the resulting deployment state.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {processSteps.map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm"
                >
                  <div className="font-mono text-sm font-semibold tracking-[0.2em] text-primary">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-[-0.03em]">
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DemoCard />
        </div>
      </div>
    </section>
  );
}
