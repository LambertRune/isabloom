import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { buildSnapshot } from "./build-snapshot.ts";

const dir = dirname(fileURLToPath(import.meta.url));
const out = join(dir, "schema", "snapshot.yaml");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, stringify(buildSnapshot(), { lineWidth: 0 }));
