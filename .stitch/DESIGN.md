# Design System: e-motion Warisan Edition

**Project ID:** _pending — created via `stitch:create_project` in Phase 2_

> This file is the prompt-injected "DESIGN SYSTEM (REQUIRED)" block for every Stitch screen generated for the e-motion Warisan Edition. Synthesized from `src/styles/globals.css :root`, `src/styles/warisan.css`, `src/app/layout.tsx`, and the just-shipped glass+pucuk-rebung Heritage Templates card. Layered with the `taste-design` skill's anti-generic constraints.

---

## 1. Visual Theme & Atmosphere

Ceremonial, intimate, and cinematic — a Malay royal-court ceremony at twilight, reinterpreted as a digital product. Surfaces are deep, hand-woven, and reverent; never bright, never flat, never generic-SaaS. Layouts are **asymmetric by default** — off-center hero compositions, 60/40 split panes with sticky preview rails, parallax depth between content and ornament. Motion is **perpetual but restrained**: petals drift, gold dust shimmers, ornaments fade up on reveal, marquees loop endlessly. Never bouncy, never spinner-y, never a finished animation.

Each screen sits in one of three section moods, and only one:
- **Songket section** (dark) — gold-on-midnight indigo→maroon gradient, songket-motif SVG overlay
- **Ivory section** (light) — cream→ivory, maroon ink, gold accent
- **Maroon section** (jewel) — maroon→maroon-dark, gold filigree overlay

There is no fourth mood. Generic neutral backgrounds, white pages, or saturated brand-blue surfaces are forbidden.

---

## 2. Color Palette & Roles

**Surfaces (dark mode default — `body[data-warisan]` is the floor):**
- **Deep Indigo Night** (#0d1228) — body floor; the canonical page backdrop
- **Indigo Twilight** (#1a2040) — section base for songket-section
- **Indigo Mist** (#2a3460) — raised glass states, hover lift, songket-section midpoint
- **Royal Maroon** (#6b1d2e) — section accent, primary ink on ivory surfaces, alert ink
- **Maroon Velvet** (#4a1020) — songket-section gradient endpoint, maroon-section base

**Heritage golds — the unifying spine across every surface:**
- **Songket Gold** (#c9a24e) — primary CTA fill, ornament strokes, "✓ AKTIF" badge, eyebrow labels on dark
- **Champagne Gold** (#e8c775) — gradient highlight stop on gold buttons & titles, glow accents
- **Pale Gold** (#f0d68c) — focused-state outer glow, drifting particle dust
- **Gold Shadow** (#8a6d2a) — Cormorant italic helper text on ivory surfaces

**Earth & jewel accents (sparingly):**
- **Emerald Forest** (#2d5a3f) — "Free" tier badge fill only; never on text
- **Emerald Deep** (#1a3525) — emerald drop shadow

**Light surfaces:**
- **Warm Ivory** (#f8f0de) — body copy on dark surfaces, glass card titles
- **Ivory Warm** (#f2e6c8) — ivory-section gradient endpoint
- **Cream** (#faf4e3) — ivory-section gradient start, light surface base
- **Rose Whisper** (#d4949a) — neutral accent on form inputs only

**Muted (italic helper copy):**
- Muted (rgba(248, 240, 222, 0.55)) — Cormorant italic on dark
- Muted Dark (rgba(26, 32, 64, 0.55)) — Cormorant italic on ivory

**Hard rule:** every color in generated HTML must resolve through one of the `var(--*)` tokens above. Stitch may emit hex literals; the conversion step remaps them. No new colors permitted without adding to this list first.

---

## 3. Typography Rules

A five-font system loaded once via `next/font/google` in `src/app/layout.tsx` and switched by `body[data-lang]`. Stitch must use the CSS variables, not raw font names:

- **Playfair Display Italic** (`var(--font-playfair)`) — every hero title, every section-title. Weights 400/500/600/700. Letter-spacing tightens to **-0.02em** at display size. Always italic for emphasis spans; the `<em>` inside section titles uses Cormorant Garamond instead for a deliberate contrast.
- **Cormorant Garamond Italic** (`var(--font-cormorant)`) — section-sub copy, helper text, success-state ribbons, gold-shadow Cormorant for italic asides. Weights 300/400/500. Italic by default; upright only on form labels.
- **Inter** (`var(--font-inter)`) — eyebrow labels, button copy, tier badges, form inputs, navigation. Weights 300-700. Uppercase tracking **0.18-0.35em** on labels, never on body.
- **Noto Serif SC** (`var(--font-noto-sc)`) — auto-applied via `body[data-lang="zh"] .section-title` and equivalents. Use only when zh is active.
- **Tiro Devanagari Hindi** (`var(--font-tiro-hi)`) — auto-applied via `body[data-lang="hi"]`. Hindi-only.

**Hierarchy:**
- Hero title: `clamp(56px, 7vw, 96px)` Playfair italic, letter-spacing -0.03em, line-height 1.05
- Section title: `clamp(40px, 5.5vw, 72px)` Playfair italic, letter-spacing -0.02em, line-height 1.1
- Eyebrow / section-label: 11px Inter uppercase, tracking 0.35em, color gold-on-dark / maroon-on-ivory
- Section sub: 19px Cormorant italic 300, line-height 1.6, max-width 580px, centered
- Body copy: 16-17px Inter / Cormorant depending on surface
- Tier badge: 9-11px Inter uppercase tracking 0.18em

**Anti-pattern:** never set `font-family: system-ui` or `sans-serif` directly. Always go through the variable.

---

## 4. Component Stylings

- **Buttons (two shapes only):**
  - *Primary*: pill-shaped (border-radius 999px), gold-gradient fill `linear-gradient(135deg, #e8c775 0%, #c9a24e 100%)`, indigo-deep ink, 6-12px box-shadow tinted `rgba(201,162,78,0.35)`. Generously rounded; never sharp.
  - *Ghost*: pill-shaped, 1px gold border at 30%, transparent fill, gold ink, hover-fills to 10% gold. Same radius.
  - Buttons inside ivory sections invert to maroon ink with gold accent.

- **Cards / containers (glass spec):**
  - Background: `linear-gradient(180deg, rgba(26,32,64,0.55) 0%, rgba(13,18,40,0.65) 100%)`
  - Border: 1px hairline `rgba(201,162,78,0.28)` — intensifies to 0.70 on hover, solid gold on selected
  - Backdrop filter: `blur(18px) saturate(140%)` (+ webkit prefix)
  - Border-radius: **14px** (generously rounded; never above 20px, never below 10px)
  - Shadow: `0 1px 0 rgba(248,240,222,0.06) inset, 0 18px 50px rgba(0,0,0,0.45)`
  - **Hover:** translateY(-8px) + rotate(-0.6deg) + gold halo glow
  - **Selected:** 2px solid gold ring + `✓ AKTIF` pill-badge top-left
  - **Four pucuk-rebung corner ornaments** (per the Phase 3.5 spec): 40×40 SVG glyph rotated 0/90/180/270° at the four corners. Stroke is `currentColor` set to gold. Opacity 0.7 → 1.0 on hover.

- **Inputs / forms:**
  - **Sharp 4px corners** on inputs to contrast the soft card radius — this is a deliberate texture decision, not a mistake.
  - 1px borders in `rgba(201,162,78,0.28)` on dark; `rgba(107,29,46,0.20)` on ivory.
  - Focus ring: 2px outline in gold, offset 2px.
  - Cream surface inputs on ivory sections; indigo-mist glass inputs on dark.

- **Modals:** Centered glass panels using the card spec above, plus an outer halo `0 0 60px rgba(201,162,78,0.18)` for the candlelit feel. Backdrop is `rgba(13,18,40,0.85)` with blur(8px).

- **Pills / tier badges:** 999px radius, 9-11px Inter uppercase. Three semantics only:
  - **Free** — ivory ghost outline `rgba(248,240,222,0.35)`, ivory ink, 10% ivory fill
  - **Motion** — solid gold gradient, indigo-deep ink, gold shadow
  - **Cinematic** — maroon→gold-shadow gradient, ivory ink, gold border

---

## 5. Layout Principles

**Asymmetric by default.** Hero compositions place the title 60/40 left-weighted with a parallaxing ornament cluster on the right. Section pairs alternate sticky-preview-right → centered-content → sticky-preview-left. Form pages use a `minmax(0, 1fr) 380px` two-column grid that collapses to single-column at 1100px. Container caps at **1280px** with 32px gutters at desktop and 16px at mobile.

**Whitespace strategy:**
- Section padding: 140px vertical desktop, 80px mobile
- Section internal rhythm: section-label (mb-20px) → section-title (mb-24px) → section-sub (mb-48px) → content grid
- Grid gaps: 18px on dense card grids (templates), 32px on form/preview pairs, 14-16px on mobile

**Motion grammar (perpetual micro-motion required):**
- Every block opts into `.reveal-3d`: hidden state `translateY(40px) rotate3d(1, 0.5, 0, 5deg) opacity:0`; reveal on intersection with `cubic-bezier(.19, 1, .22, 1)` 0.8s; stagger via `.reveal-d1..d7` (100ms each).
- Background particle layers (gold dust 1-2px) drift indefinitely at low opacity behind hero/CTA — perpetual, never a stop frame.
- Hover transitions are 0.55s cubic-bezier(.19, 1, .22, 1). Never linear, never under 200ms, never over 800ms.
- Marquee strips (testimonials) loop 35s linear, never stop on hover unless reduced-motion is set.

**Anti-patterns (auto-reject in generated screens):**
- Flat solid backgrounds → must be gradient or have a motif overlay
- Everything centered → always have at least one asymmetric element per section
- Animations that finish without looping → all decorative motion must persist
- Tailwind utility hex literals leaking into JSX → every color must reach a `var(--*)` token
- Drop shadows with `rgba(0,0,0,0.X)` → shadows on dark surfaces tint with gold; shadows on ivory tint with maroon
- Border radius equal to 0 or above 20px on cards → only the 14px standard or pill 999px

**Reveal hook:** all generated section components are expected to render with `className="reveal-3d reveal-d<n>"` so the existing `useReveal3d()` hook at `src/lib/warisan/useReveal3d.ts` picks them up. Page wrappers call `useReveal3d()` once at mount.
