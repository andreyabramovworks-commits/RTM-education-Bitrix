import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const admin = await readFile(new URL("../src/AdminApp.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/admin.css", import.meta.url), "utf8");
const host = await readFile(new URL("../src/LegacyReactHost.jsx", import.meta.url), "utf8");
const runtime = await readFile(new URL("../public/legacy/runtime-core.js", import.meta.url), "utf8");

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

test("new and classic admin shells are isolated", () => {
  assert.match(host, /rtm_admin_ui/);
  assert.match(host, /!classicAdmin/);
  assert.match(runtime, /openClassic:function/);
  assert.match(runtime, /searchParams\.set\('rtm_admin_ui','classic'\)/);
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
