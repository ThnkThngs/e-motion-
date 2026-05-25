"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { defaultInvitationProps, type InvitationProps } from "@cinematic/schema";
import { TemplatePicker } from "@/components/cinematic/TemplatePicker";
import { CinematicForm } from "@/components/cinematic/CinematicForm";
import { PlayerPreview } from "@/components/cinematic/PlayerPreview";
import { PublishBar } from "@/components/cinematic/PublishBar";
import {
  cinematicTemplateById,
  cinematicTemplates,
  type CinematicTemplateId,
} from "@/lib/cinematicTemplates";
import { heritageToCinematic } from "@/lib/heritageTemplates";

// useSearchParams() must sit inside a <Suspense> boundary (Next.js 15
// static-prerender bailout). Inner component holds the search-param logic.
function BuatCinematicInner() {
  const sp = useSearchParams();
  const [templateId, setTemplateId] = useState<CinematicTemplateId>("floral");
  const [formData, setFormData] = useState<InvitationProps>(defaultInvitationProps);

  // Pre-select a template from ?template=… or ?heritage=… (set on the
  // Warisan landing's Heritage cards).
  useEffect(() => {
    const explicit = sp.get("template");
    if (explicit && cinematicTemplates.some((t) => t.id === explicit)) {
      setTemplateId(explicit as CinematicTemplateId);
      return;
    }
    const heritage = sp.get("heritage");
    if (heritage) setTemplateId(heritageToCinematic(heritage));
  }, [sp]);

  const template = cinematicTemplateById(templateId);

  return (
    <main className="builder-shell">
      <div className="builder-shell-inner builder-shell-inner--narrow">
        <header className="builder-shell-header builder-shell-header--cinematic">
          <p className="builder-shell-eyebrow">e-motion · Warisan cinematic builder</p>
          <h1 className="builder-shell-title">Bina kad jemputan animasi anda</h1>
          <p className="builder-shell-sub">
            Pilih templat sinematik, isi butiran anda, dan saksikan kad 30-saat dikemas kini secara langsung. Eksport dan harga buka di pendaftaran.
          </p>
        </header>

        <section className="builder-shell-section builder-shell-section--cinematic">
          <h2 className="builder-shell-sec-eyebrow builder-shell-sec-eyebrow--form">
            Templat
          </h2>
          <TemplatePicker selectedId={templateId} onSelect={setTemplateId} />
        </section>

        <div className="builder-shell-grid builder-shell-grid--cinematic">
          <section>
            <h2 className="builder-shell-sec-eyebrow builder-shell-sec-eyebrow--form">
              Butiran kad
            </h2>
            <CinematicForm value={formData} onChange={setFormData} />
          </section>

          <aside className="builder-preview-rail">
            <h2 className="builder-preview-label builder-preview-label--cinematic">
              Pratonton langsung
            </h2>
            <PlayerPreview component={template.component} inputProps={formData} />
            <p className="builder-preview-caption builder-preview-caption--cinematic">
              30s · 720×1280 · {template.name}. Klik untuk main; berulang sendiri.
            </p>
          </aside>
        </div>
      </div>

      <PublishBar templateId={templateId} payload={formData} />
    </main>
  );
}

export default function BuatCinematicPage() {
  return (
    <Suspense fallback={null}>
      <BuatCinematicInner />
    </Suspense>
  );
}
