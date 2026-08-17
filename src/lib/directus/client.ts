import { createDirectus, rest, staticToken } from "@directus/sdk";

export function getDirectusUrl(): string | null {
  const url = process.env.DIRECTUS_URL?.replace(/\/$/, "");
  return url || null;
}

export function getDirectus() {
  const url = getDirectusUrl();
  if (!url) {
    return null;
  }
  const token = process.env.DIRECTUS_TOKEN;
  const client = createDirectus(url).with(rest());
  return token ? client.with(staticToken(token)) : client;
}
