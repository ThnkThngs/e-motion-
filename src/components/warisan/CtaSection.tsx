"use client";

import { useMemo } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { Html } from "./Html";
import { siteConfig } from "@/config/site";

// Phase 4 conversion of Stitch screen `landing-cta`.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Stitch's TopNavBar/Footer are NOT included here — those belong to
//     WarisanNav / WarisanFooter (separate Phase 4 surfaces).
//   • Drifting gold particles use seededRandom() so SSR + client markup match.

const seededRandom = (i: number) => {
  const x = Math.sin(i * 7919.3) * 10000;
  return x - Math.floor(x);
};

const particles = Array.from({ length: 8 }, (_, i) => {
  const size = 3 + seededRandom(i + 1) * 5;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${seededRandom(i + 2) * 100}%`,
    animationDuration: `${18 + seededRandom(i + 3) * 12}s`,
    animationDelay: `${seededRandom(i + 4) * 15}s`,
  };
});

// Pucuk-rebung triangular ornament. Module level per
// react-best-practices rerender-no-inline-components.
const CtaCorner = () => (
  <svg
    viewBox="0 0 100 100"
    width="60"
    height="60"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <polygon points="0,0 100,0 0,100" />
  </svg>
);

export const CtaSection = () => {
  const { t } = useWarisanLang();
  const particleNodes = useMemo(
    () =>
      particles.map((p, i) => (
        <span key={i} className="cta-particle" style={p} aria-hidden="true" />
      )),
    [],
  );

  return (
    <section className="cta-section reveal-3d">
      <span className="cta-corner cta-corner-tl">
        <CtaCorner />
      </span>
      <span className="cta-corner cta-corner-tr">
        <CtaCorner />
      </span>
      <span className="cta-corner cta-corner-br">
        <CtaCorner />
      </span>
      <span className="cta-corner cta-corner-bl">
        <CtaCorner />
      </span>
      <div className="cta-particles" aria-hidden="true">
        {particleNodes}
      </div>
      <div className="cta-content">
        <div className="cta-eyebrow reveal-3d reveal-d1">
          {t("cta.eyebrow")}
        </div>
        <Html
          as="h2"
          className="cta-title reveal-3d reveal-d2"
          html={t("cta.title")}
        />
        <p className="cta-sub reveal-3d reveal-d3">{t("cta.sub")}</p>
        <div
          className="hero-actions reveal-3d reveal-d3"
          style={{ justifyContent: "center" }}
        >
          <a href="#builder" className="warisan-btn-primary">
            {t("cta.btn1")} <span aria-hidden="true">✦</span>
          </a>
          <a
            href={`https://wa.me/${siteConfig.contactWa}`}
            className="warisan-btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta.btn2")}
          </a>
        </div>
      </div>
    </section>
  );
};
