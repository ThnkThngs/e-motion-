"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { dictionaries, t as tLookup, type WarisanLang } from "./i18n";

type State = {
  lang: WarisanLang;
  setLang: (lang: WarisanLang) => void;
};

const useStore = create<State>()(
  persist(
    (set) => ({
      lang: "ms",
      setLang: (lang) => set({ lang }),
    }),
    { name: "warisan-lang" },
  ),
);

export const useWarisanLang = () => {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);

  // Mirror the chosen language onto <body data-lang> so warisan.css can swap
  // CJK / Devanagari font families exactly like the reference HTML does.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-lang", lang);
  }, [lang]);

  return {
    lang,
    setLang,
    t: (key: string) => tLookup(key, lang),
    testi: dictionaries[lang].testi,
  };
};
