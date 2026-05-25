import type { JSX } from "react";

// Tiny helper for i18n strings that contain inline <em> / <br> markup.
// Only those two tags are allowed — everything is authored in i18n.ts.
const ALLOWED = /<\/?(em|br)\s*\/?>/gi;
const escapeOther = (s: string) => s.replace(/<(?!\/?(em|br)\b)/gi, "&lt;");

export const Html = ({ html, as: Tag = "span", ...rest }: { html: string; as?: keyof JSX.IntrinsicElements } & Record<string, unknown>) => {
  // Strip anything that is not a permitted tag, then re-render.
  const safe = escapeOther(html).replace(ALLOWED, (m) => m.toLowerCase());
  // Cast to any to satisfy the dynamic Tag inference.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return <Component {...rest} dangerouslySetInnerHTML={{ __html: safe }} />;
};
