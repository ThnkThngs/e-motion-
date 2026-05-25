// Shared building blocks for the per-archetype card previews (Phase 4).
//
// WarisanCardPreview's contract — matched exactly here:
//   • single prop: `{ form: WarisanCardForm }`
//   • inline styles driven by `themeFor(form.templateId)` colors
//   • hardcoded Malay strings (no i18n / useWarisanLang)
//   • shared `.phone` / `.inv-*` CSS classes from styles/warisan.css
//
// Each archetype renders its own hero (visual family) and then delegates the
// countdown / events / audio / story / gallery / rsvp / gifts / video / footer
// sections to <CardBody>, so the 20 templates stay structurally consistent.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { HeritageTheme } from "@/lib/heritageThemes";
import { themeFor } from "@/lib/heritageThemes";
import { heritageTemplates } from "@/lib/heritageTemplates";
import type { WarisanCardForm } from "@/components/warisan-builder/types";

export type ArchetypeProps = Readonly<{ form: WarisanCardForm }>;

export type Countdown = Readonly<{ d: string; h: string; m: string; s: string }>;

// --- countdown -------------------------------------------------------------

const useTick = (active: boolean) => {
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);
};

export const useCountdown = (iso: string): Countdown => {
  useTick(Boolean(iso));
  return useMemo(() => {
    if (!iso) return { d: "--", h: "--", m: "--", s: "--" };
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return { d: "--", h: "--", m: "--", s: "--" };
    const diff = Math.max(0, t - Date.now());
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return {
      d: String(d).padStart(2, "0"),
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0"),
    };
    // We rely on useTick to force a re-render every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso, Math.floor(Date.now() / 1000)]);
};

// --- helpers ---------------------------------------------------------------

export const templateName = (id: string): string =>
  heritageTemplates.find((t) => t.id === id)?.name ?? "Heritage";

export const templateThumb = (id: string): string | undefined =>
  heritageTemplates.find((t) => t.id === id)?.thumb;

const COUNTDOWN_KEYS = ["d", "h", "m", "s"] as const;
const COUNTDOWN_LABEL: Record<(typeof COUNTDOWN_KEYS)[number], string> = {
  d: "Hari",
  h: "Jam",
  m: "Min",
  s: "Saat",
};

const EVENT_KEYS = ["akad", "resepsi"] as const;
const EVENT_LABEL: Record<(typeof EVENT_KEYS)[number], string> = {
  akad: "Akad Nikah",
  resepsi: "Majlis Resepsi",
};

// --- phone shell -----------------------------------------------------------

export const PhoneFrame = ({
  form,
  children,
}: Readonly<{ form: WarisanCardForm; children: React.ReactNode }>) => (
  <div className="phone">
    <div className="phone-notch" />
    <div className="phone-screen">
      <div className="phone-url">
        e-motion.my/{form.brideShort.toLowerCase()}-{form.groomShort.toLowerCase()}
      </div>
      <div className="inv">{children}</div>
    </div>
  </div>
);

// --- countdown section -----------------------------------------------------

export const CountdownSection = ({
  theme,
  cd,
}: Readonly<{ theme: HeritageTheme; cd: Countdown }>) => (
  <div
    className="inv-section"
    style={{ background: theme.bg, color: theme.ink, padding: "20px 20px 24px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 01</div>
      <div className="inv-sec-title" style={{ color: theme.ink }}>Kiraan Detik</div>
    </div>
    <div className="inv-countdown">
      {COUNTDOWN_KEYS.map((k) => (
        <div
          key={k}
          className="inv-cd-box"
          style={{ background: `${theme.accent}1f`, border: `1px solid ${theme.rule}` }}
        >
          <span className="inv-cd-num" style={{ color: theme.accent }}>{cd[k]}</span>
          <span className="inv-cd-lbl" style={{ color: `${theme.ink}aa` }}>
            {COUNTDOWN_LABEL[k]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- events section --------------------------------------------------------

export const EventsSection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    className="inv-section"
    style={{ background: theme.body, color: theme.bodyInk, padding: "22px 20px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 02</div>
      <div className="inv-sec-title" style={{ color: theme.bodyInk }}>Aturcara Majlis</div>
    </div>
    {EVENT_KEYS.map((k) => {
      const ev = form[k];
      return (
        <div
          key={k}
          className="inv-event"
          style={{
            background: `${theme.accent}14`,
            border: `1px solid ${theme.rule}`,
            marginBottom: 10,
          }}
        >
          <div className="inv-event-name" style={{ color: theme.accent }}>
            {EVENT_LABEL[k]}
          </div>
          {(
            [
              ["Tarikh", ev.date],
              ["Masa", ev.time],
              ["Tempat", ev.venue],
              ["Alamat", ev.address],
              ["Dresscode", ev.dress],
            ] as const
          )
            .filter(([, v]) => Boolean(v))
            .map(([lbl, v]) => (
              <div
                className="inv-event-row"
                key={lbl}
                style={{ borderBottomColor: theme.rule }}
              >
                <span className="inv-event-lbl" style={{ color: theme.accent }}>{lbl}</span>
                <span className="inv-event-val" style={{ color: theme.bodyInk }}>{v}</span>
              </div>
            ))}
        </div>
      );
    })}
  </div>
);

// --- audio section ---------------------------------------------------------

const AudioSection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    setPlaying(false);
  }, [form.audioUrl]);
  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };
  return (
    <div
      className="inv-section"
      style={{ background: theme.bg, color: theme.ink, padding: "18px 20px" }}
    >
      <div className="inv-sec-head">
        <div className="inv-sec-num" style={{ color: theme.accent }}>/ 03</div>
        <div className="inv-sec-title" style={{ color: theme.ink }}>Muzik Latar</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          background: `${theme.accent}1c`,
          border: `1px solid ${theme.rule}`,
          borderRadius: 6,
        }}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: theme.accent,
            color: theme.bodyInk,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="2" y="1.5" width="3" height="9" fill="currentColor" />
              <rect x="7" y="1.5" width="3" height="9" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.5L10 6L3 10.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontSize: 13,
              color: theme.accent,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {form.audioName ?? "Muzik latar"}
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              color: `${theme.ink}99`,
              marginTop: 2,
            }}
          >
            {playing ? "Sedang Dimainkan" : "Tekan untuk Main"}
          </div>
        </div>
        <audio ref={audioRef} src={form.audioUrl} loop preload="metadata" />
      </div>
    </div>
  );
};

// --- story section ---------------------------------------------------------

const StorySection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    className="inv-section"
    style={{ background: theme.body, color: theme.bodyInk, padding: "22px 20px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 04</div>
      <div className="inv-sec-title" style={{ color: theme.bodyInk }}>Kisah Cinta</div>
    </div>
    {form.story.map((s, i) => (
      <div
        key={s.yr + s.title}
        style={{
          display: "flex",
          gap: 14,
          padding: "12px 0",
          borderBottom: i < 2 ? `1px dashed ${theme.rule}` : "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontSize: 28,
            color: theme.accent,
            flexShrink: 0,
            width: 64,
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          {s.yr}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 3,
              color: theme.bodyInk,
            }}
          >
            {s.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: 12,
              color: `${theme.bodyInk}aa`,
              lineHeight: 1.5,
            }}
          >
            {s.desc}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- gallery section -------------------------------------------------------

const GallerySection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    className="inv-section"
    style={{ background: theme.bg, color: theme.ink, padding: "22px 20px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 05</div>
      <div className="inv-sec-title" style={{ color: theme.ink }}>Galeri Kenangan</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
      {form.galleryUrls.map((u, i) => (
        <div
          key={u + i}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            overflow: "hidden",
            borderRadius: 2,
            background: `${theme.accent}1c`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={u}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  </div>
);

// --- rsvp section ----------------------------------------------------------

const RsvpSection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    className="inv-section"
    style={{ background: theme.body, color: theme.bodyInk, padding: "22px 20px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 06</div>
      <div className="inv-sec-title" style={{ color: theme.bodyInk }}>Sahkan Kehadiran</div>
    </div>
    <div
      style={{
        background: `${theme.accent}14`,
        border: `1px solid ${theme.rule}`,
        borderRadius: 4,
        padding: "14px 16px",
        marginBottom: 10,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: 16,
          fontWeight: 500,
          marginBottom: 4,
          color: theme.bodyInk,
        }}
      >
        {form.rsvpName}
      </div>
      <div
        style={{
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: 11,
          color: theme.accent,
        }}
      >
        {form.rsvpPhone}
      </div>
      {form.rsvpDeadline && (
        <div
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: 11,
            color: `${theme.bodyInk}88`,
            marginTop: 6,
          }}
        >
          Sila sahkan sebelum {form.rsvpDeadline}
        </div>
      )}
    </div>
    <a
      className="inv-wa-btn"
      target="_blank"
      rel="noopener noreferrer"
      href={`https://wa.me/${form.rsvpPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Salam ${form.rsvpName}, saya ingin sahkan kehadiran ke majlis ${form.brideShort} & ${form.groomShort}.`,
      )}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 12,
        background: "linear-gradient(135deg, #25D366, #1da852)",
        color: "#fff",
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        textDecoration: "none",
        cursor: "pointer",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(37,211,102,.3)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path
          d="M2 7.5L5.5 11L12 3.5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Sahkan via WhatsApp</span>
    </a>
  </div>
);

// --- gifts section ---------------------------------------------------------

const GiftsSection = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    className="inv-section"
    style={{ background: theme.bg, color: theme.ink, padding: "22px 20px" }}
  >
    <div className="inv-sec-head">
      <div className="inv-sec-num" style={{ color: theme.accent }}>/ 07</div>
      <div className="inv-sec-title" style={{ color: theme.ink }}>Hadiah Digital</div>
    </div>
    {form.bank && (
      <div
        style={{
          background: `${theme.accent}14`,
          border: `1px solid ${theme.rule}`,
          borderRadius: 4,
          padding: "12px 14px",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          {form.bank}
        </div>
        <div
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 13,
            marginBottom: 2,
            color: theme.ink,
          }}
        >
          {form.accName}
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: 11,
            color: `${theme.ink}aa`,
            letterSpacing: ".05em",
          }}
        >
          {form.accNo}
        </div>
      </div>
    )}
    {form.ewallet && (
      <div
        style={{
          background: `${theme.accent}14`,
          border: `1px solid ${theme.rule}`,
          borderRadius: 4,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: theme.accent,
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          e-Wallet · TNG / DuitNow
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: 12,
            color: theme.ink,
          }}
        >
          {form.ewallet}
        </div>
      </div>
    )}
  </div>
);

// --- footer ----------------------------------------------------------------

const CardFooter = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <div
    style={{
      padding: "28px 20px",
      textAlign: "center",
      background: theme.bg,
      color: theme.ink,
      position: "relative",
    }}
  >
    <Image
      src={theme.ornament}
      alt=""
      width={48}
      height={48}
      aria-hidden="true"
      style={{ opacity: 0.4, margin: "0 auto 12px", display: "block" }}
    />
    <div
      style={{
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontSize: 18,
        color: theme.accent,
        marginBottom: 4,
      }}
    >
      {form.brideShort} &amp; {form.groomShort}
    </div>
    <div
      style={{
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
        fontSize: 11,
        color: `${theme.ink}88`,
      }}
    >
      Terima kasih atas doa &amp; restu · {templateName(form.templateId)}
    </div>
  </div>
);

// --- shared body -----------------------------------------------------------

/**
 * Sections 01–07 + closing video + footer. Identical across all archetypes —
 * only the hero differs. Each archetype renders its own hero, then <CardBody>.
 */
export const CardBody = ({
  form,
  theme,
  cd,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme; cd: Countdown }>) => (
  <>
    <CountdownSection theme={theme} cd={cd} />
    <EventsSection form={form} theme={theme} />
    {form.audioUrl && <AudioSection form={form} theme={theme} />}
    <StorySection form={form} theme={theme} />
    {form.galleryUrls.length > 0 && <GallerySection form={form} theme={theme} />}
    <RsvpSection form={form} theme={theme} />
    {(form.bank || form.ewallet) && <GiftsSection form={form} theme={theme} />}
    {form.videoUrl && (
      <div style={{ background: "#0d1228" }}>
        <video
          src={form.videoUrl}
          controls
          loop
          muted
          playsInline
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    )}
    <CardFooter form={form} theme={theme} />
  </>
);

// --- shared hero pieces ----------------------------------------------------

export const HeroNames = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <>
    <div className="inv-names">
      <span className="inv-name" style={{ color: theme.ink }}>{form.brideShort}</span>
      <span className="inv-amp" style={{ color: theme.accent }}>&amp;</span>
      <span className="inv-name" style={{ color: theme.ink }}>{form.groomShort}</span>
    </div>
    <div className="inv-divider" aria-hidden="true">
      <span className="line" style={{ background: theme.accent }} />
      <span className="dia" style={{ background: theme.accent }} />
      <span className="line" style={{ background: theme.accent }} />
    </div>
  </>
);

export const HeroIntro = ({
  form,
  theme,
}: Readonly<{ form: WarisanCardForm; theme: HeritageTheme }>) => (
  <>
    <p className="inv-intro" style={{ color: theme.ink, opacity: 0.85 }}>
      {form.intro}
    </p>
    {form.parents && (
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: 11,
          lineHeight: 1.5,
          color: theme.ink,
          opacity: 0.75,
          marginTop: 16,
          whiteSpace: "pre-line",
        }}
      >
        {form.parents}
      </p>
    )}
  </>
);

export { themeFor };
