import { BackgroundRippleEffectDemo } from "@/components/BackgroundRippleEffect";
import { DemoVideo } from "@/components/demo-video";
import { FeaturesSection } from "@/components/features";
import { Navbar } from "@/components/navbar";
import { CTAHero } from "@/components/cta-hero";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground font-sans">
      {/* <SiteHeader />
      <main className="relative overflow-hidden">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
      </main>
      <SiteFooter /> */}
      <Navbar />
      <BackgroundRippleEffectDemo />
      <DemoVideo />
      <FeaturesSection />
      <CTAHero />
      <Footer />

    </div>
  );
}
