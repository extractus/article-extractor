// scripts/build_npm.ts

import { build, emptyDir } from "@deno/dnt";
import pkg from "../deno.json" with { type: "json" };

const outputDir = "./npm";

await emptyDir(outputDir);

await build({
  entryPoints: ["./mod.ts"],
  outDir: outputDir,
  shims: {
    deno: true,
  },
  test: false,
  typeCheck: false,
  tsconfig: {
    compilerOptions: {
      target: "es2022",
      lib: ["es2022", "dom"],
    },
  },
  package: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    repository: pkg.repository,
    bugs: {
      url: `${pkg.homepage}/issues`,
    },
    license: pkg.license,
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
