"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDirectusUrl } from "@/lib/directus/client";
import { canAccessBeheer, safeBeheerPath, BEHEER_ME_FIELDS, type BeheerUserLike } from "@/lib/auth/access.ts";
import {
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/session.ts";

export async function loginAction(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const returnUrl = safeBeheerPath(String(formData.get("returnUrl") || "/beheer"));
  const url = getDirectusUrl();

  if (!email || !password) {
    return { error: "E-mail en wachtwoord zijn verplicht." };
  }
  if (!url) {
    return { error: "Directus is niet geconfigureerd." };
  }

  try {
    const response = await fetch(`${url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = (await response.json()) as {
      data?: { access_token: string; refresh_token: string; expires: number };
      errors?: Array<{ message?: string }>;
    };
    if (!response.ok || !body.data) {
      return {
        error: body.errors?.[0]?.message || "Inloggen mislukt. Controleer je gegevens.",
      };
    }
    await setAuthCookies(body.data);
    const me = await fetch(
      `${url}/users/me?fields=${BEHEER_ME_FIELDS}`,
      {
        headers: { Authorization: `Bearer ${body.data.access_token}` },
        cache: "no-store",
      },
    );
    const meBody = (await me.json()) as { data?: BeheerUserLike };
    if (!me.ok || !canAccessBeheer(meBody.data ?? null)) {
      await clearAuthCookies();
      return {
        error: "Geen toegang tot het beheerpaneel.",
      };
    }
  } catch {
    return { error: "Er ging iets mis. Probeer het later opnieuw." };
  }

  return { ok: true as const, returnUrl };
}

export async function logoutAction() {
  const store = await cookies();
  const refresh = store.get("refresh_token")?.value;
  const url = getDirectusUrl();
  if (refresh && url) {
    await fetch(`${url}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh, mode: "json" }),
    }).catch(() => undefined);
  }
  await clearAuthCookies();
  redirect("/beheer/login");
}
