import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relative: string): string {
  return readFileSync(join(root, relative), "utf8");
}

describe("homepage shell", () => {
  it("centers the wordmark with Start, Diensten, Aanbod, Werkwijze and Contact", () => {
    const nav = read("src/components/Navbar.tsx");
    for (const label of [
      "Start",
      "Diensten",
      "Aanbod",
      "Werkwijze",
      "Contact",
    ]) {
      expect(nav).toContain(label);
    }
    expect(nav).toContain("Isabloom");
    expect(nav).toContain("logoFileId");
  });

  it("has the analysis homepage sections", () => {
    const page = read("src/app/(site)/page.tsx");
    for (const id of [
      "hero",
      "merkbelofte",
      "diensten",
      "portfolio",
      "team",
      "contact",
    ]) {
      expect(page).toContain(`id="${id}"`);
    }
  });

  it("names services as in the analysis, not as lorem or a SaaS icon set", () => {
    const copy = read("src/content/homepage.ts");
    expect(copy).toContain("Business styling");
    expect(copy).toContain("Home styling");
    expect(copy).toContain("Events");
    expect(copy).not.toMatch(/lorem ipsum/i);
    expect(copy).not.toMatch(/\bInter\b/);
  });

  it("does not invent a phone number or mailbox", () => {
    const copy = read("src/content/homepage.ts");
    expect(copy).not.toMatch(/\+32/);
    expect(copy).not.toMatch(/@/);
  });

  it("keeps Dutch routes for Diensten and Aanbod", () => {
    expect(read("src/app/(site)/diensten/page.tsx")).toContain("Diensten");
    expect(read("src/app/(site)/aanbod/page.tsx")).toContain("Aanbod");
  });
});
