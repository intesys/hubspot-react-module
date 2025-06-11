import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/module.tsx",
  output: {
    dir: ".",
    format: "esm",
    entryFileNames: "module.js",
    sourcemap: true,
  },
  treeshake: true,
  external: [],
});
