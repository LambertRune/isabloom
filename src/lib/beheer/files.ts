type FileJunction = {
  directus_files_id?: string | { id?: string | null } | null;
  sort?: number | null;
};

function junctionFileId(item: FileJunction): string | null {
  const value = item.directus_files_id;
  if (!value) {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  return value.id ?? null;
}

export function sortedFileIds(value: FileJunction[] | null | undefined): string[] {
  return [...(value ?? [])]
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map(junctionFileId)
    .filter((id): id is string => Boolean(id));
}

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
    return sortedFileIds(value)[0] ?? null;
  }
  return value.id ?? null;
}

export function toFileList(fileId: string | null | undefined): string[] {
  return fileId ? [fileId] : [];
}
