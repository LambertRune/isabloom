import { HOME } from "@/content/homepage";
import { firstFileId } from "@/lib/beheer/files.ts";

export type CmsSettings = {
  company_name: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url?: string | null;
  maps_url: string | null;
  logo?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
} | null;

export type CmsService = {
  title: string;
  short_text: string | null;
  slug: string | null;
  images: string[];
};

export type CmsPortfolio = {
  title: string | null;
  alt: string | null;
  image: string | null;
};

export type CmsTeam = {
  name: string;
  title: string | null;
  photo: string | null;
};

export type HomeContent = {
  heroTitle: string;
  heroLead: string;
  services: Array<{ title: string; text: string; slug: string | null; image: string | null }>;
  portfolio: Array<{ title: string; image: string | null }>;
  team: Array<{ name: string; title: string; photo: string | null }>;
  phone: string | null;
  email: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  mapsUrl: string | null;
  city: string;
  logo: string | null;
};

export function mapHomeContent(input: {
  settings: CmsSettings;
  services: CmsService[];
  portfolio: CmsPortfolio[];
  team: CmsTeam[];
}): HomeContent {
  const settings = input.settings;
  const services = input.services.slice(0, 4).map((service) => ({
    title: service.title,
    text: service.short_text ?? "",
    slug: service.slug,
    image: service.images[0] ?? null,
  }));

  const portfolio = input.portfolio.slice(0, 6).map((item) => ({
    title: item.title ?? item.alt ?? "Portfolio",
    image: item.image,
  }));

  const team = input.team.map((member) => ({
    name: member.name,
    title: member.title ?? "",
    photo: member.photo,
  }));

  return {
    heroTitle: settings?.hero_title || HOME.heroTitle,
    heroLead: settings?.hero_subtitle || HOME.heroLead,
    services,
    portfolio,
    team,
    phone: settings?.phone || null,
    email: settings?.email || null,
    instagramUrl: settings?.instagram_url || null,
    facebookUrl: settings?.facebook_url || null,
    mapsUrl: settings?.maps_url || null,
    city: settings?.city || "Zwevezele",
    logo: firstFileId(settings?.logo),
  };
}
