import { describe, expect, it } from "vitest";
import { isActiveNav } from "./active.ts";

describe("active nav matching", () => {
  it("marks Start only on the homepage", () => {
    expect(isActiveNav("/", "/")).toBe(true);
    expect(isActiveNav("/", "/diensten")).toBe(false);
    expect(isActiveNav("/", "/aanbod")).toBe(false);
  });

  it("marks Diensten and Aanbod from their routes", () => {
    expect(isActiveNav("/diensten", "/diensten")).toBe(true);
    expect(isActiveNav("/aanbod", "/aanbod")).toBe(true);
    expect(isActiveNav("/diensten", "/aanbod")).toBe(false);
  });

  it("ignores in-page hashes so Werkwijze does not steal Start", () => {
    expect(isActiveNav("/#team", "/")).toBe(false);
    expect(isActiveNav("/#contact", "/")).toBe(false);
  });
});
