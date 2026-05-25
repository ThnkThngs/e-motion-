// Batik archetype — maroon + champagne-gold, paisley-dense ornament.
// Hero: lotus medallion crown + champagne-gold radial bloom.

"use client";

import { LotusMedallion } from "@/components/warisan/atoms/LotusMedallion";
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

export const BatikArchetype = ({ form }: ArchetypeProps) => {
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
          padding: "52px 24px 32px",
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
              opacity: 0.38,
              filter: "saturate(1.15)",
            }}
          />
        )}
        {/* Champagne-gold bloom — the batik glow. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 50% 18%, color-mix(in srgb, var(--gold-light) 38%, transparent) 0%, transparent 65%)",
          }}
        />
        <div className="inv-hero-content">
          {/* Lotus medallion crown — replaces a decorative glyph. */}
          <div
            aria-hidden="true"
            style={{
              color: theme.accent,
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <LotusMedallion size={34} />
          </div>
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
