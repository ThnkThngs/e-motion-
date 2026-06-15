import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { loadFont as loadDancing } from "@remotion/google-fonts/DancingScript";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadScheherazade } from "@remotion/google-fonts/ScheherazadeNew";

const cormorant = loadCormorant().fontFamily;
const dmSans = loadDMSans().fontFamily;
const amiri = loadAmiri().fontFamily;
const dancing = loadDancing().fontFamily;
const playfair = loadPlayfair().fontFamily;
const inter = loadInter().fontFamily;
const scheherazade = loadScheherazade().fontFamily;

export type ThemeId =
  | "floral"
  | "khat"
  | "modern"
  | "wildflower"
  | "songket"
  | "batik"
  | "tenun-pahang"
  | "mawar"
  | "andaman"
  | "porcelain-songket"
  | "songket-diraja";

export type ThemePalette = {
  bg: string;
  spotlight: string;
  ink: string;
  rose: string;
  gold: string;
  muted: string;
  accent: string;
};

export type ThemeFonts = {
  display: string;
  script: string;
  body: string;
  arabic: string;
};

export type Theme = {
  id: ThemeId;
  label: string;
  palette: ThemePalette;
  fonts: ThemeFonts;
  borderAsset: string;
  introAsset: string;
  butterflies: boolean;
  petals: boolean;
  useCenterSpotlight: boolean;
};

export const themes: Record<ThemeId, Theme> = {
  floral: {
    id: "floral",
    label: "Floral Walimatul",
    palette: {
      bg: "#FAF6E3",
      spotlight: "#FAF6E3",
      ink: "#2A1F18",
      rose: "#A4596A",
      gold: "#9C7A3C",
      muted: "#6E5A48",
      accent: "#D8AED2",
    },
    fonts: {
      display: cormorant,
      script: dancing,
      body: dmSans,
      arabic: amiri,
    },
    borderAsset: "art/floral-bg.png",
    introAsset: "art/floral-intro.png",
    butterflies: true,
    petals: true,
    useCenterSpotlight: true,
  },
  khat: {
    id: "khat",
    label: "Khat Calligraphy",
    palette: {
      bg: "#F4ECD8",
      spotlight: "#F4ECD8",
      ink: "#1F1812",
      rose: "#7C3A2D",
      gold: "#B98941",
      muted: "#7A6650",
      accent: "#B98941",
    },
    fonts: {
      display: playfair,
      script: amiri,
      body: cormorant,
      arabic: scheherazade,
    },
    borderAsset: "art/khat-frame.svg",
    introAsset: "art/khat-frame.svg",
    butterflies: false,
    petals: false,
    useCenterSpotlight: false,
  },
  modern: {
    id: "modern",
    label: "Modern Geometric",
    palette: {
      bg: "#F6F1EA",
      spotlight: "#F6F1EA",
      ink: "#2C3236",
      rose: "#C58B7A",
      gold: "#8FA08C",
      muted: "#6B6E70",
      accent: "#C58B7A",
    },
    fonts: {
      display: inter,
      script: playfair,
      body: inter,
      arabic: amiri,
    },
    borderAsset: "art/geometric-kerawang.svg",
    introAsset: "art/geometric-kerawang.svg",
    butterflies: false,
    petals: false,
    useCenterSpotlight: true,
  },
  wildflower: {
    id: "wildflower",
    label: "Wildflower Garden",
    palette: {
      bg: "#0E1B2C",
      spotlight: "#C24A3D",
      ink: "#FCE8C8",
      rose: "#F2B8AB",
      gold: "#E8B96A",
      muted: "#F1D4B0",
      accent: "#9CC9E8",
    },
    fonts: {
      display: cormorant,
      script: dancing,
      body: dmSans,
      arabic: amiri,
    },
    borderAsset: "art/frame-wildflower.svg",
    introAsset: "art/frame-wildflower.svg",
    butterflies: false,
    petals: true,
    useCenterSpotlight: false,
  },
  songket: {
    id: "songket",
    label: "Songket Heritage",
    palette: {
      bg: "#0F0A1A",
      spotlight: "#0F0A1A",
      ink: "#F4D78A",
      rose: "#E5564B",
      gold: "#F4D78A",
      muted: "#C9A86B",
      accent: "#3F8FB3",
    },
    fonts: {
      display: playfair,
      script: dancing,
      body: cormorant,
      arabic: amiri,
    },
    borderAsset: "art/pattern-songket-dark.svg",
    introAsset: "art/pattern-songket-dark.svg",
    butterflies: false,
    petals: false,
    useCenterSpotlight: true,
  },
  batik: {
    id: "batik",
    label: "Batik Paisley",
    palette: {
      bg: "#FFFAF1",
      spotlight: "#FFF6E6",
      ink: "#3A2410",
      rose: "#C0463A",
      gold: "#D89A2C",
      muted: "#8C5A36",
      accent: "#1F8A8B",
    },
    fonts: {
      display: cormorant,
      script: dancing,
      body: dmSans,
      arabic: amiri,
    },
    borderAsset: "art/pattern-batik-tile.svg",
    introAsset: "art/pattern-paisley-light.svg",
    butterflies: true,
    petals: false,
    useCenterSpotlight: true,
  },
  "tenun-pahang": {
    id: "tenun-pahang",
    label: "Tenun Pahang Lipat",
    palette: {
      bg: "#3A2F23",
      spotlight: "#4A3E2E",
      ink: "#F2E6C8",
      rose: "#C46850",
      gold: "#C9954F",
      muted: "#A8967C",
      accent: "#5F8B6E",
    },
    fonts: {
      display: playfair,
      script: dancing,
      body: cormorant,
      arabic: amiri,
    },
    borderAsset: "art/pattern-songket-teal.svg",
    introAsset: "art/bismillah-scene.png",
    butterflies: false,
    petals: false,
    useCenterSpotlight: true,
  },
  mawar: {
    id: "mawar",
    label: "Mawar Pastel",
    palette: {
      bg: "#F5E8E0",
      spotlight: "#F5E8E0",
      ink: "#3A2C2A",
      rose: "#B68B92",
      gold: "#BFA572",
      muted: "#7A6B66",
      accent: "#9DAA8F",
    },
    fonts: {
      display: cormorant,
      script: dancing,
      body: dmSans,
      arabic: amiri,
    },
    borderAsset: "art/pattern-floral-dark.svg",
    introAsset: "art/floral-intro.png",
    butterflies: false,
    petals: true,
    useCenterSpotlight: false,
  },
  andaman: {
    id: "andaman",
    label: "Andaman Diraja",
    palette: {
      bg: "#0E2745",
      spotlight: "#1A3A60",
      ink: "#F4D78A",
      rose: "#E8826E",
      gold: "#D4A24A",
      muted: "#B8A06E",
      accent: "#F5F5EE",
    },
    fonts: {
      display: playfair,
      script: dancing,
      body: cormorant,
      arabic: amiri,
    },
    borderAsset: "art/pattern-songket-dark.svg",
    introAsset: "art/bismillah-scene.png",
    butterflies: false,
    petals: false,
    useCenterSpotlight: true,
  },
  // Porcelain Songket — ivory porcelain ground, blue-and-white ware + dusty
  // copper accents, subtle songket weave overlay. All-serif (Georgia-style)
  // typography, so `script` maps to a serif rather than a cursive face.
  "porcelain-songket": {
    id: "porcelain-songket",
    label: "Porcelain Songket",
    palette: {
      bg: "#FFFAF4",
      spotlight: "#FFFAF4",
      ink: "#214770",
      rose: "#B25F50",
      gold: "#214770",
      muted: "#6B7480",
      accent: "#B25F50",
    },
    fonts: {
      display: playfair,
      script: cormorant,
      body: cormorant,
      arabic: amiri,
    },
    borderAsset: "art/porcelain-songket-overlay.png",
    introAsset: "art/porcelain-songket-overlay.png",
    butterflies: false,
    petals: true,
    useCenterSpotlight: true,
  },
  // Songket Diraja — royal navy ground, woven gold songket + cream ogee panel
  // with red-and-cream floral accents. The data-driven twin of the bespoke,
  // fully code-drawn SongketDirajaInvitation.
  "songket-diraja": {
    id: "songket-diraja",
    label: "Songket Diraja",
    palette: {
      bg: "#0C2340",
      spotlight: "#163A5F",
      ink: "#F3E6C4",
      rose: "#C0463A",
      gold: "#C9A24A",
      muted: "#B8A06E",
      accent: "#E6C878",
    },
    fonts: {
      display: playfair,
      script: dancing,
      body: cormorant,
      arabic: amiri,
    },
    borderAsset: "art/pattern-songket-dark.svg",
    introAsset: "art/bismillah-scene.png",
    butterflies: false,
    petals: false,
    useCenterSpotlight: true,
  },
};
