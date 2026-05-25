// Geometri archetype — minimal indigo + gold, low-ornament dot-grid lattice.
// Hero: restrained gold dot-grid + single thin geometric rule.

"use client";

import {
  CardBody,
  HeroIntro,
  HeroNames,
  PhoneFrame,
  templateThumb,
  themeFor,
  useCountdown,
  type ArchetypeProps,
} from "./cardPreviewShared";

export const GeometriArchetype = ({ form }: ArchetypeProps) => {
  const theme = themeFor(form.templateId);
  const cd = useCountdown(form.countdownAt);
  const thumb = templateThumb(form.templateId);

  return (
    <PhoneFrame form={form}>
      <div
        className="inv-hero"
        style={{
          background: theme.bg,
          color: theme.ink,
          minHeight: 460,
          padding: "60px 24px 32px",
        }}
      >
        {thumb && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${thumb})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.22,
              filter: "saturate(1)",
            }}
          />
        )}
        {/* Minimal gold dot-grid — the only ornament this archetype carries. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage:
              "radial-gradient(color-mix(in srgb, var(--gold) 55%, transparent) 1px, transparent 1.4px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="inv-hero-content">
          <div className="inv-bismillah" style={{ color: theme.accent }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="inv-hero-label" style={{ color: theme.accent }}>
            Walimatul Urus
          </div>
          {/* Thin geometric rule — restrained substitute for dense motifs. */}
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 1,
              background: theme.accent,
              opacity: 0.7,
              margin: "0 auto 4px",
            }}
          />
          <HeroNames form={form} theme={theme} />
          <HeroIntro form={form} theme={theme} />
        </div>
      </div>
      <CardBody form={form} theme={theme} cd={cd} />
    </PhoneFrame>
  );
};
