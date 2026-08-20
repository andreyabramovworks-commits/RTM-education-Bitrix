import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const picker = await readFile(new URL("../public/legacy/assignment-picker.js", import.meta.url), "utf8");
const pickerCss = await readFile(new URL("../public/legacy/assignment-picker.css", import.meta.url), "utf8");
const runtime = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const learning = await readFile(new URL("../public/legacy/learning.js", import.meta.url), "utf8");

test("assignment picker uses checkboxes for selection and a switch for child departments", () => {
  assert.match(picker, /class="rtm-picker-switch"/);
  assert.match(pickerCss, /appearance:none/);
  assert.match(pickerCss, /input:checked\+\.rtm-picker-switch/);
  assert.doesNotMatch(pickerCss, /appearance:auto!important/);
});

test("section settings use the shared modal instead of a browser prompt", () => {
  const source = runtime.match(/async function renameSection[\s\S]*?\nfunction /)?.[0] || "";
  assert.match(source, /section-settings-dialog/);
  assert.match(source, /sectionSettingsSave/);
  assert.doesNotMatch(source, /prompt\(/);
});

test("knowledge test editor is restored before leaving its route", () => {
  assert.match(learning, /function restoreKnowledgeTestEditor/);
  assert.match(learning, /state\.knowledgeEditorReturn&&view!==['"]database['"]/);
  assert.match(learning, /restoreKnowledgeTestEditor\(\);\s*switchAdmin\(['"]database['"]\)/);
});

test("test submission is single-flight and reports success or recoverable failure", () => {
  assert.match(learning, /if \(form\.dataset\.submitting\) return/);
  assert.match(learning, /Отправляем ответы/);
  assert.match(learning, /Ответы сохранены/);
  assert.match(learning, /Ваш выбор сохранён на экране/);
});

test("test scene keeps one question text element per generated block", () => {
  assert.match(learning, /var seenQuestionText=false/);
  assert.match(learning, /if\(seenQuestionText\)return false/);
});
