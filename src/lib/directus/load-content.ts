import { readItems, readSingleton } from "@directus/sdk";
import { AANBOD } from "@/content/aanbod";
import { HOME } from "@/content/homepage";
import { offerCategorySlug, type OfferCategory } from "@/lib/aanbod/categories.ts";
import { slugFromTitle } from "@/lib/beheer/slug.ts";
import { sortedFileIds } from "@/lib/beheer/files.ts";
import { getDirectus } from "./client.ts";
import { mapHomeContent, type CmsService, type HomeContent } from "./map-content.ts";

type FileJunction = {
  directus_files_id?: string | { id?: string | null } | null;
  sort?: number | null;
};

type ServiceRow = {
  title: string;
  slug: string | null;
  short_text: string | null;
  images?: FileJunction[];
};

const SERVICE_QUERY = {
  sort: ["sort"],
  fields: ["title", "slug", "short_text", "images.sort", "images.directus_files_id"],
  deep: { images: { _sort: ["sort"] } },
};

const OFFER_QUERY = {
  sort: ["sort"],
  fields: ["title", "category", "text", "active", "images.sort", "images.directus_files_id"],
  deep: { images: { _sort: ["sort"] } },
};

function mapService(service: ServiceRow): CmsService {
  return {
    title: service.title,
    short_text: service.short_text,
    slug: service.slug,
    images: sortedFileIds(service.images),
  };
}

function fallbackServices() {
  return HOME.services.map((service) => ({
    title: service.title,
    text: service.text,
    slug: slugFromTitle(service.title),
    image: null,
    images: [] as string[],
  }));
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
      client.request(readItems("services", SERVICE_QUERY)),
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

    return mapHomeContent({
      settings: settings as never,
      services: (services as ServiceRow[]).map(mapService),
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
  const client = getDirectus();
  if (!client) {
    return fallbackServices();
  }
  try {
    const services = await client.request(readItems("services", SERVICE_QUERY));
    const mapped = (services as ServiceRow[]).map((service) => {
      const images = sortedFileIds(service.images);
      return {
        title: service.title,
        text: service.short_text ?? "",
        slug: service.slug,
        image: images[0] ?? null,
        images,
      };
    });
    return mapped.length > 0 ? mapped : fallbackServices();
  } catch {
    return fallbackServices();
  }
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
    const items = await client.request(readItems("offer_items", OFFER_QUERY));
    const groups = { ...fallback };
    for (const item of items as Array<{
      title: string;
      category: OfferCategory;
      text: string | null;
      active?: boolean;
      images?: FileJunction[];
    }>) {
      if (item.active === false) {
        continue;
      }
      const id = offerCategorySlug(item.category);
      groups[id].push({
        title: item.title,
        text: item.text ?? "",
        image: sortedFileIds(item.images)[0] ?? null,
      });
    }
    return groups;
  } catch {
    return fallback;
  }
}
