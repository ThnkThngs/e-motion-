import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../compositions/ThemeContext";
import type { InvitationProps } from "../schema";

export const HeaderScene: React.FC<Pick<InvitationProps, "brideShort" | "groomShort" | "date" | "venue">> = ({
  brideShort,
  groomShort,
  date,
  venue,
}) => {
  const { palette, fonts } = useTheme();
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 20, 110, 130], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lift = (delay: number) =>
    interpolate(frame, [delay, delay + 30], [24, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const op = (delay: number) =>
    interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 22,
          letterSpacing: 8,
          color: palette.muted,
          opacity: op(0),
          transform: `translateY(${lift(0)}px)`,
          textTransform: "uppercase",
        }}
      >
        Walimatul Urus
      </div>
      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 130,
          color: palette.ink,
          lineHeight: 1.0,
          marginTop: 26,
          fontWeight: 500,
          opacity: op(15),
          transform: `translateY(${lift(15)}px)`,
        }}
      >
        {brideShort}
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 60,
          color: palette.rose,
          fontStyle: "italic",
          margin: "8px 0",
          opacity: op(30),
        }}
      >
        &amp;
      </div>
      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 130,
          color: palette.ink,
          lineHeight: 1.0,
          fontWeight: 500,
          opacity: op(45),
          transform: `translateY(${lift(45)}px)`,
        }}
      >
        {groomShort}
      </div>

      <div
        style={{
          marginTop: 60,
          width: 220,
          height: 1,
          background: palette.muted,
          opacity: op(60) * 0.5,
        }}
      />
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 22,
          letterSpacing: 6,
          color: palette.ink,
          marginTop: 18,
          opacity: op(60),
        }}
      >
        {date}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 18,
          letterSpacing: 3,
          color: palette.muted,
          marginTop: 22,
          opacity: op(75),
        }}
      >
        {venue}
      </div>
    </AbsoluteFill>
  );
};
