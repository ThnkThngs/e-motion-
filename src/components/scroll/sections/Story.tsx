"use client";

// Phase 4 conversion of Stitch screen `undang-story` — see
// .stitch/designs/undang-story.html. Mobile visual target: dark songket
// section with a horizontally-pinned scroll of doa/story cards.
//
// Behavior: preserves the existing InvitationScroll SalamKautSection pin-scroll
// (GSAP horizontal pin tied to the viewport width). The cinematic schema
// surfaces these strings as `features.salamKaut.items`, so for now the "story"
// section reuses that data — when the schema gains a dedicated love-story
// timeline this section is the place to extend.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eyebrowStyle } from "./_shared";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type StoryProps = Readonly<{
  items: ReadonlyArray<string>;
}>;

export const StorySection = ({ items }: StoryProps) => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || !trackRef.current) return;
      const distance = trackRef.current.scrollWidth - window.innerWidth;
      if (distance <= 0) return;
      gsap.to(trackRef.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
        },
      });
    },
    { scope: ref },
  );

  if (items.length === 0) return null;

  return (
    <section
      ref={ref}
      className="undang-story"
      style={{ paddingBlock: 60, overflow: "hidden", textAlign: "center" }}
    >
      <p style={{ ...eyebrowStyle, marginBottom: 28 }}>Kisah & Doa</p>
      <div
        ref={trackRef}
        className="undang-story-track"
        style={{ display: "flex", gap: 18, padding: "0 20vw", willChange: "transform" }}
      >
        {items.map((s, i) => (
          <div
            // Strings may repeat across the salam-kaut list — pair index with text
            // so React's reconciler keeps each card in a stable slot.
            key={`${s}-${i}`}
            className="undang-story-card"
            style={{
              minWidth: 280,
              maxWidth: 320,
              padding: "26px 22px",
              borderRadius: 16,
              border: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)",
              background: "color-mix(in oklab, var(--gold) 6%, transparent)",
              fontFamily: "var(--font-display)",
              fontSize: 16,
              lineHeight: 1.5,
              color: "var(--ink)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 180,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </section>
  );
};
