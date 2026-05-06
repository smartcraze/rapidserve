import type { LucideIcon } from "lucide-react";
import {
  Gauge,
  Globe,
  Layers3,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const githubUrl = "https://github.com/smartcraze/rapidserve";

export const launchSignals = [
  { label: "Avg. deploy time", value: "3 min" },
  { label: "Build stream", value: "Live" },
  { label: "Routing", value: "Auto subdomains" },
];

export const featureCards: FeatureCard[] = [
  {
    icon: Terminal,
    title: "Live build logs",
    desc: "Stream each container step as it happens. No refreshes, no waiting, just a clear view into the pipeline.",
  },
  {
    icon: Globe,
    title: "Instant app URLs",
    desc: "Every project gets a clean preview domain automatically mapped to the deployed container.",
  },
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

export const processSteps = [
  {
    step: "01",
    title: "Connect repository",
    desc: "Paste a public GitHub URL and choose a project slug that becomes the app subdomain.",
  },
  {
    step: "02",
    title: "Build and ship",
    desc: "RapidServe creates the image, provisions the service, and streams logs from the build system.",
  },
  {
    step: "03",
    title: "Open the deployment",
    desc: "Once the build completes, the deployment is live at the generated localhost subdomain.",
  },
];

export const pipelineLines = [
  "$ rapidserve deploy ./my-app",
  "✓ Repository cloned",
  "✓ Docker image built",
  "→ Pushing to registry",
  "→ Spinning up isolated runtime",
  "✓ Deployment ready at my-app.localhost:8000",
];
