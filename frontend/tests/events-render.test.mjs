import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("event journal renders one React screen and filters real rows", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { EventsAdmin, filterEvents } = await server.ssrLoadModule("/src/EventsAdmin.jsx");
    const rows = [
      { id: "1", userName: "Мария", event: "Открытие", targetName: "Кодекс", departmentIds: ["5"], createdAt: "2026-11-17T10:00:00Z" },
      { id: "2", userName: "Иван", event: "Завершение", targetName: "Курс", departmentIds: ["6"], createdAt: "2026-11-16T10:00:00Z" },
    ];
    assert.deepEqual(filterEvents(rows, { query: "кодекс", department: "5", from: "2026-11-17" }).map((row) => row.id), ["1"]);
    assert.deepEqual(filterEvents(rows, { query: "", department: "6", from: "2026-11-17" }), []);
    const markup = renderToStaticMarkup(React.createElement(EventsAdmin));
    assert.match(markup, /Журнал событий/);
    assert.match(markup, /Загружаем события/);
    assert.match(markup, /События с даты/);
  } finally {
    await server.close();
  }
});
