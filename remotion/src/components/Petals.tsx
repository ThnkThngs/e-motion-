import { useCurrentFrame, useVideoConfig, AbsoluteFill, random } from "remotion";

type Props = {
  count?: number;
  seed?: string;
};

export const Petals: React.FC<Props> = ({ count = 26, seed = "petals" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const petals = Array.from({ length: count }, (_, i) => {
    const id = `${seed}-${i}`;
    const baseX = random(`${id}-x`) * width;
    const startY = random(`${id}-y`) * height * 1.4 - height * 0.3;
    const speed = 0.35 + random(`${id}-s`) * 0.65;
    const drift = (random(`${id}-d`) - 0.5) * 220;
    const sizePx = 6 + random(`${id}-r`) * 10;
    const hue = random(`${id}-h`);
    const color = hue < 0.33 ? "#D8AED2" : hue < 0.66 ? "#F2C66A" : "#B7C97D";
    const phase = random(`${id}-p`) * Math.PI * 2;

    const t = ((frame * speed + i * 11) % durationInFrames) / durationInFrames;
    const y = startY + t * (height + 200);
    const x = baseX + Math.sin(frame / 18 + phase) * drift * 0.18;
    const rot = frame * (0.6 + random(`${id}-rot`)) + i * 17;
    const opacity = 0.55 + Math.sin(frame / 22 + phase) * 0.15;

    return (
      <div
        key={id}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: sizePx,
          height: sizePx * 1.6,
          background: color,
          borderRadius: "60% 40% 50% 50% / 60% 40% 60% 40%",
          opacity,
          transform: `rotate(${rot}deg)`,
          filter: "blur(0.4px)",
          mixBlendMode: "multiply",
        }}
      />
    );
  });

  return <AbsoluteFill style={{ pointerEvents: "none" }}>{petals}</AbsoluteFill>;
};
