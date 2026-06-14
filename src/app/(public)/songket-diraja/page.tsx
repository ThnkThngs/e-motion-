import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import SongketDirajaScroll from "./SongketDirajaScroll";

// Standalone, content-hardcoded Songket Diraja invitation (Aulia & Hilmi) — a
// royal navy/gold synthesis of the six reference panels. Distinct from the
// data-driven /undang/[slug] route; this is its own shareable page.

const title = "Aulia & Hilmi — Walimatul Urus | Songket Diraja";
const description =
  "Jemputan walimatul urus Aulia & Hilmi — Sabtu 24 Mei 2026 di The Warisan Hall, Kuala Lumpur. Tema songket diraja biru-emas.";
const url = `${siteConfig.baseUrl}/songket-diraja`;
const ogImage = `${siteConfig.baseUrl}/songket-diraja/og.jpg`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url,
    siteName: siteConfig.name,
    images: [{ url: ogImage, width: 1200, height: 1500, alt: title }],
    type: "website",
    locale: "ms_MY",
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function SongketDirajaPage() {
  return <SongketDirajaScroll />;
}
