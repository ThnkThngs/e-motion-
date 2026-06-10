# e-motion.my — Tech Stack Roadmap Framework

Twelve-layer end-to-end framework for taking e-motion.my from pre-launch to a
scaled Malaysian digital wedding-invitation SaaS. Each layer states what exists
in this repo **today**, the gap, and phased actions:

- **P0 — Launch** (must hold for first paying couples)
- **P1 — Growth** (first ~1,000 invitations / paid tiers live)
- **P2 — Scale** (multi-region traffic spikes: weekend majlis surges)

Stack of record: **Next.js 15 (App Router, React 19) · Supabase (Postgres/Auth/Storage) ·
Vercel · Remotion Player · GSAP · Billplz (payments, planned) · Resend (email, planned)**.

---

## 1. Frontend

**Today**
- Next.js 15 App Router, React 19, Tailwind 3, GSAP + `@gsap/react`, Remotion Player 4 (cinematic tier), Zustand, Zod 4.
- Route groups: `(public)` — landing, `/buat-warisan`, `/buat-cinematic`, `/undang/[slug]` (+ `/undang/preview?live=1` guest-experience rehearsal), `/cards/[shareToken]`, `/porcelain-songket` showcase; `(dashboard)` — `/builder`, `/admin/*`.
- Published invitation = activation gate (`ActivationGate`) → 11-section scroll story (`src/components/scroll/`) with `?kepada=` guest personalization and scroll progress.

**Gaps** → landing hero hydration mismatch (particle styles); no `features.gift` / music in the invitation schema; i18n is BM/EN ad-hoc (`src/lib/warisan/i18n.ts`), no ZH/HI.

**Actions**
- P0: fix hydration mismatch; Lighthouse ≥90 mobile on `/undang/[slug]`; `prefers-reduced-motion` audit across GSAP sections.
- P1: schema v2 (`gift` accounts, ambient `music` URL wired to the activation gate); full i18n (EN/BM/ZH/HI).
- P2: per-template code-splitting (`next/dynamic` per design line) so the Porcelain bundle never ships to a Warisan guest.

## 2. API & Backend Logic

**Today**
- Route handlers: `/api/invitations`, `/api/rsvp`, `/api/ucapan`, `/api/og` (OG image), `/api/admin/*` (login/logout/stats/invitations/RSVP CSV/ucapan moderation).
- Zod validation at every boundary (`invitationSchema` parse before render/persist).

**Gaps** → no payments or email surface; mutations are route handlers only (fine), but no idempotency keys; no webhook surface.

**Actions**
- P0: Billplz checkout + webhook handler (signature-verified, idempotent on bill id); Resend transactional email (publish confirmation, RSVP notification).
- P1: RSVP reminder scheduling (Vercel Cron → Supabase queue table); guest-list import/export.
- P2: extract render-heavy work (Remotion video export) to async jobs — Vercel Queues or Supabase Edge Functions.

## 3. Database & Storage

**Today**
- Supabase Postgres via `@supabase/supabase-js` + `@supabase/ssr`; typed in `src/types/database.ts` (invitations, rsvps, ucapan).
- No `supabase/` migrations directory in-repo — schema lives only in the hosted project.

**Gaps** → schema drift risk (no migrations in git); gallery images referenced by URL with no managed storage; no backups policy in code.

**Actions**
- P0: `supabase init` + commit baseline migration; Supabase Storage bucket for gallery/audio uploads with size/MIME limits.
- P1: `payments`, `guests`, `events` tables (multi-event: akad + resepsi); soft-delete for invitations.
- P2: partition `rsvps`/`ucapan` by invitation if hot; PITR enabled on the Supabase plan.

## 4. Auth & Permissions

**Today**
- Admin: custom HMAC-signed cookie session (`src/lib/admin/auth.ts`, `node:crypto`) enforced by Node-runtime middleware on `/admin/*`; API handlers re-check via `requireAdmin()`.
- Couples/end-users: **no auth** — invitations are managed via admin or anonymous create.

**Gaps** → couples can't self-serve manage their card; single shared admin credential; no roles.

**Actions**
- P0: Supabase Auth (email OTP / Google) for couples; `user_id` ownership column on `invitations`.
- P1: roles (`owner`, `helper` for wedding planners), magic-link "edit access" sharing; migrate admin to Supabase Auth + `admin` claim, retire the bespoke HMAC session.
- P2: org accounts for wedding vendors/resellers (white-label).

## 5. Hosting & Deployment

**Today** — Vercel project (CLI 52 linked); no `vercel.json`/`vercel.ts` — platform defaults; `nodeMiddleware` experimental flag in `next.config.ts`.

**Actions**
- P0: add `vercel.ts` typed config (region pin `sin1` — Singapore serves MY lowest-latency; security headers consolidated here or in `next.config.ts`, not both).
- P1: protected production promotions + Rolling Releases for gradual rollout; preview deployments wired to PR flow.
- P2: evaluate Fluid Compute concurrency settings for the OG-image and render endpoints.

## 6. Cloud & Compute

**Today** — all compute is Vercel functions (default 300s timeout, Node 24); Remotion renders happen client-side in the Player only.

**Actions**
- P0: nothing — current shape is right for launch.
- P1: server-side Remotion rendering (video keepsake export) on a queue-backed worker — Vercel Sandbox/Queues or a small Remotion Lambda setup; never render videos inside request/response.
- P2: media pipeline (image resize on upload via Supabase image transforms; audio normalization).

## 7. CI/CD & Version Control

**Today** — git on `main` only; **no `.github/workflows`**; no test runner configured (`npm test` absent); `npm run type-check` + `next lint` exist.

**Actions**
- P0: GitHub Actions: `type-check` + `lint` + `next build` on every PR; branch protection on `main`; Vercel preview per PR.
- P1: Playwright smoke suite (activation gate opens, RSVP submits, admin login); Vitest for `lib/` units (rate limiter, hijri/date helpers).
- P2: visual regression on the template gallery (Chromatic/Percy or Playwright screenshots).

## 8. Security & Row-Level Security

**Today**
- Security headers in `next.config.ts` (nosniff, `X-Frame-Options: DENY`, XSS); Zod at boundaries; service-role client (`src/lib/supabase/admin.ts`) bypasses RLS server-side only.
- RLS status of hosted tables is **not captured in repo** — unverifiable.

**Actions**
- P0: commit RLS policies with the baseline migration — public `SELECT` on published invitations by slug only; `INSERT`-only for rsvps/ucapan with per-invitation checks; everything else owner/service-role. Add CSP header (script-src self + maps embeds). Run `get_advisors` (Supabase) and fix all criticals.
- P1: ucapan moderation default-on (already has admin moderation surface — make unmoderated entries non-public); audit log table for admin actions.
- P2: periodic dependency audit in CI (`npm audit` gate + Renovate).

## 9. Rate Limiting

**Today** — in-memory token bucket (`src/lib/rateLimit.ts`) keyed by `x-forwarded-for`; the file itself notes it only holds on a single instance — on Vercel, every cold instance gets a fresh empty Map.

**Actions**
- P0: move to Upstash Redis (`@upstash/ratelimit`) for `/api/rsvp`, `/api/ucapan`, `/api/admin/login` (brute-force) — sliding window, per-IP + per-slug.
- P1: Vercel BotID / Firewall rules on RSVP + ucapan (spam season = wedding season).
- P2: per-tier quotas (free vs cinematic) enforced at API level.

## 10. Caching & CDN

**Today** — Vercel Edge Network by default; `next/image` with WebP/AVIF (but `remotePatterns: '**'` — too permissive); invitation pages are dynamic (Supabase fetch per request).

**Actions**
- P0: tighten `images.remotePatterns` to Supabase storage + known hosts; `s-maxage=60, stale-while-revalidate` on `/undang/[slug]` GET (content changes rarely after publish).
- P1: tag-based revalidation — `revalidateTag(slug)` on payload edit/publish so cards are fully static-cached between edits; cache OG images aggressively (immutable per publish version).
- P2: Runtime Cache for hot RSVP-count/stats reads.

## 11. Error Tracking & Logging

**Today** — `console.*` + Vercel function logs only; no client-side error capture; no alerting.

**Actions**
- P0: Sentry (`@sentry/nextjs`) — client + server + source maps; alert on publish/RSVP failures (these lose real guests).
- P1: structured logs (one JSON line per API request: route, slug, latency, outcome); Vercel Log Drain → Axiom/Better Stack; uptime monitor on `/undang/healthcheck-slug`.
- P2: product analytics (privacy-light: Vercel Analytics / Plausible) — open-rate of activation gate, RSVP conversion per template.

## 12. Availability & Recovery

**Today** — single Vercel region (implicit), Supabase single project, no documented recovery path.

**Actions**
- P0: Supabase daily backups verified restorable (run one restore drill); document RTO/RPO (target: RPO ≤24h, RTO ≤4h pre-launch); `export` admin CSV already exists — keep as a manual escape hatch.
- P1: PITR (RPO ≤5min) once paid tiers launch — a lost RSVP list two days before a majlis is unrecoverable trust damage; status page.
- P2: read-replica or multi-region strategy only if latency data demands it; weekend-surge load test (RSVP burst: 2,000 guests × Saturday morning).

---

## Sequencing (the actual roadmap)

| Phase | Theme | Items |
|-------|-------|-------|
| **P0 — Launch hardening** (now) | Trust & correctness | Migrations + RLS in repo (L3/L8) · Upstash rate limits (L9) · CI pipeline (L7) · Sentry (L11) · Supabase Auth for couples (L4) · Billplz + Resend (L2) · region pin + image domains (L5/L10) · backup drill (L12) |
| **P1 — Paid growth** | Revenue & retention | Tier enforcement · music/gift schema v2 (L1) · tag-based static caching (L10) · Playwright smoke (L7) · moderation default-on (L8) · PITR (L12) · reminder crons (L2) |
| **P2 — Scale** | Margin & resilience | Async video export (L6) · per-line code splitting (L1) · runtime cache (L10) · load tests + multi-region call (L12) · vendor/white-label accounts (L4) |

**Definition of done per phase**: every P0 item shipped *and* observable (an alert
or dashboard proves it works) before P1 starts.
