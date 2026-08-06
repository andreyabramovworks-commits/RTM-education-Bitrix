import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/legacy/learning.js", import.meta.url), "utf8");
const reviewSource = source.split("/* source: v052.js */")[1].split("/* source: v053.js */")[0];

test("v52 review permissions use helpers declared in the same script", () => {
  assert.match(reviewSource, /function currentRoleV52\(\)/);
  assert.match(reviewSource, /function roleRankV52\(role\)/);
  assert.match(reviewSource, /var role = currentRoleV52\(\)/);
  assert.match(reviewSource, /roleRankV52\(role\)/);
  assert.doesNotMatch(reviewSource, /\bactualRole\(\)/);
  assert.doesNotMatch(reviewSource, /(?<!V52)\broleRank\(role\)/);
});

test("v52 review renderer preserves the v51 nested review-center host", () => {
  assert.match(reviewSource, /function renderReviewsV52\(rootOverride\)/);
  assert.match(reviewSource, /rootOverride \|\| document\.querySelector\('\[data-v5100-test-host\]'\)/);
  assert.match(reviewSource, /renderReviewsV52\(root\)/);
});