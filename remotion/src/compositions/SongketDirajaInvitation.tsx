import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from "remotion";
import { themes } from "../themes";

// Bespoke Songket Diraja video invitation (Aulia & Hilmi).
//
// The video twin of the /songket-diraja scroll page: an 18s / 540-frame @30fps
// timeline over six scenes (Pembuka, Nama, Akad, Aturcara, Lokasi, RSVP).
// Everything is hand-authored inline SVG + code — deep navy ground, woven gold
// songket, a cream ogee/mihrab panel, red-and-cream floral sprays, gold
// filigree, drifting birds, a faded mosque silhouette and a gilded perahu — so
// the composition is fully self-contained with no raster or AI-clip deps.
//
// Self-contained (no InvitationProps) because the copy + verse are specific to
// this couple; the generic, data-driven template is SongketDirajaCinematic.

const THEME = themes["songket-diraja"];
const C = {
  navy: "#0C2340",
  navy2: "#163A5F",
  gold: "#C9A24A",
  goldBright: "#E6C878",
  goldDeep: "#9A7325",
  cream: "#FBF3DF",
  red: "#A8392E",
  text: "#14304F",
  muted: "#5D6F86",
};

export const SONGKET_DIRAJA_FPS = 30;
export const SONGKET_DIRAJA_DURATION = 540;

// Scene timeline (frames). 90 90 120 90 75 75 = 540.
const SCENES = {
  opening: { from: 0, dur: 90 },
  names: { from: 90, dur: 90 },
  akad: { from: 180, dur: 120 },
  aturcara: { from: 300, dur: 90 },
  location: { from: 390, dur: 75 },
  rsvp: { from: 465, dur: 75 },
};

const SONGKET_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><g fill='none' stroke='%23c9a24a' stroke-width='1'><path d='M20 2 L38 20 L20 38 L2 20 Z'/><circle cx='20' cy='20' r='2.5' fill='%23c9a24a' stroke='none'/></g></svg>";
const BAND_URI =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='26' viewBox='0 0 48 26'><g fill='%23c9a24a'><path d='M24 4 L30 13 L24 22 L18 13 Z' opacity='0.9'/><circle cx='6' cy='13' r='2'/><circle cx='42' cy='13' r='2'/></g><g stroke='%23c9a24a' stroke-width='1' opacity='0.6'><line x1='0' y1='2' x2='48' y2='2'/><line x1='0' y1='24' x2='48' y2='24'/></g></svg>";

/* ---------- Inline SVG ornaments ---------- */

function ArchPanel() {
  const outline = "M28 922 L28 358 C28 196 172 205 300 38 C428 205 572 196 572 358 L572 922 Z";
  const inner = "M54 899 L54 370 C54 226 180 235 300 81 C420 235 546 226 546 370 L546 899 Z";
  return (
    <svg
      width={600}
      height={940}
      viewBox="0 0 600 940"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="sdCreamV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf7e9" />
          <stop offset="0.55" stopColor="#fbf3df" />
          <stop offset="1" stopColor="#f1e3bf" />
        </linearGradient>
      </defs>
      <path d={outline} fill="url(#sdCreamV)" />
      <path d={outline} fill="none" stroke="#c9a24a" strokeWidth="10" opacity="0.16" />
      <path d={outline} fill="none" stroke="#b78f33" strokeWidth="3" />
      <path d={inner} fill="none" stroke="#c9a24a" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function ApexFloret() {
  return (
    <svg
      width={56}
      height={56}
      viewBox="0 0 30 30"
      style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)" }}
      aria-hidden
    >
      <g fill="#c9a24a" stroke="#9a7325" strokeWidth="0.6">
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx="15" cy="8" rx="4.4" ry="7" transform={`rotate(${a} 15 15)`} />
        ))}
        <circle cx="15" cy="15" r="3.4" fill="#e6c878" />
        <circle cx="15" cy="15" r="1.3" fill="#9a7325" stroke="none" />
      </g>
    </svg>
  );
}

function Leaf({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d="M0 0 C 9 -7 9 -26 0 -34 C -9 -26 -9 -7 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${r})`}
      fill="url(#sdLeafV)"
      stroke="#9a7325"
      strokeWidth={1}
    />
  );
}

function Blossom({ x, y, s, petal }: { x: number; y: number; s: number; petal: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={x}
          cy={y - s * 0.62}
          rx={s * 0.36}
          ry={s * 0.6}
          fill={petal}
          stroke="#9a7325"
          strokeWidth={0.8}
          transform={`rotate(${a} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={s * 0.34} fill="#d8b65f" stroke="#9a7325" strokeWidth={0.8} />
      <circle cx={x} cy={y} r={s * 0.12} fill="#9a7325" />
    </g>
  );
}

function FloralSpray({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width={220} height={282} viewBox="0 0 180 230" style={style} aria-hidden>
      <defs>
        <linearGradient id="sdLeafV" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6c878" />
          <stop offset="1" stopColor="#9a7325" />
        </linearGradient>
      </defs>
      <Leaf x={70} y={206} r={-12} />
      <Leaf x={48} y={196} r={-46} />
      <Leaf x={96} y={188} r={18} />
      <Leaf x={120} y={150} r={36} />
      <Leaf x={34} y={150} r={-72} />
      <Leaf x={104} y={104} r={8} />
      <path d="M70 214 C 60 170 70 130 104 96" fill="none" stroke="#9a7325" strokeWidth="2.2" opacity="0.8" />
      <Blossom x={66} y={170} s={34} petal="#a8392e" />
      <Blossom x={112} y={120} s={26} petal="#fbf3df" />
      <Blossom x={40} y={120} s={18} petal="#c0463a" />
      <Blossom x={120} y={186} s={15} petal="#fdf7e9" />
    </svg>
  );
}

function Filigree() {
  return (
    <svg width={188} height={23} viewBox="0 0 132 16" style={{ margin: "16px 0" }} aria-hidden>
      <g fill="none" stroke="#c9a24a" strokeWidth="1.4">
        <path d="M2 8 C 28 8 34 3 50 8 M130 8 C 104 8 98 3 82 8" />
        <path d="M50 8 C 58 14 74 14 82 8" />
      </g>
      <g fill="#c9a24a">
        <path d="M66 1 L72 8 L66 15 L60 8 Z" />
        <circle cx="2" cy="8" r="1.8" />
        <circle cx="130" cy="8" r="1.8" />
      </g>
    </svg>
  );
}

function Birds({ style }: { style?: React.CSSProperties }) {
  const bird = (x: number, y: number, sc: number, op: number) => (
    <path
      d="M0 10 Q7 2 14 10 Q21 2 28 10"
      fill="none"
      stroke="#c9a24a"
      strokeWidth={2}
      strokeLinecap="round"
      transform={`translate(${x} ${y}) scale(${sc})`}
      opacity={op}
    />
  );
  return (
    <svg width={150} height={88} viewBox="0 0 96 56" style={style} aria-hidden>
      {bird(2, 6, 1, 0.9)}
      {bird(40, 0, 0.8, 0.75)}
      {bird(30, 28, 1.1, 0.85)}
      {bird(66, 20, 0.7, 0.6)}
    </svg>
  );
}

function Mosque({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width={560} height={280} viewBox="0 0 400 200" style={style} aria-hidden>
      <g fill="#c9a24a">
        <rect x="60" y="96" width="14" height="104" />
        <path d="M67 96 Q56 78 67 64 Q78 78 67 96 Z" />
        <rect x="326" y="96" width="14" height="104" />
        <path d="M333 96 Q322 78 333 64 Q344 78 333 96 Z" />
        <path d="M120 200 L120 150 L160 150 L160 200 Z" />
        <path d="M120 150 Q120 122 140 116 Q160 122 160 150 Z" />
        <path d="M240 200 L240 150 L280 150 L280 200 Z" />
        <path d="M240 150 Q240 122 260 116 Q280 122 280 150 Z" />
        <path d="M160 200 L160 120 L240 120 L240 200 Z" />
        <path d="M160 120 Q160 60 200 48 Q240 60 240 120 Z" />
        <path d="M196 48 L200 24 L204 48 Z" />
        <circle cx="200" cy="20" r="4" />
      </g>
    </svg>
  );
}

function Perahu({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width={150} height={109} viewBox="0 0 160 116" style={style} aria-hidden>
      <g fill="#c9a24a" stroke="#9a7325" strokeWidth="1.2">
        <path d="M78 14 L78 78 L30 78 Z" />
        <path d="M86 30 L86 78 L124 78 Z" />
        <path d="M18 82 Q80 100 142 82 L126 96 Q80 110 34 96 Z" />
      </g>
      <g fill="none" stroke="#c9a24a" strokeWidth="1.6" opacity="0.7">
        <path d="M6 104 Q26 96 46 104 T86 104 T126 104 T160 104" />
      </g>
    </svg>
  );
}

/* ---------- Background + flecks ---------- */

/** Navy ground with woven songket, gold bands and a slow ken-burns drift. */
const Background: React.FC<{ localDur: number }> = ({ localDur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, localDur], [1.03, 1.08], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(40,78,120,0.55), transparent 62%), linear-gradient(170deg, #0d2748 0%, #0a1d36 55%, #081728 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url("${SONGKET_URI}")`,
          backgroundSize: "66px 66px",
          opacity: 0.08,
          transform: `scale(${scale})`,
        }}
      />
      {/* gold songket bands */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 38,
          backgroundImage: `url("${BAND_URI}")`,
          backgroundSize: "72px 38px",
          backgroundRepeat: "repeat-x",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 38,
          backgroundImage: `url("${BAND_URI}")`,
          backgroundSize: "72px 38px",
          backgroundRepeat: "repeat-x",
          opacity: 0.85,
          transform: "rotate(180deg)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Drifting gold flecks across the whole timeline. */
const GoldFlecks: React.FC<{ count?: number; seed?: string }> = ({ count = 18, seed = "diraja" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const flecks = Array.from({ length: count }, (_, i) => {
    const id = `${seed}-${i}`;
    const baseX = random(`${id}-x`) * width;
    const startY = random(`${id}-y`) * height * 1.4 - height * 0.3;
    const speed = 0.3 + random(`${id}-s`) * 0.6;
    const drift = (random(`${id}-d`) - 0.5) * 180;
    const size = 7 + random(`${id}-r`) * 9;
    const phase = random(`${id}-p`) * Math.PI * 2;
    const t = ((frame * speed + i * 11) % durationInFrames) / durationInFrames;
    const y = startY + t * (height + 200);
    const x = baseX + Math.sin(frame / 18 + phase) * drift * 0.18;
    const rot = 45 + frame * (0.5 + random(`${id}-rot`)) + i * 17;
    const opacity = 0.4 + Math.sin(frame / 22 + phase) * 0.18;
    return (
      <div
        key={id}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: 2,
          background: `radial-gradient(circle at 50% 40%, ${C.goldBright}, ${C.gold} 60%, transparent 74%)`,
          transform: `rotate(${rot}deg)`,
          opacity,
        }}
      />
    );
  });
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{flecks}</AbsoluteFill>;
};

/* ---------- Reveal + layout ---------- */

/** Fades + lifts a block in, holds, then fades out near the scene's end. */
const Reveal: React.FC<{ delay: number; localDur: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  localDur,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const inOpacity = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOpacity = interpolate(frame, [localDur - 16, localDur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(frame, [delay, delay + 22], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(frame, [delay, delay + 22], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: Math.min(inOpacity, outOpacity), transform: `translateY(${ty}px)`, filter: `blur(${blur}px)`, ...style }}>
      {children}
    </div>
  );
};

/** The cream ogee panel centered on the navy ground, with copy laid over it. */
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 600, height: 940 }}>
      <ArchPanel />
      <ApexFloret />
      <div
        style={{
          position: "absolute",
          top: 196,
          left: 64,
          right: 64,
          bottom: 76,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  </AbsoluteFill>
);

const kicker: React.CSSProperties = {
  fontSize: 24,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: C.goldDeep,
  fontFamily: THEME.fonts.body,
  fontWeight: 600,
  margin: "10px 0",
};
const arabic: React.CSSProperties = { fontSize: 42, color: C.goldDeep, lineHeight: 1.6, fontFamily: THEME.fonts.arabic, margin: "8px 0" };
const title: React.CSSProperties = { fontSize: 58, lineHeight: 1.1, color: C.goldDeep, fontStyle: "italic", fontFamily: THEME.fonts.display, margin: "6px 0" };
const names: React.CSSProperties = { fontSize: 108, color: C.text, lineHeight: 1.04, fontFamily: THEME.fonts.display, margin: "2px 0" };
const amp: React.CSSProperties = { fontSize: 56, color: C.red, fontStyle: "italic", fontFamily: THEME.fonts.display, margin: "2px 0" };
const date: React.CSSProperties = { fontSize: 46, letterSpacing: "0.12em", color: C.text, fontFamily: THEME.fonts.body, margin: "12px 0 4px" };
const body: React.CSSProperties = { fontSize: 28, lineHeight: 1.62, color: C.text, fontFamily: THEME.fonts.body, margin: "6px 0" };
const venue: React.CSSProperties = { fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", color: C.goldDeep, fontFamily: THEME.fonts.body, fontWeight: 600, margin: "8px 0 0" };
const quote: React.CSSProperties = { fontSize: 27, lineHeight: 1.62, fontStyle: "italic", color: C.text, fontFamily: THEME.fonts.body, margin: "6px 0" };

export const SongketDirajaInvitation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.navy, fontFamily: THEME.fonts.body }}>
      {/* 01 — Pembuka */}
      <Sequence from={SCENES.opening.from} durationInFrames={SCENES.opening.dur}>
        <Background localDur={SCENES.opening.dur} />
        <Birds style={{ position: "absolute", top: "11%", left: "12%" }} />
        <Perahu style={{ position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)", opacity: 0.5 }} />
        <FloralSpray style={{ position: "absolute", left: -12, bottom: 18 }} />
        <Frame>
          <Reveal delay={6} localDur={SCENES.opening.dur} style={arabic}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </Reveal>
          <Reveal delay={14} localDur={SCENES.opening.dur} style={kicker}>
            Walimatul Urus
          </Reveal>
          <Reveal delay={22} localDur={SCENES.opening.dur}>
            <Filigree />
          </Reveal>
          <Reveal delay={30} localDur={SCENES.opening.dur} style={title}>
            Dengan penuh kesyukuran
          </Reveal>
          <Reveal delay={40} localDur={SCENES.opening.dur} style={body}>
            Bismillah, kami mempersembahkan sebuah jemputan dari hati — bermula dengan doa, diteruskan dengan kasih.
          </Reveal>
        </Frame>
      </Sequence>

      {/* 02 — Nama */}
      <Sequence from={SCENES.names.from} durationInFrames={SCENES.names.dur}>
        <Background localDur={SCENES.names.dur} />
        <FloralSpray style={{ position: "absolute", left: -12, bottom: 18 }} />
        <FloralSpray style={{ position: "absolute", right: -12, top: 40, transform: "scaleX(-1)" }} />
        <Frame>
          <Reveal delay={6} localDur={SCENES.names.dur} style={kicker}>
            The Wedding Of
          </Reveal>
          <Reveal delay={14} localDur={SCENES.names.dur} style={names}>
            Aulia
          </Reveal>
          <Reveal delay={20} localDur={SCENES.names.dur} style={amp}>
            &amp;
          </Reveal>
          <Reveal delay={26} localDur={SCENES.names.dur} style={names}>
            Hilmi
          </Reveal>
          <Reveal delay={34} localDur={SCENES.names.dur}>
            <Filigree />
          </Reveal>
          <Reveal delay={40} localDur={SCENES.names.dur} style={date}>
            24 &nbsp;|&nbsp; 05 &nbsp;|&nbsp; 26
          </Reveal>
          <Reveal delay={48} localDur={SCENES.names.dur} style={{ ...body, color: C.muted }}>
            Sabtu &middot; Bersamaan 7 Zulkaedah 1447H
          </Reveal>
          <Reveal delay={56} localDur={SCENES.names.dur} style={venue}>
            The Warisan Hall &middot; Kuala Lumpur
          </Reveal>
        </Frame>
      </Sequence>

      {/* 03 — Akad Nikah */}
      <Sequence from={SCENES.akad.from} durationInFrames={SCENES.akad.dur}>
        <Background localDur={SCENES.akad.dur} />
        <FloralSpray style={{ position: "absolute", right: -12, top: 40, transform: "scaleX(-1)" }} />
        <Frame>
          <Reveal delay={8} localDur={SCENES.akad.dur} style={kicker}>
            Akad Nikah
          </Reveal>
          <Reveal delay={20} localDur={SCENES.akad.dur} style={arabic}>
            وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </Reveal>
          <Reveal delay={34} localDur={SCENES.akad.dur} style={{ ...quote, marginTop: 14 }}>
            “Dan Dia menjadikan di antara kamu rasa kasih sayang dan belas kasihan.”
            <br />
            <span style={{ color: C.muted }}>Ar-Rum: 21</span>
          </Reveal>
          <Reveal delay={50} localDur={SCENES.akad.dur}>
            <Filigree />
          </Reveal>
          <Reveal delay={60} localDur={SCENES.akad.dur} style={body}>
            Pada saat lafaz akad disempurnakan, dua hati dipersatukan dalam amanah, kasih sayang dan rahmat-Nya.
          </Reveal>
        </Frame>
      </Sequence>

      {/* 04 — Aturcara Majlis */}
      <Sequence from={SCENES.aturcara.from} durationInFrames={SCENES.aturcara.dur}>
        <Background localDur={SCENES.aturcara.dur} />
        <FloralSpray style={{ position: "absolute", left: -12, bottom: 18 }} />
        <Frame>
          <Reveal delay={6} localDur={SCENES.aturcara.dur} style={{ ...kicker, marginBottom: 16 }}>
            Aturcara Majlis
          </Reveal>
          {[
            ["11:00 pagi", "Ketibaan para tetamu"],
            ["12:30 t/hari", "Majlis akad nikah"],
            ["1:00 petang", "Jamuan & majlis bersanding"],
            ["4:00 petang", "Majlis bersurai"],
          ].map(([t, l], i) => (
            <Reveal
              key={t}
              delay={16 + i * 8}
              localDur={SCENES.aturcara.dur}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 14,
                width: "100%",
                border: "1px solid rgba(154,115,37,.32)",
                borderRadius: 16,
                background: "rgba(255,255,255,.4)",
                padding: "13px 18px",
                marginBottom: 12,
              }}
            >
              <span style={{ fontFamily: THEME.fonts.display, fontSize: 26, color: C.red, whiteSpace: "nowrap" }}>{t}</span>
              <span style={{ fontFamily: THEME.fonts.body, fontSize: 24, color: C.text }}>{l}</span>
            </Reveal>
          ))}
        </Frame>
      </Sequence>

      {/* 05 — Lokasi Majlis */}
      <Sequence from={SCENES.location.from} durationInFrames={SCENES.location.dur}>
        <Background localDur={SCENES.location.dur} />
        <Mosque style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", opacity: 0.16 }} />
        <FloralSpray style={{ position: "absolute", left: -12, bottom: 18 }} />
        <Frame>
          <Reveal delay={6} localDur={SCENES.location.dur} style={kicker}>
            Lokasi Majlis
          </Reveal>
          <Reveal delay={14} localDur={SCENES.location.dur} style={title}>
            The Warisan Hall
          </Reveal>
          <Reveal delay={22} localDur={SCENES.location.dur} style={venue}>
            Kuala Lumpur
          </Reveal>
          <Reveal delay={30} localDur={SCENES.location.dur}>
            <Filigree />
          </Reveal>
          <Reveal delay={38} localDur={SCENES.location.dur} style={body}>
            Majlis diadakan di dewan utama yang bersuasana warisan dan elegan.
          </Reveal>
        </Frame>
      </Sequence>

      {/* 06 — RSVP + Doa */}
      <Sequence from={SCENES.rsvp.from} durationInFrames={SCENES.rsvp.dur}>
        <Background localDur={SCENES.rsvp.dur} />
        <FloralSpray style={{ position: "absolute", right: -12, top: 40, transform: "scaleX(-1)" }} />
        <Frame>
          <Reveal delay={6} localDur={SCENES.rsvp.dur} style={kicker}>
            Sila Sahkan Kehadiran
          </Reveal>
          <Reveal delay={16} localDur={SCENES.rsvp.dur} style={{ ...title, fontSize: 52, fontStyle: "normal", color: C.text }}>
            Aulia &amp; Hilmi
          </Reveal>
          <Reveal delay={26} localDur={SCENES.rsvp.dur}>
            <Filigree />
          </Reveal>
          <Reveal delay={34} localDur={SCENES.rsvp.dur} style={body}>
            Imbas QR pada kad jemputan untuk RSVP sebelum 1 April 2026.
          </Reveal>
          <Reveal delay={46} localDur={SCENES.rsvp.dur} style={{ ...quote, marginTop: 16 }}>
            Ya Allah, jadikanlah rumah tangga kami sakinah, mawaddah, warahmah.
          </Reveal>
          <Reveal delay={58} localDur={SCENES.rsvp.dur} style={venue}>
            Kehadiran &amp; doa restu amat kami hargai
          </Reveal>
        </Frame>
      </Sequence>

      {/* Gold flecks drift over the whole timeline */}
      <Sequence from={0} durationInFrames={SONGKET_DIRAJA_DURATION}>
        <GoldFlecks count={18} seed="diraja" />
      </Sequence>
    </AbsoluteFill>
  );
};
