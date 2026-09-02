import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const adminVideo = fs.readFileSync(new URL("../src/VideoAdmin.jsx", import.meta.url), "utf8");
const learnerVideo = fs.readFileSync(new URL("../src/VideoLibrary.jsx", import.meta.url), "utf8");
const acknowledgements = fs.readFileSync(new URL("../public/legacy/acknowledgements.js", import.meta.url), "utf8");

test("video screens reuse the authenticated Bitrix request bridge", () => {
  assert.match(adminVideo, /RTMV47\.ready/);
  assert.match(adminVideo, /RTMV47\.request/);
  assert.doesNotMatch(adminVideo, /fetch\(/);
  assert.match(learnerVideo, /RTMV47\.ready/);
  assert.match(learnerVideo, /RTMV47\.request/);
});

test("revision checks group documents before editions and expose audit details", () => {
  assert.match(acknowledgements, /class="v531-document"/);
  assert.match(acknowledgements, /class="v531-edition"/);
  assert.match(acknowledgements, /row\.userPhoto/);
  assert.match(acknowledgements, /Контрольный вопрос/);
  assert.match(acknowledgements, /data-v531-remind/);
  assert.match(acknowledgements, /Ответственный/);
});
