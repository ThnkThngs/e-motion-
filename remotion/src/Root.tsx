import "./index.css";
import { Composition } from "remotion";
import { FloralInvitation } from "./compositions/FloralInvitation";
import { KhatInvitation } from "./compositions/KhatInvitation";
import { ModernInvitation } from "./compositions/ModernInvitation";
import { WildflowerInvitation } from "./compositions/WildflowerInvitation";
import { SongketInvitation } from "./compositions/SongketInvitation";
import { BatikInvitation } from "./compositions/BatikInvitation";
import { invitationSchema, defaultInvitationProps } from "./schema";

const COMPOSITIONS = [
  { id: "Invitation-Floral", component: FloralInvitation },
  { id: "Invitation-Khat", component: KhatInvitation },
  { id: "Invitation-Modern", component: ModernInvitation },
  { id: "Invitation-Wildflower", component: WildflowerInvitation },
  { id: "Invitation-Songket", component: SongketInvitation },
  { id: "Invitation-Batik", component: BatikInvitation },
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
    </>
  );
};
