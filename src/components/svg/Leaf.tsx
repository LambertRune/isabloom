type MarkProps = {
  className?: string;
};

export function Leaf({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 64 96" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 90 C 30 62, 12 48, 14 28 C 16 12, 28 8, 32 6 C 36 8, 48 12, 50 28 C 52 48, 34 62, 32 90"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 86 C 33 60, 36 40, 32 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
