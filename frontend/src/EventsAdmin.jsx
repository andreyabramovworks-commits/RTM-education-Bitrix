import React, { useEffect, useMemo, useState } from "react";
import "./events.css";

const TYPE_LABELS = { folder: "Папка", article: "Статья", test: "Тест", course: "Курс", file: "Файл" };
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("ru-RU");
};
const csvCell = (value) => {
  const text = String(value ?? "");
  const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

export function filterEvents(events, { query, department, from }) {
  const search = query.trim().toLocaleLowerCase("ru-RU");
  return events.filter((row) => {
    const text = `${row.userName} ${row.event} ${row.targetName}`.toLocaleLowerCase("ru-RU");
    return (!search || text.includes(search))
      && (department === "all" || (row.departmentIds || []).map(String).includes(department))
      && (!from || String(row.createdAt || "").slice(0, 10) >= from);
  });
}

export function EventsAdmin() {
  const [data, setData] = useState({ events: [], departments: [] });
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [from, setFrom] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError("");
    (async () => {
      if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
      await window.RTMV47.ready();
      return window.RTMV47.request("/api/v47/events");
    })().then((response) => {
      if (live) setData(response);
    }).catch((cause) => {
      if (live) setError(cause?.message || "Не удалось загрузить события");
    }).finally(() => {
      if (live) setLoading(false);
    });
    return () => { live = false; };
  }, [revision]);

  const rows = useMemo(() => filterEvents(data.events, { query, department, from }), [data.events, query, department, from]);
  const download = () => {
    const header = ["Дата", "Пользователь", "Событие", "Материал"];
    const lines = [header, ...data.events.map((row) => [formatDate(row.createdAt), row.userName, row.event, row.targetName])];
    const csv = `\ufeff${lines.map((line) => line.map(csvCell).join(";")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "rtm_events.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return <section className="ea-page" aria-label="Журнал событий">
    <header className="ea-head"><div><h1>События</h1><p>Лента событий контента по порталу</p></div><button onClick={() => setRevision((value) => value + 1)} disabled={loading}>Обновить</button></header>
    <div className="ea-toolbar">
      <input aria-label="Поиск событий" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по пользователю, событию или материалу" />
      <select aria-label="Отдел" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">Вся компания</option>{data.departments.map((row) => <option key={row.id} value={String(row.id)}>{row.name}</option>)}</select>
      <input aria-label="События с даты" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
      <button onClick={download} disabled={!data.events.length}>⇩ Отчёт</button>
    </div>
    {error && <div className="ea-error" role="alert">{error} <button onClick={() => setRevision((value) => value + 1)}>Повторить</button></div>}
    <div className="ea-table"><header><h2>Список событий</h2><span>Всего: {rows.length}</span></header>
      {loading ? <p role="status">Загружаем события…</p> : rows.length ? <div className="ea-scroll"><table><thead><tr><th>Дата/время</th><th>Пользователь</th><th>Событие</th><th>Материал</th><th>Длительность</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{formatDate(row.createdAt)}</td><td>{row.userName}</td><td>{row.event}</td><td>{TYPE_LABELS[row.targetType] || "Материал"}: {row.targetName}</td><td>{row.duration}</td></tr>)}</tbody></table></div> : <p>Событий нет</p>}
    </div>
  </section>;
}
