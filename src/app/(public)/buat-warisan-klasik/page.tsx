import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import WarisanKlasikBuilder from "./WarisanKlasikBuilder";

// Warisan Klasik "custom edit" builder — edit a classical Malay heritage kad
// jemputan and export it as one self-contained, offline scrollable HTML file.

const title = "Bina Kad Jemputan Warisan Klasik";
const description =
  "Sunting kad jemputan walimatul urus bertemakan warisan Melayu — songket emas, motif pucuk rebung, nama Jawi — dan muat turun sebagai satu fail HTML lengkap.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${siteConfig.baseUrl}/buat-warisan-klasik`,
    siteName: siteConfig.name,
    type: "website",
    locale: "ms_MY",
  },
};

export default function BuatWarisanKlasikPage() {
  return <WarisanKlasikBuilder />;
}
