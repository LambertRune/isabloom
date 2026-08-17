"use server";

import { createItem, deleteItem, updateItem, updateSingleton } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import {
  boolValue,
  fileValue,
  numberValue,
  optionalText,
  requireBeheerClient,
  serviceSlug,
  text,
  toFileList,
} from "@/lib/beheer/cms.ts";

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/diensten");
  revalidatePath("/aanbod");
  revalidatePath("/beheer", "layout");
}

export async function saveSiteSettingsAction(_prev: unknown, formData: FormData) {
  try {
    const { client } = await requireBeheerClient();
    const company_name = text(formData, "company_name");
    if (!company_name) {
      return { error: "Bedrijfsnaam is verplicht." };
    }
    await client.request(
      updateSingleton("site_settings", {
        company_name,
        street: optionalText(formData, "street"),
        postal_code: optionalText(formData, "postal_code"),
        city: optionalText(formData, "city"),
        country: optionalText(formData, "country") || "BE",
        phone: optionalText(formData, "phone"),
        email: optionalText(formData, "email"),
        instagram_url: optionalText(formData, "instagram_url"),
        facebook_url: optionalText(formData, "facebook_url"),
        maps_url: optionalText(formData, "maps_url"),
        logo: fileValue(formData, "logo"),
        favicon: fileValue(formData, "favicon"),
      }),
    );
    refreshPublic();
    return { ok: true as const };
  } catch {
    return { error: "Opslaan mislukt." };
  }
}

export async function saveServiceAction(_prev: unknown, formData: FormData) {
  try {
    const { client } = await requireBeheerClient();
    const id = optionalText(formData, "id");
    const title = text(formData, "title");
    const short_text = text(formData, "short_text");
    if (!title) {
      return { error: "Titel is verplicht." };
    }
    if (!short_text) {
      return { error: "Korte tekst is verplicht." };
    }
    const payload = {
      title,
      slug: serviceSlug(formData),
      short_text,
      long_text: optionalText(formData, "long_text"),
      sort: numberValue(formData, "sort"),
      cta_text: optionalText(formData, "cta_text"),
      cta_link: optionalText(formData, "cta_link"),
      images: toFileList(fileValue(formData, "image")),
    };
    if (id) {
      await client.request(updateItem("services", id, payload));
    } else {
      await client.request(createItem("services", payload));
    }
    refreshPublic();
    revalidatePath("/beheer/diensten");
    return { ok: true as const };
  } catch {
    return { error: "Opslaan mislukt." };
  }
}

export async function deleteServiceAction(id: string) {
  const { client } = await requireBeheerClient();
  await client.request(deleteItem("services", id));
  refreshPublic();
  revalidatePath("/beheer/diensten");
}

export async function saveOfferAction(_prev: unknown, formData: FormData) {
  try {
    const { client } = await requireBeheerClient();
    const id = optionalText(formData, "id");
    const title = text(formData, "title");
    const category = text(formData, "category") as
      | "shop"
      | "christmas_rental"
      | "flower_rental";
    if (!title) {
      return { error: "Titel is verplicht." };
    }
    if (!["shop", "christmas_rental", "flower_rental"].includes(category)) {
      return { error: "Kies een categorie." };
    }
    const payload = {
      title,
      category,
      text: optionalText(formData, "text"),
      sort: numberValue(formData, "sort"),
      active: boolValue(formData, "active"),
      images: toFileList(fileValue(formData, "image")),
    };
    if (id) {
      await client.request(updateItem("offer_items", id, payload));
    } else {
      await client.request(createItem("offer_items", payload));
    }
    refreshPublic();
    revalidatePath("/beheer/aanbod");
    return { ok: true as const };
  } catch {
    return { error: "Opslaan mislukt." };
  }
}

export async function deleteOfferAction(id: string) {
  const { client } = await requireBeheerClient();
  await client.request(deleteItem("offer_items", id));
  refreshPublic();
  revalidatePath("/beheer/aanbod");
}

export async function savePortfolioAction(_prev: unknown, formData: FormData) {
  try {
    const { client } = await requireBeheerClient();
    const id = optionalText(formData, "id");
    const image = fileValue(formData, "image");
    if (!image) {
      return { error: "Een afbeelding is verplicht." };
    }
    const payload = {
      title: optionalText(formData, "title"),
      alt: optionalText(formData, "alt"),
      category: optionalText(formData, "category"),
      sort: numberValue(formData, "sort"),
      image,
    };
    if (id) {
      await client.request(updateItem("portfolio_items", id, payload));
    } else {
      await client.request(createItem("portfolio_items", payload));
    }
    refreshPublic();
    revalidatePath("/beheer/portfolio");
    return { ok: true as const };
  } catch {
    return { error: "Opslaan mislukt." };
  }
}

export async function deletePortfolioAction(id: string) {
  const { client } = await requireBeheerClient();
  await client.request(deleteItem("portfolio_items", id));
  refreshPublic();
  revalidatePath("/beheer/portfolio");
}

export async function saveTeamAction(_prev: unknown, formData: FormData) {
  try {
    const { client } = await requireBeheerClient();
    const id = optionalText(formData, "id");
    const name = text(formData, "name");
    if (!name) {
      return { error: "Naam is verplicht." };
    }
    const payload = {
      name,
      title: optionalText(formData, "title"),
      photo: fileValue(formData, "photo"),
      sort: numberValue(formData, "sort"),
      active: boolValue(formData, "active"),
    };
    if (id) {
      await client.request(updateItem("team_members", id, payload));
    } else {
      await client.request(createItem("team_members", payload));
    }
    refreshPublic();
    revalidatePath("/beheer/team");
    return { ok: true as const };
  } catch {
    return { error: "Opslaan mislukt." };
  }
}

export async function deleteTeamAction(id: string) {
  const { client } = await requireBeheerClient();
  await client.request(deleteItem("team_members", id));
  refreshPublic();
  revalidatePath("/beheer/team");
}
