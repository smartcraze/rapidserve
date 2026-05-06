import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { WorkflowSection } from "@/components/landing/workflow-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground font-sans">
      <SiteHeader />
      <main className="relative overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
