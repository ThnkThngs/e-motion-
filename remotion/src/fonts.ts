import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { loadFont as loadDancing } from "@remotion/google-fonts/DancingScript";

export const cormorant = loadCormorant().fontFamily;
export const dmSans = loadDMSans().fontFamily;
export const amiri = loadAmiri().fontFamily;
export const dancing = loadDancing().fontFamily;

export const palette = {
  cream: "#FAF6E3",
  ink: "#2A1F18",
  rose: "#A4596A",
  gold: "#9C7A3C",
  muted: "#6E5A48",
};
