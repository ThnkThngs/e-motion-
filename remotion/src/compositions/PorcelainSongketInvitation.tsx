import {
  AbsoluteFill,
  Sequence,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { themes } from "../themes";
import { Petals } from "../components/Petals";

// Bespoke Porcelain Songket video invitation (Aulia & Hilmi).
//
// An 18s / 540-frame @30fps timeline mirroring the package storyboard's six
// scenes. Scene backgrounds prefer the Higgsfield AI clips
// (public/porcelain-songket/video/*) and fall back to the static scene JPEGs
// when a clip is absent — flip `video` on a scene once its clip is generated.
//
// Self-contained (no InvitationProps) because the copy + verse are specific to
// this couple; the generic, data-driven porcelain template is PorcelainInvitation.

const THEME = themes["porcelain-songket"];
const C = {
  ivory: "#FFFAF4",
  blue: "#214770",
  copper: "#B25F50",
  ink: "#2D333F",
};

export const PORCELAIN_FPS = 30;
export const PORCELAIN_DURATION = 540;

// Scene timeline (frames). 90 90 120 90 75 75 = 540.
const SCENES = {
  opening: { from: 0, dur: 90, image: "opening_names.jpg", video: undefined as string | undefined },
  names: { from: 90, dur: 90, image: "opening_names.jpg", video: undefined as string | undefined },
  akad: { from: 180, dur: 120, image: "akad.jpg", video: undefined as string | undefined },
  promises: { from: 300, dur: 90, image: "promises.jpg", video: undefined as string | undefined },
  location: { from: 390, dur: 75, image: "location_rsvp.jpg", video: undefined as string | undefined },
  rsvp: { from: 465, dur: 75, image: "location_rsvp.jpg", video: undefined as string | undefined },
};

const asset = (name: string) => staticFile(`porcelain-songket/${name}`);

/** Background image or AI clip, with a slow ken-burns drift + porcelain veil + songket weave. */
const SceneBg: React.FC<{ image: string; video?: string; localDur: number }> = ({ image, video, localDur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, localDur], [1.06, 1.13], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, localDur], [0, -14], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${y}px)` }}>
        {video ? (
          <OffthreadVideo src={asset(video)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Img src={asset(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </AbsoluteFill>
      {/* subtle songket weave */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${asset("subtle_songket_overlay.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.16,
          mixBlendMode: "multiply",
        }}
      />
      {/* porcelain veil */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 24%, rgba(255,255,255,.74), rgba(255,255,255,.4) 40%, rgba(255,255,255,.06) 82%)",
        }}
      />
    </AbsoluteFill>
  );
};

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
  const ty = interpolate(frame, [delay, delay + 22], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(frame, [delay, delay + 22], [4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: Math.min(inOpacity, outOpacity),
        transform: `translateY(${ty}px)`,
        filter: `blur(${blur}px)`,
        textShadow: "0 1px 0 #fff",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// The scene JPEGs carry the design's own baked-in typography; the porcelain
// panel (same treatment as the scroll page) sits behind the live copy so the
// two don't double-expose.
const Copy: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 44px", textAlign: "center", ...style }}>
    <div
      style={{
        width: "100%",
        background: "rgba(255,250,244,0.86)",
        border: "1px solid rgba(178,95,80,0.25)",
        borderRadius: 44,
        padding: "52px 36px",
        boxShadow: "0 24px 60px rgba(33,71,112,0.10)",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

const kicker: React.CSSProperties = {
  fontSize: 22,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: C.blue,
  fontFamily: THEME.fonts.body,
  margin: "14px 0",
};
const arabic: React.CSSProperties = { fontSize: 34, color: C.blue, lineHeight: 1.5, fontFamily: THEME.fonts.arabic };
const title: React.CSSProperties = { fontSize: 78, lineHeight: 1.04, color: C.copper, fontStyle: "italic", fontFamily: THEME.fonts.display };
const names: React.CSSProperties = { fontSize: 96, letterSpacing: "0.16em", color: C.blue, lineHeight: 1.2, fontFamily: THEME.fonts.display };
const body: React.CSSProperties = { fontSize: 26, lineHeight: 1.6, color: C.ink, fontFamily: THEME.fonts.body };

export const PorcelainSongketInvitation: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.ivory, fontFamily: THEME.fonts.body }}>
      {/* Petals drift across the whole timeline */}
      <Sequence from={0} durationInFrames={PORCELAIN_DURATION}>
        <Petals count={20} seed="porcelain" />
      </Sequence>

      {/* 01 — The Beginning */}
      <Sequence from={SCENES.opening.from} durationInFrames={SCENES.opening.dur}>
        <SceneBg {...SCENES.opening} localDur={SCENES.opening.dur} />
        <Copy>
          <Reveal delay={6} localDur={SCENES.opening.dur} style={arabic}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </Reveal>
          <Reveal delay={14} localDur={SCENES.opening.dur} style={kicker}>
            Walimatul Urus
          </Reveal>
          <Reveal delay={22} localDur={SCENES.opening.dur} style={title}>
            Dari Akad
          </Reveal>
          <Reveal delay={30} localDur={SCENES.opening.dur} style={{ ...title, color: C.blue }}>
            ke Janji
          </Reveal>
        </Copy>
      </Sequence>

      {/* 02 — The Names */}
      <Sequence from={SCENES.names.from} durationInFrames={SCENES.names.dur}>
        <SceneBg {...SCENES.names} localDur={SCENES.names.dur} />
        <Copy>
          <Reveal delay={6} localDur={SCENES.names.dur} style={kicker}>
            The Wedding of
          </Reveal>
          <Reveal delay={14} localDur={SCENES.names.dur} style={names}>
            AULIA
          </Reveal>
          <Reveal delay={20} localDur={SCENES.names.dur} style={{ fontSize: 48, color: C.copper, fontStyle: "italic", fontFamily: THEME.fonts.display }}>
            &amp;
          </Reveal>
          <Reveal delay={26} localDur={SCENES.names.dur} style={names}>
            HILMI
          </Reveal>
          <Reveal delay={36} localDur={SCENES.names.dur} style={{ ...kicker, color: C.copper }}>
            Sabtu • 24 | 05 | 2026
          </Reveal>
          <Reveal delay={44} localDur={SCENES.names.dur} style={body}>
            Bersamaan 7 Zulkaedah 1447H
          </Reveal>
        </Copy>
      </Sequence>

      {/* 03 — Akad Nikah */}
      <Sequence from={SCENES.akad.from} durationInFrames={SCENES.akad.dur}>
        <SceneBg {...SCENES.akad} localDur={SCENES.akad.dur} />
        <Copy>
          <Reveal delay={8} localDur={SCENES.akad.dur} style={kicker}>
            Akad Nikah
          </Reveal>
          <Reveal delay={20} localDur={SCENES.akad.dur} style={{ ...arabic, color: C.copper }}>
            وَجَعَلْنَا بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </Reveal>
          <Reveal delay={34} localDur={SCENES.akad.dur} style={{ ...body, fontStyle: "italic", marginTop: 18 }}>
            “Dan Kami jadikan di antara kamu kasih sayang dan rahmat.”
            <br />
            Ar-Rum: 21
          </Reveal>
          <Reveal delay={52} localDur={SCENES.akad.dur} style={{ ...body, marginTop: 26 }}>
            Di saat lafaz akad disempurnakan, dua hati dipertemukan dalam amanah, kasih sayang dan rahmat-Nya.
          </Reveal>
        </Copy>
      </Sequence>

      {/* 04 — Janji Suami Isteri */}
      <Sequence from={SCENES.promises.from} durationInFrames={SCENES.promises.dur}>
        <SceneBg {...SCENES.promises} localDur={SCENES.promises.dur} />
        <Copy style={{ padding: "0 48px" }}>
          <Reveal delay={6} localDur={SCENES.promises.dur} style={{ ...kicker, marginBottom: 18 }}>
            Janji Sepasang Suami Isteri
          </Reveal>
          {[
            ["Saling Mencintai", "Mencintai dengan penuh keikhlasan."],
            ["Saling Melindungi", "Menjaga satu sama lain dalam setiap keadaan."],
            ["Saling Menyokong", "Menyokong impian bersama menuju kebaikan."],
            ["Saling Mendoakan", "Mendoakan kebaikan dunia dan akhirat."],
          ].map(([h, p], i) => (
            <Reveal
              key={h}
              delay={16 + i * 8}
              localDur={SCENES.promises.dur}
              style={{
                background: "rgba(255,255,255,.7)",
                border: "1px solid rgba(33,71,112,.18)",
                borderRadius: 24,
                padding: "16px 20px",
                marginBottom: 12,
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 22, textTransform: "uppercase", letterSpacing: "0.12em", color: C.blue, fontFamily: THEME.fonts.body }}>
                {h}
              </div>
              <div style={{ fontSize: 20, color: C.ink, marginTop: 4, fontFamily: THEME.fonts.body }}>{p}</div>
            </Reveal>
          ))}
        </Copy>
      </Sequence>

      {/* 05 — Lokasi Majlis */}
      <Sequence from={SCENES.location.from} durationInFrames={SCENES.location.dur}>
        <SceneBg {...SCENES.location} localDur={SCENES.location.dur} />
        <Copy>
          <Reveal delay={6} localDur={SCENES.location.dur} style={kicker}>
            Lokasi Majlis
          </Reveal>
          <Reveal delay={14} localDur={SCENES.location.dur} style={{ ...title, fontSize: 56 }}>
            The Warisan Hall
          </Reveal>
          <Reveal delay={22} localDur={SCENES.location.dur} style={kicker}>
            Kuala Lumpur
          </Reveal>
          <Reveal delay={30} localDur={SCENES.location.dur} style={body}>
            Majlis diadakan di dewan utama dengan suasana warisan dan elegan.
          </Reveal>
        </Copy>
      </Sequence>

      {/* 06 — RSVP + Doa */}
      <Sequence from={SCENES.rsvp.from} durationInFrames={SCENES.rsvp.dur}>
        <SceneBg {...SCENES.rsvp} localDur={SCENES.rsvp.dur} />
        <Copy>
          <Reveal delay={6} localDur={SCENES.rsvp.dur} style={kicker}>
            Sila Sahkan Kehadiran
          </Reveal>
          <Reveal delay={14} localDur={SCENES.rsvp.dur} style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <Img
              src={asset("qr_placeholder.png")}
              style={{ width: 168, height: 168, padding: 10, background: "#fff", borderRadius: 10, boxShadow: "0 0 0 1px rgba(33,71,112,.4)" }}
            />
          </Reveal>
          <Reveal delay={22} localDur={SCENES.rsvp.dur} style={body}>
            Imbas QR untuk RSVP sebelum 1 April 2026
          </Reveal>
          <Reveal delay={34} localDur={SCENES.rsvp.dur} style={{ ...body, fontStyle: "italic", marginTop: 20 }}>
            Ya Allah, jadikanlah rumah tangga kami sakinah, mawaddah, warahmah.
          </Reveal>
          <Reveal delay={46} localDur={SCENES.rsvp.dur} style={{ ...kicker, color: C.copper, marginTop: 18 }}>
            Kehadiran anda amat kami hargai
          </Reveal>
        </Copy>
      </Sequence>
    </AbsoluteFill>
  );
};
