"use client";

// Phase 4 — thin orchestrator for the published-invitation ("undang") scroll.
//
// The original InvitationScroll was a 1099-line mega-component holding every
// section inline. Each section now lives in ./sections/* (one file per Stitch
// `undang-*` screen). This file only:
//   • sets the theme CSS custom properties on <main>,
//   • renders the optional preview badge,
//   • renders the 11 sections in scroll order, handing each its data slice.
//
// The exported name (`InvitationScroll`) and prop signature are unchanged so
// existing callers (the /undang/<slug> route) keep working.

import { themes, type ThemeId } from "@cinematic/themes";
import type { InvitationProps } from "@cinematic/schema";
import { CoverSection } from "./sections/Cover";
import { AkadSection } from "./sections/Akad";
import { ResepsiSection } from "./sections/Resepsi";
import { StorySection } from "./sections/Story";
import { CountdownSection } from "./sections/Countdown";
import { GallerySection } from "./sections/Gallery";
import { GiftSection, type GiftAccount } from "./sections/Gift";
import { LocationSection } from "./sections/Location";
import { RSVPSection } from "./sections/RSVP";
import { UcapanSection } from "./sections/Ucapan";
import { ClosingSection } from "./sections/Closing";

type Props = {
  templateId: ThemeId;
  payload: InvitationProps;
  slug?: string;
  preview?: boolean;
};

// The cinematic InvitationProps schema does not yet carry digital-gift bank
// accounts, so the Gift section receives an empty list and self-hides (same
// null-guard pattern as Gallery / Story). When `features.gift` lands in the
// schema, forward it here.
const NO_GIFT_ACCOUNTS: ReadonlyArray<GiftAccount> = [];

export const InvitationScroll: React.FC<Props> = ({ templateId, payload, slug, preview }) => {
  const theme = themes[templateId] ?? themes.floral;
  const f = payload.features;

  return (
    <main
      style={
        {
          "--bg": theme.palette.bg,
          "--ink": theme.palette.ink,
          "--rose": theme.palette.rose,
          "--gold": theme.palette.gold,
          "--muted": theme.palette.muted,
          "--accent": theme.palette.accent,
          "--font-display": theme.fonts.display,
          "--font-script": theme.fonts.script,
          "--font-body": theme.fonts.body,
          "--font-arabic": theme.fonts.arabic,
          background: "var(--bg)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
          minHeight: "100dvh",
          overflowX: "hidden",
        } as React.CSSProperties
      }
    >
      {preview && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 100,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Preview
        </div>
      )}

      <CoverSection
        theme={theme}
        brideShort={payload.brideShort}
        groomShort={payload.groomShort}
        dateLong={payload.dateLong}
        rsvpEnabled={f.rsvp.enabled}
      />
      <AkadSection theme={theme} payload={payload} />
      <ResepsiSection payload={payload} />
      {f.salamKaut.enabled && f.salamKaut.items.length > 0 && (
        <StorySection items={f.salamKaut.items} />
      )}
      {f.countdown.enabled && <CountdownSection eventDateTime={f.countdown.eventDateTime} />}
      {f.gallery.enabled && f.gallery.images.length > 0 && (
        <GallerySection images={f.gallery.images} />
      )}
      <GiftSection accounts={NO_GIFT_ACCOUNTS} />
      {f.map.enabled && (
        <LocationSection
          payload={payload}
          googleMapsUrl={f.map.googleMapsUrl}
          wazeUrl={f.map.wazeUrl}
        />
      )}
      {f.rsvp.enabled && slug && <RSVPSection slug={slug} deadline={f.rsvp.deadline} />}
      {f.ucapan.enabled && slug && <UcapanSection slug={slug} />}
      <ClosingSection
        brideShort={payload.brideShort}
        groomShort={payload.groomShort}
        brandLine={payload.brandLine}
      />
    </main>
  );
};
