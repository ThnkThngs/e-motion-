"use client";

// Phase 4 conversion of Stitch screen `undang-rsvp` — see
// .stitch/designs/undang-rsvp.html. Mobile visual target: an indigo section
// with a right-aligned header, a glass form card (name, phone, attendance
// segmented control, pax stepper, message), and a full-width submit pill.
//
// Behavior: ported verbatim from the previous InvitationScroll RsvpSection —
// the form POSTs `{ slug, guestName, attendance, pax, phone, note }` to
// /api/rsvp, shows a thank-you state on success, an inline error on failure,
// and disables the form once the RSVP deadline has passed.

import { useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle, formInputStyle } from "./_shared";

type RSVPProps = Readonly<{
  slug: string;
  deadline: string;
}>;

type Attendance = "hadir" | "tidak" | "mungkin";
type FormState = "idle" | "sending" | "ok" | "error";

const ATTENDANCE_OPTIONS: ReadonlyArray<Attendance> = ["hadir", "tidak", "mungkin"];

// Labelled field wrapper. Module-level component so it is not re-created on
// each RSVPSection render (react-best-practices rerender-no-inline-components).
const FormField = ({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span
      style={{
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "var(--muted)",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
    {children}
  </label>
);

export const RSVPSection = ({ slug, deadline }: RSVPProps) => {
  const ref = useScrollReveal<HTMLElement>({ y: 40 });
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [pax, setPax] = useState(2);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errMsg, setErrMsg] = useState("");

  const past = deadline ? new Date(`${deadline}T23:59:59`).getTime() < Date.now() : false;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, guestName: name, attendance, pax, phone, note }),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      setState("ok");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Gagal hantar RSVP");
      setState("error");
    }
  };

  return (
    <section
      ref={ref}
      id="rsvp"
      className="undang-rsvp"
      style={{ padding: "100px 24px", minHeight: "100dvh", textAlign: "center" }}
    >
      <div className="undang-rsvp-inner" style={{ maxWidth: 460, margin: "0 auto" }}>
        <p style={eyebrowStyle}>Sah Kehadiran</p>
        <h2
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(40px, 9vw, 64px)",
            color: "var(--gold)",
            margin: "8px 0 0",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          RSVP Mesra
        </h2>

        {past ? (
          <p style={{ marginTop: 18, color: "var(--muted)" }}>
            Maaf, tarikh akhir RSVP telah luput.
          </p>
        ) : state === "ok" ? (
          <div style={{ marginTop: 22 }}>
            <h3
              style={{
                fontFamily: "var(--font-script)",
                fontSize: 42,
                color: "var(--gold)",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Terima kasih!
            </h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              RSVP anda telah direkodkan. Jumpa di majlis!
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            style={{ display: "grid", gap: 12, margin: "24px 0 0", textAlign: "left" }}
          >
            <FormField label="Nama">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={formInputStyle}
              />
            </FormField>
            <FormField label="Kehadiran">
              <div style={{ display: "flex", gap: 8 }}>
                {ATTENDANCE_OPTIONS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAttendance(a)}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      borderRadius: 10,
                      border:
                        attendance === a
                          ? "1px solid var(--gold)"
                          : "1px solid color-mix(in oklab, var(--ink) 18%, transparent)",
                      background:
                        attendance === a
                          ? "color-mix(in oklab, var(--gold) 18%, transparent)"
                          : "transparent",
                      color: "var(--ink)",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontWeight: 600,
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </FormField>
            {attendance !== "tidak" && (
              <FormField label="Bilangan kehadiran">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={pax}
                  onChange={(e) => setPax(parseInt(e.target.value || "1", 10))}
                  style={formInputStyle}
                />
              </FormField>
            )}
            <FormField label="Telefon (pilihan)">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={formInputStyle}
              />
            </FormField>
            <FormField label="Pesanan (pilihan)">
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ ...formInputStyle, resize: "vertical" }}
              />
            </FormField>
            {state === "error" && (
              <p style={{ color: "var(--rose)", fontSize: 13, margin: 0 }}>{errMsg}</p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              style={{
                padding: "14px 20px",
                borderRadius: 999,
                border: 0,
                background: "var(--gold)",
                color: "var(--bg)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1.5,
                cursor: state === "sending" ? "wait" : "pointer",
              }}
            >
              {state === "sending" ? "Menghantar…" : "Hantar RSVP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
