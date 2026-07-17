import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve("node_modules/@excalidraw/excalidraw/dist/prod/fonts");
const target = resolve("../excalidraw-dist/fonts");

if (!existsSync(source)) {
  throw new Error(`Excalidraw fonts were not found: ${source}`);
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true, force: true });
console.log(`Copied Excalidraw fonts to ${target}`);
