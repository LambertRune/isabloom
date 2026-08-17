type MarkProps = {
  className?: string;
};

export function BerrySpray({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 90 70" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 58 C 22 50, 28 28, 46 30 C 60 32, 66 18, 82 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M28 40 C 24 32, 30 24, 36 28" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="36" cy="26" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="54" cy="22" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="68" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
