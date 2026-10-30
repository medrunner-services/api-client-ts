import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/import-contracts.mjs <API contracts directory>");
const target = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../openapi");
await mkdir(target, { recursive: true });
for (const name of ["openapi.json", "events.json", "fixtures.json"]) {
  await copyFile(path.resolve(source, name), path.join(target, name));
}
console.log("Imported API-owned contracts. Run pnpm contracts:generate and pnpm test.");
