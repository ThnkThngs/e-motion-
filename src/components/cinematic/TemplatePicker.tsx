"use client";

import { cinematicTemplates, type CinematicTemplateId } from "@/lib/cinematicTemplates";

type Props = {
  selectedId: CinematicTemplateId;
  onSelect: (id: CinematicTemplateId) => void;
};

export const TemplatePicker: React.FC<Props> = ({ selectedId, onSelect }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
      }}
    >
      {cinematicTemplates.map((tpl) => {
        const selected = tpl.id === selectedId;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl.id)}
            style={{
              position: "relative",
              padding: 0,
              border: selected ? "2px solid #B98941" : "1px solid rgba(0,0,0,0.1)",
              borderRadius: 14,
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              boxShadow: selected
                ? "0 8px 22px rgba(185, 137, 65, 0.25)"
                : "0 2px 6px rgba(0,0,0,0.06)",
              transition: "all 150ms ease",
              textAlign: "left",
            }}
            aria-pressed={selected}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "9 / 16",
                background: "#F4ECD8",
                backgroundImage: `url(${tpl.thumb})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ padding: "10px 12px 12px" }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1F1812",
                  marginBottom: 2,
                }}
              >
                {tpl.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6E5A48",
                  lineHeight: 1.4,
                }}
              >
                {tpl.blurb}
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: "#B98941",
                  background: "rgba(185, 137, 65, 0.12)",
                  padding: "3px 8px",
                  borderRadius: 999,
                  textTransform: "uppercase",
                }}
              >
                {tpl.badge}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
