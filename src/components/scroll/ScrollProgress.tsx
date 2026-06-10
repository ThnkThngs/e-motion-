"use client";

// Hairline reading-progress bar for the published-invitation scroll.
// transform: scaleX (not width) so it never triggers layout; updates are
// rAF-coalesced from a passive scroll listener. Purely decorative — hidden
// from the accessibility tree.

import { useEffect, useRef } from "react";

export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 90,
        background: "color-mix(in oklab, var(--ink) 8%, transparent)",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          transformOrigin: "left",
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, var(--gold), var(--rose))",
          willChange: "transform",
        }}
      />
    </div>
  );
};
