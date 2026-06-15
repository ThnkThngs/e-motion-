import type { ComponentType } from "react";
import { FloralInvitation } from "@cinematic/compositions/FloralInvitation";
import { KhatInvitation } from "@cinematic/compositions/KhatInvitation";
import { ModernInvitation } from "@cinematic/compositions/ModernInvitation";
import { WildflowerInvitation } from "@cinematic/compositions/WildflowerInvitation";
import { SongketInvitation } from "@cinematic/compositions/SongketInvitation";
import { BatikInvitation } from "@cinematic/compositions/BatikInvitation";
import { TenunPahangInvitation } from "@cinematic/compositions/TenunPahangInvitation";
import { MawarInvitation } from "@cinematic/compositions/MawarInvitation";
import { AndamanInvitation } from "@cinematic/compositions/AndamanInvitation";
import { PorcelainInvitation } from "@cinematic/compositions/PorcelainInvitation";
import { SongketDirajaCinematic } from "@cinematic/compositions/SongketDirajaCinematic";
import type { InvitationProps } from "@cinematic/schema";

export type CinematicTemplateId =
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

export type CinematicTemplate = {
  id: CinematicTemplateId;
  name: string;
  blurb: string;
  thumb: string;
  badge: string;
  component: ComponentType<InvitationProps>;
};

export const cinematicTemplates: CinematicTemplate[] = [
  {
    id: "floral",
    name: "Floral Walimatul",
    blurb: "Watercolor wildflowers, butterflies, and scripted couple names — a soft heritage feel.",
    thumb: "/cinematic/floral-thumb.png",
    badge: "Motion · RM39",
    component: FloralInvitation,
  },
  {
    id: "wildflower",
    name: "Wildflower Garden",
    blurb: "Painted blossoms wreathing a deep navy frame — vibrant, feminine, gallery-style.",
    thumb: "/cinematic/wildflower-thumb.png",
    badge: "Cinematic · RM79",
    component: WildflowerInvitation,
  },
  {
    id: "khat",
    name: "Khat Calligraphy",
    blurb: "Gold Khat-inspired arches and Arabic typography for a regal majlis announcement.",
    thumb: "/cinematic/khat-thumb.png",
    badge: "Motion · RM39",
    component: KhatInvitation,
  },
  {
    id: "songket",
    name: "Songket Heritage",
    blurb: "Royal songket banding in midnight, gold and red — a Malay heritage statement.",
    thumb: "/cinematic/songket-thumb.png",
    badge: "Cinematic · RM79",
    component: SongketInvitation,
  },
  {
    id: "batik",
    name: "Batik Paisley",
    blurb: "Hand-drawn paisley batik with warm spice tones — playful and richly textured.",
    thumb: "/cinematic/batik-thumb.png",
    badge: "Motion · RM39",
    component: BatikInvitation,
  },
  {
    id: "modern",
    name: "Modern Geometric",
    blurb: "Contemporary kerawang patterning with sage and blush — clean, minimal, editorial.",
    thumb: "/cinematic/modern-thumb.png",
    badge: "Motion · RM39",
    component: ModernInvitation,
  },
  {
    id: "tenun-pahang",
    name: "Tenun Pahang Lipat",
    blurb: "Tenunan tangan Pahang dengan emas tan dan aksen hijau giok — mewah dan berbumi.",
    thumb: "/api/og?template=tenun-pahang",
    badge: "Motion · RM39",
    component: TenunPahangInvitation,
  },
  {
    id: "mawar",
    name: "Mawar Pastel",
    blurb: "Krim merah jambu dengan champagne dan sage — tema taman pastel kontemporari.",
    thumb: "/api/og?template=mawar",
    badge: "Motion · RM39",
    component: MawarInvitation,
  },
  {
    id: "andaman",
    name: "Andaman Diraja",
    blurb: "Biru kobalt diraja dengan emas dan koral — istiadat berdarjah Melayu.",
    thumb: "/api/og?template=andaman",
    badge: "Cinematic · RM79",
    component: AndamanInvitation,
  },
  {
    id: "porcelain-songket",
    name: "Porcelain Songket",
    blurb: "Porselin biru-puteh, aksen tembaga lembut dan tenunan songket halus — anggun dan berbumi.",
    thumb: "/porcelain-songket/mockup_preview.jpg",
    badge: "Cinematic · RM79",
    component: PorcelainInvitation,
  },
  {
    id: "songket-diraja",
    name: "Songket Diraja",
    blurb: "Biru-navy diraja dengan tenunan emas, gerbang mihrab puteh dan bunga merah — mewah dan istiadat.",
    thumb: "/songket-diraja/og.jpg",
    badge: "Cinematic · RM79",
    component: SongketDirajaCinematic,
  },
];

export const cinematicTemplateById = (id: CinematicTemplateId): CinematicTemplate =>
  cinematicTemplates.find((t) => t.id === id) ?? cinematicTemplates[0];
