"use client";

import { useState } from "react";
import type { InvitationProps, Features } from "@cinematic/schema";

type Props = {
  value: InvitationProps;
  onChange: (next: InvitationProps) => void;
};

type FieldDef = {
  key: keyof InvitationProps;
  label: string;
  hint?: string;
  multiline?: boolean;
};

type SectionDef = { title: string; fields: FieldDef[] };

const SECTIONS: SectionDef[] = [
  {
    title: "Couple",
    fields: [
      { key: "brideName", label: "Bride — full name", hint: "Used in the script reveal scene." },
      { key: "brideShort", label: "Bride — short", hint: "Shown big on the header." },
      { key: "brideFather", label: "Bride's father" },
      { key: "groomName", label: "Groom — full name" },
      { key: "groomShort", label: "Groom — short" },
      { key: "groomFather", label: "Groom's father" },
      { key: "parents", label: "Parents line", hint: "Use ' & ' to split host families." },
      { key: "inviteBody", label: "Invitation copy", multiline: true },
    ],
  },
  {
    title: "Event",
    fields: [
      { key: "date", label: "Date — short", hint: "e.g. 27 . 01 . 2024" },
      { key: "dateLong", label: "Date — long", hint: "e.g. 27 JANUARI 2024" },
      { key: "venue", label: "Venue name" },
      { key: "venueAddress", label: "Venue address" },
    ],
  },
  {
    title: "Schedule",
    fields: [
      { key: "scheduleMeal", label: "Jamuan makan" },
      { key: "scheduleArrival", label: "Ketibaan pengantin" },
    ],
  },
  {
    title: "RSVP & brand",
    fields: [
      { key: "rsvpUrl", label: "RSVP URL", hint: "Used for the QR code on the details scene." },
      { key: "brandLine", label: "Outro line", hint: "e.g. Jempot Motion" },
    ],
  },
];

const SALAM_PRESETS = [
  "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair",
  "Semoga Allah memberkati pernikahan kalian",
  "Selamat pengantin baru",
  "Sakinah, mawaddah, warahmah",
  "Semoga kekal hingga ke jannah",
  "Tahniah dan moga bahagia",
  "Doa dimurahkan rezeki",
  "Semoga dilimpahi keberkatan",
];

export const CinematicForm: React.FC<Props> = ({ value, onChange }) => {
  const [openSection, setOpenSection] = useState<string>(SECTIONS[0].title);

  const set = (key: keyof InvitationProps) => (v: string) =>
    onChange({ ...value, [key]: v });

  const setFeatures = (next: Features) =>
    onChange({ ...value, features: next });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {SECTIONS.map((section) => {
        const open = section.title === openSection;
        return (
          <section
            key={section.title}
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 12,
              background: "#FFFDF8",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenSection(open ? "" : section.title)}
              style={accordionBtn(open)}
              aria-expanded={open}
            >
              {section.title}
              <span style={{ fontSize: 18, color: "#B98941" }}>{open ? "−" : "+"}</span>
            </button>
            {open && (
              <div style={{ padding: "8px 16px 18px", display: "grid", gap: 12 }}>
                {section.fields.map((f) => (
                  <Field
                    key={f.key}
                    def={f}
                    val={value[f.key] as string}
                    onChange={set(f.key)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <FeaturesSection
        features={value.features}
        onChange={setFeatures}
        open={openSection === "Features"}
        onToggle={() => setOpenSection(openSection === "Features" ? "" : "Features")}
      />
    </div>
  );
};

const accordionBtn = (open: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "14px 16px",
  background: open ? "rgba(185,137,65,0.08)" : "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  color: "#1F1812",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const FeaturesSection: React.FC<{
  features: Features;
  onChange: (next: Features) => void;
  open: boolean;
  onToggle: () => void;
}> = ({ features, onChange, open, onToggle }) => {
  const update = <K extends keyof Features>(k: K, v: Features[K]) =>
    onChange({ ...features, [k]: v });

  const toggleSalam = (preset: string) => {
    const has = features.salamKaut.items.includes(preset);
    update("salamKaut", {
      ...features.salamKaut,
      items: has
        ? features.salamKaut.items.filter((p) => p !== preset)
        : [...features.salamKaut.items, preset],
    });
  };

  return (
    <section
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        background: "#FFFDF8",
        overflow: "hidden",
      }}
    >
      <button type="button" onClick={onToggle} style={accordionBtn(open)} aria-expanded={open}>
        Features (RSVP · Map · Countdown · Gallery · Ucapan · Salam)
        <span style={{ fontSize: 18, color: "#B98941" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "8px 16px 18px", display: "grid", gap: 16 }}>
          <FeatureToggle
            label="RSVP Interaktif"
            enabled={features.rsvp.enabled}
            onToggle={(en) => update("rsvp", { ...features.rsvp, enabled: en })}
          >
            <Inline>
              <InlineLabel>Deadline</InlineLabel>
              <input
                type="date"
                value={features.rsvp.deadline}
                onChange={(e) => update("rsvp", { ...features.rsvp, deadline: e.target.value })}
                style={inputStyle}
              />
            </Inline>
          </FeatureToggle>

          <FeatureToggle
            label="Peta Lokasi"
            enabled={features.map.enabled}
            onToggle={(en) => update("map", { ...features.map, enabled: en })}
          >
            <SmallField
              label="Google Maps URL"
              value={features.map.googleMapsUrl}
              onChange={(v) => update("map", { ...features.map, googleMapsUrl: v })}
            />
            <SmallField
              label="Waze URL"
              value={features.map.wazeUrl}
              onChange={(v) => update("map", { ...features.map, wazeUrl: v })}
            />
          </FeatureToggle>

          <FeatureToggle
            label="Countdown Timer"
            enabled={features.countdown.enabled}
            onToggle={(en) => update("countdown", { ...features.countdown, enabled: en })}
          >
            <Inline>
              <InlineLabel>Event date & time</InlineLabel>
              <input
                type="datetime-local"
                value={features.countdown.eventDateTime.slice(0, 16)}
                onChange={(e) =>
                  update("countdown", { ...features.countdown, eventDateTime: e.target.value })
                }
                style={inputStyle}
              />
            </Inline>
          </FeatureToggle>

          <FeatureToggle
            label="Galeri Foto"
            enabled={features.gallery.enabled}
            onToggle={(en) => update("gallery", { ...features.gallery, enabled: en })}
          >
            <SmallField
              label="Image URLs (comma separated)"
              value={features.gallery.images.join(", ")}
              onChange={(v) =>
                update("gallery", {
                  ...features.gallery,
                  images: v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <span style={{ fontSize: 11, color: "#9C8B76" }}>
              Paste public image URLs, comma-separated. Upload coming in Phase 2.5.
            </span>
          </FeatureToggle>

          <FeatureToggle
            label="Ucapan Tetamu"
            enabled={features.ucapan.enabled}
            onToggle={(en) => update("ucapan", { enabled: en })}
          />

          <FeatureToggle
            label="Salam Kaut"
            enabled={features.salamKaut.enabled}
            onToggle={(en) => update("salamKaut", { ...features.salamKaut, enabled: en })}
          >
            <span style={{ fontSize: 11, color: "#9C8B76" }}>Pilih salam:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SALAM_PRESETS.map((p) => {
                const on = features.salamKaut.items.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleSalam(p)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: on ? "1px solid #B98941" : "1px solid rgba(0,0,0,0.12)",
                      background: on ? "rgba(185,137,65,0.12)" : "#fff",
                      color: "#1F1812",
                      fontSize: 11,
                      cursor: "pointer",
                      lineHeight: 1.3,
                      maxWidth: 280,
                      textAlign: "left",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </FeatureToggle>
        </div>
      )}
    </section>
  );
};

const FeatureToggle: React.FC<{
  label: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}> = ({ label, enabled, onToggle, children }) => (
  <div
    style={{
      border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: 10,
      padding: "10px 12px",
      background: enabled ? "rgba(185,137,65,0.04)" : "transparent",
      display: "grid",
      gap: 10,
    }}
  >
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        style={{ width: 16, height: 16 }}
      />
      <span style={{ fontWeight: 600, fontSize: 14, color: "#1F1812" }}>{label}</span>
    </label>
    {enabled && children && <div style={{ display: "grid", gap: 8, paddingLeft: 26 }}>{children}</div>}
  </div>
);

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  fontSize: 13,
  color: "#1F1812",
  background: "#fff",
  fontFamily: "inherit",
  outline: "none",
};

const Inline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{children}</div>
);

const InlineLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: 12, fontWeight: 600, color: "#6E5A48" }}>{children}</span>
);

const SmallField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#6E5A48" }}>{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, width: "100%" }}
    />
  </label>
);

const Field: React.FC<{ def: FieldDef; val: string; onChange: (v: string) => void }> = ({
  def,
  val,
  onChange,
}) => {
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 8,
    fontSize: 14,
    color: "#1F1812",
    background: "#fff",
    fontFamily: "inherit",
    outline: "none",
  };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#6E5A48", letterSpacing: 0.4 }}>
        {def.label}
      </span>
      {def.multiline ? (
        <textarea
          value={val}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ ...sharedStyle, resize: "vertical", lineHeight: 1.5 }}
        />
      ) : (
        <input
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      )}
      {def.hint && <span style={{ fontSize: 11, color: "#9C8B76" }}>{def.hint}</span>}
    </label>
  );
};
