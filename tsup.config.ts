import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  external: [],
  noExternal: [],
  platform: "node",
  format: ["esm", "cjs"],
  target: "es2022",
  skipNodeModulesBundle: true,
  clean: true,
  shims: false,
  minify: false,
  splitting: false,
  keepNames: true,
  dts: {
    compilerOptions: {
      // Bug with baseUrl in TS6 - https://github.com/egoist/tsup/issues/1388
      ignoreDeprecations: "6.0",
    },
  },
  sourcemap: true,
  esbuildPlugins: [],
  treeshake: false,
});
