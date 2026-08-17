type MarkProps = {
  className?: string;
};

export function Branch({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 160 70" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 58 C 30 54, 44 30, 70 34 C 96 38, 108 16, 154 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M70 34 C 66 22, 78 14, 86 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M108 22 C 112 10, 124 8, 130 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
