import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const learner = await readFile(new URL("../src/LearnerApp.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/learner.css", import.meta.url), "utf8");
const runtime = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");

test("learner navigation exposes only supported learner routes", () => {
  assert.match(learner, /\["learn", "Обучение"\]/);
  assert.match(learner, /\["kb", "База знаний"\]/);
  assert.match(learner, /\["profile", "Профиль"\]/);
  assert.doesNotMatch(learner, /\["projects",/);
});

test("learner tabs and search have accessible contracts", () => {
  assert.match(learner, /role="tablist"/);
  assert.match(learner, /role="tab"/);
  assert.match(learner, /aria-selected=/);
  assert.match(learner, /ArrowLeft/);
  assert.match(learner, /<label className="lr-search">/);
});

test("mobile exposes authorized administration through the menu and supports reduced motion", () => {
  assert.match(styles, /@media \(max-width: 768px\)/);
  assert.match(styles, /\.lr-admin-mode[\s\S]*display: none/);
  assert.match(learner, /snapshot\.canOpenAdmin/);
  assert.match(learner, /Перейти в админку/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test("learner restores revisions, profile ranking, avatar and release version", () => {
  assert.match(learner, /\["revisions", "Редакции"/);
  assert.match(learner, /loadAcknowledgements/);
  assert.match(learner, /PERSONAL_PHOTO/);
  assert.match(learner, /Топ пользователей по очкам/);
  assert.match(learner, /Версия v/);
});

test("knowledge uses the canonical structured bridge instead of project cards", () => {
  assert.match(learner, /bridge\.loadKnowledge/);
  assert.match(learner, /flattenMaterials/);
  assert.doesNotMatch(learner, /snapshot\.projects/);
});

test("global help control preserves contextual nested help entry points", () => {
  assert.match(learner, /aria-pressed=\{snapshot\.hintsEnabled\}/);
  assert.match(learner, /bridge\.openHint/);
  assert.match(runtime, /setHintsEnabled/);
});

test("learner bridge keeps synchronization single-flight and refreshes Bitrix identity", () => {
  assert.match(runtime, /window\.__RTM_LEARNER__=/);
  assert.match(runtime, /await refreshCurrentUser\(\);return performLoadAll/);
  assert.match(runtime, /if\(loadAllPromise\)return loadAllPromise/);
  assert.doesNotMatch(runtime, /setTimeout\(function\(\)\{loadAll\(false\)/);
});
