import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../compositions/ThemeContext";
import type { InvitationProps } from "../schema";

export const BismillahScene: React.FC<Pick<InvitationProps, "parents" | "inviteBody">> = ({
  parents,
  inviteBody,
}) => {
  const { palette, fonts } = useTheme();
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 20, 130, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const op = (delay: number) =>
    interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp" });

  const lift = (delay: number) =>
    interpolate(frame, [delay, delay + 30], [16, 0], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const [a, b] = parents.split("&");

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
      <div
        style={{
          fontFamily: fonts.arabic,
          fontSize: 64,
          color: palette.ink,
          opacity: op(0),
          transform: `translateY(${lift(0)}px)`,
          marginBottom: 30,
          direction: "rtl",
        }}
      >
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </div>

      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 22,
          letterSpacing: 2,
          color: palette.ink,
          fontWeight: 600,
          opacity: op(20),
          transform: `translateY(${lift(20)}px)`,
        }}
      >
        {a?.trim()}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 22,
          color: palette.muted,
          margin: "6px 0",
          opacity: op(28),
        }}
      >
        &amp;
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 22,
          letterSpacing: 2,
          color: palette.ink,
          fontWeight: 600,
          opacity: op(36),
          transform: `translateY(${lift(36)}px)`,
        }}
      >
        {b?.trim()}
      </div>

      <div
        style={{
          marginTop: 44,
          fontFamily: fonts.body,
          fontSize: 22,
          color: palette.muted,
          lineHeight: 1.7,
          whiteSpace: "pre-line",
          opacity: op(55),
        }}
      >
        {inviteBody}
      </div>
    </AbsoluteFill>
  );
};
