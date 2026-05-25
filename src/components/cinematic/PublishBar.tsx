"use client";

import { useState } from "react";
import type { InvitationProps } from "@cinematic/schema";
import type { CinematicTemplateId } from "@/lib/cinematicTemplates";

type Props = {
  templateId: CinematicTemplateId;
  payload: InvitationProps;
};

const encodePayload = (data: { templateId: string; payload: InvitationProps }) =>
  typeof window === "undefined"
    ? ""
    : btoa(unescape(encodeURIComponent(JSON.stringify(data))));

export const PublishBar: React.FC<Props> = ({ templateId, payload }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPreview = () => {
    const data = encodePayload({ templateId, payload });
    window.open(`/undang/preview?data=${data}`, "_blank");
  };

  const onPublish = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, payload }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const { slug } = await res.json();
      window.location.href = `/undang/${slug}?published=1`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        background: "linear-gradient(180deg, rgba(31,24,18,0) 0%, rgba(31,24,18,0.92) 30%)",
        padding: "24px 20px 18px",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          background: "rgba(31,24,18,0.95)",
          border: "1px solid rgba(185,137,65,0.35)",
          padding: "10px 14px",
          borderRadius: 999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        {error && (
          <span style={{ fontSize: 12, color: "#FF8E8E", maxWidth: 220 }}>{error}</span>
        )}
        <button
          type="button"
          onClick={onPreview}
          disabled={busy}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#FAF6E3",
            fontSize: 13,
            fontWeight: 600,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          Preview scroll page
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={busy}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "none",
            background: "linear-gradient(180deg, #D6B270 0%, #B98941 100%)",
            color: "#1F1812",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.4,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          {busy ? "Publishing…" : "Publish invitation"}
        </button>
      </div>
    </div>
  );
};
