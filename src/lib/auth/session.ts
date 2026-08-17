import { cookies } from "next/headers";
import { getDirectusUrl } from "@/lib/directus/client";
import { BEHEER_ME_FIELDS, canAccessBeheer, type BeheerUserLike } from "./access.ts";

const ACCESS = "access_token";
const REFRESH = "refresh_token";

export type BeheerUser = BeheerUserLike & {
  id: string;
  email: string;
};

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS)?.value ?? null;
}

export async function setAuthCookies(tokens: {
  access_token: string;
  refresh_token: string;
  expires: number;
}): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(ACCESS, tokens.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: Math.max(60, Math.floor(tokens.expires / 1000)),
    path: "/",
  });
  store.set(REFRESH, tokens.refresh_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS);
  store.delete(REFRESH);
}

export async function getBeheerUser(): Promise<BeheerUser | null> {
  const token = await getAccessToken();
  const url = getDirectusUrl();
  if (!token || !url) {
    return null;
  }
  const response = await fetch(
    `${url}/users/me?fields=${BEHEER_ME_FIELDS}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!response.ok) {
    return null;
  }
  const body = (await response.json()) as { data: BeheerUser };
  if (!canAccessBeheer(body.data)) {
    return null;
  }
  return body.data;
}
