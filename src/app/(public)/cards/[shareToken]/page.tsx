import { notFound } from "next/navigation";

/**
 * This route is a legacy stub from an earlier prototype.
 * The live invitation flow uses /undang/[slug] instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PublishedCardPage(_props: unknown) {
  notFound();
}
