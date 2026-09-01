import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile, readdir } from "node:fs/promises";
import { RELEASE_ASSET_REVISION } from "../src/legacyRuntime.js";

const legacyDirectory = new URL("../public/legacy/", import.meta.url);
const publicDirectory = new URL("../public/", import.meta.url);

async function compileScripts(directory, files) {
  for (const file of files) {
    const source = await readFile(new URL(file, directory), "utf8");
    assert.doesNotThrow(
      () => new vm.Script(source, { filename: file }),
      `${file} must compile before release`,
    );
  }
}

test("Bitrix startup scripts are valid JavaScript", async () => {
  await compileScripts(publicDirectory, ["bitrix-loader.js", "bitrix-bootstrap.js"]);
});

test("startup entrypoints share the current cache revision", async () => {
  const [index, loader] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("bitrix-loader.js", publicDirectory), "utf8"),
  ]);

  assert.match(index, new RegExp(`bitrix-loader\\.js\\?v=${RELEASE_ASSET_REVISION}`));
  assert.match(loader, new RegExp(`bitrix-bootstrap\\.js\\?v=${RELEASE_ASSET_REVISION}`));
});

test("every top-level legacy runtime script is valid JavaScript", async () => {
  const files = (await readdir(legacyDirectory))
    .filter((name) => name.endsWith(".js"))
    .sort();

  assert.ok(files.includes("runtime-core.js"));
  await compileScripts(legacyDirectory, files);
});
