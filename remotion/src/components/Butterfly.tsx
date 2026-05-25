import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";

type Props = {
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size?: number;
  hue?: "pink" | "orange";
  flapSpeed?: number;
};

export const Butterfly: React.FC<Props> = ({
  delay,
  startX,
  startY,
  endX,
  endY,
  size = 120,
  hue = "pink",
  flapSpeed = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - delay;
  if (local < 0) return null;

  const entry = spring({
    frame: local,
    fps,
    config: { damping: 14, stiffness: 70 },
    durationInFrames: 90,
  });

  const travel = interpolate(local, [0, 180], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const x = startX + (endX - startX) * travel;
  const yBase = startY + (endY - startY) * travel;
  const bob = Math.sin(local / 12) * 18;
  const tilt = Math.sin(local / flapSpeed) * 12;
  const flap = Math.abs(Math.sin(local / flapSpeed)) * 0.35 + 0.65;

  const exit = interpolate(local, [180, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = entry * exit;

  const wingLeft = hue === "pink" ? "#F5A2B5" : "#F2B36A";
  const wingRight = hue === "pink" ? "#E07A95" : "#E89048";
  const accent = hue === "pink" ? "#FFD6E1" : "#FFE3B5";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: yBase + bob,
        width: size,
        height: size,
        opacity,
        transform: `rotate(${tilt}deg)`,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <ellipse cx="50" cy="50" rx="2.4" ry="22" fill="#3A2A1F" />
        <ellipse
          cx="32"
          cy="42"
          rx={28 * flap}
          ry="22"
          fill={wingLeft}
          opacity="0.9"
          transform="rotate(-12 32 42)"
        />
        <ellipse
          cx="68"
          cy="42"
          rx={28 * flap}
          ry="22"
          fill={wingRight}
          opacity="0.9"
          transform="rotate(12 68 42)"
        />
        <ellipse
          cx="34"
          cy="62"
          rx={20 * flap}
          ry="16"
          fill={wingLeft}
          opacity="0.85"
          transform="rotate(8 34 62)"
        />
        <ellipse
          cx="66"
          cy="62"
          rx={20 * flap}
          ry="16"
          fill={wingRight}
          opacity="0.85"
          transform="rotate(-8 66 62)"
        />
        <circle cx="32" cy="42" r="3" fill={accent} opacity="0.9" />
        <circle cx="68" cy="42" r="3" fill={accent} opacity="0.9" />
        <circle cx="50" cy="32" r="2.5" fill="#3A2A1F" />
        <path d="M48 30 Q44 22 42 18" stroke="#3A2A1F" strokeWidth="1.2" fill="none" />
        <path d="M52 30 Q56 22 58 18" stroke="#3A2A1F" strokeWidth="1.2" fill="none" />
      </svg>
    </div>
  );
};
