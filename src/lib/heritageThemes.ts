// Per-template visual presets used by the Warisan card builder preview.
// Each Heritage template gets a tailored palette + ornament asset so the
// preview reads as the chosen template, not a generic gold-on-indigo card.
//
// Ornaments resolve to existing SVGs already shipped at public/art/*.

import type { HeritageTemplate } from "./heritageTemplates";

export type HeritageTheme = {
  bg: string;       // hero background (gradient or solid)
  ink: string;      // primary text on hero
  accent: string;   // gold-equivalent accent
  rule: string;     // soft rule / border
  body: string;     // body section background
  bodyInk: string;  // body section ink
  ornament: string; // path to a decorative SVG used as section divider / overlay
};

const ornaments: Record<string, string> = {
  songket: "/art/pattern-songket-dark.svg",
  songketTeal: "/art/pattern-songket-teal.svg",
  batik: "/art/pattern-batik-tile.svg",
  paisley: "/art/pattern-paisley-light.svg",
  floralDark: "/art/pattern-floral-dark.svg",
  kerawang: "/art/geometric-kerawang.svg",
  wildflower: "/art/frame-wildflower.svg",
  khat: "/art/khat-frame.svg",
};

export const heritageThemes: Record<string, HeritageTheme> = {
  "songket-riau": {
    bg: "linear-gradient(180deg, #6b1d2e 0%, #4a1020 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(232,199,117,.4)",
    body: "#faf4e3", bodyInk: "#1a2040", ornament: ornaments.songket,
  },
  "songket-biru-diraja": {
    bg: "linear-gradient(180deg, #0d1228 0%, #1a2040 70%, #2a3460 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(232,199,117,.35)",
    body: "#faf4e3", bodyInk: "#0d1228", ornament: ornaments.songket,
  },
  "batik-merah-emas": {
    bg: "linear-gradient(135deg, #6b1d2e 0%, #8a2838 100%)",
    ink: "#f8f0de", accent: "#f0d68c", rule: "rgba(240,214,140,.4)",
    body: "#faf4e3", bodyInk: "#3A2410", ornament: ornaments.batik,
  },
  "warisan-hitam-emas": {
    bg: "linear-gradient(180deg, #0d1228 0%, #050811 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(201,162,78,.45)",
    body: "#1a1a2a", bodyInk: "#f0d68c", ornament: ornaments.kerawang,
  },
  "tenun-coklat": {
    bg: "linear-gradient(180deg, #3a2410 0%, #5a3a18 100%)",
    ink: "#f8f0de", accent: "#d89a2c", rule: "rgba(216,154,44,.4)",
    body: "#faf4e3", bodyInk: "#3a2410", ornament: ornaments.batik,
  },
  "pucuk-rebung-merah": {
    bg: "linear-gradient(180deg, #6b1d2e 0%, #4a1020 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(232,199,117,.4)",
    body: "#fff6e6", bodyInk: "#3a2410", ornament: ornaments.batik,
  },
  "ikat-jingga": {
    bg: "linear-gradient(135deg, #c0463a 0%, #8a2838 100%)",
    ink: "#fff6e6", accent: "#f0d68c", rule: "rgba(240,214,140,.4)",
    body: "#fff6e6", bodyInk: "#3a2410", ornament: ornaments.batik,
  },
  "songket-mewah": {
    bg: "linear-gradient(180deg, #0F0A1A 0%, #2c1d3a 100%)",
    ink: "#f4d78a", accent: "#f4d78a", rule: "rgba(244,215,138,.45)",
    body: "#1a132a", bodyInk: "#f4d78a", ornament: ornaments.songket,
  },
  "ornamen-riau": {
    bg: "linear-gradient(135deg, #2d5a3f 0%, #1a3525 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(232,199,117,.35)",
    body: "#faf4e3", bodyInk: "#1a3525", ornament: ornaments.kerawang,
  },
  "geometri-warisan": {
    bg: "linear-gradient(180deg, #f6f1ea 0%, #e4cfa0 100%)",
    ink: "#2C3236", accent: "#8a6d2a", rule: "rgba(138,109,42,.35)",
    body: "#faf4e3", bodyInk: "#2C3236", ornament: ornaments.kerawang,
  },
  "ikat-tropika": {
    bg: "linear-gradient(135deg, #1F8A8B 0%, #0e4a4b 100%)",
    ink: "#f8f0de", accent: "#f0d68c", rule: "rgba(240,214,140,.4)",
    body: "#faf4e3", bodyInk: "#0e4a4b", ornament: ornaments.songketTeal,
  },
  "ungu-permaisuri": {
    bg: "linear-gradient(180deg, #3a2150 0%, #5a3570 100%)",
    ink: "#f0d68c", accent: "#e8c775", rule: "rgba(232,199,117,.4)",
    body: "#1f1230", bodyInk: "#f0d68c", ornament: ornaments.kerawang,
  },
  "tenun-biru-laut": {
    bg: "linear-gradient(180deg, #0d1228 0%, #1a3a55 100%)",
    ink: "#f8f0de", accent: "#9CC9E8", rule: "rgba(156,201,232,.4)",
    body: "#faf4e3", bodyInk: "#0d1228", ornament: ornaments.songketTeal,
  },
  "songket-pandai": {
    bg: "linear-gradient(180deg, #6b1d2e 0%, #1a2040 100%)",
    ink: "#f8f0de", accent: "#e8c775", rule: "rgba(232,199,117,.4)",
    body: "#faf4e3", bodyInk: "#1a2040", ornament: ornaments.songket,
  },
  "ikat-keemasan": {
    bg: "linear-gradient(135deg, #8a6d2a 0%, #c9a24e 100%)",
    ink: "#0d1228", accent: "#0d1228", rule: "rgba(13,18,40,.35)",
    body: "#faf4e3", bodyInk: "#0d1228", ornament: ornaments.batik,
  },
  "kemerahan-corak": {
    bg: "linear-gradient(180deg, #c0463a 0%, #6b1d2e 100%)",
    ink: "#fff6e6", accent: "#f0d68c", rule: "rgba(240,214,140,.4)",
    body: "#fff6e6", bodyInk: "#3a2410", ornament: ornaments.batik,
  },
  "pucuk-rebung-hijau": {
    bg: "linear-gradient(180deg, #2d5a3f 0%, #4a7856 100%)",
    ink: "#f8f0de", accent: "#f0d68c", rule: "rgba(240,214,140,.4)",
    body: "#faf4e3", bodyInk: "#1a3525", ornament: ornaments.wildflower,
  },
  palembang: {
    bg: "linear-gradient(180deg, #4a1020 0%, #6b1d2e 50%, #0d1228 100%)",
    ink: "#f4d78a", accent: "#f4d78a", rule: "rgba(244,215,138,.45)",
    body: "#faf4e3", bodyInk: "#4a1020", ornament: ornaments.paisley,
  },
  "merah-puteh": {
    bg: "linear-gradient(180deg, #faf4e3 0%, #f0e6d0 100%)",
    ink: "#6b1d2e", accent: "#c0463a", rule: "rgba(192,70,58,.4)",
    body: "#faf4e3", bodyInk: "#3A2410", ornament: ornaments.kerawang,
  },
  "kain-songket-klasik": {
    bg: "linear-gradient(180deg, #0F0A1A 0%, #1a2040 100%)",
    ink: "#f4d78a", accent: "#f4d78a", rule: "rgba(244,215,138,.45)",
    body: "#1a132a", bodyInk: "#f4d78a", ornament: ornaments.songket,
  },
};

export const themeFor = (tpl: HeritageTemplate | string): HeritageTheme => {
  const id = typeof tpl === "string" ? tpl : tpl.id;
  return heritageThemes[id] ?? heritageThemes["songket-riau"];
};
