"use client";

// Phase 4 conversion of Stitch screen `undang-location` — see
// .stitch/designs/undang-location.html. Mobile visual target: an indigo
// section with an asymmetric left-aligned header, a framed map card, the
// venue address block, and a row of pill navigation buttons.
//
// Behavior: preserves the previous InvitationScroll MapSection — an embedded
// Google Maps iframe plus deep links to Google Maps and Waze. Map links come
// from `payload.features.map` (googleMapsUrl / wazeUrl) and fall back to a
// query built from `venueAddress`, exactly as the mega-component did.

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { InvitationProps } from "@cinematic/schema";
import { eyebrowStyle } from "./_shared";

type LocationProps = Readonly<{
  payload: InvitationProps;
  googleMapsUrl: string;
  wazeUrl: string;
}>;

// Pill-button style shared by the two map links. Module-level constant
// (rerender-hoist-jsx spirit) — keeps allocation out of every render.
const pillStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 22px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  textDecoration: "none",
} as const;

export const LocationSection = ({ payload, googleMapsUrl, wazeUrl }: LocationProps) => {
  const ref = useScrollReveal<HTMLElement>({
    y: 44,
    stagger: 0.1,
    childSelector: "[data-stagger]",
  });

  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(
    payload.venueAddress,
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const gMaps =
    googleMapsUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(payload.venueAddress)}`;
  const waze =
    wazeUrl ||
    `https://waze.com/ul?q=${encodeURIComponent(payload.venueAddress)}&navigate=yes`;

  return (
    <section
      ref={ref}
      className="undang-location"
      style={{
        padding: "100px 24px",
        minHeight: "100dvh",
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--accent) 22%, var(--bg)) 0%, var(--bg) 100%)",
      }}
    >
      <div
        className="undang-location-inner"
        style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}
      >
        <p data-stagger style={eyebrowStyle}>
          Lokasi
        </p>
        <h2
          data-stagger
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(40px, 9vw, 64px)",
            color: "var(--gold)",
            margin: "8px 0 24px",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Tempat Majlis
        </h2>

        <div
          data-stagger
          className="undang-location-map"
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid color-mix(in oklab, var(--gold) 35%, transparent)",
            aspectRatio: "3/4",
            background: "#000",
            maxWidth: 480,
          }}
        >
          <iframe
            src={embed}
            style={{ border: 0, width: "100%", height: "100%" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi majlis"
          />
        </div>

        <div data-stagger style={{ marginTop: 28 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 26,
              color: "var(--ink)",
              margin: 0,
              fontWeight: 600,
            }}
          >
            {payload.venue}
          </h3>
          <p
            style={{
              margin: "8px 0 0",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--muted)",
            }}
          >
            {payload.venueAddress}
          </p>
        </div>

        <div
          data-stagger
          className="undang-location-actions"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}
        >
          <a
            href={gMaps}
            target="_blank"
            rel="noreferrer"
            style={{
              ...pillStyle,
              background: "var(--gold)",
              color: "var(--bg)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            }}
          >
            Peta Lokasi
          </a>
          <a
            href={waze}
            target="_blank"
            rel="noreferrer"
            style={{
              ...pillStyle,
              border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
              color: "var(--gold)",
            }}
          >
            Buka Waze
          </a>
        </div>
      </div>
    </section>
  );
};
