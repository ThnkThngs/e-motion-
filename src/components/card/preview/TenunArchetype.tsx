// Tenun archetype — warm earthy hand-woven tones via layered overlays.
// Hero: horizontal woven-thread overlay + earth-warm vignette.

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

export const TenunArchetype = ({ form }: ArchetypeProps) => {
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
              opacity: 0.3,
              filter: "saturate(1.05)",
            }}
          />
        )}
        {/* Woven horizontal threads — the tenun hand-loom texture. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 5px, color-mix(in srgb, var(--maroon) 30%, transparent) 5px 6px)",
          }}
        />
        {/* Earth-warm vignette. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 45%, color-mix(in srgb, var(--maroon-dark) 55%, transparent) 100%)",
          }}
        />
        <div className="inv-hero-content">
          <div className="inv-bismillah" style={{ color: theme.accent }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="inv-hero-label" style={{ color: theme.accent }}>
            Walimatul Urus
          </div>
          <HeroNames form={form} theme={theme} />
          <HeroIntro form={form} theme={theme} />
        </div>
      </div>
      <CardBody form={form} theme={theme} cd={cd} />
    </PhoneFrame>
  );
};
