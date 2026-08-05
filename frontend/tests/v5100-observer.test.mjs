import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/legacy/v5100.js", import.meta.url), "utf8");

test("v51 DOM observer reaches a fixed point after renaming the roles heading", () => {
  let observerCallback = null;
  let mutations = 0;
  let headingText = "Пользователи";
  const heading = {};

  Object.defineProperty(heading, "textContent", {
    get: () => headingText,
    set: (value) => {
      headingText = value;
      mutations += 1;
      if (mutations > 5) throw new Error("MutationObserver entered a self-triggering loop");
      observerCallback?.([]);
    },
  });

  const document = {
    documentElement: {},
    body: { appendChild() {} },
    addEventListener() {},
    getElementById() { return null; },
    querySelector(selector) {
      return selector === "#adminUsers h1" ? heading : null;
    },
    querySelectorAll() { return []; },
    createElement() { return {}; },
  };
  const context = {
    console,
    document,
    state: { aview: "" },
    matchMedia: () => ({ matches: false }),
    MutationObserver: class {
      constructor(callback) { observerCallback = callback; }
      observe() {}
    },
    setTimeout(callback) { callback(); return 1; },
    clearTimeout() {},
    CustomEvent: class {},
  };
  context.window = context;

  vm.runInNewContext(source, context, { filename: "v5100.js" });

  assert.equal(headingText, "Роли пользователей");
  assert.equal(mutations, 1);
});
