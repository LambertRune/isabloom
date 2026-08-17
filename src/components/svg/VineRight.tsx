type MarkProps = {
  className?: string;
};

export function VineRight({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 240 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M232 76 C 208 68, 204 40, 178 42 C 152 44, 148 68, 122 60 C 98 52, 94 26, 66 30 C 46 33, 28 16, 8 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M178 42 C 186 30, 174 18, 164 24"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M122 60 C 112 72, 126 82, 136 76"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
