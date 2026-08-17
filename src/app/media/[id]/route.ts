import { getDirectusUrl } from "@/lib/directus/client";
import {
  buildDirectusAssetPath,
  MEDIA_UUID,
  parseAssetTransforms,
} from "@/lib/media/asset-transforms.ts";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const base = getDirectusUrl();
  if (!base || !MEDIA_UUID.test(id)) {
    return new Response("Not found", { status: 404 });
  }
  const transforms = parseAssetTransforms(new URL(request.url).searchParams);
  const token = process.env.DIRECTUS_TOKEN;
  const response = await fetch(`${base}${buildDirectusAssetPath(id, transforms)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "force-cache",
  });
  if (!response.ok || !response.body) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
