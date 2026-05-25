// Ikat archetype — maroon→gold-shadow gradients, sun-bleached warm feel.
// Hero: diagonal ikat-blur gradient wash + gold-shadow corner glows.

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

export const IkatArchetype = ({ form }: ArchetypeProps) => {
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
              opacity: 0.34,
              filter: "saturate(1.2)",
            }}
          />
        )}
        {/* Diagonal ikat wash — maroon to gold-shadow, the dyed-thread bleed. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(135deg, color-mix(in srgb, var(--maroon) 45%, transparent) 0%, transparent 40%, color-mix(in srgb, var(--gold-shadow) 50%, transparent) 100%)",
          }}
        />
        {/* Sun-bleached gold corner glows. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 12% 14%, color-mix(in srgb, var(--gold-light) 42%, transparent) 0%, transparent 32%), radial-gradient(circle at 88% 86%, color-mix(in srgb, var(--gold-light) 30%, transparent) 0%, transparent 34%)",
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
