"use client";

import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { warisanLangs } from "@/lib/warisan/i18n";

export const LangSwitcher = () => {
  const { lang, setLang } = useWarisanLang();
  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {warisanLangs.map((l) => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn ${lang === l.code ? "active" : ""}`}
          data-lang={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
