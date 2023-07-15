import { BuildOptions } from "https://deno.land/x/dnt@0.37.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["ESNext"],
  },
  typeCheck: "both",
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@miyauci/vdom",
    version,
    description: "Virtual DOM specification and diff-patch algorithm",
    keywords: [
      "virtual-dom",
      "vdom",
      "dom",
      "diff",
      "patch",
      "virtual",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/vdom",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/vdom.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/vdom/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: { access: "public" },
  },
  packageManager: "pnpm",
});
