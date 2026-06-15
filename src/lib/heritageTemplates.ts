// Heritage Template registry — 20 still designs ported from the Warisan Edition HTML.
// Co-exists with the 6 Remotion video templates in src/lib/cinematicTemplates.ts.
// Generated thumbs live at public/heritage/<id>.jpg (see scripts/extract-heritage-assets.mjs).

import type { CinematicTemplateId } from "./cinematicTemplates";

export type HeritageTier = "free" | "motion" | "cinematic";

// Visual archetypes — the 6 design families the 20 templates collapse into.
// Each archetype gets its own preview component under
// src/components/card/preview/<Archetype>Archetype.tsx (Phase 4, step 2).
export type HeritageArchetype =
  | "songket"        // gold weave on indigo/blue/black-gold royal palettes
  | "batik"          // red+gold motifs, paisley-like ornament density
  | "tenun"          // brown/blue earthy hand-woven tones
  | "ikat"           // jingga/tropika/keemasan warm sun-bleached palettes
  | "pucuk-rebung"   // filigree corners, lattice backgrounds
  | "geometri";      // modern minimal lattice, low-ornament

export type HeritageTemplate = {
  id: string;
  name: string;
  tier: HeritageTier;
  thumb: string;
  archetype: HeritageArchetype;
};

export const heritageTemplates: HeritageTemplate[] = [
  { id: "songket-riau", name: "Songket Riau", tier: "free", thumb: "/heritage/songket-riau.jpg", archetype: "songket" },
  { id: "songket-biru-diraja", name: "Songket Biru Diraja", tier: "motion", thumb: "/heritage/songket-biru-diraja.jpg", archetype: "songket" },
  { id: "batik-merah-emas", name: "Batik Merah Emas", tier: "cinematic", thumb: "/heritage/batik-merah-emas.jpg", archetype: "batik" },
  { id: "warisan-hitam-emas", name: "Warisan Hitam Emas", tier: "cinematic", thumb: "/heritage/warisan-hitam-emas.jpg", archetype: "songket" },
  { id: "tenun-coklat", name: "Tenun Coklat", tier: "free", thumb: "/heritage/tenun-coklat.jpg", archetype: "tenun" },
  { id: "pucuk-rebung-merah", name: "Pucuk Rebung Merah", tier: "motion", thumb: "/heritage/pucuk-rebung-merah.jpg", archetype: "pucuk-rebung" },
  { id: "ikat-jingga", name: "Ikat Jingga", tier: "motion", thumb: "/heritage/ikat-jingga.jpg", archetype: "ikat" },
  { id: "songket-mewah", name: "Songket Mewah", tier: "cinematic", thumb: "/heritage/songket-mewah.jpg", archetype: "songket" },
  { id: "ornamen-riau", name: "Ornamen Riau", tier: "motion", thumb: "/heritage/ornamen-riau.jpg", archetype: "geometri" },
  { id: "geometri-warisan", name: "Geometri Warisan", tier: "free", thumb: "/heritage/geometri-warisan.jpg", archetype: "geometri" },
  { id: "ikat-tropika", name: "Ikat Tropika", tier: "motion", thumb: "/heritage/ikat-tropika.jpg", archetype: "ikat" },
  { id: "ungu-permaisuri", name: "Ungu Permaisuri", tier: "cinematic", thumb: "/heritage/ungu-permaisuri.jpg", archetype: "songket" },
  { id: "tenun-biru-laut", name: "Tenun Biru Laut", tier: "free", thumb: "/heritage/tenun-biru-laut.jpg", archetype: "tenun" },
  { id: "songket-pandai", name: "Songket Pandai", tier: "free", thumb: "/heritage/songket-pandai.jpg", archetype: "songket" },
  { id: "ikat-keemasan", name: "Ikat Keemasan", tier: "motion", thumb: "/heritage/ikat-keemasan.jpg", archetype: "ikat" },
  { id: "kemerahan-corak", name: "Kemerahan Corak", tier: "motion", thumb: "/heritage/kemerahan-corak.jpg", archetype: "batik" },
  { id: "pucuk-rebung-hijau", name: "Pucuk Rebung Hijau", tier: "motion", thumb: "/heritage/pucuk-rebung-hijau.jpg", archetype: "pucuk-rebung" },
  { id: "palembang", name: "Palembang", tier: "cinematic", thumb: "/heritage/palembang.jpg", archetype: "batik" },
  { id: "merah-puteh", name: "Merah Puteh", tier: "free", thumb: "/heritage/merah-puteh.jpg", archetype: "geometri" },
  { id: "kain-songket-klasik", name: "Kain Songket Klasik", tier: "cinematic", thumb: "/heritage/kain-songket-klasik.jpg", archetype: "songket" },
  { id: "porcelain-songket", name: "Porcelain Songket", tier: "cinematic", thumb: "/porcelain-songket/mockup_preview.jpg", archetype: "songket" },
  { id: "songket-diraja", name: "Songket Diraja", tier: "cinematic", thumb: "/songket-diraja/og.jpg", archetype: "songket" },
];

// Look up the archetype for a template id. Returns "songket" as a safe default
// for unknown ids so the preview dispatcher always renders something sensible.
export const archetypeFor = (id: string): HeritageArchetype =>
  heritageTemplates.find((t) => t.id === id)?.archetype ?? "songket";

// Map a Heritage id to the closest cinematic Remotion template so /buat-cinematic
// can pre-select something useful when the user clicks a Heritage card.
export const heritageToCinematic = (id: string): CinematicTemplateId => {
  if (id === "porcelain-songket") return "porcelain-songket";
  if (id === "songket-diraja") return "songket-diraja";
  if (id.startsWith("songket-biru") || id.includes("diraja") || id.includes("andaman")) return "andaman";
  if (id.startsWith("tenun")) return "tenun-pahang";
  if (id.includes("pastel") || id.startsWith("mawar") || id === "merah-puteh") return "mawar";
  if (id.startsWith("songket")) return "songket";
  if (id.startsWith("batik") || id.includes("kemerahan")) return "batik";
  if (id.startsWith("warisan") || id === "ungu-permaisuri") return "khat";
  if (id === "geometri-warisan") return "modern";
  if (id.includes("rebung") || id === "ornamen-riau" || id === "palembang") return "wildflower";
  return "floral";
};
