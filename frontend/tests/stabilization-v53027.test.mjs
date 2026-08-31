import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const host = await readFile(new URL("../src/LegacyReactHost.jsx", import.meta.url), "utf8");
const learner = await readFile(new URL("../src/LearnerApp.jsx", import.meta.url), "utf8");
const learning = await readFile(new URL("../public/legacy/learning.js", import.meta.url), "utf8");
const runtime = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const sessionSource = await readFile(new URL("../public/legacy/material-session.js", import.meta.url), "utf8");
const migrationSource = await readFile(new URL("../public/legacy/scene-migrations.js", import.meta.url), "utf8");
const editor = await readFile(new URL("../public/legacy/editor/src/main.tsx", import.meta.url), "utf8");

test("learner and admin shells stay mounted while mode changes", () => {
  assert.match(host, /<LearnerApp active=/);
  assert.match(host, /<AdminApp active=/);
  assert.doesNotMatch(host, /mode === "user" && <LearnerApp/);
  assert.doesNotMatch(host, /mode === "admin" && .*<AdminApp/);
  assert.match(learner, /<MaterialSurface active=\{active\}/);
  assert.match(runtime, /RTMDisposeArticleMaterial/);
  assert.match(runtime, /RTMDisposeTestMaterial/);
});

test("test sessions survive reopening and stale render retries are bounded", () => {
  assert.doesNotMatch(learning, /delete sessions\[key\]/);
  assert.match(learning, /retryCount\|\|0\)>=25/);
  assert.match(learning, /RTMMaterialSession/);
  assert.match(learning, /isCurrent\(materialToken,test\.ID\)/);
});

test("material session invalidates timers from the previous material", () => {
  const timers = [];
  const context = {
    window: { openUserMaterial: (item) => item.ID },
    Set,
    console,
    setTimeout(callback) { timers.push(callback); return timers.length; },
    clearTimeout() {},
  };
  vm.runInNewContext(sessionSource, context);
  context.window.openUserMaterial({ ID: "first" });
  const first = context.window.RTMMaterialSession.current();
  let ran = false;
  context.window.RTMMaterialSession.schedule(() => { ran = true; }, 0, first);
  context.window.openUserMaterial({ ID: "second" });
  timers.forEach((callback) => callback());
  assert.equal(ran, false);
});

test("scene migration preserves payloads and normalizes old scenes", () => {
  const context = { window: {}, structuredClone, JSON };
  vm.runInNewContext(migrationSource, context);
  const source = { type: "excalidraw", elements: [{ id: "a", type: "text", text: "Текст", extension: 7 }], extra: { keep: true } };
  const migrated = context.window.RTMSceneMigrations.migrate(source);
  assert.equal(migrated.rtmSchemaVersion, 1);
  assert.equal(migrated.elements[0].isDeleted, false);
  assert.equal(migrated.elements[0].extension, 7);
  assert.equal(migrated.extra.keep, true);
  assert.equal(source.rtmSchemaVersion, undefined);
});

test("article completion cards are deduplicated before repair", () => {
  assert.match(editor, /repairCompletionCard\(dedupeCompletion\(normalizeCompletion\(elements\)\)\)/);
});
