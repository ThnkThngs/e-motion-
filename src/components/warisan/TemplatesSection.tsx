"use client";

import { useState } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { heritageTemplates } from "@/lib/heritageTemplates";
import { Html } from "./Html";

// Artisan/workshop attribution per archetype — paperlesspost-style prestige
// signalling without inventing specific designer names. Each workshop label
// references a real Malaysian textile-craft region tied to the archetype.
const ARTISAN_BY_ARCHETYPE: Record<string, string> = {
  songket: "Songket Pahang Workshop",
  batik: "Batik Kelantan Artisan",
  tenun: "Tenun Terengganu Studio",
  ikat: "Ikat Sarawak Collective",
  "pucuk-rebung": "Pucuk Rebung Studio",
  geometri: "Kerawang Modern",
};

const artisanFor = (archetype: string): string =>
  ARTISAN_BY_ARCHETYPE[archetype] ?? "Warisan Studio";

// Per-archetype 3-color palette swatch. Inlined here (not imported from
// remotion/src/themes) because that module loads Remotion Google Fonts via
// React context — incompatible with Next.js server boundary even though
// this component is "use client". Kept aligned with cinematic theme palettes.
type Swatch = readonly [string, string, string]; // [bg, gold, rose]
const PALETTE_BY_ARCHETYPE: Record<string, Swatch> = {
  songket: ["#0F0A1A", "#F4D78A", "#E5564B"],
  batik: ["#FFFAF1", "#D89A2C", "#C0463A"],
  tenun: ["#3A2F23", "#C9954F", "#C46850"],
  ikat: ["#0E1B2C", "#E8B96A", "#F2B8AB"],
  "pucuk-rebung": ["#0E2745", "#D4A24A", "#E8826E"],
  geometri: ["#F6F1EA", "#8FA08C", "#C58B7A"],
};
const paletteFor = (archetype: string): Swatch =>
  PALETTE_BY_ARCHETYPE[archetype] ?? PALETTE_BY_ARCHETYPE.songket;

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
                {/* Hover-reveal palette swatch — paperlesspost-style "info on intent" */}
                {(() => {
                  const [bg, gold, rose] = paletteFor(tpl.archetype);
                  return (
                    <div className="tpl-palette" aria-hidden="true">
                      <span style={{ background: bg }} />
                      <span style={{ background: gold }} />
                      <span style={{ background: rose }} />
                    </div>
                  );
                })()}
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
                  <div className="tpl-meta-text">
                    <div className="tpl-name">{tpl.name}</div>
                    <div
                      className="tpl-artisan"
                      style={{
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "var(--gold-pale)",
                        opacity: 0.55,
                        marginTop: 2,
                      }}
                    >
                      {artisanFor(tpl.archetype)}
                    </div>
                  </div>
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
