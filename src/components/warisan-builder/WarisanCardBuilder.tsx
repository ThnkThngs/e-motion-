"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { defaultWarisanCardForm, type WarisanCardForm } from "./types";
import { HeritageTemplatePicker } from "./HeritageTemplatePicker";
import { WarisanCardFormPanel } from "./WarisanCardForm";
import { WarisanCardPreview } from "./WarisanCardPreview";
import { heritageTemplates } from "@/lib/heritageTemplates";

// Map our form into a payload the existing /api/invitations endpoint accepts.
// The endpoint requires brideShort + groomShort to build the slug; everything
// else lives inside `payload` as-is. Media blobs are session-only and are NOT
// persisted (a clear note is shown to the user at publish time).
const toApiPayload = (f: WarisanCardForm) => ({
  templateId: `heritage:${f.templateId}`,
  payload: {
    brideName: f.bride,
    brideShort: f.brideShort,
    brideFather: "",
    groomName: f.groom,
    groomShort: f.groomShort,
    groomFather: "",
    parents: f.parents,
    inviteBody: f.intro,
    date: f.resepsi.date,
    dateLong: f.resepsi.date,
    venue: f.resepsi.venue,
    venueAddress: f.resepsi.address,
    scheduleMeal: f.resepsi.time,
    scheduleArrival: f.akad.time,
    rsvpUrl: "",
    brandLine: "Warisan & E-motion",
    features: {
      rsvp: { enabled: true, deadline: f.rsvpDeadline },
      map: { enabled: false, googleMapsUrl: "", wazeUrl: "" },
      countdown: { enabled: Boolean(f.countdownAt), eventDateTime: f.countdownAt || "" },
      gallery: { enabled: false, images: [] },
      ucapan: { enabled: true },
      salamKaut: { enabled: false, items: [] },
    },
    // Heritage-specific extras (ignored by the Remotion schema's parse but
    // kept inside the JSONB payload so the heritage-aware renderer can read
    // them once it lands).
    heritage: {
      templateId: f.templateId,
      story: f.story,
      gifts: { bank: f.bank, accName: f.accName, accNo: f.accNo, ewallet: f.ewallet },
      rsvp: { name: f.rsvpName, phone: f.rsvpPhone, deadline: f.rsvpDeadline },
      akad: f.akad,
      resepsi: f.resepsi,
      hasMedia: {
        audio: Boolean(f.audioUrl),
        video: Boolean(f.videoUrl),
        gallery: f.galleryUrls.length,
      },
    },
  },
});

export const WarisanCardBuilder = () => {
  const router = useRouter();
  const sp = useSearchParams();
  const [form, setForm] = useState<WarisanCardForm>(defaultWarisanCardForm);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-select template from ?heritage= query param.
  useEffect(() => {
    const id = sp.get("heritage");
    if (id && heritageTemplates.some((t) => t.id === id)) {
      setForm((f) => ({ ...f, templateId: id }));
    }
  }, [sp]);

  const onPublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toApiPayload(form)),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? `HTTP ${res.status}`);
      }
      const { slug } = (await res.json()) as { slug: string };
      router.push(`/undang/${slug}?published=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal terbitkan");
      setPublishing(false);
    }
  };

  const hasMedia = Boolean(form.audioUrl || form.videoUrl || form.galleryUrls.length);

  return (
    <main className="builder-shell">
      <div className="builder-shell-inner">
        <header className="builder-shell-header">
          <p className="builder-shell-eyebrow">e-motion · Warisan Card Builder</p>
          <h1 className="builder-shell-title">
            Bina kad jemputan <em>warisan</em> anda
          </h1>
          <p className="builder-shell-sub">
            Pilih satu daripada 20 templat warisan, isi butiran majlis, muat naik foto / muzik / video — pratonton dikemas kini secara langsung.
          </p>
        </header>

        <section className="builder-shell-section">
          <h2 className="builder-shell-sec-eyebrow">
            Templat Warisan · {heritageTemplates.length} reka bentuk siap
          </h2>
          <HeritageTemplatePicker
            selectedId={form.templateId}
            onSelect={(id) => setForm((f) => ({ ...f, templateId: id }))}
          />
        </section>

        <div className="builder-shell-grid builder-shell-grid--warisan">
          <section>
            <h2 className="builder-shell-sec-eyebrow builder-shell-sec-eyebrow--form">
              Butiran Kad
            </h2>
            <WarisanCardFormPanel
              value={form}
              onChange={setForm}
              onPublish={onPublish}
              publishing={publishing}
            />
            {error && (
              <p role="alert" className="builder-form-alert builder-form-alert--error">
                {error}
              </p>
            )}
            {hasMedia && (
              <p className="builder-form-alert builder-form-alert--info">
                Foto, audio dan video yang anda muat naik kelihatan di pratonton ini sekarang.
                Untuk versi terbitan dengan media tersimpan kekal, sambungan storan akan diaktifkan
                dalam keluaran berikutnya — kini terbitan akan menyimpan butiran teks dan templat sahaja.
              </p>
            )}
          </section>

          <aside className="builder-preview-rail">
            <div className="builder-preview-label">
              <span className="builder-preview-label-bar" />
              Pratonton Langsung
              <span className="builder-preview-label-bar" />
            </div>
            <WarisanCardPreview form={form} />
            <p className="builder-preview-caption">
              Tatal di dalam telefon untuk lihat semua bahagian.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};
