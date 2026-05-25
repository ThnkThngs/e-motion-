import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { useTheme } from "../compositions/ThemeContext";
import type { InvitationProps } from "../schema";

export const OutroScene: React.FC<Pick<InvitationProps, "brandLine">> = ({ brandLine }) => {
  const { palette, fonts } = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const fade = interpolate(frame, [0, 18, 50, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 96,
          color: palette.rose,
          transform: `scale(${0.85 + enter * 0.15})`,
          textShadow: `0 4px 18px ${palette.rose}2E`,
        }}
      >
        {brandLine}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: fonts.body,
          fontSize: 16,
          letterSpacing: 6,
          color: palette.muted,
          textTransform: "uppercase",
          opacity: enter,
        }}
      >
        e-motion.my
      </div>
    </AbsoluteFill>
  );
};
