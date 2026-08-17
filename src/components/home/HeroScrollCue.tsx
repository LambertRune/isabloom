import { HOME } from "@/content/homepage";

export function HeroScrollCue() {
  return (
    <a
      href="#merkbelofte"
      aria-label="Scroll naar volgende sectie"
      className="mt-8 flex w-fit flex-col items-start gap-3 font-semibold text-gold-deep"
    >
      <span className="text-sm tracking-[0.16em] uppercase">{HOME.scrollLabel}</span>
      <svg
        viewBox="0 0 24 40"
        className="h-10 w-6"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2 V30"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M5 24 L12 32 L19 24"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
