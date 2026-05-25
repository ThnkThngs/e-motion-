"use client";

import { useMemo } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { Html } from "./Html";

// Deterministic seeded random so SSR + client render the same particle layout.
const rand = (i: number) => {
  const x = Math.sin(i * 9281.7) * 10000;
  return x - Math.floor(x);
};

const PetalRain = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: `${rand(i + 1) * 100}%`,
        animationDuration: `${4 + rand(i + 2) * 4}s`,
        animationDelay: `${rand(i + 3) * 5}s`,
        background: i % 2 ? "var(--gold-light)" : "var(--rose)",
      })),
    [],
  );
  return (
    <div className="ep-petal" aria-hidden="true">
      {petals.map((p, i) => (
        <span key={i} className="petal" style={p} />
      ))}
    </div>
  );
};

const BokehOrbs = () => {
  const orbs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        width: `${20 + rand(i + 1) * 24}px`,
        height: `${20 + rand(i + 1) * 24}px`,
        top: `${rand(i + 2) * 80}%`,
        left: `${rand(i + 3) * 80}%`,
        animationDuration: `${4 + rand(i + 4) * 4}s`,
        animationDelay: `${rand(i + 5) * 4}s`,
        background: `radial-gradient(circle, rgba(232,199,117,${0.35 + rand(i + 6) * 0.4}) 0%, transparent 70%)`,
      })),
    [],
  );
  return (
    <div className="ep-bokeh" aria-hidden="true">
      {orbs.map((o, i) => (
        <span key={i} className="orb" style={o} />
      ))}
    </div>
  );
};

const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const tx = (rand(i + 1) - 0.5) * 200;
        const ty = 60 + rand(i + 2) * 60;
        const tr = (rand(i + 3) - 0.5) * 720;
        return {
          left: `${rand(i + 4) * 100}%`,
          top: `${20 + rand(i + 5) * 30}%`,
          background: i % 3 === 0 ? "var(--rose)" : i % 3 === 1 ? "var(--gold-light)" : "var(--gold)",
          animationDelay: `${rand(i + 6) * 2}s`,
          ["--tx" as string]: `${tx}px`,
          ["--ty" as string]: `${ty}px`,
          ["--tr" as string]: `${tr}deg`,
        } as React.CSSProperties;
      }),
    [],
  );
  return (
    <div className="ep-conf" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} className="piece" style={p} />
      ))}
    </div>
  );
};

export const EffectsSection = () => {
  const { t } = useWarisanLang();

  return (
    <section className="warisan-section songket-section" id="effects">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-label reveal-3d">{t("sec.effects")}</div>
          <Html
            as="h2"
            className="section-title reveal-3d reveal-d1"
            html={t("effects.title")}
          />
          <p className="section-sub reveal-3d reveal-d2">{t("effects.sub")}</p>
        </div>

        <div className="effects-grid">
          <div className="effect-card reveal-3d">
            <div className="effect-corner" />
            <div className="effect-num">/01</div>
            <div className="effect-preview"><PetalRain /></div>
            <div className="effect-name">{t("fx1.n")}</div>
            <p className="effect-desc">{t("fx1.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d1">
            <div className="effect-corner" />
            <div className="effect-num">/02</div>
            <div className="effect-preview">
              <div className="ep-cine">
                <span>Farah</span>
                <span>&amp;</span>
                <span>Adam</span>
              </div>
            </div>
            <div className="effect-name">{t("fx2.n")}</div>
            <p className="effect-desc">{t("fx2.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d2">
            <div className="effect-corner" />
            <div className="effect-num">/03</div>
            <div className="effect-preview"><BokehOrbs /></div>
            <div className="effect-name">{t("fx3.n")}</div>
            <p className="effect-desc">{t("fx3.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d3">
            <div className="effect-corner" />
            <div className="effect-num">/04</div>
            <div className="effect-preview">
              <div className="ep-ink">بسم الله الرحمن الرحيم</div>
            </div>
            <div className="effect-name">{t("fx4.n")}</div>
            <p className="effect-desc">{t("fx4.d")}</p>
          </div>

          <div className="effect-card reveal-3d">
            <div className="effect-corner" />
            <div className="effect-num">/05</div>
            <div className="effect-preview">
              <div className="ep-geo">
                <span className="ep-geo-l gt" />
                <span className="ep-geo-l gr" />
                <span className="ep-geo-l gb" />
                <span className="ep-geo-l gl" />
                <span className="ep-geo-txt">Farah &amp; Adam</span>
              </div>
            </div>
            <div className="effect-name">{t("fx5.n")}</div>
            <p className="effect-desc">{t("fx5.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d1">
            <div className="effect-corner" />
            <div className="effect-num">/06</div>
            <div className="effect-preview">
              <div className="ep-shim">
                <span className="ep-shim-txt">Songket<br />Royal</span>
              </div>
            </div>
            <div className="effect-name">{t("fx6.n")}</div>
            <p className="effect-desc">{t("fx6.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d2">
            <div className="effect-corner" />
            <div className="effect-num">/07</div>
            <div className="effect-preview"><Confetti /></div>
            <div className="effect-name">{t("fx7.n")}</div>
            <p className="effect-desc">{t("fx7.d")}</p>
          </div>

          <div className="effect-card reveal-3d reveal-d3">
            <div className="effect-corner" />
            <div className="effect-num">/08</div>
            <div className="effect-preview">
              <div className="ep-songket" />
            </div>
            <div className="effect-name">{t("fx8.n")}</div>
            <p className="effect-desc">{t("fx8.d")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
