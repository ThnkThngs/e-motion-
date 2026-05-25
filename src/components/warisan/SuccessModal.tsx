"use client";

import { useEffect } from "react";
import { useWarisanLang } from "@/lib/warisan/useWarisanLang";

export const SuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useWarisanLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`warisan-modal ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="warisan-modal-box">
        <div className="warisan-modal-icon" aria-hidden="true">✦</div>
        <div className="warisan-modal-title">{t("modal.title")}</div>
        <div className="warisan-modal-body">{t("modal.body")}</div>
        <a
          className="warisan-modal-cta"
          href="/buat-cinematic"
          onClick={onClose}
        >
          {t("modal.cta")}
        </a>
        <button type="button" className="warisan-modal-close" onClick={onClose}>
          {t("modal.close")}
        </button>
      </div>
    </div>
  );
};
