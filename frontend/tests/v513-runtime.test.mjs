import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const api = await readFile(new URL("../public/legacy/api.js", import.meta.url), "utf8");
const wizard = await readFile(new URL("../public/legacy/acknowledgements.js", import.meta.url), "utf8");
const host = await readFile(new URL("../src/LegacyReactHost.jsx", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/legacyRuntime.js", import.meta.url), "utf8");

test("v51.3 has one initial synchronization path", () => {
  assert.match(app, /let initPromise=null/);
  assert.match(app, /let loadAllPromise=null/);
  assert.match(app, /if\(initPromise\)return initPromise/);
  assert.match(app, /if\(loadAllPromise\)return loadAllPromise/);
  assert.doesNotMatch(api, /Initial automatic synchronization/);
  assert.doesNotMatch(api, /__RTM_V48_INIT__\(\)/);
  assert.match(host, /await window\.__RTM_V48_INIT__\(\)/);
});

test("v51.3 runtime uses one canonical manifest", () => {
  assert.match(host, /from "\.\/legacyRuntime"/);
  assert.match(host, /if \(runtimePromise\) return runtimePromise/);
  assert.doesNotMatch(host, /const LEGACY_(?:STYLES|SCRIPTS)/);
  assert.match(manifest, /RELEASE_VERSION = "51\.3\.1"/);
  assert.match(app, /window\.__RTM_SHELL_INIT__=init/);
  assert.doesNotMatch(
    app,
    /if\(document\.readyState==='loading'\)document\.addEventListener\('DOMContentLoaded',init\);else init\(\);/,
  );
  assert.match(host, /window\.process \|\|=/);
  assert.match(host, /window\.EXCALIDRAW_ASSET_PATH/);
  assert.match(host, /__RTM_SHELL_INIT__/);
});

test("new editions choose a free date and assignments remain usable", () => {
  assert.match(wizard, /function nextFreeEditionDate/);
  assert.match(wizard, /editions\(documentId,true\)/);
  assert.match(wizard, /v513RecipientSearch/);
  assert.match(wizard, /v513-wizard-footer/);
  assert.match(wizard, /model\.dueDays=Number/);
});
