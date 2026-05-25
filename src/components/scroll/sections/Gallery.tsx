"use client";

// Phase 4 conversion of Stitch screen `undang-gallery` — see
// .stitch/designs/undang-gallery.html. Mobile visual target: songket section
// with a tight square thumbnail grid and a full-screen lightbox overlay on
// tap. The lightbox closes on overlay click.
//
// Behavior preserved from the previous InvitationScroll GallerySection.

import { useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle, sectionStyle } from "./_shared";

type GalleryProps = Readonly<{
  images: ReadonlyArray<string>;
}>;

export const GallerySection = ({ images }: GalleryProps) => {
  const ref = useScrollReveal<HTMLElement>({ y: 40, stagger: 0.08, childSelector: "[data-img]" });
  const [active, setActive] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <section
      ref={ref}
      className="undang-gallery"
      style={{ ...sectionStyle, paddingBlock: 80 }}
    >
      <p style={{ ...eyebrowStyle, marginBottom: 20 }}>Galeri Foto</p>
      <div
        className="undang-gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8,
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        {images.map((src, i) => (
          <button
            // Same URL may legitimately appear twice (e.g. hero photo re-used),
            // so we pair src with index for a stable React key.
            key={`${src}-${i}`}
            data-img
            type="button"
            onClick={() => setActive(src)}
            className="undang-gallery-cell"
            style={{
              padding: 0,
              border: 0,
              cursor: "zoom-in",
              borderRadius: 10,
              overflow: "hidden",
              aspectRatio: "1/1",
              background: "#0001",
            }}
          >
            {/* Using a raw <img> here: gallery photos are user-uploaded to arbitrary
                remote URLs and we don't want every published invitation to fail the
                next/image remotePatterns check. The existing route already shipped
                with this pattern. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        ))}
      </div>
      {active && (
        <div
          className="undang-gallery-lightbox"
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
          />
        </div>
      )}
    </section>
  );
};
