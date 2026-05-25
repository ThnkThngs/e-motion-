import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { QRCodeSVG } from "qrcode.react";
import { useTheme } from "../compositions/ThemeContext";
import type { InvitationProps } from "../schema";

export const DetailsScene: React.FC<
  Pick<
    InvitationProps,
    "dateLong" | "venue" | "venueAddress" | "scheduleMeal" | "scheduleArrival" | "rsvpUrl"
  >
> = ({ dateLong, venue, venueAddress, scheduleMeal, scheduleArrival, rsvpUrl }) => {
  const { palette, fonts } = useTheme();
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 24, 150, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const op = (delay: number) =>
    interpolate(frame, [delay, delay + 28], [0, 1], { extrapolateRight: "clamp" });
  const lift = (delay: number) =>
    interpolate(frame, [delay, delay + 32], [16, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const Row: React.FC<{ label: string; value: React.ReactNode; delay: number }> = ({
    label,
    value,
    delay,
  }) => (
    <div
      style={{
        opacity: op(delay),
        transform: `translateY(${lift(delay)}px)`,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 18,
          letterSpacing: 4,
          color: palette.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 24,
          color: palette.ink,
          fontWeight: 600,
          marginTop: 6,
          lineHeight: 1.3,
        }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 70px",
      }}
    >
      <Row label="Tarikh :" value={dateLong} delay={0} />
      <Row
        label="Lokasi :"
        value={
          <>
            {venue}
            <br />
            {venueAddress}
          </>
        }
        delay={20}
      />
      <Row
        label="Aturcara majlis :"
        value={
          <>
            <span style={{ fontWeight: 400 }}>Jamuan makan :</span> {scheduleMeal}
            <br />
            <span style={{ fontWeight: 400 }}>Ketibaan pengantin :</span> {scheduleArrival}
          </>
        }
        delay={45}
      />

      <div
        style={{
          marginTop: 16,
          opacity: op(75),
          transform: `translateY(${lift(75)}px)`,
          padding: 14,
          background: "rgba(255,255,255,0.6)",
          borderRadius: 12,
          boxShadow: "0 6px 24px rgba(42,31,24,0.08)",
        }}
      >
        <QRCodeSVG value={rsvpUrl} size={140} bgColor={palette.bg} fgColor={palette.ink} level="M" />
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 14,
          letterSpacing: 2,
          color: palette.muted,
          marginTop: 10,
          opacity: op(85),
        }}
      >
        screenshot &amp; scan
      </div>
    </AbsoluteFill>
  );
};
