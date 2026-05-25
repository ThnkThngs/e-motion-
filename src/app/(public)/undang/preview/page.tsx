"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { invitationSchema, defaultInvitationProps } from "@cinematic/schema";
import type { ThemeId } from "@cinematic/themes";
import { InvitationScroll } from "@/components/scroll/InvitationScroll";

// useSearchParams() must live inside a <Suspense> boundary (Next.js 15 —
// static-prerender bailout for client search params). Extracted into an
// inner component so the page export can provide that boundary.
function UndangPreviewInner() {
  const sp = useSearchParams();

  const { templateId, payload } = useMemo(() => {
    const raw = sp.get("data");
    if (!raw) return { templateId: "floral" as ThemeId, payload: defaultInvitationProps };
    try {
      const decoded = decodeURIComponent(escape(atob(raw)));
      const parsed = JSON.parse(decoded);
      const ok = invitationSchema.safeParse(parsed.payload);
      if (!ok.success) {
        return { templateId: "floral" as ThemeId, payload: defaultInvitationProps };
      }
      return { templateId: parsed.templateId as ThemeId, payload: ok.data };
    } catch {
      return { templateId: "floral" as ThemeId, payload: defaultInvitationProps };
    }
  }, [sp]);

  return <InvitationScroll templateId={templateId} payload={payload} preview />;
}

export default function UndangPreviewPage() {
  return (
    <Suspense fallback={null}>
      <UndangPreviewInner />
    </Suspense>
  );
}
