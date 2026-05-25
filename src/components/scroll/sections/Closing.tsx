"use client";

// Phase 4 conversion of Stitch screen `undang-closing` — see
// .stitch/designs/undang-closing.html. Mobile visual target: a gradient
// closing canvas with a large script "Terima Kasih", a gratitude verse, the
// couple attribution, an ornamental star row, and a brand medallion.
//
// Behavior: presentational only. Replaces the previous InvitationScroll
// OutroFooter and carries `brandLine` plus the short couple names. The Stitch
// `hotel_star`/`filter_vintage` Material icons and the rotated corner glyphs
// are rendered as inline SVG per the taste-design "no emoji / no icon-font"
// rule.

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle } from "./_shared";

type ClosingProps = Readonly<{
  brideShort: string;
  groomShort: string;
  brandLine: string;
}>;

// Star ornament — replaces the Stitch `hotel_star` Material Symbol so the
// section carries no icon-font dependency. Module-level per
// react-best-practices (rerender-no-inline-components).
const StarGlyph = ({ size }: Readonly<{ size: number }>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2l2.95 6.18L21.5 9.1l-4.75 4.6L17.9 21 12 17.27 6.1 21l1.15-7.3L2.5 9.1l6.55-.92L12 2z" />
  </svg>
);

const STAR_SIZES = [12, 16, 12] as const;

export const ClosingSection = ({ brideShort, groomShort, brandLine }: ClosingProps) => {
  const ref = useScrollReveal<HTMLElement>({
    y: 40,
    stagger: 0.12,
    childSelector: "[data-stagger]",
  });

  return (
    <section
      ref={ref}
      className="undang-closing"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 24px",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--rose) 22%, var(--bg)) 0%, var(--bg) 100%)",
      }}
    >
      <h2
        data-stagger
        className="undang-closing-title"
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(64px, 14vw, 120px)",
          lineHeight: 1,
          color: "var(--gold)",
          margin: 0,
          fontWeight: 400,
        }}
      >
        Terima Kasih
      </h2>

      <p
        data-stagger
        className="undang-closing-verse"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--ink)",
          maxWidth: 520,
          margin: "28px auto 0",
          opacity: 0.9,
        }}
      >
        Atas kehadiran dan doa restu, kami ucapkan terima kasih yang tidak
        terhingga. Semoga ikatan ini diberkati hingga ke akhirnya.
      </p>

      <p
        data-stagger
        style={{ ...eyebrowStyle, marginTop: 40 }}
      >
        Daripada keluarga
      </p>
      <h3
        data-stagger
        style={{
          fontFamily: "var(--font-script)",
          fontSize: "clamp(34px, 8vw, 52px)",
          color: "var(--rose)",
          margin: "10px 0 0",
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {brideShort} &amp; {groomShort}
      </h3>

      <div
        data-stagger
        className="undang-closing-ornament"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 36,
          color: "color-mix(in oklab, var(--gold) 60%, transparent)",
        }}
      >
        <span
          style={{
            width: 44,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--gold) 40%, transparent))",
          }}
        />
        {STAR_SIZES.map((size, i) => (
          <span key={`star-${i}`} style={{ display: "inline-flex" }}>
            <StarGlyph size={size} />
          </span>
        ))}
        <span
          style={{
            width: 44,
            height: 1,
            background:
              "linear-gradient(270deg, transparent, color-mix(in oklab, var(--gold) 40%, transparent))",
          }}
        />
      </div>

      <div
        data-stagger
        className="undang-closing-medallion"
        style={{
          width: 88,
          height: 88,
          marginTop: 36,
          borderRadius: 999,
          border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)",
          background: "color-mix(in oklab, var(--gold) 8%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-script)",
          fontSize: 28,
          color: "var(--gold)",
        }}
      >
        e&middot;m
      </div>

      <p
        data-stagger
        style={{
          marginTop: 18,
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {brandLine}
      </p>
      <p
        data-stagger
        style={{
          marginTop: 6,
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 13,
          letterSpacing: 2,
          color: "var(--muted)",
        }}
      >
        e-motion.my
      </p>
    </section>
  );
};
