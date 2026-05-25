"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import type { WarisanCardForm } from "./types";

const MAX_GALLERY = 6;
const MAX_AUDIO_MB = 10;
const MAX_VIDEO_MB = 30;

const Group = ({
  num,
  title,
  defaultOpen = false,
  children,
}: {
  num: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fgroup ${open ? "open" : ""}`}>
      <button
        type="button"
        className="fgroup-head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ width: "100%", background: "none", textAlign: "left" }}
      >
        <span className="fgroup-title">
          <span className="fgroup-num">{num}</span>
          {title}
        </span>
        <span className="fgroup-chev" aria-hidden="true">▾</span>
      </button>
      <div className="fgroup-body">{children}</div>
    </div>
  );
};

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="fg">
    <label className="flabel">{label}</label>
    <input
      className="finput"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="fg">
    <label className="flabel">{label}</label>
    <textarea
      className="ftextarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
    />
  </div>
);

const FileDrop = ({
  label,
  accept,
  multiple,
  state,
  onChange,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  state: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label
    style={{
      display: "block",
      border: "2px dashed rgba(107,29,46,.3)",
      padding: 18,
      textAlign: "center",
      cursor: "pointer",
      fontFamily: "var(--font-inter), 'Inter', sans-serif",
      fontSize: 11,
      letterSpacing: ".1em",
      fontWeight: 500,
      textTransform: "uppercase",
      background: "var(--cream)",
      color: "var(--maroon)",
      borderRadius: 3,
    }}
  >
    <div style={{ fontSize: 22, color: "var(--gold)" }} aria-hidden="true">↑</div>
    <div style={{ marginTop: 6 }}>{label}</div>
    <input type="file" accept={accept} multiple={multiple} onChange={onChange} style={{ display: "none" }} />
    <div
      style={{
        marginTop: 8,
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
        fontSize: 11,
        color: "var(--indigo)",
        textTransform: "none",
        letterSpacing: ".02em",
        fontWeight: 400,
      }}
    >
      {state}
    </div>
  </label>
);

export const WarisanCardFormPanel = ({
  value,
  onChange,
  onPublish,
  publishing = false,
}: {
  value: WarisanCardForm;
  onChange: (v: WarisanCardForm) => void;
  onPublish: () => void;
  publishing?: boolean;
}) => {
  // Track blob URLs created here so we can revoke them on unmount / replace.
  const [ownedUrls, setOwnedUrls] = useState<string[]>([]);
  useEffect(
    () => () => {
      ownedUrls.forEach((u) => URL.revokeObjectURL(u));
    },
    [ownedUrls],
  );

  const set = useCallback(
    <K extends keyof WarisanCardForm>(key: K, v: WarisanCardForm[K]) =>
      onChange({ ...value, [key]: v }),
    [value, onChange],
  );

  const setEvent = useCallback(
    (which: "akad" | "resepsi", patch: Partial<WarisanCardForm["akad"]>) =>
      onChange({ ...value, [which]: { ...value[which], ...patch } }),
    [value, onChange],
  );

  const setStory = useCallback(
    (i: 0 | 1 | 2, patch: Partial<WarisanCardForm["story"][number]>) => {
      const next = [...value.story] as WarisanCardForm["story"];
      next[i] = { ...next[i], ...patch };
      onChange({ ...value, story: next });
    },
    [value, onChange],
  );

  // ----- media handlers -----
  const onAudio = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_AUDIO_MB * 1024 * 1024) {
      alert(`Fail audio terlalu besar (maks ${MAX_AUDIO_MB}MB)`);
      return;
    }
    if (value.audioUrl) URL.revokeObjectURL(value.audioUrl);
    const url = URL.createObjectURL(f);
    setOwnedUrls((p) => [...p.filter((u) => u !== value.audioUrl), url]);
    onChange({ ...value, audioUrl: url, audioName: f.name });
  };

  const onVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_VIDEO_MB * 1024 * 1024) {
      alert(`Fail video terlalu besar (maks ${MAX_VIDEO_MB}MB)`);
      return;
    }
    if (value.videoUrl) URL.revokeObjectURL(value.videoUrl);
    const url = URL.createObjectURL(f);
    setOwnedUrls((p) => [...p.filter((u) => u !== value.videoUrl), url]);
    onChange({ ...value, videoUrl: url, videoName: f.name });
  };

  const onGallery = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_GALLERY - value.galleryUrls.length);
    const urls = files.map((f) => URL.createObjectURL(f));
    setOwnedUrls((p) => [...p, ...urls]);
    onChange({ ...value, galleryUrls: [...value.galleryUrls, ...urls].slice(0, MAX_GALLERY) });
  };

  const removePhoto = (i: number) => {
    const url = value.galleryUrls[i];
    if (url) URL.revokeObjectURL(url);
    onChange({ ...value, galleryUrls: value.galleryUrls.filter((_, idx) => idx !== i) });
  };

  // ----- markup -----
  return (
    <div className="form-panel">
      <div className="form-panel-head">
        <div className="form-panel-title">Bina Kad Anda</div>
        <div className="form-panel-status">Sinkron Langsung</div>
      </div>

      <Group num="01" title="Pengantin" defaultOpen>
        <div className="frow">
          <Input label="Nama Penuh — Pengantin Perempuan" value={value.bride} onChange={(v) => set("bride", v)} />
          <Input label="Nama Penuh — Pengantin Lelaki" value={value.groom} onChange={(v) => set("groom", v)} />
        </div>
        <div className="frow">
          <Input label="Nama Pendek — Perempuan" value={value.brideShort} onChange={(v) => set("brideShort", v)} placeholder="Farah" />
          <Input label="Nama Pendek — Lelaki" value={value.groomShort} onChange={(v) => set("groomShort", v)} placeholder="Adam" />
        </div>
        <Textarea label="Nama Ibu Bapa (satu baris setiap pasangan)" value={value.parents} onChange={(v) => set("parents", v)} />
        <Textarea label="Ucapan dari Hati" value={value.intro} onChange={(v) => set("intro", v)} />
      </Group>

      <Group num="02" title="Majlis" defaultOpen>
        <div className="fg" style={{ marginBottom: 4 }}>
          <label className="flabel">Tarikh Countdown</label>
          <input
            className="finput"
            type="datetime-local"
            value={value.countdownAt}
            onChange={(e) => set("countdownAt", e.target.value)}
          />
        </div>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px dashed rgba(107,29,46,.2)" }}>
          <label className="flabel">✦ Akad Nikah</label>
        </div>
        <div className="frow">
          <Input label="Tarikh" value={value.akad.date} onChange={(v) => setEvent("akad", { date: v })} />
          <Input label="Masa" value={value.akad.time} onChange={(v) => setEvent("akad", { time: v })} />
        </div>
        <Input label="Tempat" value={value.akad.venue} onChange={(v) => setEvent("akad", { venue: v })} />
        <Input label="Alamat" value={value.akad.address} onChange={(v) => setEvent("akad", { address: v })} />
        <Input label="Dresscode" value={value.akad.dress} onChange={(v) => setEvent("akad", { dress: v })} />

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px dashed rgba(107,29,46,.2)" }}>
          <label className="flabel">✦ Majlis Resepsi</label>
        </div>
        <div className="frow">
          <Input label="Tarikh" value={value.resepsi.date} onChange={(v) => setEvent("resepsi", { date: v })} />
          <Input label="Masa" value={value.resepsi.time} onChange={(v) => setEvent("resepsi", { time: v })} />
        </div>
        <Input label="Tempat" value={value.resepsi.venue} onChange={(v) => setEvent("resepsi", { venue: v })} />
        <Input label="Alamat" value={value.resepsi.address} onChange={(v) => setEvent("resepsi", { address: v })} />
        <Input label="Dresscode" value={value.resepsi.dress} onChange={(v) => setEvent("resepsi", { dress: v })} />
      </Group>

      <Group num="03" title="Muzik Latar (MP3)">
        <FileDrop
          label="Klik untuk muat naik MP3 (maks 10MB)"
          accept="audio/mpeg,audio/mp3,.mp3,audio/*"
          state={value.audioName ? `✓ ${value.audioName}` : "Tiada fail dipilih"}
          onChange={onAudio}
        />
      </Group>

      <Group num="04" title={`Galeri Foto · ${value.galleryUrls.length}/${MAX_GALLERY}`}>
        <FileDrop
          label="Klik untuk muat naik (JPEG / PNG, sehingga 6 foto)"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          state={value.galleryUrls.length === 0 ? "Tiada foto dimuat naik" : `${value.galleryUrls.length} foto`}
          onChange={onGallery}
        />
        {value.galleryUrls.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 10 }}>
            {value.galleryUrls.map((u, i) => (
              <div key={u} style={{ position: "relative", aspectRatio: "1", borderRadius: 3, overflow: "hidden", border: "1px solid var(--gold)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label="Buang foto"
                  style={{
                    position: "absolute", top: 3, right: 3, width: 22, height: 22,
                    background: "var(--maroon)", color: "var(--ivory)", border: "none",
                    borderRadius: "50%", cursor: "pointer", fontSize: 11,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Group>

      <Group num="05" title="Video Penutup (MP4)">
        <FileDrop
          label="Klik untuk muat naik MP4 (maks 30MB)"
          accept="video/mp4,.mp4,video/*"
          state={value.videoName ? `✓ ${value.videoName}` : "Tiada video dimuat naik"}
          onChange={onVideo}
        />
      </Group>

      <Group num="06" title="RSVP">
        <Input label="Nama Urusetia" value={value.rsvpName} onChange={(v) => set("rsvpName", v)} />
        <Input label="Nombor WhatsApp" value={value.rsvpPhone} onChange={(v) => set("rsvpPhone", v)} />
        <Input label="Tarikh Akhir RSVP" value={value.rsvpDeadline} onChange={(v) => set("rsvpDeadline", v)} />
      </Group>

      <Group num="07" title="Hadiah Digital">
        <div className="frow">
          <Input label="Bank" value={value.bank} onChange={(v) => set("bank", v)} />
          <Input label="Nama Akaun" value={value.accName} onChange={(v) => set("accName", v)} />
        </div>
        <Input label="Nombor Akaun" value={value.accNo} onChange={(v) => set("accNo", v)} />
        <Input label="e-Wallet (TNG / DuitNow)" value={value.ewallet} onChange={(v) => set("ewallet", v)} />
      </Group>

      <Group num="08" title="Kisah Cinta">
        {([0, 1, 2] as const).map((i) => (
          <div className="fg" key={i} style={{ paddingBottom: i < 2 ? 12 : 0, borderBottom: i < 2 ? "1px dashed rgba(107,29,46,.2)" : "none", marginBottom: i < 2 ? 12 : 0 }}>
            <label className="flabel">Babak {i + 1}</label>
            <div className="frow">
              <input className="finput" placeholder="Tahun" value={value.story[i].yr} onChange={(e) => setStory(i, { yr: e.target.value })} />
              <input className="finput" placeholder="Tajuk" value={value.story[i].title} onChange={(e) => setStory(i, { title: e.target.value })} />
            </div>
            <input className="finput" placeholder="Cerita ringkas..." value={value.story[i].desc} onChange={(e) => setStory(i, { desc: e.target.value })} style={{ marginTop: 6 }} />
          </div>
        ))}
      </Group>

      <button type="button" className="fbtn-primary" onClick={onPublish} disabled={publishing}>
        {publishing ? "Menerbitkan…" : "✦ Terbitkan Kad Saya"}
      </button>
    </div>
  );
};
