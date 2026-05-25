"use client";

import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { LangSwitcher } from "./LangSwitcher";
import { siteConfig } from "@/config/site";

// Phase 4 conversion of Stitch screen `landing-footer`.
// Differences from generated HTML:
//   • Tailwind hex literals remapped to var(--*) tokens via warisan.css.
//   • Material Symbols icons replaced with inline unicode/SVG so we don't add
//     a new font dependency.
//   • Stitch's 4-column grid (brand / produk / sokongan / sosial) preserved.
//   • LangSwitcher is reused from the existing component.

// Pucuk-rebung triangular ornament. Module level per
// react-best-practices rerender-no-inline-components.
const FooterCorner = () => (
  <svg
    viewBox="0 0 40 40"
    width="40"
    height="40"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M0 0L20 20L0 40V0Z" />
  </svg>
);

type SocialLink = { href: string; label: string; glyph: string };

const socialLinks: ReadonlyArray<SocialLink> = [
  { href: "https://instagram.com", label: "Instagram", glyph: "◉" },
  { href: "https://tiktok.com", label: "TikTok", glyph: "▶" },
  { href: "https://facebook.com", label: "Facebook", glyph: "ƒ" },
  { href: `https://wa.me/${siteConfig.contactWa}`, label: "WhatsApp", glyph: "✉" },
];

export const WarisanFooter = () => {
  const { t } = useWarisanLang();
  return (
    <footer className="warisan-footer reveal-3d">
      <div className="footer-container">
        <span className="footer-corner footer-corner-tl">
          <FooterCorner />
        </span>
        <span className="footer-corner footer-corner-tr">
          <FooterCorner />
        </span>
        <span className="footer-corner footer-corner-bl">
          <FooterCorner />
        </span>
        <span className="footer-corner footer-corner-br">
          <FooterCorner />
        </span>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              Warisan <span className="amp">&amp;</span> E-motion{" "}
              <span className="my">.MY</span>
            </div>
            <div className="footer-tag">{t("footer.tag")}</div>
          </div>
          <div className="footer-col">
            <h4>{t("footer.platform")}</h4>
            <ul>
              <li>
                <a href="#templates">{t("footer.templates")}</a>
              </li>
              <li>
                <a href="#effects">{t("footer.effects")}</a>
              </li>
              <li>
                <a href="#builder">{t("footer.builder")}</a>
              </li>
              <li>
                <a href="#pricing">{t("footer.angpau")}</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("footer.support")}</h4>
            <ul>
              <li>
                <a href="#help">{t("footer.help")}</a>
              </li>
              <li>
                <a href="#contact">{t("footer.contact")}</a>
              </li>
              <li>
                <a href="#tutorial">{t("footer.tutorial")}</a>
              </li>
              <li>
                <a href="#privacy">{t("footer.privacy")}</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("footer.social")}</h4>
            <ul className="footer-social">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="footer-social-icon" aria-hidden="true">
                      {s.glyph}
                    </span>
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <div>{t("footer.copy")}</div>
          <LangSwitcher />
        </div>
      </div>
    </footer>
  );
};
