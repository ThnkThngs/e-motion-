import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../compositions/ThemeContext";

export const FloralIntro: React.FC = () => {
  const { palette, fonts, introAsset } = useTheme();
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 50], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(frame, [0, 90], [1.08, 1.0]);
  const sheen = interpolate(frame, [40, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <AbsoluteFill
        style={{
          clipPath: `inset(${(1 - reveal) * 22}%)`,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile(introAsset)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 60%, ${palette.bg}00 0%, ${palette.bg}D9 80%)`,
          opacity: sheen,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontFamily: fonts.script,
            fontSize: 56,
            color: palette.muted,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          ~ The Wedding of ~
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
