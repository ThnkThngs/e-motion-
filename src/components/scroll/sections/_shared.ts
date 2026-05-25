// Phase 4 conversion — shared helpers for the 11 undang scroll sections.
// Module-level constants per react-best-practices (rerender-no-inline-components,
// rendering-hoist-jsx). Keep this file lean — no JSX, no React imports.

import type { CSSProperties } from "react";

// Mobile-first full-bleed section container used by every scroll segment.
// Matches the existing InvitationScroll sectionStyle so the published-invitation
// rhythm doesn't shift after the split.
export const sectionStyle: CSSProperties = {
  padding: "100px 24px",
  textAlign: "center",
  maxWidth: 1080,
  margin: "0 auto",
};

export const formInputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid color-mix(in oklab, var(--ink) 18%, transparent)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "inherit",
  color: "var(--ink)",
  background: "color-mix(in oklab, var(--bg) 90%, white)",
  outline: "none",
};

export const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: 6,
  textTransform: "uppercase",
  color: "var(--muted)",
  margin: 0,
};
