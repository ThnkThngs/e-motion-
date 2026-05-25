import { InvitationCore } from "./InvitationCore";
import { themes } from "../themes";
import type { InvitationProps } from "../schema";

export const TenunPahangInvitation: React.FC<InvitationProps> = (props) => (
  <InvitationCore {...props} theme={themes["tenun-pahang"]} />
);
