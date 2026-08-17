type MarkProps = {
  className?: string;
};

export function FlowerHead({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M40 18 C 34 8, 22 10, 24 22 C 18 16, 10 24, 20 30 C 10 34, 14 46, 26 42 C 22 52, 34 58, 38 48 C 42 58, 54 52, 50 42 C 62 46, 66 34, 56 30 C 66 24, 58 16, 52 22 C 54 10, 42 8, 40 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34" cy="36" r="1.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="40" cy="32" r="1.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="46" cy="36" r="1.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="40" cy="40" r="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
