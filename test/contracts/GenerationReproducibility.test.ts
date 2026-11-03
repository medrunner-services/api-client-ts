import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

it("generates identical contracts from different linked dependency layouts", () => {
  const source = fileURLToPath(new URL("../..", import.meta.url));
  const temporary = mkdtempSync(path.join(tmpdir(), "medrunner-contracts-"));
  const roots = [path.join(temporary, "flat"), path.join(temporary, "deeper", "nested", "package")];
  const linked: string[] = [];
  try {
    for (const root of roots) {
      mkdirSync(path.join(root, "scripts"), { recursive: true });
      mkdirSync(path.join(root, "openapi"));
      cpSync(path.join(source, "scripts/generate-contracts.mjs"), path.join(root, "scripts/generate-contracts.mjs"));
      for (const file of ["openapi.json", "events.json"])
        cpSync(path.join(source, "openapi", file), path.join(root, "openapi", file));
      const modules = path.join(root, "node_modules");
      symlinkSync(realpathSync(path.join(source, "node_modules")), modules, process.platform === "win32" ? "junction" : "dir");
      linked.push(modules);
      const run = spawnSync(process.execPath, ["scripts/generate-contracts.mjs"], { cwd: root, encoding: "utf8", timeout: 30000 });
      expect(run.status, run.stdout + run.stderr).toBe(0);
    }
    for (const file of ["validators.js", "validators.d.ts", "wire.ts", "events.ts", "catalog.ts"]) {
      const contents = roots.map(root => readFileSync(path.join(root, "src/contracts/generated", file), "utf8"));
      expect(contents[0], file).toBe(contents[1]);
    }
  } finally {
    for (const modules of linked) unlinkSync(modules);
    const resolved = realpathSync(temporary);
    if (!resolved.startsWith(realpathSync(tmpdir()) + path.sep)) throw new Error("Refusing cleanup outside the temporary directory");
    rmSync(resolved, { recursive: true, force: true });
  }
}, 60000);
