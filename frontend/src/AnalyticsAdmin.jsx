import React, { useEffect, useMemo, useState } from "react";
import "./analytics.css";

const TABS = [["overview", "Обзор"], ["users", "Пользователи"], ["top", "Топ"], ["materials", "Материалы"], ["events", "События"], ["kb", "Список проектов"]];
const TYPE = { course: "Курс", article: "Статья", test: "Тест", file: "Файл" };
const key = (value) => String(value ?? "");
const props = (row) => row?.PROPERTY_VALUES || {};
const dateOf = (row) => String(props(row).createdAt || row?.DATE_CREATE || "").slice(0, 10);
const nameOf = (user) => `${user.NAME || ""} ${user.LAST_NAME || ""}`.trim() || user.EMAIL || `ID ${user.ID}`;
const metaOf = (item) => { try { return JSON.parse(props(item).meta || "{}"); } catch { return {}; } };
const csvCell = (value) => { const raw = String(value ?? ""); const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw; return `"${safe.replaceAll('"', '""')}"`; };
const formatDate = (value) => { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("ru-RU"); };

export function buildAnalytics({ items = [], users = [], departments = [], assigns = [], progress = [], attempts = [], events = [] }) {
  const materials = items.filter((item) => props(item).deleted !== "Y" && !["folder", "section"].includes(props(item).type));
  const itemById = new Map(items.map((item) => [key(item.ID), item]));
  const userById = new Map(users.map((user) => [key(user.ID), user]));
  const uniqueAssigns = [...new Map(assigns.map((row) => [`${key(props(row).userId)}:${key(props(row).targetId)}`, row])).values()];
  const completed = new Set(progress.filter((row) => props(row).status === "completed").map((row) => `${key(props(row).userId)}:${key(props(row).targetId)}`));
  const departmentNames = new Map(departments.map((row) => [key(row.id), row.name]));
  const userRows = [...userById.values()].map((user) => {
    const id = key(user.ID), assignedRows = uniqueAssigns.filter((row) => key(props(row).userId) === id);
    const done = assignedRows.filter((row) => completed.has(`${id}:${key(props(row).targetId)}`)).length;
    const failed = attempts.filter((row) => key(props(row).userId) === id && props(row).passed === "N").length;
    const completedTargets = new Set(progress.filter((row) => key(props(row).userId) === id && props(row).status === "completed").map((row) => key(props(row).targetId)));
    const points = [...completedTargets].reduce((sum, targetId) => sum + Math.max(0, Number(metaOf(itemById.get(targetId)).points) || 0), 0);
    const departmentIds = (user.DEPARTMENT_IDS || user.UF_DEPARTMENT || []).map(key);
    const userEvents = events.filter((row) => key(props(row).userId) === id);
    const courseRows = assignedRows.map((row) => itemById.get(key(props(row).targetId))).filter((item) => props(item).type === "course").map((course) => {
      const children = materials.filter((item) => key(props(item).parentId) === key(course.ID));
      const done = children.filter((item) => completed.has(`${id}:${key(item.ID)}`)).length;
      return { id: key(course.ID), name: course.NAME || "Курс", done, total: children.length, pct: children.length ? Math.round(done / children.length * 100) : 0 };
    });
    const activeSeconds = userEvents.filter((row) => props(row).event === "Активность").reduce((sum, row) => sum + (Number(props(row).duration) || 0), 0);
    return { id, name: nameOf(user), email: user.EMAIL || "", departmentIds, department: departmentIds.map((value) => departmentNames.get(value) || value).join(", "), assigned: assignedRows.length, done, failed, inWork: Math.max(0, assignedRows.length - done), pct: assignedRows.length ? Math.round(done / assignedRows.length * 100) : 0, points, lastDate: userEvents.map(dateOf).sort().at(-1) || "",
      assignedRows, courseRows, activeSeconds, attempts: attempts.filter((row) => key(props(row).userId) === id).map((row) => ({ ...row, testName: itemById.get(key(props(row).testId))?.NAME || "Тест" })), events: userEvents };
  });
  const materialRows = materials.map((item) => {
    const id = key(item.ID), assignedRows = uniqueAssigns.filter((row) => key(props(row).targetId) === id);
    const done = assignedRows.filter((row) => completed.has(`${key(props(row).userId)}:${id}`)).length;
    const itemEvents = events.filter((row) => key(props(row).targetId) === id);
    const departmentIds = [...new Set([...assignedRows, ...itemEvents].flatMap((row) => (userById.get(key(props(row).userId))?.DEPARTMENT_IDS || []).map(key)))];
    return { id, name: item.NAME || "", type: TYPE[props(item).type] || props(item).type || "Материал", departmentIds, assigned: assignedRows.length, done, inWork: Math.max(0, assignedRows.length - done), pct: assignedRows.length ? Math.round(done / assignedRows.length * 100) : 0, lastDate: itemEvents.map(dateOf).sort().at(-1) || "",
      events: itemEvents };
  });
  const eventRows = events.map((row) => ({ id: row.ID, date: props(row).createdAt || row.DATE_CREATE, user: userById.get(key(props(row).userId)), userName: nameOf(userById.get(key(props(row).userId)) || { ID: props(row).userId }), target: props(row).targetName || itemById.get(key(props(row).targetId))?.NAME || "—", event: props(row).event || "Событие", duration: props(row).duration || "—", departmentIds: (userById.get(key(props(row).userId))?.DEPARTMENT_IDS || []).map(key) }));
  const kbRows = materials.filter((item) => props(item).type === "article" && props(item).status === "published").map((item) => { const itemEvents = events.filter((row) => key(props(row).targetId) === key(item.ID)); return { id: key(item.ID), name: item.NAME || "", space: props(item).space || "Root", departmentIds: [...new Set(itemEvents.flatMap((row) => (userById.get(key(props(row).userId))?.DEPARTMENT_IDS || []).map(key)))], lastDate: itemEvents.map(dateOf).sort().at(-1) || "", openings: itemEvents.filter((row) => props(row).event === "Открытие").length, completed: progress.filter((row) => key(props(row).targetId) === key(item.ID) && props(row).status === "completed").length }; });
  const assigned = userRows.reduce((sum, row) => sum + row.assigned, 0), done = userRows.reduce((sum, row) => sum + row.done, 0);
  return { materials: materialRows, users: userRows, top: [...userRows].sort((a, b) => b.points - a.points), events: eventRows, kb: kbRows, departments, counts: { materials: materialRows.length, users: userRows.length, assigned, done, inWork: Math.max(0, assigned - done), attempts: attempts.length, events: events.length } };
}

const request = async (path) => window.RTMV47.request(`/api/v47/${path}`);
async function loadAnalytics() {
  if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
  await window.RTMV47.ready();
  const [items, users, departments, assigns, progress, attempts, events] = await Promise.all([
    request("legacy/rtm_items?summary=true"), request("users"), request("departments"),
    request("legacy/rtm_assigns"), request("legacy/rtm_progress"), request("legacy/rtm_attempts"), request("legacy/rtm_events"),
  ]);
  return buildAnalytics({ items, users, departments, assigns, progress, attempts, events });
}

const columns = {
  users: [["name", "Пользователь"], ["department", "Отделы"], ["pct", "Обученность"], ["assigned", "Назначено"], ["done", "Пройдено"], ["failed", "Провалено"], ["inWork", "В процессе"]],
  top: [["name", "Пользователь"], ["points", "Очки"], ["done", "Пройдено"]],
  materials: [["name", "Материал"], ["type", "Тип"], ["assigned", "Назначено"], ["pct", "Обученность"], ["done", "Пройдено"], ["inWork", "В процессе"]],
  events: [["date", "Время"], ["event", "Событие"], ["userName", "Пользователь"], ["target", "Материал"], ["duration", "Длительность"]],
  kb: [["name", "Статья"], ["space", "Раздел"], ["openings", "Открытий"], ["completed", "Завершений"]],
};

export function filterAnalyticsRows(rows, tab, { query, department, from, to }) {
  const search = query.trim().toLocaleLowerCase("ru-RU");
  return rows.filter((row) => {
    const haystack = Object.values(row).filter((value) => typeof value === "string" || typeof value === "number").join(" ").toLocaleLowerCase("ru-RU");
    const departments = row.departmentIds || [];
    const date = tab === "events" ? String(row.date || "").slice(0, 10) : String(row.lastDate || "").slice(0, 10);
    return (!search || haystack.includes(search)) && (department === "all" || departments.includes(department))
      && (!from || (date && date >= from)) && (!to || (date && date <= to));
  });
}

export function AnalyticsAdmin() {
  const [data, setData] = useState(null), [tab, setTab] = useState("overview"), [revision, setRevision] = useState(0);
  const [query, setQuery] = useState(""), [department, setDepartment] = useState("all"), [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [loading, setLoading] = useState(true), [error, setError] = useState(""), [selectedUser, setSelectedUser] = useState(null);
  const [sort, setSort] = useState({ field: "", direction: 1 });
  useEffect(() => { let live = true; setLoading(true); setError(""); loadAnalytics().then((result) => { if (live) setData(result); }).catch((cause) => { if (live) setError(cause?.message || "Не удалось загрузить аналитику"); }).finally(() => { if (live) setLoading(false); }); return () => { live = false; }; }, [revision]);
  const rows = useMemo(() => {
    const source = data?.[tab] || [];
    const filtered = filterAnalyticsRows(source, tab, { query, department, from, to });
    if (!sort.field) return filtered;
    return [...filtered].sort((a, b) => (typeof a[sort.field] === "number" && typeof b[sort.field] === "number" ? a[sort.field] - b[sort.field] : String(a[sort.field] || "").localeCompare(String(b[sort.field] || ""), "ru", { numeric: true })) * sort.direction);
  }, [data, tab, query, department, from, to, sort]);
  const exportRows = () => {
    const headers = columns[tab]; if (!headers) return;
    const csv = `\ufeff${[headers.map(([, label]) => label), ...rows.map((row) => headers.map(([field]) => row[field]))].map((line) => line.map(csvCell).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `rtm_${tab}_${new Date().toISOString().slice(0, 10)}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  const resetAttempts = async (testId, userId) => {
    if (!window.confirm("Сбросить использованные попытки для этого теста?")) return;
    try { await window.RTMV47.request(`/api/v47/tests/${encodeURIComponent(testId)}/users/${encodeURIComponent(userId)}/attempts`, { method: "DELETE" }); setSelectedUser(null); setRevision((value) => value + 1); }
    catch (cause) { setError(cause?.message || "Не удалось сбросить попытки"); }
  };
  const visibleUser = data?.users.find((row) => row.id === selectedUser);
  return <section className="aa-page" aria-label="Аналитика обучения">
    <header className="aa-head"><div><h1>Аналитика</h1><p>Статистика по пользователям и материалам</p></div><button onClick={() => setRevision((value) => value + 1)} disabled={loading}>Обновить</button></header>
    <nav className="aa-tabs" aria-label="Разделы аналитики">{TABS.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} aria-current={tab === id ? "page" : undefined} onClick={() => { setTab(id); setSort({ field: "", direction: 1 }); }}>{label}</button>)}</nav>
    {error && <div className="aa-error" role="alert">{error} <button onClick={() => setRevision((value) => value + 1)}>Повторить</button></div>}
    {loading ? <p role="status">Загружаем аналитику…</p> : data && <>
      {tab === "overview" ? <><div className="aa-stats">{[["Материалов", data.counts.materials], ["Пользователей", data.counts.users], ["Назначений", data.counts.assigned], ["Пройдено", data.counts.done]].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div><div className="aa-overview"><div className="aa-card"><h2>Статусы назначений</h2><strong>{data.counts.assigned ? Math.round(data.counts.done / data.counts.assigned * 100) : 0}%</strong><p>{data.counts.done} из {data.counts.assigned} назначений завершено</p><progress value={data.counts.done} max={Math.max(1, data.counts.assigned)} /></div><div className="aa-card"><h2>Сводка активности</h2><p>{data.counts.events} событий · {data.counts.attempts} попыток тестов · {data.counts.inWork} назначений в работе</p></div></div></> : <>
        <div className="aa-filters"><input aria-label="Поиск в аналитике" placeholder="Поиск" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Отдел" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">Вся компания</option>{data.departments.map((row) => <option key={row.id} value={key(row.id)}>{row.name}</option>)}</select><label>С <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label>По <input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label><button onClick={exportRows}>⇩ Отчёт</button></div>
        <div className="aa-table"><div className="aa-table-head"><h2>{TABS.find(([id]) => id === tab)?.[1]}</h2><span>Найдено: {rows.length}</span></div><div className="aa-scroll"><table><thead><tr>{columns[tab].map(([field, label]) => <th key={field}><button onClick={() => setSort((value) => ({ field, direction: value.field === field ? -value.direction : 1 }))}>{label} {sort.field === field ? (sort.direction === 1 ? "↑" : "↓") : ""}</button></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={tab === "users" || tab === "top" ? () => setSelectedUser(row.id) : undefined} className={tab === "users" || tab === "top" ? "clickable" : ""}>{columns[tab].map(([field]) => <td key={field}>{field === "date" ? formatDate(row[field]) : field === "pct" ? `${row[field]}%` : String(row[field] ?? "—")}</td>)}</tr>)}</tbody></table>{!rows.length && <p>Нет данных для выбранных фильтров</p>}</div></div>
      </>}
    </>}
    {visibleUser && <div className="aa-dialog-backdrop" onClick={() => setSelectedUser(null)}><section className="aa-dialog" role="dialog" aria-modal="true" aria-label={`Аналитика: ${visibleUser.name}`} onClick={(event) => event.stopPropagation()}><header><div><h2>{visibleUser.name}</h2><p>{visibleUser.email} · {visibleUser.department || "Отдел не указан"}</p><p>Последняя активность: {formatDate(visibleUser.events[0] && (props(visibleUser.events[0]).createdAt || visibleUser.events[0].DATE_CREATE))}</p></div><button onClick={() => setSelectedUser(null)} aria-label="Закрыть">×</button></header><div className="aa-stats">{[["Назначено", visibleUser.assigned], ["Пройдено", visibleUser.done], ["Попыток", visibleUser.attempts.length], ["Активное время", `${Math.round(visibleUser.activeSeconds / 60)} мин`]].map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div><h3>Прогресс по курсам</h3>{visibleUser.courseRows.length ? <ul>{visibleUser.courseRows.map((row) => <li key={row.id}><span>{row.name} · {row.done} из {row.total}</span><strong>{row.pct}%</strong></li>)}</ul> : <p>Курсы пока не назначены</p>}<h3>Последние попытки тестов</h3>{visibleUser.attempts.length ? <ul>{visibleUser.attempts.slice(0, 12).map((row) => <li key={row.ID}><span>{row.testName} · {String(props(row).score || 0)}% · {formatDate(props(row).createdAt)} · {props(row).passed === "PENDING" ? "На проверке" : props(row).passed === "Y" ? "Зачёт" : "Не зачтено"}</span>{props(row).testId && <button onClick={() => resetAttempts(props(row).testId, visibleUser.id)}>Дать новые попытки</button>}</li>)}</ul> : <p>Попыток пока нет</p>}<h3>История действий</h3>{visibleUser.events.length ? <ul>{visibleUser.events.filter((row) => props(row).event !== "Активность").slice(0, 20).map((row) => <li key={row.ID}>{formatDate(props(row).createdAt)} · {props(row).event || "Событие"} · {props(row).targetName || "—"}</li>)}</ul> : <p>Событий пока нет</p>}</section></div>}
  </section>;
}
