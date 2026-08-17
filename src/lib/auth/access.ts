export type BeheerRole = {
  name?: string | null;
  app_access?: boolean | null;
  admin_access?: boolean | null;
};

export type BeheerUserLike = {
  status?: string | null;
  role?: BeheerRole | string | null;
};

export const BEHEER_ME_FIELDS = "id,email,status,role.*";

export function canAccessBeheer(user: BeheerUserLike | null): boolean {
  if (!user || user.status !== "active") {
    return false;
  }
  const role = user.role;
  if (!role || typeof role === "string") {
    return false;
  }
  if (role.name === "Website") {
    return false;
  }
  return (
    role.admin_access === true ||
    role.app_access === true ||
    role.name === "Isabloom beheerder" ||
    role.name === "Administrator"
  );
}

export function safeBeheerPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/beheer") || path.startsWith("//") || path.includes("://")) {
    return "/beheer";
  }
  return path;
}
