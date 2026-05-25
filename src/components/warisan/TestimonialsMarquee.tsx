"use client";

import { useMemo } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { Html } from "./Html";

// Phase 4 conversion of Stitch screen `landing-testimonials`.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Marquee uses CSS keyframe `testiScroll` (35s linear infinite) — matches
//     the source `animate-marquee` duration.
//   • Duplicate set baked at runtime so the loop is seamless.

// Pucuk-rebung triangular corner. Module level per
// react-best-practices rerender-no-inline-components.
const TestiCorner = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0,0 L24,0 L0,24 Z" />
  </svg>
);

export const TestimonialsMarquee = () => {
  const { t, testi } = useWarisanLang();
  // Duplicate the list so the CSS infinite-translate marquee loops seamlessly.
  const doubled = useMemo(() => [...testi, ...testi], [testi]);

  return (
    <section className="warisan-section songket-section testi-section">
      <div className="section-inner">
        <div className="section-header testi-section-header">
          <div className="section-label reveal-3d">{t("sec.testi")}</div>
          <Html
            as="h2"
            className="section-title reveal-3d reveal-d1"
            html={t("testi.title")}
          />
        </div>
      </div>
      <div className="testi-track-wrap">
        <div className="testi-track">
          {doubled.map((tt, i) => (
            <article key={i} className="testi-card">
              <span className="testi-corner testi-corner-tl">
                <TestiCorner />
              </span>
              <span className="testi-corner testi-corner-tr">
                <TestiCorner />
              </span>
              <span className="testi-corner testi-corner-bl">
                <TestiCorner />
              </span>
              <span className="testi-corner testi-corner-br">
                <TestiCorner />
              </span>
              <div className="testi-stars" aria-label="5 stars">
                ★★★★★
              </div>
              <p className="testi-quote">&ldquo;{tt.q}&rdquo;</p>
              <div className="testi-meta">
                <span className="testi-author">{tt.a}</span>
                <span className="testi-event">{tt.e}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
