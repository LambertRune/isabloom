type FileJunction = {
  directus_files_id?: string | null;
};

export function firstFileId(
  value: string | { id?: string | null } | FileJunction[] | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.find((item) => item.directus_files_id)?.directus_files_id ?? null;
  }
  return value.id ?? null;
}

export function toFileList(fileId: string | null | undefined): string[] {
  return fileId ? [fileId] : [];
}
