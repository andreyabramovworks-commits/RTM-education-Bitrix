import React, { useEffect, useState } from "react";
import "./dashboard.css";

const TYPES = { article: "Статья", test: "Тест", course: "Курс", file: "Файл", folder: "Папка" };
const dateText = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("ru-RU"); };

export function DashboardAdmin({ onOpenRoute, onOpenMaterial }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("rtm:admin-change", refresh);
    return () => window.removeEventListener("rtm:admin-change", refresh);
  }, []);
  useEffect(() => {
    let live = true;
    setLoading(true); setError("");
    (async () => {
      if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
      await window.RTMV47.ready();
      return window.RTMV47.request("/api/v47/dashboard");
    })().then((result) => { if (live) setData(result); })
      .catch((cause) => { if (live) setError(cause?.message || "Не удалось загрузить сводку"); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [revision]);

  const counts = data?.counts || { materials: 0, users: 0, completed: 0, inWork: 0, notStarted: 0 };
  const total = Math.max(counts.completed + counts.inWork + counts.notStarted, 1);
  const doneDeg = Math.round(counts.completed / total * 360);
  const workDeg = Math.round(counts.inWork / total * 360);
  return <section className="da-page" aria-label="Дашборд обучения">
    <header className="da-head"><div><h1>Дашборд</h1><p>Сводка по порталу обучения</p></div><button onClick={() => setRevision((value) => value + 1)} disabled={loading}>Обновить</button></header>
    {error && <div className="da-error" role="alert">{error} <button onClick={() => setRevision((value) => value + 1)}>Повторить</button></div>}
    {loading ? <p role="status">Загружаем сводку…</p> : <>
      <div className="da-top"><article className="da-card"><h2>Обучаемость</h2><div className="da-chart"><div className="da-donut" style={{ background: `conic-gradient(#22c55e 0 ${doneDeg}deg,#f59e0b ${doneDeg}deg ${doneDeg + workDeg}deg,#94a3b8 ${doneDeg + workDeg}deg 360deg)` }} aria-label={`Пройдено: ${counts.completed}; в процессе: ${counts.inWork}; не начато: ${counts.notStarted}`} /><div className="da-legend"><span>🟢 Пройдено: {counts.completed}</span><span>🟠 В процессе: {counts.inWork}</span><span>⚪ Не начато: {counts.notStarted}</span></div></div></article>
        <article className="da-card"><header><h2>Последние события</h2><button onClick={() => onOpenRoute("events")}>Все события</button></header>{data.recentEvents.length ? data.recentEvents.map((row) => <button className="da-row" key={row.id} onClick={() => row.targetId && onOpenMaterial(row.targetId)} disabled={!row.targetId}><b>{row.userName}</b> {row.event} «{row.targetName}»<small>{dateText(row.createdAt)}</small></button>) : <p>Событий пока нет</p>}</article></div>
      <div className="da-stats"><button onClick={() => onOpenRoute("materials")}><span>Материалов всего</span><b>{counts.materials}</b></button><button onClick={() => onOpenRoute("users")}><span>Пользователей всего</span><b>{counts.users}</b></button><div><span>Пройдено материалов</span><b>{counts.completed}</b></div><div><span>Материалов в работе</span><b>{counts.inWork}</b></div></div>
      <article className="da-card"><header><div><h2>Последние материалы</h2><p>Пять последних созданных единиц контента</p></div><button onClick={() => onOpenRoute("materials")}>Все материалы</button></header>{data.recentMaterials.length ? data.recentMaterials.map((row) => <button className="da-row" key={row.id} onClick={() => onOpenMaterial(row.id)}><span className="da-type">{TYPES[row.type] || row.type}</span><b>{row.name}</b><small>Автор: {row.author} · {dateText(row.updatedAt)}</small></button>) : <p>Материалов пока нет</p>}</article>
    </>}
  </section>;
}
