"use client";

import { useWarisanLang } from "@/lib/warisan/useWarisanLang";

// Phase 4 conversion of Stitch screen `landing-stats`.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Stitch's TopNavBar/Footer are NOT included here — those belong to
//     WarisanNav / WarisanFooter (separate Phase 4 surfaces).
//   • Per-stat reveal-d<n> stagger matches the source delay-100/200/300/400.
//   • taste-design FIX: the Stitch source fabricated "10,000+ PASANGAN" and
//     "60s PURATA TERBITAN" metrics. Those are removed. Only verifiable value
//     props remain — 20 (real template count), 4 (real language count) — plus
//     two non-numeric props ("Sinematik"/"Segera") so no metric is invented.

type Stat = { valueKey: string; labelKey: string; word: boolean };

const stats: ReadonlyArray<Stat> = [
  { valueKey: "stat.tpl.v", labelKey: "stat.tpl", word: false },
  { valueKey: "stat.fx.v", labelKey: "stat.fx", word: true },
  { valueKey: "stat.time.v", labelKey: "stat.time", word: true },
  { valueKey: "stat.lang.v", labelKey: "stat.lang", word: false },
];

// Pucuk-rebung corner ornament. Module level per react-best-practices
// rerender-no-inline-components.
const SongketCorner = () => (
  <svg
    viewBox="0 0 40 40"
    width="40"
    height="40"
    fill="none"
    aria-hidden="true"
    focusable="false"
    stroke="currentColor"
  >
    <path
      d="M20 0L40 20L20 40L0 20L20 0ZM20 10L30 20L20 30L10 20L20 10Z"
      strokeWidth="1"
    />
  </svg>
);

export const StatsStrip = () => {
  const { t } = useWarisanLang();
  return (
    <section className="warisan-section songket-section stats-section reveal-3d">
      <span className="stats-corner stats-corner-tl">
        <SongketCorner />
      </span>
      <span className="stats-corner stats-corner-tr">
        <SongketCorner />
      </span>
      <span className="stats-corner stats-corner-bl">
        <SongketCorner />
      </span>
      <span className="stats-corner stats-corner-br">
        <SongketCorner />
      </span>
      <div className="stats-strip">
        {stats.map((s, i) => (
          <div
            key={s.labelKey}
            className={`stat-item reveal-3d reveal-d${i + 1}`}
          >
            <div className={`stat-num${s.word ? " stat-num--word" : ""}`}>
              {t(s.valueKey)}
            </div>
            <div className="stat-label">{t(s.labelKey)}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
