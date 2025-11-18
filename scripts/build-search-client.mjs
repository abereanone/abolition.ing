import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const entryPoint = path.join(root, "src", "scripts", "search-page.ts");
const outDir = path.join(root, "public", "assets");

await mkdir(outDir, { recursive: true });

await build({
  entryPoints: [entryPoint],
  outfile: path.join(outDir, "search-client.js"),
  bundle: true,
  platform: "browser",
  format: "esm",
  sourcemap: false,
  target: ["es2020"],
  alias: {
    "@": path.join(root, "src"),
  },
  logLevel: "silent",
});
