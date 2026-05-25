"use client";

import { Player } from "@remotion/player";
import type { ComponentType } from "react";
import type { InvitationProps } from "@cinematic/schema";

type Props = {
  component: ComponentType<InvitationProps>;
  inputProps: InvitationProps;
};

export const PlayerPreview: React.FC<Props> = ({ component, inputProps }) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 360,
        aspectRatio: "9 / 16",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(20, 12, 4, 0.18)",
        background: "#000",
      }}
    >
      <Player
        component={component}
        inputProps={inputProps}
        durationInFrames={900}
        fps={30}
        compositionWidth={720}
        compositionHeight={1280}
        style={{ width: "100%", height: "100%" }}
        controls
        loop
        autoPlay
        clickToPlay
      />
    </div>
  );
};
