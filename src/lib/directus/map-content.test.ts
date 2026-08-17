import { describe, expect, it } from "vitest";
import { HOME } from "../../content/homepage.ts";
import { mapHomeContent } from "./map-content.ts";

describe("Directus home mapping", () => {
  it("keeps analysis copy when Directus is empty", () => {
    const mapped = mapHomeContent({
      settings: null,
      services: [],
      portfolio: [],
      team: [],
    });

    expect(mapped.heroTitle).toBe(HOME.heroTitle);
    expect(mapped.services.map((item) => item.title)).toEqual(
      HOME.services.map((item) => item.title),
    );
    expect(mapped.phone).toBeNull();
    expect(mapped.email).toBeNull();
  });

  it("prefers Directus fields when they are filled", () => {
    const mapped = mapHomeContent({
      settings: {
        company_name: "Isabloom",
        city: "Zwevezele",
        phone: "+32 50 00 00 00",
        email: "info@example.invalid",
        instagram_url: "https://instagram.com/isabloom",
        maps_url: "https://maps.google.com/?q=Zwevezele",
        hero_title: null,
        hero_subtitle: null,
      },
      services: [
        {
          title: "Business styling",
          short_text: "Etalages uit Directus.",
          slug: "business-styling",
          images: [],
        },
      ],
      portfolio: [{ title: "Atelier", alt: "Atelier", image: "file-1" }],
      team: [{ name: "Isa", title: "Stylist", photo: null }],
    });

    expect(mapped.phone).toBe("+32 50 00 00 00");
    expect(mapped.email).toBe("info@example.invalid");
    expect(mapped.services[0]?.text).toBe("Etalages uit Directus.");
    expect(mapped.portfolio[0]?.title).toBe("Atelier");
    expect(mapped.team[0]?.name).toBe("Isa");
  });
});
