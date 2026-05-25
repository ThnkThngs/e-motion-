"use client";

import { useEffect, useState } from "react";
import { useReveal3d } from "@/lib/warisan/useReveal3d";
import { WarisanNav } from "@/components/warisan/WarisanNav";
import { WarisanHero } from "@/components/warisan/WarisanHero";
import { StatsStrip } from "@/components/warisan/StatsStrip";
import { EffectsSection } from "@/components/warisan/EffectsSection";
import { TemplatesSection } from "@/components/warisan/TemplatesSection";
import { BuilderDemoSection } from "@/components/warisan/BuilderDemoSection";
import { PricingSection } from "@/components/warisan/PricingSection";
import { TestimonialsMarquee } from "@/components/warisan/TestimonialsMarquee";
import { CtaSection } from "@/components/warisan/CtaSection";
import { WarisanFooter } from "@/components/warisan/WarisanFooter";
import { SuccessModal } from "@/components/warisan/SuccessModal";

export default function Home() {
  useReveal3d();
  const [modalOpen, setModalOpen] = useState(false);

  // Tag the body so global CSS can switch from the default Tailwind shell to
  // the Warisan dark surface (and disable the safe-area padding rule).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-warisan", "");
    return () => document.body.removeAttribute("data-warisan");
  }, []);

  // Smooth-scroll on in-page anchor clicks (mirrors the reference HTML).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <main className="warisan-root">
      <WarisanNav />
      <WarisanHero />
      <StatsStrip />
      <EffectsSection />
      <TemplatesSection />
      <BuilderDemoSection onPublish={() => setModalOpen(true)} />
      <PricingSection />
      <TestimonialsMarquee />
      <CtaSection />
      <WarisanFooter />
      <SuccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
