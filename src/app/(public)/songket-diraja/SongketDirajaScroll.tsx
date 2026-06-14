"use client";

// Songket Diraja — standalone scroll invitation (Aulia & Hilmi).
//
// A bespoke "royal" synthesis of the six reference panels: deep navy ground,
// woven gold songket bands, a cream ogee/mihrab panel framed in gold hairline,
// red-and-cream floral corner sprays, gold filigree, drifting birds, a faded
// mosque silhouette and a gilded perahu. All ornaments are hand-authored inline
// SVG (no raster assets) so the page is fully self-contained and crisp at any
// size. Reveal + active-scene tracking use an IntersectionObserver, robust
// inside a scroll-snap overflow container.

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./songket-diraja.module.css";

const VENUE_QUERY = "The Warisan Hall Kuala Lumpur";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`;
const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(VENUE_QUERY)}`;
const RSVP_URL = "https://e-motion.my/rsvp/aulia-hilmi";

const SCENE_COUNT = 6;

type Style = React.CSSProperties & Record<string, string | number>;

/* ---------- Inline SVG ornaments ---------- */

// Cream ogee/mihrab panel. preserveAspectRatio="none" lets it stretch to the
// copy column; non-scaling strokes keep the gold hairline uniform.
function ArchFrame() {
  const outline = "M14 432 L14 168 C14 92 86 96 150 18 C214 96 286 92 286 168 L286 432 Z";
  const inner = "M27 421 L27 173 C27 106 90 110 150 38 C210 110 273 106 273 173 L273 421 Z";
  return (
    <svg className={styles.arch} viewBox="0 0 300 440" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="sdCream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf7e9" />
          <stop offset="0.55" stopColor="#fbf3df" />
          <stop offset="1" stopColor="#f1e3bf" />
        </linearGradient>
      </defs>
      <path d={outline} fill="url(#sdCream)" />
      <path d={outline} fill="none" stroke="#c9a24a" strokeWidth="6" opacity="0.16" vectorEffect="non-scaling-stroke" />
      <path d={outline} fill="none" stroke="#b78f33" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d={inner} fill="none" stroke="#c9a24a" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Gold quatrefoil floret for the arch apex.
function ApexFloret() {
  return (
    <svg className={styles.apex} viewBox="0 0 30 30" aria-hidden>
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
      fill="url(#sdLeaf)"
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

// Corner floral spray — red + cream blossoms with gilded leaves.
function FloralSpray({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 180 230" aria-hidden>
      <defs>
        <linearGradient id="sdLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6c878" />
          <stop offset="1" stopColor="#9a7325" />
        </linearGradient>
      </defs>
      {/* leaves (behind) */}
      <Leaf x={70} y={206} r={-12} />
      <Leaf x={48} y={196} r={-46} />
      <Leaf x={96} y={188} r={18} />
      <Leaf x={120} y={150} r={36} />
      <Leaf x={34} y={150} r={-72} />
      <Leaf x={104} y={104} r={8} />
      {/* gilded stem */}
      <path d="M70 214 C 60 170 70 130 104 96" fill="none" stroke="#9a7325" strokeWidth="2.2" opacity="0.8" />
      {/* blossoms */}
      <Blossom x={66} y={170} s={34} petal="#a8392e" />
      <Blossom x={112} y={120} s={26} petal="#fbf3df" />
      <Blossom x={40} y={120} s={18} petal="#c0463a" />
      <Blossom x={120} y={186} s={15} petal="#fdf7e9" />
    </svg>
  );
}

function Filigree() {
  return (
    <svg className={styles.rule} viewBox="0 0 132 16" aria-hidden>
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

function Birds() {
  const bird = (x: number, y: number, sc: number, op: number) => (
    <path
      d="M0 10 Q7 2 14 10 Q21 2 28 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      transform={`translate(${x} ${y}) scale(${sc})`}
      opacity={op}
    />
  );
  return (
    <svg className={styles.birds} viewBox="0 0 96 56" aria-hidden>
      {bird(2, 6, 1, 0.9)}
      {bird(40, 0, 0.8, 0.75)}
      {bird(30, 28, 1.1, 0.85)}
      {bird(66, 20, 0.7, 0.6)}
    </svg>
  );
}

function Mosque() {
  return (
    <svg className={styles.mosque} viewBox="0 0 400 200" aria-hidden>
      <g fill="currentColor">
        {/* minarets */}
        <rect x="60" y="96" width="14" height="104" />
        <path d="M67 96 Q56 78 67 64 Q78 78 67 96 Z" />
        <rect x="326" y="96" width="14" height="104" />
        <path d="M333 96 Q322 78 333 64 Q344 78 333 96 Z" />
        {/* flanking small domes */}
        <path d="M120 200 L120 150 L160 150 L160 200 Z" />
        <path d="M120 150 Q120 122 140 116 Q160 122 160 150 Z" />
        <path d="M240 200 L240 150 L280 150 L280 200 Z" />
        <path d="M240 150 Q240 122 260 116 Q280 122 280 150 Z" />
        {/* central dome */}
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
    <svg viewBox="0 0 160 116" style={style} aria-hidden>
      <g fill="#c9a24a" stroke="#9a7325" strokeWidth="1.2">
        {/* sails */}
        <path d="M78 14 L78 78 L30 78 Z" />
        <path d="M86 30 L86 78 L124 78 Z" />
        {/* hull */}
        <path d="M18 82 Q80 100 142 82 L126 96 Q80 110 34 96 Z" />
      </g>
      <g fill="none" stroke="#c9a24a" strokeWidth="1.6" opacity="0.7">
        <path d="M6 104 Q26 96 46 104 T86 104 T126 104 T160 104" />
      </g>
    </svg>
  );
}

/* ---------- Falling gold flecks ---------- */
function FleckLayer({ seed }: { seed: number }) {
  const flecks = Array.from({ length: 20 }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin(seed * 100 + i * 13 + n * 7) * 10000;
      return x - Math.floor(x);
    };
    const style: Style = {
      left: `${(r(1) * 100).toFixed(2)}%`,
      top: `${(-20 - r(2) * 50).toFixed(2)}%`,
      animationDuration: `${(8 + r(3) * 7).toFixed(2)}s`,
      animationDelay: `${(-r(4) * 9).toFixed(2)}s`,
      opacity: (0.4 + r(5) * 0.45).toFixed(2),
      transform: `rotate(45deg) scale(${(0.6 + r(6) * 0.9).toFixed(2)})`,
    };
    return <i key={i} className={styles.fleck} style={style} aria-hidden />;
  });
  return <div className={styles.fleckLayer}>{flecks}</div>;
}

function m(delay: number): Style {
  return { ["--delay"]: `${delay}ms` };
}

export default function SongketDirajaScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showCue, setShowCue] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    // Track every scene's latest ratio and activate the global max — deciding
    // from a single callback's entries is order-dependent and can revert state.
    const ratios = new Map<number, number>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(Number((e.target as HTMLElement).dataset.step), e.intersectionRatio);
        }
        let bestIdx = 0;
        let bestRatio = -1;
        ratios.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = idx;
          }
        });
        setActive(bestIdx);
        if (bestIdx > 0) setShowCue(false);
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    scenes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const goTo = (idx: number) => {
    const scene = rootRef.current?.querySelector<HTMLElement>(`[data-step="${idx}"]`);
    scene?.scrollIntoView({ behavior: "smooth" });
  };

  const sceneClass = (step: number) => `${styles.scene} ${active === step ? styles["is-active"] : ""}`;

  return (
    <>
      <div className={styles.progress} role="tablist" aria-label="Bahagian jemputan">
        {Array.from({ length: SCENE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
            aria-label={`Pergi ke bahagian ${i + 1}`}
            aria-selected={i === active}
            role="tab"
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className={styles.root} ref={rootRef}>
        {/* Scene 01 — Pembuka */}
        <section className={sceneClass(0)} data-step={0}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <Birds />
            <FleckLayer seed={0} />
            <Perahu
              style={{
                position: "absolute",
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                opacity: 0.5,
                zIndex: 3,
              }}
            />
            <FloralSpray className={`${styles.floral} ${styles.floralBL}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.arabic} ${styles.motion}`} style={m(240)}>
                  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </div>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(420)}>
                  Walimatul Urus
                </div>
                <span className={styles.motion} style={m(560)}>
                  <Filigree />
                </span>
                <div className={`${styles.title} ${styles.motion}`} style={m(700)}>
                  Dengan penuh kesyukuran
                </div>
                <p className={`${styles.body} ${styles.motion}`} style={m(900)}>
                  Bismillah, kami mempersembahkan sebuah jemputan dari hati — bermula
                  dengan doa, diteruskan dengan kasih.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 02 — Nama (hero) */}
        <section id="nama" className={sceneClass(1)} data-step={1}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <FleckLayer seed={1} />
            <FloralSpray className={`${styles.floral} ${styles.floralBL}`} />
            <FloralSpray className={`${styles.floral} ${styles.floralTR}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                  The Wedding Of
                </div>
                <div className={`${styles.names} ${styles.motion}`} style={m(380)}>
                  Aulia
                </div>
                <div className={`${styles.amp} ${styles.motion}`} style={m(520)}>
                  &amp;
                </div>
                <div className={`${styles.names} ${styles.motion}`} style={m(660)}>
                  Hilmi
                </div>
                <span className={styles.motion} style={m(800)}>
                  <Filigree />
                </span>
                <div className={`${styles.date} ${styles.motion}`} style={m(900)}>
                  24 &nbsp;|&nbsp; 05 &nbsp;|&nbsp; 26
                </div>
                <p className={`${styles.body} ${styles.muted} ${styles.motion}`} style={m(1040)}>
                  Sabtu &middot; Bersamaan 7 Zulkaedah 1447H
                </p>
                <div className={`${styles.venue} ${styles.motion}`} style={m(1180)}>
                  The Warisan Hall &middot; Kuala Lumpur
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 03 — Akad Nikah */}
        <section className={sceneClass(2)} data-step={2}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <FleckLayer seed={2} />
            <FloralSpray className={`${styles.floral} ${styles.floralTR}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                  Akad Nikah
                </div>
                <div className={`${styles.arabic} ${styles.motion}`} style={m(380)}>
                  وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </div>
                <p className={`${styles.quote} ${styles.motion}`} style={m(560)}>
                  &ldquo;Dan Dia menjadikan di antara kamu rasa kasih sayang dan
                  belas kasihan.&rdquo;
                  <br />
                  <span className={styles.muted}>Ar-Rum: 21</span>
                </p>
                <span className={styles.motion} style={m(740)}>
                  <Filigree />
                </span>
                <p className={`${styles.body} ${styles.motion}`} style={m(880)}>
                  Pada saat lafaz akad disempurnakan, dua hati dipersatukan dalam
                  amanah, kasih sayang dan rahmat-Nya.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 04 — Aturcara Majlis */}
        <section className={sceneClass(3)} data-step={3}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <FleckLayer seed={3} />
            <FloralSpray className={`${styles.floral} ${styles.floralBL}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                  Aturcara Majlis
                </div>
                <div className={styles.agenda}>
                  {[
                    ["11:00 pagi", "Ketibaan para tetamu"],
                    ["12:30 t/hari", "Majlis akad nikah"],
                    ["1:00 petang", "Jamuan & majlis bersanding"],
                    ["4:00 petang", "Majlis bersurai"],
                  ].map(([t, l], i) => (
                    <div key={t} className={`${styles.slot} ${styles.motion}`} style={m(360 + i * 150)}>
                      <span className={styles.slotTime}>{t}</span>
                      <span className={styles.slotLabel}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 05 — Lokasi Majlis */}
        <section className={sceneClass(4)} data-step={4}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <Mosque />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <FleckLayer seed={4} />
            <FloralSpray className={`${styles.floral} ${styles.floralBL}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                  Lokasi Majlis
                </div>
                <div className={`${styles.title} ${styles.motion}`} style={m(360)}>
                  The Warisan Hall
                </div>
                <div className={`${styles.venue} ${styles.motion}`} style={m(500)}>
                  Kuala Lumpur
                </div>
                <span className={styles.motion} style={m(620)}>
                  <Filigree />
                </span>
                <p className={`${styles.body} ${styles.motion}`} style={m(740)}>
                  Klik untuk membuka arah ke dewan utama yang bersuasana warisan dan
                  elegan.
                </p>
                <div className={`${styles.buttons} ${styles.motion}`} style={m(900)}>
                  <a className={styles.btn} href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                    Google Maps
                  </a>
                  <a className={`${styles.btn} ${styles.btnGold}`} href={WAZE_URL} target="_blank" rel="noopener noreferrer">
                    Waze
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 06 — RSVP + Doa */}
        <section className={sceneClass(5)} data-step={5}>
          <div className={styles.stage}>
            <div className={styles.bg} />
            <div className={styles.songket} />
            <div className={`${styles.band} ${styles.bandTop}`} />
            <div className={`${styles.band} ${styles.bandBottom}`} />
            <FleckLayer seed={5} />
            <FloralSpray className={`${styles.floral} ${styles.floralTR}`} />
            <div className={styles.frame}>
              <ArchFrame />
              <ApexFloret />
              <div className={styles.copy}>
                <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                  Sila Sahkan Kehadiran
                </div>
                <div className={`${styles.qr} ${styles.motion}`} style={m(360)}>
                  <QRCodeSVG value={RSVP_URL} size={120} bgColor="#ffffff" fgColor="#14304f" level="M" />
                </div>
                <p className={`${styles.body} ${styles.motion}`} style={m(520)}>
                  Imbas QR untuk RSVP sebelum 1 April 2026
                </p>
                <div className={`${styles.buttons} ${styles.motion}`} style={m(660)}>
                  <a className={styles.btn} href={RSVP_URL} target="_blank" rel="noopener noreferrer">
                    RSVP
                  </a>
                  <a className={`${styles.btn} ${styles.btnGold}`} href="#doa">
                    Doa Restu
                  </a>
                </div>
                <span className={styles.motion} style={m(820)}>
                  <Filigree />
                </span>
                <p id="doa" className={`${styles.quote} ${styles.motion}`} style={m(940)}>
                  Ya Allah, jadikanlah rumah tangga kami sakinah, mawaddah,
                  warahmah.
                </p>
                <div className={`${styles.venue} ${styles.motion}`} style={m(1080)}>
                  Kehadiran &amp; doa restu amat kami hargai
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showCue && <div className={styles.cue}>Tatal kisah jemputan</div>}
    </>
  );
}
