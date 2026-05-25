# Design System: e-motion Warisan Edition

**Project:** Malaysian wedding invitation SaaS — scroll-based ceremonial cards + utilitarian admin
**Stack:** Next.js 15, Tailwind CSS, GSAP ScrollTrigger, Remotion video, Supabase
**Layers:**
- **(A) Invitation Scroll** — `/undang/[slug]` — ceremonial, theme-adaptive, 6 distinct aesthetics
- **(B) Admin & Builder UI** — `/admin`, `/buat-*` — tool-like, scannable, no decoration

---

## 1. Visual Theme & Atmosphere

### Layer A — Invitation Scroll

A *malam berinai* candlelit study. Rich brocade textures implied through layered gradients and gold leaf borders, never literal pattern tiling. The experience is intimate and unhurried — the couple's names emerge large and luminous from a deep background, while the page breathes slowly past them via parallax. Six distinct Malaysian wedding aesthetics live in one structural skeleton: from aged Khat manuscript parchment to near-black Songket velvet, the palette swaps completely at runtime through CSS custom properties. The emotional register is **ceremonial, romantic, intimate, culturally specific, and layered**.

**Density:** 4 — generous vertical padding, single-column scroll, wide negative space between ceremony details
**Variance:** 8 — asymmetric content alignment shifts per section; gold dividers, ornamental glyphs, and radial vignettes create visual relief
**Motion:** 7 — GSAP ScrollTrigger parallax on cover hero (35% scroll lag on background), scroll-triggered opacity reveals per section, spring-physics on interactive chips

### Layer B — Admin & Builder UI

A clinical, well-lit architect's studio. White canvas, generous whitespace, indigo as the sole action colour. Information density increases for data tables and RSVP lists, but the visual palette deliberately suppresses the wedding aesthetic to keep operators focused. No gold, no script fonts, no ivory warmth. The emotional register is **utilitarian, focused, calm, and trustworthy**.

**Density:** 7 — compact table rows, 3-column stat tiles, sidebar navigation
**Variance:** 3 — symmetric grid layout, consistent border treatments, no decorative elements
**Motion:** 3 — subtle `transition-all duration-150` on interactive states only

---

## 2. Color Palette & Roles

### 2A — Warisan Global Tokens (invitation layer + CSS custom properties)

- **Midnight Indigo** (`#1a2040`) — Primary structural depth: hero backgrounds, dark-theme ink, sidebar anchors
- **Obsidian Layer** (`#0d1228`) — Deepest surface: footer, sidebar shadow, cover background bleed
- **Elevated Slate** (`#2a3460`) — Elevated surfaces inside dark contexts: modal overlays on dark themes
- **Traditional Cinnabar** (`#6b1d2e`) — Bold cultural accent: buttons on light-theme sections, ceremonial highlights
- **Pressed Maroon** (`#4a1020`) — Hover/pressed maroon state
- **Warm Ochre Gold** (`#c9a24e`) — Primary invitation accent: couple names, CTA chips, gold dividers, borders
- **Honeyed Gold** (`#e8c775`) — Hover glows on gold elements, text highlights in dark contexts
- **Pollen Tint** (`#f0d68c`) — Subtle ornamental wash: background tints on card surfaces (dark themes)
- **Shadow Gold** (`#8a6d2a`) — Active/pressed gold, depth ring on focus states
- **Forest Emerald** (`#2d5a3f`) — Batik accent: thematic marker for the Batik Paisley template only
- **Parchment Ivory** (`#f8f0de`) — Off-white primary background for all light-theme scrolls
- **Warm Parchment** (`#f2e6c8`) — Card surfaces on light-theme sections (slightly warmer than primary)
- **Pale Cream** (`#faf4e3`) — Page background: Floral Walimatul and Batik Paisley templates
- **Dusty Rose** (`#d4949a`) — Mauve secondary accent: ampersand colour, female name accents
- **Translucent Ivory** (`rgba(248,240,222,0.55)`) — Body text colour on dark-background themes (preserves legibility over dark texture without full opacity)
- **Translucent Navy** (`rgba(26,32,64,0.55)`) — Overlay wash for modal backgrounds on light themes

### 2B — Six Invitation Theme Palettes (runtime injection via CSS custom properties)

Each theme sets `--bg`, `--ink`, `--gold`, `--rose`, `--muted`, `--accent` on `:root` or the scroll wrapper. A single scroll component adapts entirely at runtime — no per-theme component variants.

| Theme | `--bg` | `--ink` | `--gold` | `--rose` | `--accent` | Character |
|---|---|---|---|---|---|---|
| **Floral Walimatul** | `#FAF6E3` | `#2A1F18` | `#9C7A3C` | `#A4596A` | `#D8AED2` | Parchment ivory, floral dusty-rose, morning garden |
| **Khat Calligraphy** | `#F4ECD8` | `#1F1812` | `#B98941` | `#7C3A2D` | `#B98941` | Aged manuscript, brick-red ink, calligrapher's table |
| **Modern Geometric** | `#F6F1EA` | `#2C3236` | `#8FA08C` | `#C58B7A` | `#C58B7A` | Warm stone, sage-green gold, architectural restraint |
| **Wildflower Garden** | `#0E1B2C` | `#FCE8C8` | `#E8B96A` | `#F2B8AB` | `#9CC9E8` | Midnight navy, amber gold, sky-blue wild accent |
| **Songket Heritage** | `#0F0A1A` | `#F4D78A` | `#F4D78A` | `#E5564B` | `#3F8FB3` | Near-black velvet brocade, golden ink, cinnabar red |
| **Batik Paisley** | `#FFFAF1` | `#3A2410` | `#D89A2C` | `#C0463A` | `#1F8A8B` | Warm white, rich ochre, teal-green paisley |

### 2C — Admin & Builder UI Tokens (Tailwind scale)

- **Snow Canvas** (`#FAFAFA`) — Page background, neutral-50
- **Paper Fill** (`#F5F5F5`) — Card fill, secondary surfaces, neutral-100
- **Hairline Border** (`#E5E5E5`) — All card borders and dividers, neutral-200
- **Placeholder Steel** (`#737373`) — Hint text, metadata, neutral-500
- **Secondary Prose** (`#525252`) — Secondary text labels, neutral-600
- **Near-Black Ink** (`#171717`) — Primary text, headings, neutral-900 *(NOT `#000000`)*
- **Action Indigo** (`#3730A3`) — Primary action colour: buttons, focus rings, active links, indigo-700
- **Danger Rose** (`#F43F5E`) — Destructive actions, error states, rose-500
- **Alert Amber** (`#D97706`) — Warning states, amber-600
- **Success Teal** (`#0D9488`) — Confirmation states, teal-600

---

## 3. Typography Rules

### 3A — Invitation Scroll (runtime theme fonts via CSS custom properties)

| Role | CSS var | Font by theme | Specification |
|---|---|---|---|
| **Script** | `--font-script` | Dancing Script (Floral, Wildflower, Songket, Batik) · Amiri (Khat) | Couple names: `clamp(56px, 12vw, 120px)` · weight 400 · line-height 1 |
| **Display** | `--font-display` | Cormorant Garamond (Floral, Modern, Wildflower, Batik) · Playfair Display (Khat, Songket) | Section headings, date text: `18px` · `letter-spacing: 4px` |
| **Body** | `--font-body` | DM Sans (Floral, Wildflower, Batik) · Cormorant Garamond (Khat, Songket) · Inter (Modern only) | Paragraphs, descriptions: relaxed leading, `max-width: 65ch` |
| **Arabic** | `--font-arabic` | Amiri (all) · Scheherazade New (Khat speciality) | Quranic verses and du'a: right-to-left, sized for readability |

**Eyebrow labels:** `12px` · `letter-spacing: 6px` · `text-transform: uppercase` · colour `--muted`

**Note on font choices:** Cormorant Garamond and Playfair Display are acceptable in this ceremonial cultural context — they are chosen as modern, distinctive serifs with editorial weight, not as generic placeholders. Dancing Script is culturally appropriate for Malay wedding calligraphy. Avoid substituting Inter, Georgia, or Times New Roman.

### 3B — Admin & Builder UI (system-ui stack, Tailwind scale)

**Base:** `system-ui, -apple-system, sans-serif` · `16px` · `line-height: 1.6`

*(Upgrade path: replace with `Geist` + `Geist Mono` for a premium premium tool feel — drop-in compatible with the existing Tailwind config.)*

| Role | Specification |
|---|---|
| Page title | `text-2xl font-semibold text-neutral-900` |
| Card title | `text-lg font-semibold text-neutral-900` |
| Label | `text-sm font-medium text-neutral-900` |
| Hint / caption | `text-sm text-neutral-500` |
| Danger label | `text-sm font-semibold text-rose-700` |
| Mono (slugs, IDs) | `font-mono text-sm` |

**Scale:** `xs 12px` · `sm 14px` · `base 16px` · `lg 18px` · `xl 20px` · `2xl 24px` · `3xl 30px` · `4xl 36px` · `5xl 48px`

---

## 4. Component Stylings

### Buttons

**Shape:** Subtly rounded corners (`rounded-lg` = 0.5rem) on admin; pill-shaped (`border-radius: 999px`) for invitation CTAs.
**Interaction:** Tactile downward press — GSAP `createButtonPressAnimation()` scales button to ~0.97 on active. No outer glow shadows. Focus: 2px solid ring, 2px offset.
**Disabled:** `opacity: 0.5`, `cursor: not-allowed` — clearly inactive, no hover transformation.
**Loading:** Spinning SVG icon beside label — matches button height, does not shift layout.

| Variant | Background | Text | Hover state |
|---|---|---|---|
| **Primary** | Action Indigo `#3730A3` | White | Indigo-800 darkening |
| **Secondary** | Paper Fill `#F5F5F5` | Near-Black Ink | Hairline Border fill |
| **Tertiary** | Transparent | Action Indigo | Snow Canvas tint |
| **Danger** | Danger Rose `#F43F5E` | White | Rose-600 darkening |

**RSVP Chip (invitation layer):** Pill-shaped (`border-radius: 999px`), `padding: 8px 14px`, background `--gold`, text `--bg`. `11px` uppercase, `letter-spacing: 2px`, `font-weight: 700`. Shadow: `0 6px 18px rgba(0,0,0,0.18)`.

### Cards

**Default (admin):** `background: #F5F5F5` · `border-radius: 8px` · no shadow, no border — flat and contained.
**Elevated (admin):** Adds `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`.
**Interactive:** Adds `hover:shadow-lg hover:scale-105 transition-all duration-150 cursor-pointer`. Scale is subtle — never theatrical.
**Admin override:** `background: white; border: 1px solid #E5E5E5; padding: 20px` — the white card within a grey canvas.

**Warisan Glass Card (invitation layer):**
- Radius: `14px` (Tailwind custom `rounded-card`)
- Shadow: `0 1px 0 rgba(248,240,222,0.06) inset, 0 18px 50px rgba(0,0,0,0.45)` — deep pooling shadow implies weight
- Hover: adds 1px gold ring + `0 28px 70px rgba(0,0,0,0.55), 0 0 40px rgba(201,162,78,0.18)` — gold bloom on hover
- Backdrop blur: `18px` — contextual frosted glass effect on dark-theme cards

### Inputs

**Shape:** `rounded-lg` · `border: 1px solid #E5E5E5` · `padding: 8px 12px`
**Focus:** `ring: 2px solid #3730A3; border-color: transparent` — single clear signal, no double-ring
**Error:** `border-color: #F43F5E; ring-color: #F43F5E`
**Label:** Above input · `text-sm font-medium text-neutral-900` · `margin-bottom: 6px`
**Hint:** Below input · `text-sm text-neutral-500` · `margin-top: 4px`
**No floating labels** — label position is fixed above, always visible

### Invitation Form Inputs (builder + RSVP section)

Matches the active invitation theme — inherits `--ink`, `--gold`, `--bg` tokens. Focus ring uses `--gold`. No Tailwind classes — pure inline CSS driven by CSS custom properties.

### Modals

**Overlay:** `background: rgba(0,0,0,0.5); backdrop-filter: blur(4px)` — soft fog, not harsh block
**Panel:** `background: white; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.15)` — springs in via `animate-scale` keyframe
**Header/Footer:** `border-bottom: 1px solid #E5E5E5` / `border-top: 1px solid #E5E5E5`
**Sizes:** `sm` max-w-sm · `md` max-w-md · `lg` max-w-lg

---

## 5. Layout Principles

### Invitation Scroll (Layer A)

**Structure:** Mobile-first single-column scroll. Each section is a full-viewport segment or content-height block — no fixed grid. Flow: `Cover → Akad → Resepsi → Story → Countdown → Gallery → Gift → Location → RSVP → Ucapan → Closing`.

**Cover hero:** `min-height: 100dvh` (never `h-screen` — iOS Safari fatal jump). Full-bleed background asset bleeds `−10% / −5%` beyond the viewport — parallax reveals the bleed as the user scrolls. GSAP drives `yPercent: 35` on background, `yPercent: −10` + `opacity: 0.6` fade on foreground text group.

**Content container:** `max-width: 720px; padding: 0 24px; margin: 0 auto` — narrow enough to feel intimate, wide enough for Arabic text.

**Radial vignette:** Layered gradient over the hero background asset: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, {--bg}E6 70%)` — focuses the eye on couple names without covering the image entirely.

**Per-theme decorative elements:** Butterflies: Floral Walimatul, Batik Paisley · Petals: Floral, Wildflower Garden · None: Khat Calligraphy, Modern Geometric, Songket Heritage.
**Center spotlight:** Floral, Modern Geometric, Songket, Batik use a `useCenterSpotlight: true` ambient radial glow centred behind the couple names.

**Asymmetric alternation:** Story section and Akad/Resepsi alternates alignment left/right — never two consecutive centered sections.

### Admin Dashboard (Layer B)

**Structure:** Fixed-width left sidebar (240px) + scrollable main content area. Tailwind `flex` layout, full-height.
**Vertical rhythm:** `space-y-8` between section cards. Card interiors `padding: 20px`.
**Tables:** `border-bottom: 1px solid #E5E5E5` on each row · `font-size: 14px` · no zebra striping.
**Stat tiles:** Three-column grid of `<Card>` elements on the overview page.

### Builder (Layer C)

**Structure:** Step-through wizard. Fixed preview panel (right, 40% width) + scrollable form panel (left, 60% width). Sticky preview doesn't scroll with the form.
**Form spacing:** `gap-x-4 gap-y-1` for metadata row pairs · `space-y-3` for field groups within a section.

---

## 6. Motion & Interaction

| Element | Implementation | Spec |
|---|---|---|
| Cover hero parallax | GSAP ScrollTrigger | bg `yPercent: 35`, fg `yPercent: −10` + `opacity: 0.6`, `scrub: true` |
| Section entry reveal | GSAP ScrollTrigger | `opacity 0→1`, `y: 40→0`, cascade delay per item |
| Button press | GSAP `.to(el, { scale: 0.97, duration: 0.08 })` | `createButtonPressAnimation()`, mounted once |
| Modal appear | CSS keyframe `animate-scale` | `scale(0.95)→scale(1)` + `opacity 0→1` |
| Hover transitions | CSS | `transition: all 150ms` |
| Gold glow (hover) | `shadow-gold-glow` | `0 6px 16px rgba(201,162,78,0.45)` |
| Candle glow (ambient) | `shadow-candle` | `0 0 60px rgba(201,162,78,0.18)` — idle warmth on dark-theme cards |

**Spring physics baseline:** `stiffness: 100, damping: 20` for any JS-driven spring (not currently used — GSAP handles all motion).

**Easing:**
- Out (UI elements entering): `cubic-bezier(0.16, 1, 0.3, 1)` — snappy in, slow settle
- In (UI elements leaving): `cubic-bezier(0.7, 0, 0.84, 0)` — slow start, fast exit

**Durations:** Fast `100ms` · Normal `150ms` · Slow `300ms`

**Reduced motion:** ALL animations and transitions disabled via `@media (prefers-reduced-motion: reduce)`. No exceptions.

**Performance rule:** Animate exclusively via `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, `background-color`, or `border-color` directly — these force layout recalculation.

---

## 7. Shadow Scale

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Subtle lift on interactive rows |
| `shadow-base` | `0 1px 3px rgba(0,0,0,0.1)` | Default card depth |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.1)` | Elevated card, active state |
| `shadow-lg` | `0 10px 30px rgba(0,0,0,0.15)` | Modals, dropdowns |
| `shadow-xl` | `0 20px 50px rgba(0,0,0,0.15)` | Hero overlays |
| `shadow-glass` | `0 1px 0 rgba(248,240,222,0.06) inset, 0 18px 50px rgba(0,0,0,0.45)` | Invitation cards on dark themes |
| `shadow-glass-hover` | `shadow-glass` + `1px gold ring` + `0 28px 70px rgba(0,0,0,0.55), 0 0 40px rgba(201,162,78,0.18)` | Hover on invitation cards |
| `shadow-gold-glow` | `0 6px 16px rgba(201,162,78,0.45)` | Active/hover on gold elements |
| `shadow-candle` | `0 0 60px rgba(201,162,78,0.18)` | Ambient idle warmth — dark themes only |

**Shadow tinting rule:** All shadows use neutral black (`rgba(0,0,0,…)`) on light-theme surfaces and gold-tinted black on dark-theme surfaces. No coloured box shadows on admin UI.

---

## 8. Border Radius Scale

`none 0` · `sm 2px` · `base 4px` · `md 6px` · `lg 8px` · `xl 12px` · `2xl 16px` · `3xl 24px` · **`card 14px`** (Warisan glass cards) · **`pill 999px`** (RSVP chip, invitation tags)

---

## 9. Anti-Patterns (NEVER DO)

**Typography bans:**
- ❌ Inter font on the invitation scroll — ceremonially inappropriate and generic
- ❌ Generic system serifs (Times New Roman, Georgia, Garamond) — use Cormorant Garamond or Playfair Display with intent
- ❌ Pure black (`#000000`) — use Near-Black Ink `#171717` or theme `--ink` token
- ❌ Gradient text on large couple-name headlines — the script font is the feature, not a gradient fill

**Layout bans:**
- ❌ Overlapping elements — every element occupies its own clean spatial zone. Parallax layers are offset Z, not overlapping content
- ❌ Three equal-width feature cards in a row — use asymmetric grid or vertical stack instead
- ❌ `h-screen` — use `min-h-[100dvh]` on full-viewport sections (iOS Safari catastrophic jump)
- ❌ Horizontal overflow on mobile — all multi-column layouts collapse to single column below 768px
- ❌ Centered invitation hero section — use offset couple-name placement when theme variance allows
- ❌ Absolute-positioned content stacking on the same Z plane

**Visual bans:**
- ❌ Neon or outer-glow box shadows — shadow tinted to theme bg only
- ❌ Oversaturated accent colours — gold stays warm ochre, not electric yellow
- ❌ AI blue/purple neon aesthetic — no purple button glows, no gradient primary buttons
- ❌ Custom mouse cursors — standard browser cursor throughout

**Content bans:**
- ❌ Emojis anywhere in the UI (including admin labels)
- ❌ AI copywriting clichés: "Seamless", "Elevate", "Unleash", "Next-Gen", "Powerful"
- ❌ Filler scroll indicators: "Scroll to explore", "Swipe down", bouncing chevrons — the parallax animation is the invitation
- ❌ Generic placeholder names ("John Doe", "Acme Corp", "Sample Wedding") — use culturally authentic Malaysian names in demos
- ❌ Fabricated metrics or statistics — no invented "10,000+ invitations sent", "99.9% uptime" unless real data is provided
- ❌ `LABEL // YEAR` typographic convention (e.g., "WARISAN // 2026") — lazy AI template pattern
- ❌ Broken Unsplash placeholder links — use `picsum.photos` or SVG-based ornamental placeholders
- ❌ Circular loading spinners — use skeleton shimmer matching the target layout

**Cultural/contextual bans:**
- ❌ Latin-script-only couple name display when Arabic script is active — both scripts must render correctly
- ❌ Quranic verses without proper Arabic typography (`--font-arabic`, right-to-left direction)
- ❌ Mixing warm and cool greys within one theme — pick one grey family and stay consistent
- ❌ Applying the Warisan ceremonial palette (gold, ivory, script fonts) to the admin dashboard — the two layers must remain visually distinct
