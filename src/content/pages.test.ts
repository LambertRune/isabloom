import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relative: string): string {
  return readFileSync(join(root, relative), "utf8");
}

describe("diensten page", () => {
  it("expands the three analysis services with a contact CTA", () => {
    const page = read("src/app/diensten/page.tsx");
    const copy = read("src/content/homepage.ts");
    expect(copy).toContain("Business styling");
    expect(copy).toContain("Home styling");
    expect(copy).toContain("Events");
    expect(page).toContain("loadServices");
    expect(page).toContain("Contacteer ons");
    expect(page).not.toMatch(/prijs/i);
    expect(page).not.toMatch(/lorem ipsum/i);
  });
});

describe("aanbod page", () => {
  it("uses anchors for Winkel, Verhuur Kerst and Verhuur Bloemen", () => {
    const page = read("src/app/aanbod/page.tsx");
    const copy = read("src/content/aanbod.ts");
    expect(copy).toContain('id: "winkel"');
    expect(copy).toContain('id: "verhuur-kerst"');
    expect(copy).toContain('id: "verhuur-bloemen"');
    expect(page).toContain("id={section.id}");
    expect(page).not.toMatch(/winkelmandje/i);
    expect(page).not.toMatch(/prijs/i);
  });

  it("does not invent product names or a mailbox", () => {
    const copy = read("src/content/aanbod.ts");
    expect(copy).toContain("Winkel");
    expect(copy).toContain("Verhuur Kerst");
    expect(copy).toContain("Verhuur Bloemen");
    expect(copy).not.toMatch(/\+32/);
    expect(copy).not.toMatch(/@/);
    expect(copy).not.toMatch(/lorem ipsum/i);
  });
});
