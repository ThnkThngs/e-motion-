// Songket archetype — gold weave on indigo/royal palettes.
// Hero: dense songket weave overlay + gold woven label rule.
// Matches WarisanCardPreview's contract: { form }, inline styles, hardcoded
// Malay, shared .phone/.inv-* CSS classes.

"use client";

import { SongketWeavePattern } from "@/components/warisan/atoms/SongketWeavePattern";
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

export const SongketArchetype = ({ form }: ArchetypeProps) => {
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
              opacity: 0.32,
              filter: "saturate(1.1)",
            }}
          />
        )}
        {/* Songket weave — the defining motif of this archetype. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            color: "var(--gold)",
            opacity: 0.55,
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 9px, color-mix(in srgb, var(--gold) 22%, transparent) 9px 10px)",
          }}
        />
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, color: "var(--gold)" }}
        >
          <SongketWeavePattern size={340} opacity={0.22} />
        </div>
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
