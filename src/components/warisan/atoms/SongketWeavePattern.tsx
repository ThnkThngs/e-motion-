// Songket weave pattern atom — extracted Phase 4 atom from
// .stitch/designs/songket-weave-pattern.svg. Exported in two forms:
//
//   1. <SongketWeavePattern /> — a standalone <svg> for use as an inline
//      decorative tile (consumers can also do `width="100%" height="100%"`).
//   2. getSongketWeaveDataUrl(opacity, color) — a helper that produces a
//      data: URL suitable for `style={{ backgroundImage: url('…'), backgroundSize: '100px 100px' }}`.
//
// Both default to opacity 0.18 and `currentColor` (the SVG component) /
// gold-ish color (the helper, since data: URLs can't read CSS variables).

export type SongketWeavePatternProps = Readonly<{
  size?: number;
  opacity?: number;
  color?: string;
  className?: string;
}>;

export const SongketWeavePattern = ({
  size = 100,
  opacity = 0.18,
  color,
  className,
}: SongketWeavePatternProps) => {
  // If a color is passed, use it; otherwise let currentColor inherit.
  const stroke = color ?? "currentColor";
  const fill = color ?? "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <pattern
        id="songketPattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M20 0L40 20L20 40L0 20L20 0Z"
          stroke={stroke}
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M20 5L35 20L20 35L5 20L20 5Z"
          stroke={stroke}
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        <circle cx="20" cy="20" r="2" fill={fill} opacity="0.4" />
      </pattern>
      <rect width="100" height="100" fill="url(#songketPattern)" />
    </svg>
  );
};

/**
 * Returns a data: URL for the songket pattern, suitable for use as a tiled
 * CSS background. Default opacity 0.18, default color a warm songket gold.
 */
export const getSongketWeaveDataUrl = (
  opacity = 0.18,
  color = "#c9a24e",
): string => {
  // Encode the color once — colon and # are URL-unsafe in inline data: SVGs.
  const c = encodeURIComponent(color);
  const o = opacity.toFixed(3);
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' opacity='${o}'>` +
    `<path d='M20 0L40 20L20 40L0 20L20 0Z' stroke='${color}' stroke-width='0.5' fill='none' opacity='0.3'/>` +
    `<path d='M20 5L35 20L20 35L5 20L20 5Z' stroke='${color}' stroke-width='0.5' fill='none' opacity='0.2'/>` +
    `<circle cx='20' cy='20' r='2' fill='${color}' opacity='0.4'/>` +
    `</svg>`;
  // We've already URL-encoded the color above into `c`; encode the whole
  // payload but reuse the prepared color where needed.
  void c;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
