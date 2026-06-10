"use client";

// Activation gate for the published-invitation ("undang") scroll.
//
// Guests land on a sealed, theme-aware cover: ornament frame, couple names,
// optional "Khas buat" personalization (read from the ?kepada= query param),
// and a single "Buka Jemputan" action. The invitation content is rendered
// underneath (crawlers and OG scrapers still see everything) — the gate only
// overlays and locks scroll until the guest opens it.
//
// Opening choreography is pure CSS transitions (no GSAP needed for a one-shot
// unmount): the card lifts and fades, then the backdrop dissolves; after the
// last transition the parent unmounts us via onOpen. prefers-reduced-motion
// collapses the whole thing to a fast fade.

import { useEffect, useRef, useState } from "react";

type Props = Readonly<{
  brideShort: string;
  groomShort: string;
  dateLong: string;
  onOpen: () => void;
}>;

const OPEN_MS = 850;
const REDUCED_OPEN_MS = 150;

// "Khas buat" guest personalization. Read from window in an effect (not
// useSearchParams) so the gate needs no Suspense boundary and SSR markup
// stays stable.
function readGuestName(): string {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("kepada") ?? params.get("to") ?? "";
  return raw.replace(/[<>]/g, "").trim().slice(0, 60);
}

export const ActivationGate = ({ brideShort, groomShort, dateLong, onOpen }: Props) => {
  const [guest, setGuest] = useState("");
  const [closing, setClosing] = useState(false);
  const [reduced, setReduced] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setGuest(readGuestName());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // Lock page scroll while sealed; release the moment opening starts so the
  // guest can scroll straight into the cover parallax.
  useEffect(() => {
    if (closing) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = prev;
    };
  }, [closing]);

  const open = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onOpen, reduced ? REDUCED_OPEN_MS : OPEN_MS);
  };

  const duration = reduced ? REDUCED_OPEN_MS : 600;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Jemputan dimeterai — tekan untuk buka"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(ellipse 90% 70% at 50% 38%, color-mix(in oklab, var(--bg) 88%, white) 0%, var(--bg) 72%)",
        opacity: closing ? 0 : 1,
        transition: `opacity ${duration}ms ease ${reduced ? 0 : 220}ms`,
        pointerEvents: closing ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes emGateRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .em-gate-item { animation: none !important; opacity: 1 !important; }
        }
        .em-gate-item {
          opacity: 0;
          animation: emGateRise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .em-gate-seal:hover { transform: scale(1.04); }
        .em-gate-seal:active { transform: scale(0.97); }
        .em-gate-seal:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 560,
          width: "100%",
          padding: "56px 28px",
          border: "1px solid color-mix(in oklab, var(--gold) 45%, transparent)",
          borderRadius: 4,
          background: "color-mix(in oklab, var(--bg) 94%, white)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.16)",
          opacity: closing ? 0 : 1,
          transform: closing ? "translateY(-28px) scale(0.98)" : "none",
          transition: `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {/* inner hairline frame — the double-rule keline of printed kad jemputan */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 8,
            border: "1px solid color-mix(in oklab, var(--gold) 25%, transparent)",
            borderRadius: 2,
            pointerEvents: "none",
          }}
        />

        <p
          className="em-gate-item"
          style={{
            fontSize: 11,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "var(--muted)",
            margin: 0,
            animationDelay: "120ms",
          }}
        >
          Walimatul Urus
        </p>

        <h2
          className="em-gate-item"
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(44px, 10vw, 72px)",
            lineHeight: 1.05,
            color: "var(--gold)",
            fontWeight: 400,
            margin: "18px 0 10px",
            animationDelay: "240ms",
          }}
        >
          {brideShort} <span style={{ color: "var(--rose)" }}>&</span> {groomShort}
        </h2>

        <p
          className="em-gate-item"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 14,
            letterSpacing: 4,
            color: "var(--ink)",
            margin: "0 0 28px",
            animationDelay: "340ms",
          }}
        >
          {dateLong}
        </p>

        {guest && (
          <p
            className="em-gate-item"
            style={{
              fontSize: 13,
              color: "var(--muted)",
              margin: "0 0 24px",
              animationDelay: "420ms",
            }}
          >
            Khas buat{" "}
            <span style={{ color: "var(--ink)", fontWeight: 600 }}>{guest}</span>{" "}
            sekeluarga
          </p>
        )}

        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          className="em-gate-item em-gate-seal"
          style={{
            minHeight: 48,
            padding: "14px 34px",
            borderRadius: 999,
            border: "1px solid color-mix(in oklab, var(--gold) 60%, transparent)",
            background: "var(--gold)",
            color: "var(--bg)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 10px 26px color-mix(in oklab, var(--gold) 40%, transparent)",
            transition: "transform 180ms ease",
            animationDelay: "520ms",
          }}
        >
          Buka Jemputan
        </button>
      </div>
    </div>
  );
};
