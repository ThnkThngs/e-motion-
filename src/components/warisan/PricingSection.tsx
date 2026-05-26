"use client";

import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { Html } from "./Html";
import { siteConfig } from "@/config/site";

// Phase 4 conversion of Stitch screen `landing-pricing`.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Material Symbols `check_circle` replaced with inline ✓/✗ glyphs so we
//     don't add a new font dependency.
//   • Featured tier renders the rotated "PILIHAN POPULAR" banner via the
//     existing `.price-card.featured::before` rule.
//   • Tier definitions are declared at module level — the array is constant
//     and never recomputed per render.

type Feature = { ok: boolean; key: string };

type TierAction =
  | { type: "link"; href: string }
  | { type: "whatsapp"; text: string };

type Tier = {
  tag: string;
  name: string;
  amount: string;
  sub: string;
  btn: string;
  feats: ReadonlyArray<Feature>;
  featured: boolean;
  action: TierAction;
};

const WA_BASE = `https://wa.me/${siteConfig.contactWa}`;

const tiers: ReadonlyArray<Tier> = [
  {
    tag: "p.free",
    name: "p.basic",
    amount: "0",
    sub: "p.free.sub",
    btn: "p.free.btn",
    feats: [
      { ok: true, key: "p1.1" },
      { ok: true, key: "p1.2" },
      { ok: true, key: "p1.3" },
      { ok: true, key: "p1.4" },
      { ok: false, key: "p1.5" },
      { ok: false, key: "p1.6" },
    ],
    featured: false,
    action: { type: "link", href: "/buat-warisan" },
  },
  {
    tag: "p.motion",
    name: "p.name.motion",
    amount: "29",
    sub: "p.motion.sub",
    btn: "p.motion.btn",
    feats: [
      { ok: true, key: "p2.1" },
      { ok: true, key: "p2.2" },
      { ok: true, key: "p2.3" },
      { ok: true, key: "p2.4" },
      { ok: true, key: "p2.5" },
      { ok: false, key: "p2.6" },
    ],
    featured: true,
    action: {
      type: "whatsapp",
      text: "Salam! Saya berminat dengan Pakej Motion (RM29). Boleh saya tahu lebih lanjut?",
    },
  },
  {
    tag: "p.cin",
    name: "p.name.cin",
    amount: "59",
    sub: "p.cin.sub",
    btn: "p.cin.btn",
    feats: [
      { ok: true, key: "p3.1" },
      { ok: true, key: "p3.2" },
      { ok: true, key: "p3.3" },
      { ok: true, key: "p3.4" },
      { ok: true, key: "p3.5" },
      { ok: true, key: "p3.6" },
    ],
    featured: false,
    action: {
      type: "whatsapp",
      text: "Salam! Saya berminat dengan Pakej Cinematic (RM59). Boleh saya tahu lebih lanjut?",
    },
  },
];

function handleTierAction(action: TierAction) {
  if (action.type === "link") {
    window.location.href = action.href;
  } else {
    window.open(`${WA_BASE}?text=${encodeURIComponent(action.text)}`, "_blank", "noopener");
  }
}

export const PricingSection = () => {
  const { t } = useWarisanLang();
  return (
    <section className="warisan-section maroon-section" id="pricing">
      <div className="section-inner">
        <div className="section-header">
          <div
            className="section-label reveal-3d"
            style={{ color: "var(--gold-light)" }}
          >
            {t("sec.pricing")}
          </div>
          <Html
            as="h2"
            className="section-title reveal-3d reveal-d1"
            html={t("price.title")}
          />
          <p
            className="section-sub reveal-3d reveal-d2"
            style={{ color: "var(--gold-pale)", opacity: 0.85 }}
          >
            {t("price.sub")}
          </p>
        </div>
        {/* Trust signal row — paperlesspost-style transparent value stacking.
            Only true claims, no fabricated metrics. */}
        <div
          className="pricing-trust reveal-3d reveal-d2"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px 32px",
            margin: "0 auto 48px",
            maxWidth: 760,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--gold-pale)",
            opacity: 0.7,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--gold-light)" }}>✦</span> {t("price.trust1")}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--gold-light)" }}>✦</span> {t("price.trust2")}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--gold-light)" }}>✦</span> {t("price.trust3")}
          </span>
        </div>
        <div className="pricing-grid">
          {tiers.map((tier, i) => (
            <div
              key={tier.tag}
              className={`price-card reveal-3d reveal-d${i + 1}${tier.featured ? " featured" : ""}`}
            >
              <div className="price-tag">{t(tier.tag)}</div>
              <div className="price-name">{t(tier.name)}</div>
              <div className="price-amount">
                <sup>RM</sup>
                {tier.amount}
              </div>
              <div className="price-desc">{t(tier.sub)}</div>
              <div className="price-divider">
                <span className="price-divider-dia" />
              </div>
              <ul className="price-features">
                {tier.feats.map((f) => (
                  <li key={f.key} className="price-feat">
                    <span className={f.ok ? "price-check" : "price-cross"}>
                      {f.ok ? "✓" : "✗"}
                    </span>
                    <span style={!f.ok ? { opacity: 0.4 } : undefined}>
                      {t(f.key)}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="price-btn"
                onClick={() => handleTierAction(tier.action)}
              >
                {t(tier.btn)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
