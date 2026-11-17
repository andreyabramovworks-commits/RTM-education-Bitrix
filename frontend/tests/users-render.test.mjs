import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("users screen renders React controls and filters actual roles and departments", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { UsersAdmin, filterUsers } = await server.ssrLoadModule("/src/UsersAdmin.jsx");
    const users = [
      { ID: "1", NAME: "Мария", EMAIL: "m@example.com", ROLE: "editor", DEPARTMENT_IDS: ["5"] },
      { ID: "2", NAME: "Иван", EMAIL: "i@example.com", ROLE: "teacher", DEPARTMENT_IDS: ["6"] },
    ];
    assert.deepEqual(filterUsers(users, { query: "мар", department: "5", role: "editor", sort: "name" }).map((row) => row.ID), ["1"]);
    assert.deepEqual(filterUsers(users, { query: "", department: "all", role: "all", sort: "role" }).map((row) => row.ID), ["1", "2"]);
    const markup = renderToStaticMarkup(React.createElement(UsersAdmin, { bridge: { refresh: async () => {} } }));
    assert.match(markup, /Пользователи и роли/);
    assert.match(markup, /Загружаем пользователей/);
    assert.match(markup, /Все роли/);
  } finally { await server.close(); }
});
