// Thin pass-through (Phase 4). The single one-shape preview was replaced by a
// per-archetype component family under src/components/card/preview/. This kept
// the same export name + prop shape so every existing caller is unaffected.

"use client";

import { CardPreviewDispatcher } from "@/components/card/preview/CardPreviewDispatcher";
import type { WarisanCardForm } from "./types";

export const WarisanCardPreview = (props: Readonly<{ form: WarisanCardForm }>) => (
  <CardPreviewDispatcher {...props} />
);
