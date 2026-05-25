import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Inter,
  Noto_Serif_SC,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import "../styles/globals.css";

// Warisan Edition fonts. Loading via next/font avoids the runtime <link> the
// reference HTML uses and prevents the dev-server "too many requests" warning.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
});

const tiroHi = Tiro_Devanagari_Hindi({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-tiro-hi",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "e-motion.my — Warisan Edition",
  description:
    "Kad jemputan perkahwinan digital dengan jiwa Melayu — bergerak, hidup, dan penuh emosi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const fontClasses = [
  playfair.variable,
  cormorant.variable,
  inter.variable,
  notoSc.variable,
  tiroHi.variable,
].join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className={fontClasses}>
      <body>{children}</body>
    </html>
  );
}
