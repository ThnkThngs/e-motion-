"use client";

// Phase 4 conversion of Stitch screen `undang-resepsi` — see
// .stitch/designs/undang-resepsi.html. Mobile visual target: maroon section
// with centered eyebrow, time block, and an inset glass card listing the
// reception venue + meal schedule.
//
// Maps `payload.scheduleMeal` + `payload.venueAddress` from the existing
// cinematic InvitationProps contract; no new schema fields are introduced.

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { InvitationProps } from "@cinematic/schema";
import { eyebrowStyle } from "./_shared";

type ResepsiProps = Readonly<{
  payload: InvitationProps;
}>;

export const ResepsiSection = ({ payload }: ResepsiProps) => {
  const ref = useScrollReveal<HTMLElement>({
    y: 50,
    stagger: 0.1,
    childSelector: "[data-stagger]",
  });

  return (
    <section
      ref={ref}
      className="undang-resepsi maroon-section"
      style={{
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--rose) 35%, var(--bg)) 0%, var(--bg) 100%)",
      }}
    >
      <p data-stagger style={eyebrowStyle}>
        Majlis Resepsi
      </p>
      <h3
        data-stagger
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 6vw, 48px)",
          color: "var(--gold)",
          margin: "12px 0 24px",
          fontWeight: 600,
        }}
      >
        {payload.dateLong}
      </h3>
      <div
        data-stagger
        className="undang-resepsi-card"
        style={{
          maxWidth: 360,
          margin: "0 auto",
          padding: 22,
          borderRadius: 14,
          border: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)",
          background: "color-mix(in oklab, var(--gold) 8%, transparent)",
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
          Tempat
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
          {payload.venue}
        </p>
        <p style={{ margin: "4px 0 14px", fontSize: 13, color: "var(--muted)" }}>
          {payload.venueAddress}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Jamuan
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
          {payload.scheduleMeal}
        </p>
      </div>
    </section>
  );
};
