import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../public/legacy/knowledge.js", import.meta.url), "utf8");

test("knowledge management accepts the stored moderator value for editor access", () => {
  const accessLists = source.match(/\["developer","admin","editor","moderator"\]/g) || [];
  assert.equal(accessLists.length, 3);
  assert.doesNotMatch(source, /\["developer","admin","editor"\]/);
});
