import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("learner screen renders Bitrix access gate and role-dependent controls", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { LearnerApp } = await server.ssrLoadModule("/src/LearnerApp.jsx");
    const render = (snapshot) => renderToStaticMarkup(React.createElement(LearnerApp, {
      active: true,
      bridge: { getSnapshot: () => snapshot, subscribe: () => () => {} },
      onSetMode: () => {},
    }));
    const base = { userId: "0", appearance: { brandName: "RTM" }, hintsEnabled: true, canOpenAdmin: false };
    const blocked = render(base);
    assert.match(blocked, /Откройте приложение из Bitrix24/);
    assert.doesNotMatch(blocked, /Администрирование/);
    const authorized = render({ ...base, userId: "42", canOpenAdmin: true, courses: [], items: [], progress: [] });
    assert.doesNotMatch(authorized, /Откройте приложение из Bitrix24/);
    assert.match(authorized, /Администрирование/);
  } finally {
    await server.close();
  }
});
