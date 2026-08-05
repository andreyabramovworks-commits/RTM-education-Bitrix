import { cp, mkdir } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const frontendRoot = dirname(fileURLToPath(import.meta.url));
const publicRoot = resolve(frontendRoot, "public");

function copyRuntimePublic() {
  return {
    name: "rtm-copy-runtime-public",
    apply: "build",
    async closeBundle() {
      const outDir = resolve(frontendRoot, "dist");
      await mkdir(outDir, { recursive: true });
      await cp(publicRoot, outDir, {
        recursive: true,
        filter(source) {
          const path = relative(publicRoot, source).split(sep).join("/");
          return path !== "legacy/editor" && !path.startsWith("legacy/editor/");
        },
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRuntimePublic()],
  publicDir: false,
});
