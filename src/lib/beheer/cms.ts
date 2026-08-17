import { readFiles, readItems, readSingleton } from "@directus/sdk";
import { getAccessToken, getBeheerUser } from "@/lib/auth/session.ts";
import { firstFileId, toFileList } from "@/lib/beheer/files.ts";
import { slugFromTitle } from "@/lib/beheer/slug.ts";
import { getSessionDirectus } from "@/lib/directus/client.ts";

export async function requireBeheerClient() {
  const user = await getBeheerUser();
  const token = await getAccessToken();
  if (!user || !token) {
    throw new Error("Unauthorized");
  }
  const client = getSessionDirectus(token);
  if (!client) {
    throw new Error("Directus is niet geconfigureerd.");
  }
  return { user, client };
}

export type SiteSettingsRecord = {
  company_name: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  maps_url: string | null;
  opening_hours: string | null;
  logo: string | null;
  favicon: string | null;
};

export type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  short_text: string | null;
  long_text: string | null;
  sort: number | null;
  cta_text: string | null;
  cta_link: string | null;
  image: string | null;
};

export type OfferRecord = {
  id: string;
  title: string;
  category: "shop" | "christmas_rental" | "flower_rental";
  text: string | null;
  sort: number | null;
  active: boolean;
  image: string | null;
};

export type PortfolioRecord = {
  id: string;
  title: string | null;
  alt: string | null;
  category: string | null;
  sort: number | null;
  image: string | null;
};

export type TeamRecord = {
  id: string;
  name: string;
  title: string | null;
  photo: string | null;
  sort: number | null;
  active: boolean;
};

type FileJunction = { directus_files_id?: string | null };

export async function loadSiteSettings(): Promise<SiteSettingsRecord> {
  const { client } = await requireBeheerClient();
  const settings = await client.request(readSingleton("site_settings"));
  const row = settings as SiteSettingsRecord;
  return {
    company_name: row.company_name ?? null,
    street: row.street ?? null,
    postal_code: row.postal_code ?? null,
    city: row.city ?? null,
    country: row.country ?? "BE",
    phone: row.phone ?? null,
    email: row.email ?? null,
    instagram_url: row.instagram_url ?? null,
    facebook_url: row.facebook_url ?? null,
    maps_url: row.maps_url ?? null,
    opening_hours: row.opening_hours ?? null,
    logo: firstFileId(row.logo),
    favicon: firstFileId(row.favicon),
  };
}

export async function loadServicesAdmin(): Promise<ServiceRecord[]> {
  const { client } = await requireBeheerClient();
  const items = await client.request(
    readItems("services", {
      sort: ["sort"],
      fields: [
        "id",
        "title",
        "slug",
        "short_text",
        "long_text",
        "sort",
        "cta_text",
        "cta_link",
        "images.directus_files_id",
      ],
    }),
  );
  return (items as Array<ServiceRecord & { images?: FileJunction[] }>).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    short_text: item.short_text,
    long_text: item.long_text,
    sort: item.sort,
    cta_text: item.cta_text,
    cta_link: item.cta_link,
    image: firstFileId(item.images),
  }));
}

export async function loadOffersAdmin(): Promise<OfferRecord[]> {
  const { client } = await requireBeheerClient();
  const items = await client.request(
    readItems("offer_items", {
      sort: ["sort"],
      fields: ["id", "title", "category", "text", "sort", "active", "images.directus_files_id"],
    }),
  );
  return (items as Array<OfferRecord & { images?: FileJunction[] }>).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    text: item.text,
    sort: item.sort,
    active: item.active !== false,
    image: firstFileId(item.images),
  }));
}

export async function loadPortfolioAdmin(): Promise<PortfolioRecord[]> {
  const { client } = await requireBeheerClient();
  const items = await client.request(
    readItems("portfolio_items", {
      sort: ["sort"],
      fields: ["id", "title", "alt", "category", "sort", "image"],
    }),
  );
  return (items as PortfolioRecord[]).map((item) => ({
    ...item,
    image: firstFileId(item.image),
  }));
}

export async function loadTeamAdmin(): Promise<TeamRecord[]> {
  const { client } = await requireBeheerClient();
  const items = await client.request(
    readItems("team_members", {
      sort: ["sort"],
      fields: ["id", "name", "title", "photo", "sort", "active"],
    }),
  );
  return (items as TeamRecord[]).map((item) => ({
    ...item,
    photo: firstFileId(item.photo),
    active: item.active !== false,
  }));
}

export async function listImageFiles() {
  const { client } = await requireBeheerClient();
  return client.request(
    readFiles({
      fields: ["id", "title", "type"],
      sort: ["-uploaded_on"],
      limit: 100,
      filter: { type: { _starts_with: "image/" } },
    }),
  );
}

export function text(formData: FormData, key: string): string {
  return String(formData.get(key) || "").trim();
}

export function optionalText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

export function numberValue(formData: FormData, key: string): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

export function boolValue(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function fileValue(formData: FormData, key: string): string | null {
  return optionalText(formData, key);
}

export function serviceSlug(formData: FormData): string {
  return slugFromTitle(text(formData, "slug") || text(formData, "title"));
}

export { toFileList };
