import { describe, expect, it } from "vitest";
import { firstFileId, sortedFileIds, toFileList } from "./files.ts";

describe("beheer file relations", () => {
  it("reads the first Directus file id from a junction or uuid", () => {
    expect(firstFileId("abc")).toBe("abc");
    expect(firstFileId({ id: "file-2" })).toBe("file-2");
    expect(firstFileId([{ directus_files_id: "file-1" }])).toBe("file-1");
    expect(firstFileId([])).toBeNull();
  });

  it("writes a many-to-many payload as a list of file ids", () => {
    expect(toFileList("file-1")).toEqual(["file-1"]);
    expect(toFileList(null)).toEqual([]);
  });

  it("orders Directus M2M files by junction sort before reading ids", () => {
    expect(
      sortedFileIds([
        { directus_files_id: "second", sort: 2 },
        { directus_files_id: "first", sort: 0 },
        { directus_files_id: null, sort: 1 },
      ]),
    ).toEqual(["first", "second"]);
    expect(
      firstFileId([
        { directus_files_id: "second", sort: 2 },
        { directus_files_id: "first", sort: 0 },
      ]),
    ).toBe("first");
  });
});
