// Card preview dispatcher (Phase 4) — routes a Heritage template to its
// archetype preview component. archetypeFor() returns "songket" for unknown
// ids, and Songket is also the explicit fallback in the switch's default arm.

"use client";

import { archetypeFor } from "@/lib/heritageTemplates";
import { SongketArchetype } from "./SongketArchetype";
import { BatikArchetype } from "./BatikArchetype";
import { TenunArchetype } from "./TenunArchetype";
import { IkatArchetype } from "./IkatArchetype";
import { PucukRebungArchetype } from "./PucukRebungArchetype";
import { GeometriArchetype } from "./GeometriArchetype";
import type { ArchetypeProps } from "./cardPreviewShared";

export const CardPreviewDispatcher = ({ form }: ArchetypeProps) => {
  switch (archetypeFor(form.templateId)) {
    case "batik":
      return <BatikArchetype form={form} />;
    case "tenun":
      return <TenunArchetype form={form} />;
    case "ikat":
      return <IkatArchetype form={form} />;
    case "pucuk-rebung":
      return <PucukRebungArchetype form={form} />;
    case "geometri":
      return <GeometriArchetype form={form} />;
    case "songket":
    default:
      return <SongketArchetype form={form} />;
  }
};
