import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../compositions/ThemeContext";

type Props = {
  src?: string;
  opacity?: number;
  bloomFrames?: number;
};

export const FloralBorder: React.FC<Props> = ({
  src,
  opacity = 1,
  bloomFrames = 60,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const bloom = interpolate(frame, [0, bloomFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const inset = (1 - bloom) * 18;
  const scale = 0.96 + bloom * 0.04;
  const assetSrc = src ?? theme.borderAsset;

  return (
    <AbsoluteFill
      style={{
        opacity,
        clipPath: `inset(${inset}% round 0px)`,
        transform: `scale(${scale})`,
      }}
    >
      <Img
        src={staticFile(assetSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </AbsoluteFill>
  );
};
