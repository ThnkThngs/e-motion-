"use client";

// Warisan Klasik builder — form + live preview + export. The preview iframe and
// the exported .html consume the SAME generateWarisanInvitationHtml output, so
// "does the export work?" is answered by looking at the preview.

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  generateWarisanInvitationHtml,
  defaultWarisanData,
  type WarisanData,
  type WarisanTheme,
} from "@/lib/warisanKlasik/generate";
import styles from "./builder.module.css";

const THEME_LABELS: Record<WarisanTheme, string> = {
  indigo: "Indigo Diraja",
  emerald: "Zamrud Tropika",
  terracotta: "Terakota Bumi",
};

const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Field helpers hoisted to module scope — defining them inside the component
// would remount inputs every render and drop focus mid-typing.
function TextField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

function AreaField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

function JawiField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} dir="rtl" className={styles.jawiInput} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function WarisanKlasikBuilder() {
  const [data, setData] = useState<WarisanData>(defaultWarisanData);
  const [qrSvg, setQrSvg] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const qrHostRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof WarisanData>(key: K, value: WarisanData[K]) =>
    setData((d) => ({ ...d, [key]: value }));
  const setStr = (key: keyof WarisanData) => (v: string) => set(key, v as WarisanData[typeof key]);

  // Serialize the rendered QR to a static SVG string (the QR lib never ships in
  // the export). Re-read whenever the RSVP URL changes.
  useEffect(() => {
    if (!data.rsvpUrl) {
      setQrSvg("");
      return;
    }
    const svg = qrHostRef.current?.querySelector("svg");
    if (svg) setQrSvg(svg.outerHTML);
  }, [data.rsvpUrl]);

  // Debounced regeneration — srcDoc replacement reloads the iframe document, so
  // per-keystroke would flicker and reset scroll.
  useEffect(() => {
    const id = setTimeout(() => setPreviewHtml(generateWarisanInvitationHtml(data, { qrSvg })), 350);
    return () => clearTimeout(id);
  }, [data, qrSvg]);

  const filename = useMemo(() => {
    const base = slugify(`${data.brideFirst}-${data.groomFirst}`) || "kad-jemputan-warisan";
    return `jemputan-${base}.html`;
  }, [data.brideFirst, data.groomFirst]);

  const download = () => {
    const html = generateWarisanInvitationHtml(data, { qrSvg }); // fresh, not debounced
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const openFull = () => {
    const html = generateWarisanInvitationHtml(data, { qrSvg });
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h1>Kad Jemputan Warisan Klasik</h1>
        <p>Sunting butiran majlis — pratonton dikemas kini serta-merta. Muat turun fail HTML lengkap untuk dikongsi.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <div className={styles.group}>
            <h2>Tema &amp; Tajuk</h2>
            <div className={styles.field}>
              <label htmlFor="theme">Tema warna</label>
              <select id="theme" value={data.theme} onChange={(e) => set("theme", e.target.value as WarisanTheme)}>
                {(Object.keys(THEME_LABELS) as WarisanTheme[]).map((t) => (
                  <option key={t} value={t}>
                    {THEME_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <TextField id="header" label="Tajuk majlis" hint="cth. WALIMATUL URUS" value={data.header} onChange={setStr("header")} />
            <div className={`${styles.field} ${styles.checkbox}`}>
              <input
                id="showBismillah"
                type="checkbox"
                checked={data.showBismillah}
                onChange={(e) => set("showBismillah", e.target.checked)}
              />
              <label htmlFor="showBismillah">Sertakan bahagian Bismillah</label>
            </div>
          </div>

          <div className={styles.group}>
            <h2>Pasangan</h2>
            <div className={styles.row}>
              <TextField id="brideFirst" label="Nama pengantin perempuan" value={data.brideFirst} onChange={setStr("brideFirst")} />
              <TextField id="groomFirst" label="Nama pengantin lelaki" value={data.groomFirst} onChange={setStr("groomFirst")} />
            </div>
            <div className={styles.row}>
              <JawiField id="brideJawi" label="Jawi (perempuan)" value={data.brideJawi} onChange={setStr("brideJawi")} />
              <JawiField id="groomJawi" label="Jawi (lelaki)" value={data.groomJawi} onChange={setStr("groomJawi")} />
            </div>
            <TextField id="brideFull" label="Nama penuh (perempuan)" hint="cth. Aisyah binti Rahman" value={data.brideFull} onChange={setStr("brideFull")} />
            <TextField id="groomFull" label="Nama penuh (lelaki)" hint="cth. Daniyal bin Ahmad Faizal" value={data.groomFull} onChange={setStr("groomFull")} />
          </div>

          <div className={styles.group}>
            <h2>Tuan Rumah &amp; Jemputan</h2>
            <TextField id="hostIntro" label="Pembuka" hint="cth. Dengan penuh kesyukuran" value={data.hostIntro} onChange={setStr("hostIntro")} />
            <AreaField id="hostLines" label="Ibu bapa / tuan rumah" hint="Satu baris setiap nama. Guna & pada baris sendiri." value={data.hostLines} onChange={setStr("hostLines")} />
            <AreaField id="inviteLine" label="Kata jemputan" hint="Satu baris setiap ayat." value={data.inviteLine} onChange={setStr("inviteLine")} />
          </div>

          <div className={styles.group}>
            <h2>Ayat &amp; Tarikh</h2>
            <AreaField id="verse" label="Ayat / petikan (Bismillah)" hint="Satu baris setiap baris ayat." value={data.verse} onChange={setStr("verse")} />
            <div className={styles.row}>
              <TextField id="dateBM" label="Tarikh (BM)" hint="cth. Sabtu, 12 Oktober 2026" value={data.dateBM} onChange={setStr("dateBM")} />
              <TextField id="dateHijri" label="Tarikh Hijri" hint="cth. 20 Rabiulakhir 1448H" value={data.dateHijri} onChange={setStr("dateHijri")} />
            </div>
          </div>

          <div className={styles.group}>
            <h2>Aturcara Majlis</h2>
            <div className={styles.row}>
              <TextField id="akadTitle" label="Acara 1" value={data.akadTitle} onChange={setStr("akadTitle")} />
              <TextField id="akadTime" label="Masa" value={data.akadTime} onChange={setStr("akadTime")} />
            </div>
            <div className={styles.row}>
              <TextField id="resepsiTitle" label="Acara 2" value={data.resepsiTitle} onChange={setStr("resepsiTitle")} />
              <TextField id="resepsiTime" label="Masa" value={data.resepsiTime} onChange={setStr("resepsiTime")} />
            </div>
          </div>

          <div className={styles.group}>
            <h2>Lokasi</h2>
            <TextField id="venueName" label="Nama tempat" value={data.venueName} onChange={setStr("venueName")} />
            <AreaField id="venueAddress" label="Alamat" hint="Satu baris setiap baris alamat." value={data.venueAddress} onChange={setStr("venueAddress")} />
            <TextField id="mapsUrl" label="Pautan Google Maps" value={data.mapsUrl} onChange={setStr("mapsUrl")} />
            <TextField id="wazeUrl" label="Pautan Waze" value={data.wazeUrl} onChange={setStr("wazeUrl")} />
          </div>

          <div className={styles.group}>
            <h2>RSVP &amp; Doa</h2>
            <TextField id="closingLine" label="Kata penutup" value={data.closingLine} onChange={setStr("closingLine")} />
            <TextField id="rsvpUrl" label="Pautan RSVP (QR)" hint="Kosongkan untuk menyembunyikan QR." value={data.rsvpUrl} onChange={setStr("rsvpUrl")} />
            <AreaField id="contacts" label="Hubungi" hint="Satu baris: Nama — 01X-XXXXXXX (jadi pautan WhatsApp)." value={data.contacts} onChange={setStr("contacts")} />
            <AreaField id="doa" label="Doa penutup" hint="Satu baris setiap baris." value={data.doa} onChange={setStr("doa")} />
          </div>
        </div>

        <div className={styles.previewCol}>
          <div className={styles.phone}>
            <iframe srcDoc={previewHtml} title="Pratonton kad jemputan" />
          </div>
          <div className={styles.actions}>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={download}>
              Muat turun HTML
            </button>
            <button type="button" className={styles.btn} onClick={openFull}>
              Buka pratonton penuh
            </button>
          </div>
        </div>
      </div>

      {/* hidden QR host — serialized into the generator, never shipped in export */}
      <div className={styles.qrHost} ref={qrHostRef} aria-hidden>
        {data.rsvpUrl && <QRCodeSVG value={data.rsvpUrl} size={148} bgColor="#ffffff" fgColor="#0f2438" level="M" />}
      </div>
    </div>
  );
}
