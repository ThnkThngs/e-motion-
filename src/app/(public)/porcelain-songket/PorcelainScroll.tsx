"use client";

// Porcelain Songket — standalone scroll invitation (Aulia & Hilmi).
//
// Faithful port of the package prototype's six scroll-snap scenes, upgraded for
// production: full-viewport scenes, a real RSVP QR (qrcode.react), live Maps /
// Waze deep links, and accessible progress dots. Reveal + active-scene tracking
// use an IntersectionObserver (as the prototype did) — robust inside a
// scroll-snap overflow container, where window-scoped GSAP ScrollTrigger is not.

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "./porcelain.module.css";

const VENUE_QUERY = "The Warisan Hall Kuala Lumpur";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_QUERY)}`;
const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(VENUE_QUERY)}`;
const RSVP_URL = "https://e-motion.my/rsvp/aulia-hilmi";
const PETAL_SRC = ["/porcelain-songket/petal_1.png", "/porcelain-songket/petal_2.png", "/porcelain-songket/petal_3.png"];

const SCENE_COUNT = 6;

type PetalStyle = React.CSSProperties & Record<string, string | number>;

function PetalLayer({ seed }: { seed: number }) {
  // Deterministic per-scene petals (seeded) so SSR and client markup match.
  const petals = Array.from({ length: 22 }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin((seed * 100 + i * 13 + n * 7)) * 10000;
      return x - Math.floor(x);
    };
    const style: PetalStyle = {
      left: `${(r(1) * 100).toFixed(2)}%`,
      top: `${(-20 - r(2) * 50).toFixed(2)}%`,
      backgroundImage: `url(${PETAL_SRC[i % 3]})`,
      animationDuration: `${(7 + r(3) * 6).toFixed(2)}s`,
      animationDelay: `${(-r(4) * 8).toFixed(2)}s`,
      opacity: (0.35 + r(5) * 0.35).toFixed(2),
    };
    return <i key={i} className={styles.petal} style={style} aria-hidden />;
  });
  return <div className={styles.petalLayer}>{petals}</div>;
}

function m(delay: number): PetalStyle {
  return { ["--delay"]: `${delay}ms` };
}

export default function PorcelainScroll() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showCue, setShowCue] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
    // Track the latest visibility ratio of every scene and activate the global
    // max. Deciding from a single callback's entries is order-dependent: a
    // leaving scene's last entry (ratio just below threshold, isIntersecting
    // still true) can arrive after the entering scene's batch and revert it.
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
    const root = rootRef.current;
    if (!root) return;
    const scene = root.querySelector<HTMLElement>(`[data-step="${idx}"]`);
    scene?.scrollIntoView({ behavior: "smooth" });
  };

  // is-active is driven by state so React owns the className (see observer note).
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
        {/* Scene 01 — The Beginning */}
        <section className={sceneClass(0)} data-step={0}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/opening_names.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowBottom} />
            <PetalLayer seed={0} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "29%", height: "42%", ...m(160) }} />
            <div className={styles.copy} style={{ top: "33%" }}>
              <div className={`${styles.arabic} ${styles.motion}`} style={m(260)}>
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </div>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(420)}>
                Walimatul Urus
              </div>
              <div className={`${styles.title} ${styles.motion}`} style={m(620)}>
                Dari Akad
              </div>
              <div className={`${styles.title} ${styles.titleBlue} ${styles.motion}`} style={m(800)}>
                ke Janji
              </div>
              <p className={`${styles.body} ${styles.motion}`} style={m(1000)}>
                Sebuah undangan yang bermula dengan lafaz, lalu diteruskan dengan doa, janji dan kasih sayang.
              </p>
            </div>
          </div>
        </section>

        {/* Scene 02 — The Names */}
        <section className={sceneClass(1)} data-step={1}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/opening_names.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowTop} />
            <div className={styles.flowBottom} />
            <PetalLayer seed={1} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "23%", height: "50%", ...m(120) }} />
            <div className={styles.copy} style={{ top: "28%" }}>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                The Wedding of
              </div>
              <div className={`${styles.names} ${styles.motion}`} style={m(420)}>
                AULIA
              </div>
              <div className={`${styles.amp} ${styles.motion}`} style={m(560)}>
                &amp;
              </div>
              <div className={`${styles.names} ${styles.motion}`} style={m(700)}>
                HILMI
              </div>
              <div className={`${styles.kicker} ${styles.kickerCopper} ${styles.motion}`} style={m(900)}>
                Sabtu • 24 | 05 | 2026
              </div>
              <p className={`${styles.body} ${styles.motion}`} style={m(1080)}>
                Bersamaan 7 Zulkaedah 1447H
              </p>
            </div>
          </div>
        </section>

        {/* Scene 03 — Akad Nikah */}
        <section className={sceneClass(2)} data-step={2}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/akad.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowTop} />
            <div className={styles.flowBottom} />
            <PetalLayer seed={2} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "16%", height: "66%", ...m(120) }} />
            <div className={styles.copy} style={{ top: "20%" }}>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(260)}>
                Akad Nikah
              </div>
              <div className={`${styles.arabic} ${styles.arabicCopper} ${styles.motion}`} style={m(460)}>
                وَجَعَلْنَا بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </div>
              <p className={`${styles.quote} ${styles.motion}`} style={m(650)}>
                “Dan Kami jadikan di antara kamu kasih sayang dan rahmat.”
                <br />
                Ar-Rum: 21
              </p>
              <p className={`${styles.body} ${styles.motion}`} style={{ marginTop: 24, ...m(870) }}>
                Di saat lafaz akad disempurnakan, dua hati dipertemukan dalam amanah, kasih sayang dan rahmat-Nya.
              </p>
            </div>
          </div>
        </section>

        {/* Scene 04 — Janji Suami Isteri */}
        <section className={sceneClass(3)} data-step={3}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/promises.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowTop} />
            <div className={styles.flowBottom} />
            <PetalLayer seed={3} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "13%", height: "74%", ...m(100) }} />
            <div className={styles.copy} style={{ top: "16%" }}>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(220)}>
                Janji Sepasang Suami Isteri
              </div>
              <div className={styles.promiseGrid}>
                {[
                  ["Saling Mencintai", "Akan mencintai dan menyayangi dengan penuh keikhlasan."],
                  ["Saling Melindungi", "Akan menjaga satu sama lain dalam setiap keadaan."],
                  ["Saling Menyokong", "Akan menyokong impian dan tujuan bersama menuju kebaikan."],
                  ["Saling Mendoakan", "Akan mendoakan kebaikan dunia dan akhirat hingga ke jannah."],
                ].map(([h, p], i) => (
                  <div key={h} className={`${styles.promise} ${styles.motion}`} style={m(390 + i * 170)}>
                    <h3>{h}</h3>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scene 05 — Lokasi Majlis */}
        <section className={sceneClass(4)} data-step={4}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/location_rsvp.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowTop} />
            <div className={styles.flowBottom} />
            <PetalLayer seed={4} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "21%", height: "52%", ...m(120) }} />
            <div className={styles.copy} style={{ top: "27%" }}>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(240)}>
                Lokasi Majlis
              </div>
              <div className={`${styles.title} ${styles.motion}`} style={{ fontSize: 38, ...m(440) }}>
                The Warisan Hall
              </div>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(600)}>
                Kuala Lumpur
              </div>
              <p className={`${styles.body} ${styles.motion}`} style={m(780)}>
                Klik ikon untuk buka peta
              </p>
              <div className={`${styles.buttons} ${styles.motion}`} style={m(960)}>
                <a className={styles.btn} href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  Google Maps
                </a>
                <a className={`${styles.btn} ${styles.btnCopper}`} href={WAZE_URL} target="_blank" rel="noopener noreferrer">
                  Waze
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Scene 06 — RSVP + Doa */}
        <section className={sceneClass(5)} data-step={5}>
          <div className={styles.stage}>
            <div className={styles.bg} style={{ backgroundImage: "url('/porcelain-songket/location_rsvp.jpg')" }} />
            <div className={styles.songket} />
            <div className={styles.veil} />
            <div className={styles.flowTop} />
            <PetalLayer seed={5} />
            <div className={`${styles.panel} ${styles.motion}`} style={{ top: "12%", height: "76%", ...m(120) }} />
            <div className={styles.copy} style={{ top: "16%" }}>
              <div className={`${styles.kicker} ${styles.motion}`} style={m(240)}>
                Sila Sahkan Kehadiran
              </div>
              <div className={`${styles.qr} ${styles.motion}`} style={m(430)}>
                <QRCodeSVG value={RSVP_URL} size={116} bgColor="#ffffff" fgColor="#214770" level="M" />
              </div>
              <p className={`${styles.body} ${styles.motion}`} style={m(620)}>
                Imbas QR untuk RSVP sebelum 1 April 2026
              </p>
              <div className={`${styles.buttons} ${styles.motion}`} style={m(800)}>
                <a className={styles.btn} href={RSVP_URL} target="_blank" rel="noopener noreferrer">
                  RSVP
                </a>
                <a className={`${styles.btn} ${styles.btnCopper}`} href="#doa">
                  Doa Restu
                </a>
              </div>
              <p id="doa" className={`${styles.quote} ${styles.motion}`} style={{ marginTop: 28, ...m(1020) }}>
                Ya Allah, jadikanlah rumah tangga kami sakinah, mawaddah, warahmah.
              </p>
              <div className={`${styles.kicker} ${styles.motion}`} style={{ marginTop: 26, ...m(1220) }}>
                Kehadiran anda amat kami hargai
              </div>
            </div>
          </div>
        </section>
      </div>

      {showCue && <div className={styles.cue}>Scroll the invitation story</div>}
    </>
  );
}
