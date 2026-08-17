type MarkProps = {
  className?: string;
};

export function StemCurl({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 50 120" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 114 C 22 80, 28 60, 18 42 C 8 24, 28 18, 32 30 C 36 42, 18 46, 16 34"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
