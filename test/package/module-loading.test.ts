import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

describe("published module formats", () => {
  it.each(["CommonJS", "ESM"] as const)("loads OIDC support through %s", async format => {
    const apiClient = await loadBuiltPackage(format);

    expect(apiClient.OidcClientCredentialsTokenProvider).toBeTypeOf("function");
  });
});

async function loadBuiltPackage(format: "CommonJS" | "ESM"): Promise<{ OidcClientCredentialsTokenProvider: unknown }> {
  const packageRoot = process.cwd();

  if (format === "CommonJS") {
    const require = createRequire(import.meta.url);
    return require(resolve(packageRoot, "dist/index.js"));
  }

  return await import(pathToFileURL(resolve(packageRoot, "dist/index.mjs")).href);
}
