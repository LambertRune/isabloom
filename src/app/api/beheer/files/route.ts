import { NextResponse } from "next/server";
import { getAccessToken, getBeheerUser } from "@/lib/auth/session.ts";
import { listImageFiles } from "@/lib/beheer/cms.ts";
import { getDirectusUrl } from "@/lib/directus/client.ts";

export async function GET() {
  const user = await getBeheerUser();
  if (!user) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 401 });
  }
  try {
    const files = await listImageFiles();
    return NextResponse.json(Array.isArray(files) ? files : []);
  } catch {
    return NextResponse.json({ error: "Bibliotheek laden mislukt." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getBeheerUser();
  const token = await getAccessToken();
  const url = getDirectusUrl();
  if (!user || !token || !url) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Geen bestand gekozen." }, { status: 400 });
  }

  const upload = new FormData();
  upload.append("file", file);

  const response = await fetch(`${url}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: upload,
  });
  const body = (await response.json().catch(() => ({}))) as {
    data?: { id: string };
    errors?: Array<{ message?: string }>;
  };
  if (!response.ok || !body.data?.id) {
    return NextResponse.json(
      { error: body.errors?.[0]?.message || "Upload mislukt." },
      { status: response.ok ? 502 : response.status },
    );
  }
  return NextResponse.json({ id: body.data.id });
}
