import { describe, expect, it } from "vitest";
import {
  NAV_INTRO_KEY,
  resetNavIntroDecision,
  shouldPlayNavIntro,
} from "./nav-intro.ts";

function memoryStorage(initial?: Map<string, string>) {
  const store = initial ?? new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

describe("navbar botanical intro", () => {
  it("plays once per session and stores the flag", () => {
    resetNavIntroDecision();
    const storage = memoryStorage();

    expect(NAV_INTRO_KEY).toBe("isabloom-nav-intro");
    expect(shouldPlayNavIntro(storage)).toBe(true);
    resetNavIntroDecision();
    expect(shouldPlayNavIntro(storage)).toBe(false);
  });

  it("keeps the same decision if React remounts during the same load", () => {
    resetNavIntroDecision();
    const storage = memoryStorage();
    expect(shouldPlayNavIntro(storage)).toBe(true);
    expect(shouldPlayNavIntro(storage)).toBe(true);
  });

  it("does not play when the visitor prefers reduced motion", () => {
    resetNavIntroDecision();
    expect(shouldPlayNavIntro(memoryStorage(), true)).toBe(false);
  });
});
