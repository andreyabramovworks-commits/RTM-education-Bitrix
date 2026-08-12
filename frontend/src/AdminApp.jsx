import React, { useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";

const ICONS = {
  dashboard: "M3 11.5 12 4l9 7.5M5 10.5V20h5v-5h4v5h5v-9.5",
  materials: "M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 21V5.5M8 7h8",
  users: "M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3 3 0 100-6 3 3 0 000 6M17 8a3 3 0 010 5.8M22 21v-2a4 4 0 00-3-3.87",
  database: "M5 5c0 1.66 3.13 3 7 3s7-1.34 7-3-3.13-3-7-3-7 1.34-7 3zm0 0v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6",
  reviews: "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 6l2 2 5-5M8 16h8",
  analytics: "M4 19v-6M10 19V8M16 19v-5M21 19H3",
  events: "M3 10h18M8 2v4M16 2v4M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2",
  settings: "M12 15.5A3.5 3.5 0 1012 8a3.5 3.5 0 000 7.5zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6l-1.5 1.5m-9 9L6 18m12 0l-1.5-1.5m-9-9L6 6",
  info: "M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2zm4-8h8M8 7h5M8 15h6",
  help: "M12 17h.01M9.1 9a3 3 0 115.3 1.9c-.9 1-2.4 1.2-2.4 3.1M12 22a10 10 0 100-20 10 10 0 000 20",
  sync: "M20 7h-5V2M4 17h5v5M20 7a8 8 0 00-14-3M4 17a8 8 0 0014 3",
  learner: "M19 12H5m6-6l-6 6 6 6",
  classic: "M4 5h16v14H4zM4 9h16M9 9v10",
};

function Icon({ name }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[name]} /></svg>;
}

const GROUPS = [
  ["Обзор", [["dashboard", "Дашборд", "Оперативная сводка по обучению"]]],
  ["Управление обучением", [
    ["materials", "Материалы и курсы", "Проекты, курсы, статьи и тесты"],
    ["users", "Пользователи и роли", "Доступы и синхронизация сотрудников"],
    ["database", "Управление Базой знаний", "Структура, документы и редакции"],
    ["reviews", "Центр проверок", "Очередь и история проверок"],
  ]],
  ["Контроль и отчётность", [
    ["analytics", "Аналитика", "Показатели и детальные отчёты"],
    ["events", "События", "Журнал действий в приложении"],
  ]],
  ["Система", [["settings", "Настройки", "Оформление и параметры портала"]]],
];

function useAdminSnapshot(bridge) {
  const [snapshot, setSnapshot] = useState(() => bridge.getSnapshot());
  useEffect(() => bridge.subscribe(() => setSnapshot(bridge.getSnapshot())), [bridge]);
  return snapshot;
}

export function AdminApp({ bridge, onSetMode }) {
  const snapshot = useAdminSnapshot(bridge);
  const mountRef = useRef(null);
  const [route, setRoute] = useState(() => bridge.getSnapshot().route || "dashboard");
  const [hints, setHints] = useState(() => {
    try { return localStorage.getItem("rtm_admin_hints") !== "0"; } catch { return true; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const isDeveloper = snapshot.role === "developer";
  const groups = useMemo(() => isDeveloper ? [...GROUPS, ["Инструменты разработчика", [["info", "Наработки сцен", "Рабочая область сцен Excalidraw"]]]] : GROUPS, [isDeveloper]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    bridge.mount(mount);
    return () => bridge.unmount();
  }, [bridge]);

  useEffect(() => {
    bridge.openRoute(route);
    setMenuOpen(false);
  }, [bridge, route]);

  const selectRoute = (nextRoute) => {
    if (nextRoute === route) bridge.openRoute(nextRoute);
    else setRoute(nextRoute);
    setMenuOpen(false);
  };

  const toggleHints = () => {
    const next = !hints;
    setHints(next);
    try { localStorage.setItem("rtm_admin_hints", next ? "1" : "0"); } catch {}
  };

  const primary = snapshot.appearance?.primaryColor || "#16845b";
  return <div className={`rtm-admin-v53 ${hints ? "has-guidance" : ""}`} style={{ "--adm-accent": primary }}>
    <header className="adm-topbar">
      <button className="adm-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню" aria-expanded={menuOpen}>☰</button>
      <button className="adm-brand" onClick={() => selectRoute("dashboard")} data-tip="Перейти на дашборд">
        {snapshot.appearance?.logo ? <img src={snapshot.appearance.logo} alt="" /> : <b>RTM</b>}
        <span>{snapshot.appearance?.brandName?.replace(/^RTM\s*/i, "") || "обучение"}</span>
        <em>Администрирование</em>
      </button>
      <div className="adm-top-actions">
        <button className={hints ? "is-active" : ""} onClick={toggleHints} aria-pressed={hints} data-tip="Показывать пояснения после наведения на элементы"><Icon name="help" /><span>Подсказки</span></button>
        <button onClick={() => bridge.refresh()} disabled={snapshot.syncing} data-tip="Получить актуальные данные из Bitrix24"><Icon name="sync" /><span>{snapshot.syncing ? "Обновляем…" : "Синхронизировать"}</span></button>
        <button onClick={() => bridge.openClassic()} data-tip="Открыть прежнюю админку отдельно"><Icon name="classic" /><span>Классическая версия</span></button>
        <button className="adm-user-mode" onClick={() => onSetMode("user")} data-tip="Вернуться в интерфейс ученика"><Icon name="learner" /><span>К обучению</span></button>
      </div>
    </header>
    <div className="adm-layout">
      <aside className={`adm-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Разделы администрирования">
        <div className="adm-sidebar-intro"><span>Рабочее пространство</span><b>{snapshot.roleLabel || "Администратор"}</b></div>
        <nav>
          {groups.map(([label, items]) => <section key={label}><h2>{label}</h2>{items.map(([id, title, tip]) => <button key={id} data-admin-route={id} className={route === id ? "active" : ""} onClick={() => selectRoute(id)} data-tip={tip} aria-current={route === id ? "page" : undefined}><Icon name={id} /><span>{title}</span></button>)}</section>)}
        </nav>
        <footer><span>Новая админка</span><b>v{snapshot.releaseVersion}</b></footer>
      </aside>
      {menuOpen && <button className="adm-menu-scrim" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" />}
      <main className="adm-workspace" data-admin-route={route} ref={mountRef} />
    </div>
  </div>;
}
