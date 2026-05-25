"use client";

// Phase 4 conversion of Stitch screen `undang-cover` — see
// .stitch/designs/undang-cover.html for the mobile visual target. Behavior
// matches the previous InvitationScroll HeroParallax: GSAP background/foreground
// parallax pinned to the full-viewport hero, optional floating RSVP chip.
//
// The published-invitation contract is preserved: this component consumes
// fields from the cinematic InvitationProps payload and only reads what it
// needs (`brideShort`, `groomShort`, `dateLong`, `borderAsset`, `rsvpEnabled`).
//
// taste-design audit: the "SCROLL" cue chevron was removed — published
// invitations should not carry scroll-cue chrome.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Theme } from "@cinematic/themes";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type CoverProps = Readonly<{
  theme: Theme;
  brideShort: string;
  groomShort: string;
  dateLong: string;
  rsvpEnabled: boolean;
}>;

export const CoverSection = ({
  theme,
  brideShort,
  groomShort,
  dateLong,
  rsvpEnabled,
}: CoverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || !bgRef.current || !fgRef.current) return;
      gsap.to(bgRef.current, {
        yPercent: 35,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(fgRef.current, {
        yPercent: -10,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="undang-cover"
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: "-10% -5%",
          backgroundImage: `url(/${theme.borderAsset})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55,
          filter: "blur(0.4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, ${theme.palette.bg}E6 70%)`,
        }}
      />

      {rsvpEnabled && (
        <a
          href="#rsvp"
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            zIndex: 5,
            padding: "8px 14px",
            borderRadius: 999,
            background: theme.palette.gold,
            color: theme.palette.bg,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            textDecoration: "none",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
          }}
        >
          RSVP
        </a>
      )}

      <div
        ref={fgRef}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 720,
        }}
      >
        <p
          className="undang-cover-eyebrow"
          style={{
            fontSize: 12,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.palette.muted,
            margin: 0,
          }}
        >
          Walimatul Urus
        </p>
        <h1
          className="undang-cover-names"
          style={{
            fontFamily: theme.fonts.script,
            fontSize: "clamp(56px, 12vw, 120px)",
            lineHeight: 1,
            color: theme.palette.gold,
            margin: "16px 0 8px",
            fontWeight: 400,
          }}
        >
          {brideShort} <span style={{ color: theme.palette.rose }}>&</span> {groomShort}
        </h1>
        <p
          className="undang-cover-date"
          style={{
            fontFamily: theme.fonts.display,
            fontSize: 18,
            letterSpacing: 4,
            color: theme.palette.ink,
            margin: "8px 0 0",
          }}
        >
          {dateLong}
        </p>
      </div>
    </section>
  );
};
