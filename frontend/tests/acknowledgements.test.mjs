import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/legacy/acknowledgements.js", import.meta.url), "utf8");

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

  vm.runInNewContext(source, context, { filename: "acknowledgements.js" });

  assert.equal(headingText, "Роли пользователей");
  assert.equal(mutations, 1);
});

test("v51.4 keeps campaign assignments while the wizard changes mode", () => {
  assert.match(source, /getDirectory\?window\.RTMV5038\.getDirectory/);
  assert.match(source, /recipientRules:savedCampaign&&savedCampaign\.recipientRules/);
  assert.match(source, /responsibleRules:savedCampaign&&savedCampaign\.responsibleRules/);
  assert.match(source, /rememberRules\(\);model\.mode=button\.dataset\.mode;stepTwo\(\)/);
  assert.match(source, /data-v5100-test-host/);
});

test("v51.4 exposes managed campaigns, departments and useful help", () => {
  assert.match(source, /data-v5100-department/);
  assert.match(source, /includeChildren/);
  assert.match(source, /data-v5120-manage-campaign/);
  assert.match(source, /dueDatePolicy/);
  assert.match(source, /mandatory-documents/);
  assert.doesNotMatch(source, /Выполняет действие «/);
  assert.doesNotMatch(source, /\.rail-btn \.v512-help-dot/);
  assert.doesNotMatch(source, /\['\[data-admin-view="(?:reviews|database|users)"\]'/);
});

test("v51.4 exposes delivery templates and a complete role matrix", () => {
  assert.match(source, /v514TaskTitle/);
  assert.match(source, /v514TaskDescription/);
  assert.match(source, /\{edition_link\}/);
  assert.match(source, /v514-role-overview/);
  assert.match(source, /role-no-admin/);
  assert.match(source, /role-mobile-admin/);
  assert.match(source, /Ограничений внутри приложения нет/);
});

test("recipient rules are explicit, searchable and all-active is exclusive", () => {
  assert.match(source, /recipientRules:savedCampaign&&savedCampaign\.recipientRules\|\|\[\]/);
  assert.match(source, /data-search-text=/);
  assert.match(source, /data-recipient-kind="responsible"/);
  assert.match(source, /if\(all&&all\.checked\)return\[\{type:'all_active'\}\]/);
  assert.match(source, /allChecked&&\(kind==='departments'\|\|kind==='users'\)/);
});
