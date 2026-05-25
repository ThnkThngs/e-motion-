// Lotus medallion atom — extracted Phase 4 atom from
// .stitch/designs/lotus-medallion.svg. Uses currentColor so consumers
// can theme it via the parent's CSS `color` property.

export type LotusMedallionProps = Readonly<{
  size?: number;
  className?: string;
}>;

export const LotusMedallion = ({ size = 24, className }: LotusMedallionProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
    <path
      d="M12 6C12 6 8 10 8 12C8 14 9.79086 16 12 16C14.2091 16 16 14 16 12C16 10 12 6 12 6Z"
      fill="currentColor"
    />
  </svg>
);
