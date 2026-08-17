import { getDirectusUrl } from "@/lib/directus/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const base = getDirectusUrl();
  if (!base || !/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }
  const token = process.env.DIRECTUS_TOKEN;
  const response = await fetch(`${base}/assets/${id}`, {
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
