import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/bitrix-bootstrap.js", import.meta.url), "utf8");

test("Bitrix auth falls back to the SDK auth object when getAuth is unsupported", async () => {
  const auth = { access_token: "test-token", domain: "example.bitrix24.ru" };
  const sdk = {
    auth,
    init(callback) { callback(); },
    getAuth() { throw new TypeError("refreshAuth is not a function"); },
    isAdmin() { return false; },
    callMethod() {},
  };
  const window = {
    self: {}, top: {}, BX24: sdk,
    setTimeout, clearTimeout, dispatchEvent() {},
  };

  vm.runInNewContext(source, {
    window,
    document: { referrer: "https://example.bitrix24.ru/marketplace/app/" },
    CustomEvent: class {},
    Promise,
  });

  await window.RTM_BITRIX_READY;
  assert.equal(window.RTM_BITRIX.getAuth(), auth);
});
