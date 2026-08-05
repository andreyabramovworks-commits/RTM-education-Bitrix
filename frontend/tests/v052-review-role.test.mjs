import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/legacy/v052.js", import.meta.url), "utf8");

test("v52 review permissions use helpers declared in the same script", () => {
  assert.match(source, /function currentRoleV52\(\)/);
  assert.match(source, /function roleRankV52\(role\)/);
  assert.match(source, /var role = currentRoleV52\(\)/);
  assert.match(source, /roleRankV52\(role\)/);
  assert.doesNotMatch(source, /\bactualRole\(\)/);
  assert.doesNotMatch(source, /(?<!V52)\broleRank\(role\)/);
});
