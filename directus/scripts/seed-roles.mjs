import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PUBLIC_URL = (process.env.PUBLIC_URL ?? "http://localhost:8055").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ROLES_PATH = process.env.ROLES_PATH ?? "/seed/roles.json";
const PING_ATTEMPTS = 30;
const PING_DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const response = await fetch(`${PUBLIC_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${text}`);
  }
  return body;
}

async function waitForPing() {
  for (let attempt = 1; attempt <= PING_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${PUBLIC_URL}/server/ping`);
      if (response.ok) {
        return;
      }
    } catch {
      // Directus is not ready yet.
    }
    if (attempt === PING_ATTEMPTS) {
      throw new Error(`Directus did not become ready at ${PUBLIC_URL}/server/ping`);
    }
    await sleep(PING_DELAY_MS);
  }
}

async function login() {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });
  return data.data.access_token;
}

async function findByName(token, path, name) {
  const query = new URLSearchParams({
    "filter[name][_eq]": name,
  });
  const result = await request(`${path}?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data[0]?.id ?? null;
}

async function upsertRole(token, role) {
  const existingId = await findByName(token, "/roles", role.name);
  if (existingId) {
    return existingId;
  }
  const created = await request("/roles", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      name: role.name,
      app_access: role.appAccess,
      admin_access: role.adminAccess,
    }),
  });
  return created.data.id;
}

async function upsertPolicy(token, role, roleId) {
  let policyId = await findByName(token, "/policies", role.name);
  if (!policyId) {
    const created = await request("/policies", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: role.name,
        app_access: role.appAccess,
        admin_access: role.adminAccess,
      }),
    });
    policyId = created.data.id;
  }

  const accessQuery = new URLSearchParams({
    "filter[role][_eq]": roleId,
    "filter[policy][_eq]": policyId,
  });
  const access = await request(`/access?${accessQuery.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (access.data.length === 0) {
    await request("/access", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        role: roleId,
        policy: policyId,
      }),
    });
  }

  return policyId;
}

export function hasNonEmptyFilter(permissions) {
  return Boolean(
    permissions &&
      typeof permissions === "object" &&
      !Array.isArray(permissions) &&
      Object.keys(permissions).length > 0,
  );
}

export function isLicenseFilterBlock(error) {
  return error instanceof Error && error.message.includes("custom_permission_rules_enabled");
}

async function postPermission(token, body) {
  const headers = { Authorization: `Bearer ${token}` };
  try {
    return await request("/permissions", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (isLicenseFilterBlock(error) && hasNonEmptyFilter(body.permissions)) {
      console.warn(
        `Website filter on ${body.collection}.${body.action} skipped (no LICENSE_KEY). Granting unfiltered read; Next.js still filters.`,
      );
      return await request("/permissions", {
        method: "POST",
        headers,
        body: JSON.stringify({ ...body, permissions: {} }),
      });
    }
    throw error;
  }
}

async function replacePermissions(token, policyId, collections) {
  for (const [collection, spec] of Object.entries(collections)) {
    const query = new URLSearchParams({
      "filter[policy][_eq]": policyId,
      "filter[collection][_eq]": collection,
    });
    const existing = await request(`/permissions?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    for (const permission of existing.data) {
      await request(`/permissions/${permission.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    for (const action of spec.actions) {
      await postPermission(token, {
        policy: policyId,
        collection,
        action,
        fields: ["*"],
        permissions: spec.filter ?? {},
        validation: {},
        presets: null,
      });
    }
  }
}

async function upsertWebsiteReader(token, websiteRoleId) {
  const staticToken = process.env.DIRECTUS_TOKEN;
  if (!staticToken) {
    console.warn("DIRECTUS_TOKEN is unset. The Next.js site cannot read as Website.");
    return;
  }
  const query = new URLSearchParams({
    "filter[email][_eq]": "website@isabloom.local",
  });
  const existing = await request(`/users?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = {
    email: "website@isabloom.local",
    password: `${staticToken}-local`,
    role: websiteRoleId,
    token: staticToken,
    status: "active",
  };
  if (existing.data[0]?.id) {
    await request(`/users/${existing.data[0].id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return;
  }
  await request("/users", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

async function setDefaultLanguage(token) {
  await request("/settings", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ default_language: "nl-NL" }),
  });
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await waitForPing();
  const token = await login();
  const roles = JSON.parse(readFileSync(ROLES_PATH, "utf8"));

  for (const role of roles) {
    const roleId = await upsertRole(token, role);
    const policyId = await upsertPolicy(token, role, roleId);
    await replacePermissions(token, policyId, role.collections);
    if (role.name === "Website") {
      await upsertWebsiteReader(token, roleId);
    }
  }

  await setDefaultLanguage(token);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
