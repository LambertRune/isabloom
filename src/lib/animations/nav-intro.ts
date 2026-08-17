export const NAV_INTRO_KEY = "isabloom-nav-intro";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function shouldPlayNavIntro(
  storage: StorageLike,
  prefersReducedMotion = false,
): boolean {
  if (prefersReducedMotion) {
    return false;
  }
  if (storage.getItem(NAV_INTRO_KEY)) {
    return false;
  }
  storage.setItem(NAV_INTRO_KEY, "1");
  return true;
}
