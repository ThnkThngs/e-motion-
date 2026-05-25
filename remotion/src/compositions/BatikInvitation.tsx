import { InvitationCore } from "./InvitationCore";
import { themes } from "../themes";
import type { InvitationProps } from "../schema";

export const BatikInvitation: React.FC<InvitationProps> = (props) => (
  <InvitationCore {...props} theme={themes.batik} />
);
