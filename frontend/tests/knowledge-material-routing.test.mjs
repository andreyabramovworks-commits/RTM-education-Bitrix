import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const knowledge = fs.readFileSync(new URL("../public/legacy/knowledge.js", import.meta.url), "utf8");
const runtime = fs.readFileSync(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const learner = fs.readFileSync(new URL("../src/LearnerApp.jsx", import.meta.url), "utf8");

test("knowledge previews are prepared by legacy data code and opened by the React material surface", () => {
  assert.match(knowledge, /prepareForUser:function/);
  assert.match(knowledge, /if\(prepareOnly\)return projection/);
  assert.match(runtime, /RTMV5038\.prepareForUser\(documentId,kind\)/);
  assert.match(runtime, /rtm:knowledge-material-prepared/);
  assert.match(learner, /addEventListener\("rtm:knowledge-material-prepared"/);
  assert.match(learner, /setMaterialContext\(\{ material, course: null \}\)/);
});
