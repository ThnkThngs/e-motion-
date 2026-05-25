"use client";

import { heritageTemplates, type HeritageTier } from "@/lib/heritageTemplates";

const tierLabel: Record<HeritageTier, string> = {
  free: "Percuma",
  motion: "Motion",
  cinematic: "Cinematic",
};

export const HeritageTemplatePicker = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gridAutoColumns: "minmax(150px, 1fr)",
        gap: 10,
        overflowX: "auto",
        padding: "4px 2px 14px",
        scrollbarColor: "var(--gold) transparent",
        scrollbarWidth: "thin",
      }}
    >
      {heritageTemplates.map((tpl) => {
        const active = selectedId === tpl.id;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            aria-pressed={active}
            style={{
              position: "relative",
              padding: 0,
              cursor: "pointer",
              border: active ? "2px solid var(--gold)" : "1px solid rgba(107,29,46,.2)",
              borderRadius: 6,
              overflow: "hidden",
              background: "var(--cream)",
              boxShadow: active
                ? "0 0 0 3px rgba(201,162,78,.25), 0 8px 20px rgba(26,32,64,.18)"
                : "0 2px 6px rgba(26,32,64,.08)",
              transition: "transform .25s, box-shadow .25s, border-color .25s",
              transform: active ? "translateY(-2px)" : "none",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "3 / 4.2",
                backgroundImage: `url(${tpl.thumb})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(13,18,40,.10) 0%, rgba(13,18,40,.55) 65%, rgba(13,18,40,.85) 100%)",
                }}
              />
              {active && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "var(--gold)",
                    color: "var(--indigo-deep)",
                    padding: "3px 8px",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: 8,
                    letterSpacing: ".15em",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  ✓ AKTIF
                </span>
              )}
            </div>
            <div
              style={{
                padding: "8px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--cream)",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--indigo-deep)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tpl.name}
              </span>
              <span
                className={`tpl-tag ${tpl.tier}`}
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: 8,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              >
                {tierLabel[tpl.tier]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
