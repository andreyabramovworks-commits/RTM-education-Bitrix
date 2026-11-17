import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("analytics counts unique assignments and filters rows by department and date", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { AnalyticsAdmin, buildAnalytics, filterAnalyticsRows } = await server.ssrLoadModule("/src/AnalyticsAdmin.jsx");
    const data = buildAnalytics({
      users: [{ ID: "u1", NAME: "Мария", DEPARTMENT_IDS: ["5"] }],
      departments: [{ id: "5", name: "Обучение" }],
      items: [{ ID: "a1", NAME: "Кодекс", PROPERTY_VALUES: { type: "article", status: "published", meta: '{"points":12}' } }],
      assigns: [{ PROPERTY_VALUES: { userId: "u1", targetId: "a1" } }, { PROPERTY_VALUES: { userId: "u1", targetId: "a1" } }],
      progress: [{ PROPERTY_VALUES: { userId: "u1", targetId: "a1", status: "completed" } }],
      events: [{ ID: "e1", PROPERTY_VALUES: { userId: "u1", targetId: "a1", event: "Открытие", createdAt: "2026-11-17T10:00:00Z" } }],
    });
    assert.equal(data.counts.assigned, 1);
    assert.equal(data.counts.done, 1);
    assert.equal(data.users[0].points, 12);
    assert.equal(data.kb[0].openings, 1);
    assert.equal(filterAnalyticsRows(data.materials, "materials", { query: "кодекс", department: "5", from: "2026-11-17", to: "" }).length, 1);
    assert.equal(filterAnalyticsRows(data.materials, "materials", { query: "", department: "5", from: "2026-11-18", to: "" }).length, 0);
    assert.match(renderToStaticMarkup(React.createElement(AnalyticsAdmin)), /Загружаем аналитику/);
  } finally { await server.close(); }
});
