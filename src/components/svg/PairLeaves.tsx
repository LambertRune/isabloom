type MarkProps = {
  className?: string;
};

export function PairLeaves({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 74 C 48 50, 20 44, 18 24 C 16 12, 30 10, 36 20 C 42 32, 50 40, 50 74"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 74 C 52 50, 80 44, 82 24 C 84 12, 70 10, 64 20 C 58 32, 50 40, 50 74"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
