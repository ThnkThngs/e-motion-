import "./index.css";
import { Composition } from "remotion";
import { FloralInvitation } from "./compositions/FloralInvitation";
import { KhatInvitation } from "./compositions/KhatInvitation";
import { ModernInvitation } from "./compositions/ModernInvitation";
import { WildflowerInvitation } from "./compositions/WildflowerInvitation";
import { SongketInvitation } from "./compositions/SongketInvitation";
import { BatikInvitation } from "./compositions/BatikInvitation";
import { PorcelainInvitation } from "./compositions/PorcelainInvitation";
import {
  PorcelainSongketInvitation,
  PORCELAIN_FPS,
  PORCELAIN_DURATION,
} from "./compositions/PorcelainSongketInvitation";
import { invitationSchema, defaultInvitationProps } from "./schema";

const COMPOSITIONS = [
  { id: "Invitation-Floral", component: FloralInvitation },
  { id: "Invitation-Khat", component: KhatInvitation },
  { id: "Invitation-Modern", component: ModernInvitation },
  { id: "Invitation-Wildflower", component: WildflowerInvitation },
  { id: "Invitation-Songket", component: SongketInvitation },
  { id: "Invitation-Batik", component: BatikInvitation },
  { id: "Invitation-Porcelain", component: PorcelainInvitation },
] as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {COMPOSITIONS.map(({ id, component }) => (
        <Composition
          key={id}
          id={id}
          component={component}
          durationInFrames={900}
          fps={30}
          width={720}
          height={1280}
          schema={invitationSchema}
          defaultProps={defaultInvitationProps}
        />
      ))}

      {/* Bespoke Aulia & Hilmi deliverable — self-contained, 18s storyboard. */}
      <Composition
        id="PorcelainSongket"
        component={PorcelainSongketInvitation}
        durationInFrames={PORCELAIN_DURATION}
        fps={PORCELAIN_FPS}
        width={720}
        height={1280}
      />
    </>
  );
};
