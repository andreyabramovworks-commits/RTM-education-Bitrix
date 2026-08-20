import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const admin = await readFile(new URL("../src/AdminApp.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/admin.css", import.meta.url), "utf8");
const host = await readFile(new URL("../src/LegacyReactHost.jsx", import.meta.url), "utf8");
const runtime = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");
const learning = await readFile(new URL("../public/legacy/learning.js", import.meta.url), "utf8");
const knowledge = await readFile(new URL("../public/legacy/knowledge.js", import.meta.url), "utf8");
const runtimeStyles = await readFile(new URL("../public/legacy/runtime-core.css", import.meta.url), "utf8");
const assignmentPicker = await readFile(new URL("../public/legacy/assignment-picker.js", import.meta.url), "utf8");

test("v53 admin shell owns navigation and exposes every approved route", () => {
  for (const route of ["dashboard", "materials", "users", "database", "reviews", "analytics", "events", "settings", "info"]) {
    assert.match(admin, new RegExp(`\\["${route}",`));
  }
  assert.match(admin, /Наработки сцен/);
  assert.match(admin, /route === id/);
  assert.match(runtime, /window\.__RTM_ADMIN__=/);
});

test("developer workspace is hidden and guarded for other roles", () => {
  assert.match(admin, /snapshot\.role === "developer"/);
  assert.match(runtime, /route==='info'&&String\(state\.currentRole\)!=='developer'/);
});

test("classic admin is unreachable and the compatibility DOM always stays hidden", () => {
  assert.match(host, /hidden\s+aria-hidden="true"\s+inert/);
  assert.doesNotMatch(host, /rtm_admin_ui|classicAdmin|openClassic/);
  assert.doesNotMatch(admin, /Классическая версия|openClassic/);
  assert.doesNotMatch(runtime, /rtm_admin_ui|openClassic:function/);
});

test("classic test edition and its persisted switch are removed", () => {
  assert.doesNotMatch(learning, /classicTest|testSwitch|bindTestSwitch|applyTestUiChoice|data-v492-test-ui/);
});

test("new admin shell suspends the complete classic shell and mounts only page content", () => {
  assert.match(runtime, /root\.hidden=true;root\.inert=true;root\.style\.display='none';root\.setAttribute\('aria-hidden','true'\)/);
  assert.match(runtime, /rtmAdminRoot\.style\.display=rtmAdminRootState\.display/);
  assert.match(runtime, /host\.appendChild\(projects\)/);
  assert.match(runtime, /host\.appendChild\(main\)/);
  assert.match(runtime, /rtmAdminProjectsHome\.parent\.insertBefore\(projects,rtmAdminProjectsHome\.next\)/);
  assert.doesNotMatch(styles, /\.adm-workspace #projectsPanel/);
  assert.match(host, /mount\?\.querySelectorAll\("\.admin-view"\)/);
});

test("admin guidance and accessibility contracts are present", () => {
  assert.match(admin, /rtm_admin_hints/);
  assert.match(admin, /aria-pressed=\{hints\}/);
  assert.match(styles, /\.has-guidance \[data-tip\]/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
});

test("admin design limits theme color to accent tokens", () => {
  assert.match(styles, /--adm-accent/);
  assert.match(styles, /--adm-surface:#fff/);
  assert.match(styles, /--adm-ink:#172033/);
  assert.doesNotMatch(styles, /!important/);
});

test("admin shell stays above the legacy header and owns the full background", () => {
  assert.match(styles, /\.rtm-admin-v53\{[^}]*z-index:20000/);
  assert.match(styles, /radial-gradient\(circle at 82% 4%/);
  assert.match(styles, /#modalBackdrop\{z-index:40000/);
});

test("route activation is restored after legacy rendering hooks", () => {
  const switchStart = runtime.indexOf("function switchAdmin(v)");
  const switchEnd = runtime.indexOf("window.dispatchEvent", switchStart);
  const body = runtime.slice(switchStart, switchEnd);
  assert.ok(body.indexOf("renderAll()") < body.indexOf("activateAdminView(v)"));
  assert.ok(body.indexOf("runUiHooks('adminView',v)") < body.indexOf("activateAdminView(v)"));
});

test("top-level navigation closes nested knowledge editors and reopens the selected root", () => {
  assert.match(admin, /if \(nextRoute === route\) \{[\s\S]*?bridge\.openRoute\(nextRoute\)/);
  assert.match(runtime, /state\.v540Workspace='';state\.knowledgeEditorReturn=false;state\.editorReturnCourseId=null/);
  assert.match(runtime, /if\(route==='materials'\)\{[\s\S]*?showMaterialsList\(\)/);
  assert.match(runtime, /bindLate\(\)/);
});

test("scene workspace is loaded on demand and reports failures", () => {
  assert.match(runtime, /route==='info'&&window\.__RTM_LOAD_CANVAS__/);
  assert.match(runtime, /function openArticleEditor\(id\)\{if\(window\.__RTM_LOAD_CANVAS__&&!window\.RTMCanvas\)/);
  assert.match(admin, /adm-route-error/);
});

test("wide admin workspace uses the available iframe width", () => {
  assert.match(styles, /\.adm-workspace>\.admin-main\{display:block;width:100%;max-width:none/);
  assert.doesNotMatch(styles, /max-width:1600px/);
});

test("course editor survives route teardown and uses one responsive control per setting", () => {
  const childLine = runtime.slice(runtime.indexOf("function renderCourseChildLine"), runtime.indexOf("function addMaterialModalForCourse"));
  assert.match(runtime, /if\(!c\|\|!ready\|\|!editor\|\|!editor\.isConnected\)return/);
  assert.match(childLine, /class="material-identity"/);
  assert.match(childLine, /class="course-control required-toggle"/);
  assert.match(childLine, /class="course-control section-control"/);
  assert.doesNotMatch(childLine, /class="pill '\+\(req\?/);
});

test("all-active recipient mode can hide detailed recipient groups", async () => {
  const acknowledgementStyles = await readFile(new URL("../public/legacy/acknowledgements.css", import.meta.url), "utf8");
  assert.match(acknowledgementStyles, /\[hidden\]\s*\{\s*display:\s*none\s*!important\s*\}/);
});

test("v53.0.20 removes linked course roles and routes linked tests through knowledge", () => {
  assert.doesNotMatch(knowledge, /button\.textContent="Роли"/);
  assert.doesNotMatch(knowledge, /!meta\|\|state\.mode==='admin'/);
});

test("v53.0.20 owns the final responsive course and material-loading surfaces", () => {
  assert.match(runtimeStyles, /#courseSectionsEditor \.material-line/);
  assert.match(runtimeStyles, /\[data-v538-course-roles\]\{display:none\}/);
  assert.match(assignmentPicker, /data-picker-all/);
  assert.match(assignmentPicker, /rtm-picker-specific/);
  assert.match(runtime, /\[data-toggle-required\]/);
});

test("legacy render hooks cannot remount the React shell", () => {
  assert.match(host, /const LegacyMarkupHost = React\.memo/);
  assert.match(host, /window\.addEventListener\("rtm:learner-change", refreshShell\)/);
  assert.match(host, /learnerBridge\?\.setMode\?\.\(mode\)/);
  assert.match(host, /finally \{\s*setBridgeTick/);
  assert.match(host, /<LearnerApp bridge=\{learnerBridge\} onSetMode=\{setShellMode\}/);
  assert.match(host, /<AdminApp bridge=\{window\.__RTM_ADMIN__\} onSetMode=\{setShellMode\}/);
  assert.match(runtime, /subscribeShell:function\(handler\)\{window\.addEventListener\('rtm:learner-change',handler\)/);
  assert.match(runtime, /typeof v38EnsureMobileUi==='function'/);
  assert.doesNotMatch(admin, /<i>›<\/i>/);
});
