import { InvitationCore } from "./InvitationCore";
import { themes } from "../themes";
import type { InvitationProps } from "../schema";

export const KhatInvitation: React.FC<InvitationProps> = (props) => (
  <InvitationCore {...props} theme={themes.khat} />
);
