import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../public/bitrix-bootstrap.js", import.meta.url), "utf8");
const loaderSource = await readFile(new URL("../public/bitrix-loader.js", import.meta.url), "utf8");

class TestCustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
}

test("publishes a Bitrix context inside the portal frame", async () => {
  const events = [];
  const auth = { access_token: "token", domain: "rtm-group.bitrix24.ru" };
  const sdk = {
    init(callback) {
      callback();
    },
    isAdmin() {
      return true;
    },
    getAuth() {
      return auth;
    },
    callMethod(method, params, callback) {
      callback({
        error: () => null,
        data: () => ({ method, params }),
        more: () => false,
      });
    },
  };
  const window = {
    self: {},
    top: {},
    BX24: sdk,
    setTimeout,
    clearTimeout,
    dispatchEvent(event) {
      events.push(event.type);
    },
  };

  vm.runInNewContext(source, {
    window,
    document: { referrer: "https://rtm-group.bitrix24.ru/marketplace/app/" },
    CustomEvent: TestCustomEvent,
    Promise,
  });

  await window.RTM_BITRIX_READY;
  assert.equal(window.RTM_BITRIX.getAuth(), auth);
  assert.equal(window.RTM_BITRIX.isAdmin(), true);
  const result = await window.RTM_BITRIX.call("user.current", { active: true });
  assert.equal(result.data.method, "user.current");
  assert.equal(result.data.params.active, true);
  assert.equal(result.more, false);
  assert.deepEqual(events, ["rtm-bitrix-ready"]);
  assert.equal(window.BX24, sdk);
});

test("does not initialize the Bitrix SDK in a standalone window", () => {
  const window = { dispatchEvent() {} };
  window.self = window;
  window.top = window;

  vm.runInNewContext(source, {
    window,
    document: { referrer: "" },
    CustomEvent: TestCustomEvent,
    Promise,
  });

  assert.equal(window.RTM_BITRIX, undefined);
  assert.equal(window.RTM_BITRIX_READY, undefined);
});

test("standalone preview does not load the external Bitrix SDK", () => {
  const appended = [];
  const window = {};
  window.self = window;
  window.top = window;
  vm.runInNewContext(loaderSource, {
    window,
    document: { referrer: "", createElement: () => ({}), head: { appendChild: (node) => appended.push(node) } },
    CustomEvent: TestCustomEvent,
  });
  assert.deepEqual(appended, []);
});
