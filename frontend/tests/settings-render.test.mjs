import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("portal settings preserve media counts and role-specific controls", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { SettingsAdmin, countMedia } = await server.ssrLoadModule("/src/SettingsAdmin.jsx");
    const items = [{ PROPERTY_VALUES: { content: '<div data-disk-id="11" class="rtm-image-block"></div>' } }];
    assert.deepEqual(countMedia(items), { disk: 1, blocks: 1, materials: 1 });
    const editor = renderToStaticMarkup(React.createElement(SettingsAdmin, { snapshot: { role: "editor", items } }));
    const teacher = renderToStaticMarkup(React.createElement(SettingsAdmin, { snapshot: { role: "teacher", items } }));
    assert.match(editor, /Настройки портала/);
    assert.match(editor, /Сохранить/);
    assert.doesNotMatch(teacher, /Сохранить/);
  } finally { await server.close(); }
});
