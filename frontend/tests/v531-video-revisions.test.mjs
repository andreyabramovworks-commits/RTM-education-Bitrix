import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const adminVideo = fs.readFileSync(new URL("../src/VideoAdmin.jsx", import.meta.url), "utf8");
const learnerVideo = fs.readFileSync(new URL("../src/VideoLibrary.jsx", import.meta.url), "utf8");
const learnerApp = fs.readFileSync(new URL("../src/LearnerApp.jsx", import.meta.url), "utf8");
const acknowledgements = fs.readFileSync(new URL("../public/legacy/acknowledgements.js", import.meta.url), "utf8");

test("video screens reuse the authenticated Bitrix request bridge", () => {
  assert.match(adminVideo, /RTMV47\.ready/);
  assert.match(adminVideo, /RTMV47\.request/);
  assert.doesNotMatch(adminVideo, /fetch\(/);
  assert.match(learnerVideo, /RTMV47\.ready/);
  assert.match(learnerVideo, /RTMV47\.request/);
});

test("video library uses folders, explorer navigation and keeps global actions", () => {
  assert.match(adminVideo, />Папки</);
  assert.match(adminVideo, /Поиск папок/);
  assert.match(adminVideo, /uploadCover/);
  assert.match(adminVideo, /defaultValue=\{video\.collectionId/);
  assert.match(learnerVideo, /lr-video-crumbs/);
  assert.match(learnerVideo, /Назад к папкам/);
  assert.doesNotMatch(learnerVideo, /Обучающие материалы/);
  assert.match(learnerApp, /view === "videos"[\s\S]+?<VideoLibrary/);
  assert.match(learnerApp, /view === "videos"[\s\S]+?lr-sync/);
  assert.match(learnerApp, /view === "videos"[\s\S]+?lr-admin-mode/);
});

test("admin can assign catalog videos to folders from every catalog view", () => {
  assert.match(adminVideo, /moveVideoToFolder/);
  assert.match(adminVideo, /\/folder/);
  assert.match(adminVideo, /aria-label=\{`Папка для \$\{v\.title\}`\}/);
  assert.match(adminVideo, /folderMap\[v\.collectionId\]\?\.title \|\| "Без папки"/);
});

test("learner video player exposes an app-level mobile fullscreen action", () => {
  assert.match(learnerVideo, /requestFullscreen/);
  assert.match(learnerVideo, /webkitRequestFullscreen/);
  assert.match(learnerVideo, /На весь экран/);
  assert.match(learnerVideo, /lr-player-shell/);
});

test("revision checks group documents before editions and expose audit details", () => {
  assert.match(acknowledgements, /class="v531-document"/);
  assert.match(acknowledgements, /class="v531-edition"/);
  assert.match(acknowledgements, /row\.userPhoto/);
  assert.match(acknowledgements, /Контрольный вопрос/);
  assert.match(acknowledgements, /data-v531-remind/);
  assert.match(acknowledgements, /Ответственный/);
});
