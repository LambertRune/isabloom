export const NAV_OPEN_MS = 220;
export const NAV_CLOSE_MS = 160;
export const NAV_STAGGER_MS = 40;
export const NAV_HOVER_OPEN_MS = 120;
export const NAV_HOVER_CLOSE_MS = 150;
export const NAV_SCROLL_PX = 36;
export const NAV_DESKTOP_MQ = "(min-width: 768px)";

export function secondsForMotion(ms: number, reduced: boolean): number {
  return reduced ? 0 : ms / 1000;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
