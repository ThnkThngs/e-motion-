"use client";

import { useState } from "react";

export const CopyLinkButton: React.FC<{ slug: string }> = ({ slug }) => {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    const url = `${window.location.origin}/undang/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: "var(--gold, rgba(185,137,65,0.95))",
        color: "var(--indigo-deep, #1F1812)",
        border: 0,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
};
