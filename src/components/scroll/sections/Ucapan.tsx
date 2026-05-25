"use client";

// Phase 4 conversion of Stitch screen `undang-ucapan` — see
// .stitch/designs/undang-ucapan.html. Mobile visual target: an indigo section
// with a left-aligned header, a glass submission form (name + message), and a
// feed of quote-styled wish cards.
//
// Behavior: ported verbatim from the previous InvitationScroll UcapanSection —
// on mount it GETs `/api/ucapan?slug=…` to hydrate the wish list, and the form
// POSTs `{ slug, guestName, message }` to /api/ucapan, prepending the returned
// ucapan to the feed on success.
//
// The Stitch `format_quote` Material Symbol is rendered as an inline SVG per
// the taste-design "no icon-font" rule.

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle, formInputStyle } from "./_shared";

type UcapanProps = Readonly<{
  slug: string;
}>;

type UcapanItem = Readonly<{
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
}>;

// Opening-quote ornament — replaces the Stitch `format_quote` Material Symbol.
// Module-level per react-best-practices (rerender-no-inline-components).
const QuoteGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7 6c-2.8 0-5 2.2-5 5v7h7v-7H4.5C4.5 9.6 5.6 8.5 7 8.5V6zm10 0c-2.8 0-5 2.2-5 5v7h7v-7h-2.5c0-1.4 1.1-2.5 2.5-2.5V6z" />
  </svg>
);

export const UcapanSection = ({ slug }: UcapanProps) => {
  const ref = useScrollReveal<HTMLElement>({ y: 40 });
  const [items, setItems] = useState<ReadonlyArray<UcapanItem>>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/ucapan?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {});
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/ucapan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, guestName: name, message }),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const data = await res.json();
      setItems((cur) => [data.ucapan, ...cur]);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hantar ucapan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      ref={ref}
      className="undang-ucapan"
      style={{ padding: "100px 24px", minHeight: "100dvh", textAlign: "center" }}
    >
      <div className="undang-ucapan-inner" style={{ maxWidth: 600, margin: "0 auto" }}>
        <p style={{ ...eyebrowStyle, textAlign: "left" }}>Ucapan &amp; Doa</p>
        <h2
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(40px, 9vw, 64px)",
            color: "var(--gold)",
            margin: "8px 0 24px",
            fontWeight: 400,
            lineHeight: 1.1,
            textAlign: "left",
          }}
        >
          Pesanan Tetamu
        </h2>

        <form
          onSubmit={submit}
          style={{ display: "grid", gap: 10, margin: "0 0 32px", textAlign: "left" }}
        >
          <input
            required
            placeholder="Nama anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={formInputStyle}
          />
          <textarea
            required
            rows={3}
            placeholder="Tinggalkan ucapan…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ ...formInputStyle, resize: "vertical" }}
          />
          {error && <p style={{ color: "var(--rose)", fontSize: 13, margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "12px 20px",
              borderRadius: 999,
              border: 0,
              background: "var(--gold)",
              color: "var(--bg)",
              fontWeight: 700,
              cursor: busy ? "wait" : "pointer",
            }}
          >
            {busy ? "Menghantar…" : "Hantar Ucapan"}
          </button>
        </form>

        <div style={{ display: "grid", gap: 12, textAlign: "left" }}>
          {items.map((u) => (
            <div
              key={u.id}
              className="undang-ucapan-card"
              style={{
                position: "relative",
                padding: "18px 18px 16px",
                borderRadius: 14,
                border: "1px solid color-mix(in oklab, var(--gold) 25%, transparent)",
                background: "color-mix(in oklab, var(--gold) 4%, transparent)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  color: "color-mix(in oklab, var(--gold) 45%, transparent)",
                }}
              >
                <QuoteGlyph />
              </span>
              <p
                style={{
                  margin: "4px 0 0",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 16,
                  lineHeight: 1.5,
                  color: "var(--ink)",
                }}
              >
                {u.message}
              </p>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--gold)",
                }}
              >
                {u.guest_name}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ color: "var(--muted)", textAlign: "center" }}>
              Jadi yang pertama meninggalkan ucapan.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
