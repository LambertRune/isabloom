import { describe, expect, it } from "vitest";
import { NAV_INTRO_KEY, shouldPlayNavIntro } from "./nav-intro.ts";

describe("navbar botanical intro", () => {
  it("plays once per session and stores the flag", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };

    expect(NAV_INTRO_KEY).toBe("isabloom-nav-intro");
    expect(shouldPlayNavIntro(storage)).toBe(true);
    expect(shouldPlayNavIntro(storage)).toBe(false);
  });

  it("does not play when the visitor prefers reduced motion", () => {
    const storage = {
      getItem: () => null,
      setItem: () => {},
    };
    expect(shouldPlayNavIntro(storage, true)).toBe(false);
  });
});
