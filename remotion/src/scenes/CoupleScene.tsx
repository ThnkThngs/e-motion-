import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../compositions/ThemeContext";
import type { InvitationProps } from "../schema";

export const CoupleScene: React.FC<
  Pick<InvitationProps, "brideName" | "brideFather" | "groomName" | "groomFather">
> = ({ brideName, brideFather, groomName, groomFather }) => {
  const { palette, fonts } = useTheme();
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const op = (delay: number) =>
    interpolate(frame, [delay, delay + 28], [0, 1], { extrapolateRight: "clamp" });
  const lift = (delay: number) =>
    interpolate(frame, [delay, delay + 32], [22, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 100,
          color: palette.ink,
          lineHeight: 1.05,
          opacity: op(0),
          transform: `translateY(${lift(0)}px)`,
        }}
      >
        {brideName}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 18,
          letterSpacing: 5,
          color: palette.muted,
          marginTop: 10,
          opacity: op(15),
        }}
      >
        BINTI {brideFather.toUpperCase()}
      </div>

      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 70,
          color: palette.rose,
          margin: "30px 0",
          opacity: op(35),
        }}
      >
        &amp;
      </div>

      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 100,
          color: palette.ink,
          lineHeight: 1.05,
          opacity: op(50),
          transform: `translateY(${lift(50)}px)`,
        }}
      >
        {groomName}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 18,
          letterSpacing: 5,
          color: palette.muted,
          marginTop: 10,
          opacity: op(65),
        }}
      >
        BIN {groomFather.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
