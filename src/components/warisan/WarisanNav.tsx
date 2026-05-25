"use client";

import { useEffect, useState } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { LangSwitcher } from "./LangSwitcher";

export const WarisanNav = () => {
  const { t } = useWarisanLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`warisan-nav ${scrolled ? "scrolled" : ""}`} id="mainNav">
      <a href="#home" className="warisan-logo">
        Warisan <span className="ampersand">&amp;</span> E-motion <span className="warisan-logo-my">.MY</span>
      </a>
      <div className="warisan-nav-right">
        <ul className="warisan-nav-links">
          <li><a href="#effects">{t("nav.effects")}</a></li>
          <li><a href="#templates">{t("nav.templates")}</a></li>
          <li><a href="#builder">{t("nav.builder")}</a></li>
          <li><a href="#pricing">{t("nav.pricing")}</a></li>
        </ul>
        <LangSwitcher />
        <a href="#builder" className="warisan-nav-cta">
          {t("nav.cta")}
        </a>
      </div>
    </nav>
  );
};
