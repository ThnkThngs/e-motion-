// Pucuk Rebung archetype — emerald palettes, filigree corner ornaments.
// Hero: four CornerOrnament filigree marks + emerald lattice overlay.

"use client";

import { CornerOrnament } from "@/components/warisan/atoms/CornerOrnament";
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

// Corner placements for the pucuk-rebung filigree marks (module-level helper).
type Corner = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  rotate: number;
};

const CORNERS: readonly Corner[] = [
  { top: 14, left: 14, rotate: 0 },
  { top: 14, right: 14, rotate: 90 },
  { bottom: 14, right: 14, rotate: 180 },
  { bottom: 14, left: 14, rotate: 270 },
];

export const PucukRebungArchetype = ({ form }: ArchetypeProps) => {
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
          padding: "64px 24px 36px",
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
              filter: "saturate(1.1)",
            }}
          />
        )}
        {/* Emerald lattice — pucuk-rebung bamboo-shoot triangulation. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "repeating-linear-gradient(60deg, transparent 0 13px, color-mix(in srgb, var(--emerald-forest) 40%, transparent) 13px 14px), repeating-linear-gradient(-60deg, transparent 0 13px, color-mix(in srgb, var(--emerald-forest) 40%, transparent) 13px 14px)",
          }}
        />
        {/* Filigree corner ornaments — the defining pucuk-rebung frame. */}
        {CORNERS.map((c) => (
          <div
            key={`${c.rotate}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              color: theme.accent,
              opacity: 0.85,
              transform: `rotate(${c.rotate}deg)`,
            }}
          >
            <CornerOrnament size={38} />
          </div>
        ))}
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
