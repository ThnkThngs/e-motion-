// Warisan Klasik — classical Malay heritage kad jemputan generator.
//
// One pure function, generateWarisanInvitationHtml(data, opts) → a complete,
// fully self-contained HTML document (inline CSS/JS/SVG + base64 fonts, zero
// network requests). The builder's preview iframe and the exported file consume
// the SAME output, so they can never drift.
//
// Design grounded in the e-motion "Warisan Melayu" line: songket gold on a deep
// indigo/emerald/terracotta ground, pucuk rebung / bunga tanjung / awan larat
// motifs (hand-drawn inline SVG), Jawi names in Amiri, ceremonial serif type.

import { WARISAN_FONT_CSS } from "./fonts";

export type WarisanTheme = "indigo" | "emerald" | "terracotta";

export interface WarisanData {
  theme: WarisanTheme;
  header: string; // WALIMATUL URUS
  // Couple
  groomFirst: string;
  groomFull: string;
  groomJawi: string;
  brideFirst: string;
  brideFull: string;
  brideJawi: string;
  // Bismillah
  showBismillah: boolean;
  verse: string; // gloss / verse, one line per row
  // Hosts
  hostIntro: string; // e.g. "Dengan penuh kesyukuran"
  hostLines: string; // parents, one per row
  inviteLine: string; // e.g. "menjemput Dato'/Datin/Tuan/Puan..."
  // Date
  dateBM: string; // Sabtu, 12 Oktober 2026
  dateHijri: string; // 20 Rabiulakhir 1448H
  // Aturcara
  akadTitle: string;
  akadTime: string;
  resepsiTitle: string;
  resepsiTime: string;
  // Venue
  venueName: string;
  venueAddress: string; // one line per row
  mapsUrl: string;
  wazeUrl: string;
  // RSVP / closing
  closingLine: string;
  rsvpUrl: string; // QR target (empty hides QR)
  contacts: string; // "Nama — 01X-XXXXXXX" one per row
  doa: string; // closing prayer, one line per row
}

export const defaultWarisanData: WarisanData = {
  theme: "indigo",
  header: "WALIMATUL URUS",
  groomFirst: "Daniyal",
  groomFull: "Daniyal bin Ahmad Faizal",
  groomJawi: "دانيال",
  brideFirst: "Aisyah",
  brideFull: "Aisyah binti Rahman",
  brideJawi: "عائشة",
  showBismillah: true,
  verse:
    "Dan di antara tanda-tanda kekuasaan-Nya,\nDia menciptakan pasangan untukmu dari jenismu sendiri,\nagar kamu cenderung dan tenteram kepadanya.\n— Ar-Rum 30:21",
  hostIntro: "Dengan penuh kesyukuran",
  hostLines:
    "Tuan Haji Rahman bin Ismail\n&\nPuan Hajjah Siti Fatimah binti Ahmad",
  inviteLine:
    "dengan segala hormatnya menjemput Dato' / Datin / Tuan / Puan / Encik / Cik\nke majlis perkahwinan putera dan puteri kami",
  dateBM: "Sabtu, 12 Oktober 2026",
  dateHijri: "20 Rabiulakhir 1448H",
  akadTitle: "Akad Nikah",
  akadTime: "11:00 pagi",
  resepsiTitle: "Majlis Persandingan",
  resepsiTime: "12:30 tengah hari",
  venueName: "Dewan Perdana Felda",
  venueAddress: "Jalan Gurney, Kuala Lumpur\n54000 Wilayah Persekutuan",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dewan+Perdana+Felda+Kuala+Lumpur",
  wazeUrl: "https://waze.com/ul?q=Dewan%20Perdana%20Felda%20Kuala%20Lumpur",
  closingLine: "Sila datang dan meraikan bersama-sama",
  rsvpUrl: "https://e-motion.my/rsvp/aisyah-daniyal",
  contacts: "Rahman (Bapa) — 012-345 6789\nFatimah (Ibu) — 013-456 7890",
  doa:
    "Ya Allah, berkatilah pernikahan ini,\nhimpunkanlah keduanya dalam kebaikan,\nsakinah, mawaddah wa rahmah.",
};

type ThemeVars = {
  primary: string;
  primaryDeep: string;
  accent: string;
  accentDeep: string;
  accentPale: string;
  secondary: string;
  secondaryDeep: string;
  textOnLight: string;
  name: string;
};

const THEMES: Record<WarisanTheme, ThemeVars> = {
  indigo: {
    primary: "#1B3A52",
    primaryDeep: "#0F2438",
    accent: "#D4AF37",
    accentDeep: "#A8861E",
    accentPale: "#E5C966",
    secondary: "#F5F1E8",
    secondaryDeep: "#EBE3D4",
    textOnLight: "#0F2438",
    name: "Indigo Diraja",
  },
  emerald: {
    primary: "#2D5A4A",
    primaryDeep: "#1A3D30",
    accent: "#D4AF37",
    accentDeep: "#A8861E",
    accentPale: "#E5C966",
    secondary: "#F5F1E8",
    secondaryDeep: "#EBE3D4",
    textOnLight: "#1A3D30",
    name: "Zamrud Tropika",
  },
  terracotta: {
    primary: "#A64D2A",
    primaryDeep: "#7A3318",
    accent: "#D4AF37",
    accentDeep: "#A8861E",
    accentPale: "#E5C966",
    secondary: "#F5F1E8",
    secondaryDeep: "#EBE3D4",
    textOnLight: "#7A3318",
    name: "Terakota Bumi",
  },
};

/* ---------- helpers ---------- */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const rows = (s: string) =>
  String(s ?? "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
const escRows = (s: string) => rows(s).map(esc);

// reveal block with staggered delay
const reveal = (i: number, html: string, cls = "") =>
  `<div class="reveal ${cls}" style="--d:${(i * 0.14).toFixed(2)}s">${html}</div>`;

/* ---------- inline SVG motif sprite ---------- */

const bungaPetals = (cx: number, cy: number, pr: number, pl: number) =>
  Array.from({ length: 8 }, (_, k) =>
    `<ellipse cx="${cx}" cy="${cy - pl}" rx="${pr}" ry="${pl * 0.9}" transform="rotate(${k * 45} ${cx} ${cy})"/>`,
  ).join("");

const SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="wkGold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#E5C966"/><stop offset="0.5" stop-color="#D4AF37"/><stop offset="1" stop-color="#A8861E"/>
  </linearGradient>
  <symbol id="m-rebung" viewBox="0 0 80 112">
    <path d="M40 4 L76 108 H4 Z" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M40 24 L64 102 H16 Z" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M40 46 L54 98 H26 Z" fill="currentColor" opacity="0.55"/>
    <line x1="40" y1="6" x2="40" y2="106" stroke="currentColor" stroke-width="1" opacity="0.6"/>
  </symbol>
  <symbol id="m-bunga" viewBox="0 0 100 100">
    <g fill="currentColor">${bungaPetals(50, 50, 6.5, 30)}</g>
    <circle cx="50" cy="50" r="11" fill="none" stroke="currentColor" stroke-width="2.4"/>
    <circle cx="50" cy="50" r="4.6" fill="currentColor"/>
  </symbol>
  <symbol id="m-awan" viewBox="0 0 220 56">
    <path d="M6 40 C 36 6, 66 6, 92 32 S 150 56, 176 26 C 188 12, 204 14, 214 24"
      fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="92" cy="32" r="3" fill="currentColor"/>
    <circle cx="176" cy="26" r="3" fill="currentColor"/>
    <path d="M214 24 q8 -2 10 -10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </symbol>
  <symbol id="m-corner" viewBox="0 0 220 220">
    <use href="#m-bunga" x="6" y="6" width="58" height="58"/>
    <use href="#m-rebung" x="70" y="2" width="42" height="60"/>
    <use href="#m-rebung" x="6" y="70" width="42" height="60" transform="rotate(-90 90 130)"/>
    <path d="M120 30 C 170 40, 184 86, 180 132" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>
    <use href="#m-awan" x="84" y="120" width="120" height="40"/>
  </symbol>
  <symbol id="m-medallion" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.7"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2.4"/>
    <g>${Array.from({ length: 12 }, (_, k) =>
      `<use href="#m-rebung" x="92" y="6" width="16" height="24" transform="rotate(${k * 30} 100 100)"/>`,
    ).join("")}</g>
    <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
    <use href="#m-bunga" x="58" y="58" width="84" height="84"/>
  </symbol>
</defs></svg>`;

// gold pucuk-rebung border ribbon, tiled horizontally
const BAND_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='44' height='20' viewBox='0 0 44 20'>" +
      "<g fill='none' stroke='%23D4AF37' stroke-width='1.4'>" +
      "<path d='M22 3 L34 17 H10 Z'/><path d='M0 17 H44'/><path d='M0 3 H44' opacity='0.5'/>" +
      "<circle cx='4' cy='10' r='1.2' fill='%23D4AF37'/><circle cx='40' cy='10' r='1.2' fill='%23D4AF37'/></g></svg>",
  );

/* ---------- scene builder ---------- */

const FONT_DISPLAY = "'Italiana','Cormorant Garamond',Georgia,serif";
const FONT_SERIF = "'Lora','Libre Baskerville',Georgia,serif";
const FONT_SANS = "'Instrument Sans','Inter',system-ui,sans-serif";
const FONT_JAWI = "'Amiri','Scheherazade New','Noto Naskh Arabic',serif";

const corners = () =>
  `<span class="orn tl"><svg viewBox="0 0 220 220"><use href="#m-corner"/></svg></span>` +
  `<span class="orn tr"><svg viewBox="0 0 220 220"><use href="#m-corner"/></svg></span>` +
  `<span class="orn bl"><svg viewBox="0 0 220 220"><use href="#m-corner"/></svg></span>` +
  `<span class="orn br"><svg viewBox="0 0 220 220"><use href="#m-corner"/></svg></span>`;

const scene = (i: number, ground: "dark" | "light", inner: string) =>
  `<section class="scene ${ground}" data-step="${i}">
     <span class="band band-t"></span><span class="band band-b"></span>
     ${corners()}
     <div class="copy">${inner}</div>
   </section>`;

export function generateWarisanInvitationHtml(data: WarisanData, opts?: { qrSvg?: string }): string {
  const d = { ...defaultWarisanData, ...data };
  const t = THEMES[d.theme] ?? THEMES.indigo;
  const titleNames = `${esc(d.brideFirst)} & ${esc(d.groomFirst)}`;

  // seeded flecks (deterministic)
  const seeded = (seed: number) => (n: number) => {
    const x = Math.sin(seed * 97 + n * 13.7) * 10000;
    return x - Math.floor(x);
  };
  const rnd = seeded(7);
  const flecks = Array.from({ length: 14 }, (_, i) => {
    const left = (rnd(i * 3 + 1) * 100).toFixed(2);
    const dur = (9 + rnd(i * 3 + 2) * 8).toFixed(2);
    const delay = (-rnd(i * 3 + 3) * 12).toFixed(2);
    const sc = (0.6 + rnd(i * 3 + 4) * 0.9).toFixed(2);
    return `<i class="fleck" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;transform:scale(${sc}) rotate(45deg)"></i>`;
  }).join("");

  /* ---- scenes ---- */
  const sceneKulit = scene(
    0,
    "dark",
    reveal(0, `<div class="kicker">${esc(d.header)}</div>`) +
      reveal(1, `<svg class="medallion" viewBox="0 0 200 200"><use href="#m-medallion"/></svg>`) +
      reveal(2, `<div class="names">${esc(d.brideFirst)}</div><div class="amp">&amp;</div><div class="names">${esc(d.groomFirst)}</div>`) +
      reveal(3, `<div class="jawi">${esc(d.brideJawi)} &nbsp;·&nbsp; ${esc(d.groomJawi)}</div>`) +
      reveal(4, `<div class="ruleline"></div>`) +
      reveal(5, `<div class="meta">${esc(d.dateBM)}</div><div class="meta small">${esc(d.venueName)}</div>`),
  );

  const sceneBismillah = d.showBismillah
    ? scene(
        1,
        "dark",
        reveal(0, `<div class="bismillah" dir="rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>`) +
          reveal(1, `<svg class="awan" viewBox="0 0 220 56"><use href="#m-awan"/></svg>`) +
          reveal(2, `<div class="verse">${escRows(d.verse).map((l) => `<div>${l}</div>`).join("")}</div>`),
      )
    : "";

  const sceneTetamu = scene(
    d.showBismillah ? 2 : 1,
    "light",
    reveal(0, `<div class="script">${esc(d.hostIntro)}</div>`) +
      reveal(1, `<div class="hosts">${escRows(d.hostLines).map((l) => (l === "&" ? `<div class="amp small">&amp;</div>` : `<div>${l}</div>`)).join("")}</div>`) +
      reveal(2, `<div class="invite">${escRows(d.inviteLine).map((l) => `<div>${l}</div>`).join("")}</div>`) +
      reveal(3, `<svg class="bunga-sm" viewBox="0 0 100 100"><use href="#m-bunga"/></svg>`) +
      reveal(4, `<div class="fullnames">${esc(d.brideFull)}</div><div class="jawi dark">${esc(d.brideJawi)}</div>` +
        `<div class="amp">&amp;</div>` +
        `<div class="fullnames">${esc(d.groomFull)}</div><div class="jawi dark">${esc(d.groomJawi)}</div>`),
  );

  const sceneAturcara = scene(
    d.showBismillah ? 3 : 2,
    "dark",
    reveal(0, `<div class="kicker">Aturcara Majlis</div>`) +
      reveal(1, `<div class="date-big">${esc(d.dateBM)}</div><div class="meta small">${esc(d.dateHijri)}</div>`) +
      reveal(2, `<div class="ruleline"></div>`) +
      reveal(3, `<div class="agenda"><div class="ag-title">${esc(d.akadTitle)}</div><div class="ag-time">${esc(d.akadTime)}</div></div>`) +
      reveal(4, `<div class="agenda"><div class="ag-title">${esc(d.resepsiTitle)}</div><div class="ag-time">${esc(d.resepsiTime)}</div></div>`),
  );

  const venueBtns =
    (d.mapsUrl ? `<a class="btn" href="${esc(d.mapsUrl)}" target="_blank" rel="noopener noreferrer">Google Maps</a>` : "") +
    (d.wazeUrl ? `<a class="btn gold" href="${esc(d.wazeUrl)}" target="_blank" rel="noopener noreferrer">Waze</a>` : "");
  const sceneLokasi = scene(
    d.showBismillah ? 4 : 3,
    "light",
    reveal(0, `<div class="kicker">Lokasi Majlis</div>`) +
      reveal(1, `<div class="venue">${esc(d.venueName)}</div>`) +
      reveal(2, `<div class="addr">${escRows(d.venueAddress).map((l) => `<div>${l}</div>`).join("")}</div>`) +
      reveal(3, `<svg class="awan dark" viewBox="0 0 220 56"><use href="#m-awan"/></svg>`) +
      (venueBtns ? reveal(4, `<div class="buttons">${venueBtns}</div>`) : ""),
  );

  const qrBlock =
    d.rsvpUrl && opts?.qrSvg
      ? reveal(1, `<div class="qr">${opts.qrSvg}</div><div class="meta small">Imbas untuk RSVP</div>`)
      : "";
  const contactLinks = escRows(d.contacts)
    .map((c) => {
      const m = /([0-9+\-\s]{7,})\s*$/.exec(c.replace(/&#39;/g, "'"));
      const tel = m ? m[1].replace(/[^0-9+]/g, "") : "";
      const wa = tel ? `https://wa.me/${tel.replace(/^0/, "60").replace(/^\+/, "")}` : "";
      return wa ? `<a class="contact" href="${wa}" target="_blank" rel="noopener noreferrer">${c}</a>` : `<div class="contact">${c}</div>`;
    })
    .join("");
  const sceneRsvp = scene(
    d.showBismillah ? 5 : 4,
    "dark",
    reveal(0, `<div class="script light">${esc(d.closingLine)}</div>`) +
      qrBlock +
      (contactLinks ? reveal(2, `<div class="kicker">RSVP &middot; Maklum Balas</div><div class="contacts">${contactLinks}</div>`) : "") +
      reveal(3, `<div class="ruleline"></div>`) +
      reveal(4, `<div class="doa" dir="auto">${escRows(d.doa).map((l) => `<div>${l}</div>`).join("")}</div>`) +
      reveal(5, `<div class="brand">Dicipta dengan &#10084; oleh e-motion.my</div>`),
  );

  const scenes = [sceneKulit, sceneBismillah, sceneTetamu, sceneAturcara, sceneLokasi, sceneRsvp].filter(Boolean);
  const dotCount = scenes.length;
  const dots = Array.from({ length: dotCount }, (_, i) => `<button class="dot" data-go="${i}" aria-label="Bahagian ${i + 1}"></button>`).join("");

  /* ---- runtime script (ES5, no template literals) ---- */
  const runtime =
    "(function(){" +
    "var root=document.getElementById('scroll');" +
    "var scenes=[].slice.call(document.querySelectorAll('.scene'));" +
    "var dots=[].slice.call(document.querySelectorAll('.dot'));" +
    "var cue=document.getElementById('cue');" +
    "var ratios=new Map();" +
    "var io=new IntersectionObserver(function(entries){" +
    "entries.forEach(function(e){ratios.set(e.target,e.intersectionRatio);});" +
    "scenes.forEach(function(s){var r=ratios.get(s)||0;if(r>0.38){s.classList.add('in');}else if(r<0.08){s.classList.remove('in');}});" +
    "var best=null,b=-1;ratios.forEach(function(r,el){if(r>b){b=r;best=el;}});" +
    "var bi=scenes.indexOf(best);" +
    "dots.forEach(function(dn,i){dn.classList.toggle('on',i===bi);});" +
    "if(cue){cue.style.opacity=bi>0?'0':'1';}" +
    "},{root:root,threshold:[0,0.08,0.2,0.38,0.6,0.9]});" +
    "scenes.forEach(function(s){io.observe(s);});" +
    "dots.forEach(function(dn){dn.addEventListener('click',function(){var i=+dn.getAttribute('data-go');if(scenes[i]){scenes[i].scrollIntoView({behavior:'smooth'});}});});" +
    "})();";

  const css = `
:root{
  --primary:${t.primary};--primaryDeep:${t.primaryDeep};--accent:${t.accent};--accentDeep:${t.accentDeep};
  --accentPale:${t.accentPale};--secondary:${t.secondary};--secondaryDeep:${t.secondaryDeep};--onLight:${t.textOnLight};
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{background:#0a0a0c;color:var(--secondary);font-family:${FONT_SERIF};-webkit-font-smoothing:antialiased}
.frame{position:relative;max-width:480px;margin:0 auto;height:100dvh;overflow:hidden;
  box-shadow:0 0 80px rgba(0,0,0,.6)}
#scroll{height:100%;overflow-y:auto;scroll-snap-type:y mandatory;scroll-behavior:smooth;scrollbar-width:none}
#scroll::-webkit-scrollbar{display:none}
.scene{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;
  display:flex;align-items:center;justify-content:center;padding:64px 36px}
.scene.dark{background:radial-gradient(ellipse at 50% 26%,var(--primary),var(--primaryDeep) 78%);color:var(--secondary)}
.scene.light{background:linear-gradient(180deg,var(--secondary),var(--secondaryDeep));color:var(--onLight)}
.copy{position:relative;z-index:3;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center}

/* gold pucuk-rebung border ribbons */
.band{position:absolute;left:0;right:0;height:18px;z-index:2;opacity:.92;
  background-image:url("${BAND_URI}");background-size:44px 18px;background-repeat:repeat-x}
.band-t{top:14px}
.band-b{bottom:14px;transform:scaleY(-1)}

/* corner clusters */
.orn{position:absolute;width:118px;height:118px;z-index:1;color:var(--accent);opacity:.5}
.scene.light .orn{opacity:.42}
.orn svg{width:100%;height:100%;display:block}
.orn.tl{top:20px;left:18px}
.orn.tr{top:20px;right:18px;transform:scaleX(-1)}
.orn.bl{bottom:20px;left:18px;transform:scaleY(-1)}
.orn.br{bottom:20px;right:18px;transform:scale(-1,-1)}

/* typography */
.kicker{font-family:${FONT_SANS};font-size:13px;letter-spacing:.36em;text-transform:uppercase;color:var(--accent);margin:10px 0}
.scene.light .kicker{color:var(--accentDeep)}
.medallion{width:150px;height:150px;color:var(--accent);margin:6px 0}
.names{font-family:${FONT_DISPLAY};font-size:58px;line-height:1.02;color:var(--secondary)}
.scene.light .names{color:var(--onLight)}
.amp{font-family:${FONT_SERIF};font-style:italic;font-size:34px;color:var(--accent);line-height:1.1;margin:2px 0}
.amp.small{font-size:22px;margin:4px 0}
.jawi{font-family:${FONT_JAWI};font-size:30px;color:var(--accentPale);direction:rtl;margin:10px 0}
.jawi.dark{color:var(--accentDeep);font-size:26px;margin:4px 0 14px}
.ruleline{width:130px;height:0;border-top:1px solid var(--accent);position:relative;margin:18px 0}
.ruleline:before{content:"";position:absolute;left:50%;top:-4px;width:8px;height:8px;background:var(--accent);transform:translateX(-50%) rotate(45deg)}
.meta{font-family:${FONT_SERIF};font-size:17px;letter-spacing:.04em;margin:5px 0}
.meta.small{font-size:14px;opacity:.85}
.bismillah{font-family:${FONT_JAWI};font-size:38px;line-height:1.7;color:var(--accentPale)}
.awan{width:140px;height:36px;color:var(--accent);margin:14px 0}
.awan.dark{color:var(--accentDeep)}
.verse{font-family:${FONT_SERIF};font-style:italic;font-size:17px;line-height:1.85;max-width:340px}
.script{font-family:${FONT_SERIF};font-style:italic;font-size:20px;margin:6px 0 12px}
.script.light{color:var(--secondary)}
.hosts{font-family:${FONT_SERIF};font-size:19px;line-height:1.7}
.invite{font-family:${FONT_SERIF};font-size:15px;line-height:1.7;opacity:.9;max-width:360px;margin:14px 0}
.bunga-sm{width:46px;height:46px;color:var(--accentDeep);margin:6px 0}
.fullnames{font-family:${FONT_DISPLAY};font-size:30px;line-height:1.15;margin-top:6px}
.date-big{font-family:${FONT_DISPLAY};font-size:30px;letter-spacing:.04em;margin-top:4px}
.agenda{margin:12px 0}
.ag-title{font-family:${FONT_SANS};font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--accentPale)}
.ag-time{font-family:${FONT_DISPLAY};font-size:26px;margin-top:2px}
.venue{font-family:${FONT_DISPLAY};font-size:32px;line-height:1.1;margin:6px 0}
.addr{font-family:${FONT_SERIF};font-size:16px;line-height:1.6;opacity:.9}
.buttons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.btn{font-family:${FONT_SANS};font-size:12px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;
  padding:12px 20px;border-radius:999px;border:1px solid var(--accent);color:var(--onLight);background:transparent;transition:.25s}
.btn.gold{background:linear-gradient(135deg,var(--accentPale),var(--accentDeep));color:#241a05;border-color:transparent}
.btn:hover{transform:translateY(-2px)}
.qr{width:148px;height:148px;margin:6px auto 6px;padding:10px;background:#fff;border-radius:10px;
  box-shadow:0 0 0 2px var(--accent),0 14px 30px rgba(0,0,0,.3)}
.qr svg{width:100%;height:100%;display:block}
.contacts{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.contact{font-family:${FONT_SERIF};font-size:16px;color:var(--secondary);text-decoration:none;border-bottom:1px dotted rgba(255,255,255,.25);padding-bottom:2px}
a.contact:hover{color:var(--accentPale)}
.doa{font-family:${FONT_SERIF};font-style:italic;font-size:16px;line-height:1.8;max-width:330px;margin-top:4px}
.brand{font-family:${FONT_SANS};font-size:11px;letter-spacing:.1em;opacity:.55;margin-top:18px}

/* reveal */
.reveal{opacity:0;transform:translateY(24px);
  transition:opacity .95s ease var(--d,0s),transform .95s cubic-bezier(.22,.61,.36,1) var(--d,0s);width:100%}
.scene.in .reveal{opacity:1;transform:none}

/* dots + cue */
.dots{position:absolute;right:10px;top:50%;transform:translateY(-50%);z-index:20;display:flex;flex-direction:column;gap:9px}
.dot{width:9px;height:9px;border-radius:50%;border:1px solid var(--accent);background:transparent;cursor:pointer;opacity:.6;transition:.3s;padding:0}
.dot.on{background:var(--accent);opacity:1;transform:scale(1.25)}
#cue{position:absolute;left:50%;bottom:42px;transform:translateX(-50%);z-index:20;color:var(--accentPale);
  font-family:${FONT_SANS};font-size:11px;letter-spacing:.2em;text-transform:uppercase;transition:opacity .6s;animation:bob 1.8s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}

/* falling gold flecks */
.fleckfx{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
.fleck{position:absolute;top:-6%;width:8px;height:8px;border-radius:2px;
  background:radial-gradient(circle at 50% 40%,var(--accentPale),var(--accent) 60%,transparent 74%);
  animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite;opacity:.7}
@keyframes fall{from{top:-6%}to{top:108%}}

@media (prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none}
  .fleck{display:none}
  #cue{animation:none}
}`;

  return `<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>${titleNames} — ${esc(d.header)}</title>
<meta name="theme-color" content="${t.primaryDeep}"/>
<meta name="description" content="Kad jemputan ${titleNames}. ${esc(d.dateBM)} · ${esc(d.venueName)}."/>
<style>${WARISAN_FONT_CSS}</style>
<style>${css}</style>
</head>
<body>
${SPRITE}
<div class="frame">
  <div class="dots">${dots}</div>
  <div class="fleckfx">${flecks}</div>
  <div id="cue">Tatal &#8595;</div>
  <div id="scroll">${scenes.join("")}</div>
</div>
<script>${runtime}</script>
</body>
</html>`;
}
