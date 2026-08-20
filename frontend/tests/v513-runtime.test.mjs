import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const api = await readFile(new URL("../public/legacy/api.js", import.meta.url), "utf8");
const wizard = await readFile(new URL("../public/legacy/acknowledgements.js", import.meta.url), "utf8");
const host = await readFile(new URL("../src/LegacyReactHost.jsx", import.meta.url), "utf8");
const manifest = await readFile(new URL("../src/legacyRuntime.js", import.meta.url), "utf8");
const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
const learnerCss = await readFile(new URL("../src/learner.css", import.meta.url), "utf8");
const knowledgeCss = await readFile(new URL("../public/legacy/knowledge.css", import.meta.url), "utf8");
const acknowledgementCss = await readFile(new URL("../public/legacy/acknowledgements.css", import.meta.url), "utf8");
const canvas = await readFile(new URL("../public/legacy/canvas.js", import.meta.url), "utf8");

test("v51.5 has one initial synchronization path", () => {
  assert.match(app, /let initPromise=null/);
  assert.match(app, /let loadAllPromise=null/);
  assert.match(app, /if\(initPromise\)return initPromise/);
  assert.match(app, /if\(loadAllPromise\)return loadAllPromise/);
  assert.doesNotMatch(api, /Initial automatic synchronization/);
  assert.doesNotMatch(api, /__RTM_V48_INIT__\(\)/);
  assert.match(host, /window\.__RTM_V48_INIT__\(\)/);
});

test("v51.5 runtime uses one canonical manifest", () => {
  assert.match(host, /from "\.\/legacyRuntime"/);
  assert.match(host, /if \(runtimePromise\) return runtimePromise/);
  assert.doesNotMatch(host, /const LEGACY_(?:STYLES|SCRIPTS)/);
  assert.match(manifest, /RELEASE_VERSION = "53\.0\.18"/);
  assert.match(index, /bitrix-loader\.js\?v=53\.0\.18-r1/);
  assert.match(host, /await Promise\.all\(LEGACY_STYLES\.map\(loadStyle\)\)/);
  assert.match(host, /rtm-pending/);
  assert.match(app, /window\.__RTM_SHELL_INIT__=init/);
  assert.doesNotMatch(
    app,
    /if\(document\.readyState==='loading'\)document\.addEventListener\('DOMContentLoaded',init\);else init\(\);/,
  );
  assert.match(host, /window\.process \|\|=/);
  assert.match(host, /window\.EXCALIDRAW_ASSET_PATH/);
  assert.match(host, /function loadCanvasRuntime/);
  assert.match(manifest, /CANVAS_SCRIPTS/);
  assert.doesNotMatch(manifest.match(/export const LEGACY_SCRIPTS[\s\S]*?\];/)[0], /rtm-canvas/);
  assert.match(host, /__RTM_SHELL_INIT__/);
});

test("profile health checks are lazy, cached and single-flight", () => {
  assert.match(api, /if \(state\.uview !== 'profile'\) return/);
  assert.match(api, /profileHealthState\.promise/);
  assert.match(api, /Date\.now\(\) - profileHealthState\.checkedAt < 60000/);
});

test("mobile administration remains available only to the actual developer", () => {
  assert.match(app, /function v38ActualDeveloper/);
  assert.match(app, /if\(!v38IsPhone\(\)\)return true/);
  assert.match(app, /if\(mode==='admin'&&v38IsPhone\(\)&&!v38ActualDeveloper\(\)\)mode='user'/);
  assert.match(app, /modeSwitch\.style\.display=v38IsPhone\(\)&&!canUseAdmin\?'none':''/);
});

test("new editions choose a free date and assignments remain usable", () => {
  assert.match(wizard, /function nextFreeEditionDate/);
  assert.match(wizard, /editions\(documentId,true\)/);
  assert.match(wizard, /v513RecipientSearch/);
  assert.match(wizard, /v513-wizard-footer/);
  assert.match(wizard, /model\.dueDays=Number/);
  assert.match(wizard, /data-search-text="'\+h\(name\+' '\+email\)/);
  assert.match(wizard, /v514-channel-switch/);
});

test("v51.5 keeps one UI ownership path for review activation", () => {
  assert.match(app, /window\.RTMUI=window\.RTMUI\|\|\{afterRender:\[\],adminView:\[\]\}/);
  assert.match(app, /function runUiHooks\(kind,value\)/);
  assert.match(api, /refreshAuth: function \(\)/);
  assert.match(wizard, /RTMUI\.adminView\.push/);
  assert.match(wizard, /installDeveloperEditionDeletion/);
});

test("v52.1 owns one modal root and keeps mode changes synchronized", () => {
  assert.match(host, /app\.querySelector\("#modalBackdrop"\)\?\.remove\(\)/);
  assert.match(host, /id="modalBackdrop"/);
  assert.match(host, /id="modalBox"/);
  assert.match(app, /window\.setMode=setMode=function\(mode\)\{closeModal\(\);applyShellMode\(mode\);baseSetMode\(mode\);emitLearnerSnapshot\(\);\}/);
  assert.match(app, /document\.addEventListener\('keydown',e=>\{if\(e\.key==='Escape'/);
  assert.match(app, /event\.stopImmediatePropagation\(\);switchAdmin\(button\.dataset\.adminView\)\},true\)/);
  assert.match(app, /document\.addEventListener\('pointerdown'/);
  assert.match(app, /new MutationObserver\(bindPersistentShellControls\)/);
});

test("v52.1 loads the heavy article renderer only for articles", () => {
  assert.match(app, /if\(materialKind\(item\)==='article'&&window\.__RTM_LOAD_CANVAS__\)await window\.__RTM_LOAD_CANVAS__\(\)/);
  assert.match(app, /if\(kind==='article'&&window\.__RTM_LOAD_CANVAS__\)await window\.__RTM_LOAD_CANVAS__\(\)/);
  assert.doesNotMatch(manifest.match(/export const LEGACY_SCRIPTS[\s\S]*?\];/)[0], /rtm-canvas/);
});

test("v52.1 keeps learner actions theme-aware without legacy important overrides", () => {
  assert.match(learnerCss, /linear-gradient\(135deg, color-mix\(in srgb, var\(--lr-primary\)/);
  assert.doesNotMatch(learnerCss, /\.learner-app \.lr-primary\s*\{/);
});

test("v52.2 gives mobile articles one vertical scroll owner", () => {
  assert.match(canvas, /mobile=matchMedia\('\(max-width:800px\)'\)\.matches/);
  assert.match(canvas, /root\.style\.height=\(mobile\?contentHeight:viewportHeight\)\+'px'/);
  assert.match(canvas, /root\.style\.overflowY=mobile\?'visible':'auto'/);
  assert.match(knowledgeCss, /\.rtm-unified-complete-hit\{[\s\S]*?color:transparent!important/);
});

test("v52.2 restores mobile admin navigation and owns the revision modal", () => {
  assert.match(app, /if\(mode==='admin'\)queueMicrotask\(function\(\)\{if\(typeof v38EnsureMobileUi==='function'\)v38EnsureMobileUi\(\);if\(typeof v38RenderMobileMenu==='function'\)v38RenderMobileMenu\(\)\}\)/);
  assert.match(wizard, /class="v514-ack"/);
  assert.doesNotMatch(wizard, /class="v5100-wizard v514-ack"/);
  assert.match(acknowledgementCss, /\.modal-box:has\(\.v514-ack\)/);
  assert.match(app, /if\(button&&layer&&nav\)\{if\(!nav\.childElementCount\)v38RenderMobileMenu\(\);return\}/);
  assert.doesNotMatch(wizard, /v514-step-number/);
});

test("v52.2 keeps mobile learner headings compact", () => {
  assert.match(learnerCss, /\.lr-page-head > div > \.lr-eyebrow,[\s\S]*?display: none/);
  assert.match(learnerCss, /\.lr-section-heading \.lr-eyebrow[\s\S]*?display: none/);
});
