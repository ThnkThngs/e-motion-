import { InvitationCore } from "./InvitationCore";
import { themes } from "../themes";
import type { InvitationProps } from "../schema";

// Generic, data-driven Songket Diraja cinematic template — renders any couple's
// payload through the shared InvitationCore timeline in the royal navy/gold
// palette. (The bespoke, fully code-drawn Aulia & Hilmi deliverable lives in
// SongketDirajaInvitation.tsx.)
export const SongketDirajaCinematic: React.FC<InvitationProps> = (props) => (
  <InvitationCore {...props} theme={themes["songket-diraja"]} />
);
