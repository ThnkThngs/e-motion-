"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";
import { Html } from "./Html";

type EventBlock = { date: string; time: string; venue: string; dress: string };
type Story = { yr: string; title: string; desc: string };

type FormState = {
  bride: string;
  groom: string;
  intro: string;
  akad: EventBlock;
  res: EventBlock;
  countdown: string;
  rsvpName: string;
  rsvpPhone: string;
  rsvpDeadline: string;
  bank: string;
  accName: string;
  accNo: string;
  ewallet: string;
  story: [Story, Story, Story];
};

const initialForm: FormState = {
  bride: "Farah",
  groom: "Adam",
  intro: "Dengan penuh rasa syukur, kami menjemput anda hadir ke majlis perkahwinan kami.",
  akad: { date: "25 Mei 2026", time: "9:00 Pagi", venue: "Masjid Al-Falah", dress: "Pastel" },
  res: { date: "25 Mei 2026", time: "11:00 Pagi", venue: "Dewan Perdana", dress: "Pastel" },
  countdown: "",
  rsvpName: "Kak Siti",
  rsvpPhone: "+60 12-345 6789",
  rsvpDeadline: "15 Mei 2026",
  bank: "Maybank",
  accName: "Farah Binti Ahmad",
  accNo: "1234567890",
  ewallet: "+60 12-345 6789",
  story: [
    { yr: "2020", title: "Pertemuan pertama", desc: "Kami berkenalan di kampus." },
    { yr: "2024", title: "Bertunang", desc: "Lamaran rasmi di rumah keluarga." },
    { yr: "2026", title: "Majlis kahwin", desc: "Hari yang dinanti tiba." },
  ],
};

const useCountdown = (target: string) => {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => {
    if (!target) return { d: "--", h: "--", m: "--", s: "--" };
    const t = new Date(target).getTime();
    if (Number.isNaN(t)) return { d: "--", h: "--", m: "--", s: "--" };
    const diff = Math.max(0, t - now);
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return { d: String(d).padStart(2, "0"), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") };
  }, [now, target]);
};

const Group = ({
  num,
  title,
  children,
  defaultOpen = false,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`fgroup ${open ? "open" : ""}`}>
      <div
        className="fgroup-head"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
      >
        <div className="fgroup-title">
          <span className="fgroup-num">{num}</span>
          {title}
        </div>
        <span className="fgroup-chev">▾</span>
      </div>
      <div className="fgroup-body">{children}</div>
    </div>
  );
};

export const BuilderDemoSection = ({
  onPublish,
}: {
  onPublish: () => void;
}) => {
  const { t } = useWarisanLang();
  const [form, setForm] = useState<FormState>(initialForm);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const cd = useCountdown(form.countdown);

  // Clean up object URLs.
  useEffect(() => () => galleryUrls.forEach((u) => URL.revokeObjectURL(u)), [galleryUrls]);

  const set = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((f) => ({ ...f, [key]: value })),
    [],
  );

  const setEvent = useCallback(
    (which: "akad" | "res", patch: Partial<EventBlock>) =>
      setForm((f) => ({ ...f, [which]: { ...f[which], ...patch } })),
    [],
  );

  const setStory = useCallback((i: 0 | 1 | 2, patch: Partial<Story>) => {
    setForm((f) => {
      const next = [...f.story] as FormState["story"];
      next[i] = { ...next[i], ...patch };
      return { ...f, story: next };
    });
  }, []);

  const onGallery = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    const urls = files.map((f) => URL.createObjectURL(f));
    setGalleryUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return urls;
    });
  };

  const phoneSlug = `${form.bride}-${form.groom}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <section className="warisan-section builder-section" id="builder">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-label reveal-3d">{t("sec.builder")}</div>
          <Html
            as="h2"
            className="section-title reveal-3d reveal-d1"
            html={t("builder.title")}
          />
          <p className="section-sub reveal-3d reveal-d2">{t("builder.sub")}</p>
        </div>

        <div className="builder-layout">
          {/* FORM */}
          <div className="form-panel reveal-3d">
            <div className="form-panel-head">
              <div className="form-panel-title">{t("fp.title")}</div>
              <div className="form-panel-status">{t("fp.status")}</div>
            </div>

            <Group num="01" title={t("grp.couple")} defaultOpen>
              <div className="frow">
                <div className="fg">
                  <label className="flabel">{t("f.bride")}</label>
                  <input className="finput" value={form.bride} onChange={(e) => set("bride", e.target.value)} />
                </div>
                <div className="fg">
                  <label className="flabel">{t("f.groom")}</label>
                  <input className="finput" value={form.groom} onChange={(e) => set("groom", e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label className="flabel">{t("f.intro")}</label>
                <textarea className="ftextarea" value={form.intro} onChange={(e) => set("intro", e.target.value)} />
              </div>
            </Group>

            <Group num="02" title={t("grp.events")} defaultOpen>
              <div className="fg" style={{ marginBottom: 8 }}>
                <label className="flabel">{t("ev.akad")}</label>
              </div>
              <div className="frow">
                <div className="fg"><label className="flabel">{t("f.date")}</label><input className="finput" value={form.akad.date} onChange={(e) => setEvent("akad", { date: e.target.value })} /></div>
                <div className="fg"><label className="flabel">{t("f.time")}</label><input className="finput" value={form.akad.time} onChange={(e) => setEvent("akad", { time: e.target.value })} /></div>
              </div>
              <div className="fg"><label className="flabel">{t("f.venue")}</label><input className="finput" value={form.akad.venue} onChange={(e) => setEvent("akad", { venue: e.target.value })} /></div>
              <div className="fg"><label className="flabel">{t("f.dress")}</label><input className="finput" value={form.akad.dress} onChange={(e) => setEvent("akad", { dress: e.target.value })} /></div>

              <div className="fg" style={{ marginTop: 16, marginBottom: 8 }}>
                <label className="flabel">{t("ev.resepsi")}</label>
              </div>
              <div className="frow">
                <div className="fg"><label className="flabel">{t("f.date")}</label><input className="finput" value={form.res.date} onChange={(e) => setEvent("res", { date: e.target.value })} /></div>
                <div className="fg"><label className="flabel">{t("f.time")}</label><input className="finput" value={form.res.time} onChange={(e) => setEvent("res", { time: e.target.value })} /></div>
              </div>
              <div className="fg"><label className="flabel">{t("f.venue")}</label><input className="finput" value={form.res.venue} onChange={(e) => setEvent("res", { venue: e.target.value })} /></div>
              <div className="fg"><label className="flabel">{t("f.countdown")}</label><input className="finput" type="date" value={form.countdown} onChange={(e) => set("countdown", e.target.value)} /></div>
            </Group>

            <Group num="03" title={t("grp.gallery")}>
              <label className="flabel">{t("f.dropphoto")}</label>
              <input type="file" accept="image/jpeg,image/png" multiple onChange={onGallery} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 10 }}>
                {galleryUrls.map((u, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={u} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 3 }} />
                ))}
              </div>
            </Group>

            <Group num="04" title={t("grp.rsvp")}>
              <div className="fg"><label className="flabel">{t("f.contact")}</label><input className="finput" value={form.rsvpName} onChange={(e) => set("rsvpName", e.target.value)} /></div>
              <div className="fg"><label className="flabel">{t("f.phone")}</label><input className="finput" value={form.rsvpPhone} onChange={(e) => set("rsvpPhone", e.target.value)} /></div>
              <div className="fg"><label className="flabel">{t("f.deadline")}</label><input className="finput" value={form.rsvpDeadline} onChange={(e) => set("rsvpDeadline", e.target.value)} /></div>
            </Group>

            <Group num="05" title={t("grp.gifts")}>
              <div className="frow">
                <div className="fg"><label className="flabel">{t("f.bank")}</label><input className="finput" value={form.bank} onChange={(e) => set("bank", e.target.value)} /></div>
                <div className="fg"><label className="flabel">{t("f.accname")}</label><input className="finput" value={form.accName} onChange={(e) => set("accName", e.target.value)} /></div>
              </div>
              <div className="fg"><label className="flabel">{t("f.accno")}</label><input className="finput" value={form.accNo} onChange={(e) => set("accNo", e.target.value)} /></div>
              <div className="fg"><label className="flabel">{t("f.ewallet")}</label><input className="finput" value={form.ewallet} onChange={(e) => set("ewallet", e.target.value)} /></div>
            </Group>

            <Group num="06" title={t("grp.story")}>
              {([0, 1, 2] as const).map((i) => (
                <div className="fg" key={i}>
                  <label className="flabel">{t(`f.ms${i + 1}`)}</label>
                  <div className="frow">
                    <input className="finput" placeholder="Tahun" value={form.story[i].yr} onChange={(e) => setStory(i, { yr: e.target.value })} />
                    <input className="finput" placeholder="Tajuk" value={form.story[i].title} onChange={(e) => setStory(i, { title: e.target.value })} />
                  </div>
                  <input className="finput" placeholder="Cerita ringkas..." value={form.story[i].desc} onChange={(e) => setStory(i, { desc: e.target.value })} style={{ marginTop: 6 }} />
                </div>
              ))}
            </Group>

            <button type="button" className="fbtn-primary" onClick={onPublish}>
              {t("f.submit")}
            </button>
          </div>

          {/* PHONE PREVIEW */}
          <div className="preview-wrap">
            <div className="preview-label">{t("pv.label")}</div>
            <div className="phone">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-url">e-motion.my/{phoneSlug || "kad"}</div>
                <div className="inv">
                  <div className="inv-hero">
                    <div className="inv-hero-pattern" />
                    <div className="inv-hero-content">
                      <div className="inv-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                      <div className="inv-hero-label">{t("inv.label")}</div>
                      <div className="inv-names">
                        <span className="inv-name">{form.bride}</span>
                        <span className="inv-amp">&amp;</span>
                        <span className="inv-name">{form.groom}</span>
                      </div>
                      <div className="inv-divider" aria-hidden="true">
                        <span className="line" />
                        <span className="dia" />
                        <span className="line" />
                      </div>
                      <p className="inv-intro">{form.intro}</p>
                    </div>
                  </div>

                  <div className="inv-section maroon">
                    <div className="inv-sec-head">
                      <div className="inv-sec-num">/ 01</div>
                      <div className="inv-sec-title">{t("inv.countdown")}</div>
                    </div>
                    <div className="inv-countdown">
                      {(["d", "h", "m", "s"] as const).map((k) => (
                        <div key={k} className="inv-cd-box">
                          <span className="inv-cd-num">{cd[k]}</span>
                          <span className="inv-cd-lbl">{t(`cd.${k}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="inv-section cream">
                    <div className="inv-sec-head">
                      <div className="inv-sec-num">/ 02</div>
                      <div className="inv-sec-title">{t("inv.events")}</div>
                    </div>
                    {(["akad", "res"] as const).map((k, i) => (
                      <div key={k} className="inv-event">
                        <div className="inv-event-name">{i === 0 ? t("ev.akad") : t("ev.resepsi")}</div>
                        <div className="inv-event-row"><span className="inv-event-lbl">{t("f.date")}</span><span className="inv-event-val">{form[k].date}</span></div>
                        <div className="inv-event-row"><span className="inv-event-lbl">{t("f.time")}</span><span className="inv-event-val">{form[k].time}</span></div>
                        <div className="inv-event-row"><span className="inv-event-lbl">{t("f.venue")}</span><span className="inv-event-val">{form[k].venue}</span></div>
                      </div>
                    ))}
                  </div>

                  {galleryUrls.length > 0 && (
                    <div className="inv-section indigo">
                      <div className="inv-sec-head">
                        <div className="inv-sec-num">/ 03</div>
                        <div className="inv-sec-title">{t("inv.gallery")}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                        {galleryUrls.map((u, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={u} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="inv-footer">
                    <div className="inv-footer-brand">{form.bride} &amp; {form.groom}</div>
                    <div className="inv-footer-tag">{t("inv.thanks")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
