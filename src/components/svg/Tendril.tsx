type MarkProps = {
  className?: string;
};

export function Tendril({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 70 110" fill="none" className={className} aria-hidden="true">
      <path
        d="M36 104 C 20 86, 52 74, 28 58 C 8 44, 48 36, 30 20 C 18 10, 34 8, 40 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
