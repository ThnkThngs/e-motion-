"use client";

import { useMemo } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";

// Phase 4 conversion of Stitch screen `landing-hero` (asset 58c0bee2…, screen
// fb5d57…) — see .stitch/designs/landing-hero.html for the source.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Stitch's TopNavBar/Footer are NOT included here — those belong to
//     WarisanNav / WarisanFooter (separate Phase 4 surfaces).
//   • Material Symbols `favorite` icon replaced with an inline unicode glyph
//     so we don't add a new font dependency.
//   • Seeded-random particles preserved from the previous WarisanHero to
//     keep SSR/CSR markup identical (prevents hydration mismatch).

const seededRandom = (i: number) => {
  const x = Math.sin(i * 9999) * 10000;
  return x - Math.floor(x);
};

const particles = Array.from({ length: 18 }, (_, i) => {
  const size = 4 + seededRandom(i + 1) * 8;
  return {
    left: `${seededRandom(i + 2) * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    bottom: `${-10 - seededRandom(i + 3) * 20}%`,
    animationDelay: `${seededRandom(i + 4) * 18}s`,
    animationDuration: `${10 + seededRandom(i + 5) * 14}s`,
  };
});

// Inline gold heart glyph — replaces the `♥` emoji flagged by the
// taste-design audit ("no emojis anywhere").
const HeartGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="48"
    height="48"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Pucuk-rebung corner ornament. Defined at module level per
// react-best-practices rerender-no-inline-components.
const CornerOrnament = () => (
  <svg
    viewBox="0 0 40 40"
    width="40"
    height="40"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16 L2 2 L16 2" strokeWidth="1.4" />
      <path
        d="M7 7 Q14 7 14 14 M7 7 Q7 14 14 14"
        strokeWidth="1.1"
        strokeOpacity="0.65"
      />
      <path d="M2 2 L9 9" strokeWidth="0.9" strokeOpacity="0.45" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="14" r="0.9" fill="currentColor" stroke="none" opacity="0.7" />
    </g>
  </svg>
);

export const WarisanHero = () => {
  const { t } = useWarisanLang();
  const particleNodes = useMemo(
    () =>
      particles.map((p, i) => (
        <span
          key={i}
          className="hero-asym-particle"
          style={p}
          aria-hidden="true"
        />
      )),
    [],
  );

  return (
    <section
      className="warisan-section songket-section hero-asym"
      id="home"
    >
      <div className="hero-asym-particles" aria-hidden="true">
        {particleNodes}
      </div>

      <div className="section-inner hero-asym-grid">
        {/* Left 60% — title block */}
        <div className="hero-asym-left reveal-3d reveal-d1">
          <div className="hero-asym-eyebrow">{t("hero.eyebrow")}</div>
          <h1 className="hero-asym-title">
            {t("hero.title1")}{" "}
            <em className="hero-asym-title-em">{t("hero.title2")}</em>
          </h1>
          <p className="hero-asym-desc">{t("hero.desc")}</p>
          <div className="hero-asym-actions">
            <a href="#builder" className="warisan-btn-primary">
              {t("hero.cta1")}
            </a>
            <a href="#templates" className="warisan-btn-secondary">
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* Right 40% — glass vignette cluster */}
        <div
          className="hero-asym-right reveal-3d reveal-d3"
          aria-hidden="true"
        >
          <div className="hero-asym-vignette">
            <span className="hero-asym-corner hero-asym-corner-tl">
              <CornerOrnament />
            </span>
            <span className="hero-asym-corner hero-asym-corner-tr">
              <CornerOrnament />
            </span>
            <span className="hero-asym-corner hero-asym-corner-br">
              <CornerOrnament />
            </span>
            <span className="hero-asym-corner hero-asym-corner-bl">
              <CornerOrnament />
            </span>

            <div className="hero-asym-glass hero-asym-glass-1">
              <div className="hero-asym-glass-photo" />
              <div className="hero-asym-glass-meta">
                <span className="hero-asym-glass-bar bar-gold" />
                <span className="hero-asym-glass-bar bar-ivory" />
              </div>
            </div>

            <div className="hero-asym-glass hero-asym-glass-2">
              <span className="hero-asym-glass-heart">
                <HeartGlyph />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
