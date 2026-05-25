// Pucuk-rebung corner ornament — extracted Phase 4 atom from
// .stitch/designs/pucuk-rebung-ornament.svg. Uses currentColor so consumers
// can theme it via the parent's CSS `color` property. Note: WarisanHero and
// TemplatesSection still ship their own inline ornament implementations on
// purpose — this atom is the canonical version for new surfaces.

export type CornerOrnamentProps = Readonly<{
  size?: number;
  className?: string;
}>;

export const CornerOrnament = ({ size = 40, className }: CornerOrnamentProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20 2L23 15H37L26 23L30 37L20 29L10 37L14 23L3 15H17L20 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 10V30M10 20H30"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.5"
    />
  </svg>
);
