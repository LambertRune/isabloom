type MarkProps = {
  className?: string;
};

export function Bud({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 48 72" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 68 C 24 48, 12 40, 14 24 C 16 12, 24 10, 24 10 C 24 10, 32 12, 34 24 C 36 40, 24 48, 24 68"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 28 C 24 32, 30 28, 30 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
