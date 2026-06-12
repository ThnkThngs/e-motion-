import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PorcelainScroll from "./PorcelainScroll";

// Standalone, content-hardcoded porcelain-songket invitation (Aulia & Hilmi).
// Distinct from the data-driven /undang/[slug] route — this is the faithful
// reproduction of the package design as its own shareable page.

const title = "Aulia & Hilmi — Walimatul Urus";
const description =
  "Dari Akad ke Janji — jemputan walimatul urus Aulia & Hilmi, Sabtu 24 Mei 2026 di The Warisan Hall, Kuala Lumpur.";
const url = `${siteConfig.baseUrl}/porcelain-songket`;
const ogImage = `${siteConfig.baseUrl}/porcelain-songket/mockup_preview.jpg`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url,
    siteName: siteConfig.name,
    images: [{ url: ogImage, width: 1800, height: 1200, alt: title }],
    type: "website",
    locale: "ms_MY",
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

export default function PorcelainSongketPage() {
  return <PorcelainScroll />;
}
