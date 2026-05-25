"use client";

// Phase 4 conversion of Stitch screen `undang-countdown` — see
// .stitch/designs/undang-countdown.html. Mobile visual target: a centered
// eyebrow followed by a 4-tile (Hari/Jam/Minit/Saat) grid styled in gold
// against the songket section.
//
// Behavior preserved from the previous InvitationScroll CountdownSection:
// 1s interval reseat of `now`, deterministic diff math, padded display.

import { useEffect, useMemo, useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle, sectionStyle } from "./_shared";

type CountdownProps = Readonly<{
  eventDateTime: string;
}>;

// Module-level (rerender-hoist-jsx / js-hoist-regexp spirit) — these labels
// never change so we keep the array out of every render.
const SLOTS = [
  { key: "d", label: "Hari" },
  { key: "h", label: "Jam" },
  { key: "m", label: "Minit" },
  { key: "s", label: "Saat" },
] as const;

export const CountdownSection = ({ eventDateTime }: CountdownProps) => {
  const ref = useScrollReveal<HTMLElement>({ y: 40 });
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = useMemo(() => new Date(eventDateTime).getTime(), [eventDateTime]);
  const diff = Math.max(0, target - now);
  const values: Record<(typeof SLOTS)[number]["key"], number> = {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };

  return (
    <section
      ref={ref}
      className="undang-countdown"
      style={{ ...sectionStyle, paddingBlock: 80 }}
    >
      <p style={{ ...eyebrowStyle, marginBottom: 24 }}>Menghitung hari</p>
      <div
        className="undang-countdown-grid"
        style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
      >
        {SLOTS.map(({ key, label }) => (
          <div
            key={key}
            className="undang-countdown-tile"
            style={{
              minWidth: 78,
              padding: "16px 14px",
              borderRadius: 14,
              border: "1px solid color-mix(in oklab, var(--gold) 50%, transparent)",
              background: "color-mix(in oklab, var(--gold) 8%, transparent)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 38,
                color: "var(--gold)",
                lineHeight: 1,
                fontWeight: 600,
              }}
            >
              {String(values[key]).padStart(2, "0")}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "var(--muted)",
                marginTop: 6,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
