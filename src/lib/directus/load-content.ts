import { readItems, readSingleton } from "@directus/sdk";
import { AANBOD } from "@/content/aanbod";
import { HOME } from "@/content/homepage";
import { slugFromTitle } from "@/lib/beheer/slug.ts";
import { getDirectus } from "./client.ts";
import { mapHomeContent, type CmsService, type HomeContent } from "./map-content.ts";

type FileJunction = {
  directus_files_id?: string | null;
};

function fileIds(images: FileJunction[] | undefined): string[] {
  return (images ?? [])
    .map((item) => item.directus_files_id)
    .filter((id): id is string => Boolean(id));
}

export async function loadHomeContent(): Promise<HomeContent> {
  const empty = mapHomeContent({
    settings: null,
    services: [],
    portfolio: [],
    team: [],
  });
  const client = getDirectus();
  if (!client) {
    return empty;
  }

  try {
    const [settings, services, portfolio, team] = await Promise.all([
      client.request(readSingleton("site_settings")),
      client.request(
        readItems("services", {
          sort: ["sort"],
          fields: ["title", "slug", "short_text", "images.directus_files_id"],
        }),
      ),
      client.request(
        readItems("portfolio_items", {
          sort: ["sort"],
          fields: ["title", "alt", "image"],
        }),
      ),
      client.request(
        readItems("team_members", {
          sort: ["sort"],
          fields: ["name", "title", "photo", "active"],
        }),
      ),
    ]);

    const mappedServices: CmsService[] = (services as CmsService[]).map((service) => ({
      ...service,
      images: fileIds(service.images as unknown as FileJunction[]),
    }));

    return mapHomeContent({
      settings: settings as never,
      services: mappedServices,
      portfolio: portfolio as never,
      team: (team as Array<{ active?: boolean; name: string; title: string | null; photo: string | null }>).filter(
        (member) => member.active !== false,
      ),
    });
  } catch {
    return empty;
  }
}

export async function loadServices() {
  const home = await loadHomeContent();
  if (home.services.length > 0) {
    return home.services;
  }
  return HOME.services.map((service) => ({
    title: service.title,
    text: service.text,
    slug: slugFromTitle(service.title),
    image: null,
  }));
}

export async function loadOfferGroups() {
  const fallback = Object.fromEntries(
    AANBOD.sections.map((section) => [section.id, []]),
  ) as Record<string, Array<{ title: string; text: string; image: string | null }>>;
  const client = getDirectus();
  if (!client) {
    return fallback;
  }
  try {
    const items = await client.request(
      readItems("offer_items", {
        sort: ["sort"],
        fields: ["title", "category", "text", "active", "images.directus_files_id"],
      }),
    );
    const groups = { ...fallback };
    for (const item of items as Array<{
      title: string;
      category: "shop" | "christmas_rental" | "flower_rental";
      text: string | null;
      active?: boolean;
      images?: FileJunction[];
    }>) {
      if (item.active === false) {
        continue;
      }
      const id =
        item.category === "shop"
          ? "winkel"
          : item.category === "christmas_rental"
            ? "verhuur-kerst"
            : "verhuur-bloemen";
      groups[id].push({
        title: item.title,
        text: item.text ?? "",
        image: fileIds(item.images)[0] ?? null,
      });
    }
    return groups;
  } catch {
    return fallback;
  }
}
