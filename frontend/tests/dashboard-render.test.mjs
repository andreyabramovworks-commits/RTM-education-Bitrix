import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("dashboard renders React loading state and navigation controls", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { DashboardAdmin } = await server.ssrLoadModule("/src/DashboardAdmin.jsx");
    const markup = renderToStaticMarkup(React.createElement(DashboardAdmin, {
      onOpenRoute: () => {}, onOpenMaterial: () => {},
    }));
    assert.match(markup, /Дашборд обучения/);
    assert.match(markup, /Загружаем сводку/);
    assert.match(markup, /Обновить/);
  } finally { await server.close(); }
});
