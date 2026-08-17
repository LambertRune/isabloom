type MarkProps = {
  className?: string;
};

export function VineLeft({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 240 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 78 C 28 70, 36 42, 58 40 C 86 38, 92 66, 118 58 C 142 51, 148 28, 176 32 C 198 35, 214 18, 232 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 40 C 52 28, 64 18, 74 22"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M118 58 C 126 70, 114 80, 104 76"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
