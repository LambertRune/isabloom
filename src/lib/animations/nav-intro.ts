export const NAV_INTRO_KEY = "isabloom-nav-intro";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

let loadDecision: boolean | null = null;

export function resetNavIntroDecision() {
  loadDecision = null;
}

export function shouldPlayNavIntro(
  storage: StorageLike,
  prefersReducedMotion = false,
): boolean {
  if (loadDecision !== null) {
    return loadDecision;
  }
  if (prefersReducedMotion) {
    loadDecision = false;
    return false;
  }
  if (storage.getItem(NAV_INTRO_KEY)) {
    loadDecision = false;
    return false;
  }
  storage.setItem(NAV_INTRO_KEY, "1");
  loadDecision = true;
  return true;
}
