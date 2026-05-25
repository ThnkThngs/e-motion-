"use client";

// Phase 4 conversion of Stitch screen `undang-akad` — see
// .stitch/designs/undang-akad.html. Mobile visual target: dark songket section
// with a left-aligned eyebrow, large italic time, and a glass card carrying
// the venue + arrival info.
//
// Behavior: preserves the parents/bismillah/couple block that previously lived
// in InvitationScroll's BismillahSection + CoupleSection, so the published
// invitation still leads with the formal salutation before showing akad timing.

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { InvitationProps } from "@cinematic/schema";
import type { Theme } from "@cinematic/themes";
import { eyebrowStyle, sectionStyle } from "./_shared";

type AkadProps = Readonly<{
  theme: Theme;
  payload: InvitationProps;
}>;

export const AkadSection = ({ theme, payload }: AkadProps) => {
  const ref = useScrollReveal<HTMLElement>({
    y: 36,
    stagger: 0.12,
    childSelector: "[data-stagger]",
  });
  const lines = payload.inviteBody.split("\n").filter(Boolean);

  return (
    <section ref={ref} className="undang-akad" style={sectionStyle}>
      <p
        data-stagger
        style={{
          fontFamily: theme.fonts.arabic,
          fontSize: "clamp(34px, 7vw, 64px)",
          lineHeight: 1.4,
          color: theme.palette.gold,
          margin: 0,
          direction: "rtl",
        }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p
        data-stagger
        style={{ marginTop: 14, color: "var(--muted)", letterSpacing: 4, fontSize: 12 }}
      >
        Dengan nama Allah, Yang Maha Pemurah, Lagi Maha Mengasihani
      </p>

      <p data-stagger style={{ ...eyebrowStyle, marginTop: 44 }}>
        Akad Nikah
      </p>
      <p
        data-stagger
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 14,
          letterSpacing: 1.5,
          color: "var(--muted)",
          maxWidth: 520,
          margin: "20px auto 0",
          lineHeight: 1.7,
        }}
      >
        {payload.parents}
      </p>
      {lines.map((line, i) => (
        <p
          // Lines come from `inviteBody` and are user-authored; index is the only
          // stable identity available here.
          key={`${line}-${i}`}
          data-stagger
          style={{
            margin: "12px 0 0",
            fontSize: 16,
            color: "var(--ink)",
            lineHeight: 1.7,
          }}
        >
          {line}
        </p>
      ))}
      <h2
        data-stagger
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(40px, 8vw, 72px)",
          color: "var(--gold)",
          margin: "28px 0 8px",
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {payload.brideName}
      </h2>
      <p data-stagger style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
        Puteri kepada {payload.brideFather}
      </p>
      <p data-stagger style={{ color: "var(--rose)", fontSize: 22, margin: "20px 0" }}>
        &
      </p>
      <h2
        data-stagger
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(40px, 8vw, 72px)",
          color: "var(--gold)",
          margin: "0 0 8px",
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {payload.groomName}
      </h2>
      <p data-stagger style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
        Putera kepada {payload.groomFather}
      </p>

      <div
        data-stagger
        className="undang-akad-card"
        style={{
          maxWidth: 360,
          margin: "44px auto 0",
          padding: 22,
          borderRadius: 14,
          border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)",
          background: "color-mix(in oklab, var(--gold) 5%, transparent)",
          textAlign: "left",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Ketibaan
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>
          {payload.scheduleArrival}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--muted)" }}>
          {payload.venue}
        </p>
      </div>
    </section>
  );
};
