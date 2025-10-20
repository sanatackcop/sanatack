import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "./Hero";
import CollagesSupported from "./Bannar";
import { AITutorFeatures } from "./CourseFeature";
import LightRays from "./LightRays";
import { MagicAiFeatures } from "./MagaicAiFeatures";
import { UseCases } from "./Cases";
import FAQs from "./FAQs";
import { Pricing } from "./Pricing";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!location.hash) {
      return;
    }

    const handleScroll = () => {
      const target = document.querySelector(location.hash);
      if (!target) return;

      const navOffset = 80;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navOffset;

      window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: "smooth",
      });
    };

    const timeout = window.setTimeout(() => {
      handleScroll();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [location.hash]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-[#09090b]">
      <Navbar />
      <LightRays
        raysOrigin="top-center"
        raysColor="#fff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={0.8}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="pointer-events-none absolute inset-0 custom-rays opacity-50"
      />
      <main className="flex-1">
        <Hero />
        <CollagesSupported />
        <AITutorFeatures />
        <MagicAiFeatures />
        <UseCases />
        <Pricing />
        <FAQs />
      </main>
      <Footer />
    </div>
  );
}
