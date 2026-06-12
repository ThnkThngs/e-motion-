import { InvitationCore } from "./InvitationCore";
import { themes } from "../themes";
import type { InvitationProps } from "../schema";

// Generic, data-driven Porcelain Songket cinematic template — renders any
// couple's payload through the shared InvitationCore timeline in the porcelain
// palette. (The bespoke, video-backed Aulia & Hilmi deliverable lives in
// PorcelainSongketInvitation.tsx.)
export const PorcelainInvitation: React.FC<InvitationProps> = (props) => (
  <InvitationCore {...props} theme={themes["porcelain-songket"]} />
);
