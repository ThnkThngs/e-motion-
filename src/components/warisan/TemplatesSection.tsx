"use client";

import { useState } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { heritageTemplates } from "@/lib/heritageTemplates";
import { Html } from "./Html";

// Songket Riau pucuk-rebung corner ornament. Drawn once at the top-left
// orientation; rotated via CSS for the other three corners.
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

export const TemplatesSection = () => {
  const { t } = useWarisanLang();
  const [selectedId, setSelectedId] = useState<string>(heritageTemplates[0].id);

  const tierLabel = (tier: "free" | "motion" | "cinematic") =>
    tier === "free" ? t("tpl.free") : tier === "motion" ? t("tpl.motion") : t("tpl.cinematic");

  return (
    <section className="warisan-section songket-section" id="templates">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-label reveal-3d">{t("sec.templates")}</div>
          <Html
            as="h2"
            className="section-title reveal-3d reveal-d1"
            html={t("tpl.title")}
          />
          <p className="section-sub reveal-3d reveal-d2">{t("tpl.sub")}</p>
        </div>

        <div className="templates-grid">
          {heritageTemplates.map((tpl, i) => {
            const isSelected = tpl.id === selectedId;
            const href = `/buat-warisan?heritage=${tpl.id}`;
            return (
              <a
                key={tpl.id}
                href={href}
                onClick={(e) => {
                  // Single-click selects + scrolls to builder; dbl-click navigates.
                  if (e.detail === 1) {
                    e.preventDefault();
                    setSelectedId(tpl.id);
                    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`tpl-card reveal-3d ${isSelected ? "selected" : ""} reveal-d${(i % 7) + 1}`}
                data-tpl-id={tpl.id}
                aria-label={`${tpl.name} — ${tierLabel(tpl.tier)}`}
              >
                <span className="tpl-corner tpl-corner-tl"><CornerOrnament /></span>
                <span className="tpl-corner tpl-corner-tr"><CornerOrnament /></span>
                <span className="tpl-corner tpl-corner-br"><CornerOrnament /></span>
                <span className="tpl-corner tpl-corner-bl"><CornerOrnament /></span>
                <div
                  className="tpl-preview"
                  style={{ backgroundImage: `url(${tpl.thumb})` }}
                >
                  <div className="tpl-overlay" />
                  <div className="tpl-card-content">
                    <div className="tpl-card-names">
                      <span className="tpl-card-bride">Farah</span>
                      <span className="tpl-card-amp">&amp;</span>
                      <span className="tpl-card-groom">Adam</span>
                    </div>
                  </div>
                </div>
                <div className="tpl-meta">
                  <div className="tpl-name">{tpl.name}</div>
                  <div className={`tpl-tag ${tpl.tier}`}>{tierLabel(tpl.tier)}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
