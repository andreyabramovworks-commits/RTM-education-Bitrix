import React, { useEffect, useMemo, useRef, useState } from "react";
import "./learner.css";

const NAV = [
  ["learn", "Обучение"],
  ["kb", "База знаний"],
  ["profile", "Профиль"],
];

const parseMeta = (item) => {
  try { return JSON.parse(item?.PROPERTY_VALUES?.meta || "{}"); } catch { return {}; }
};
const kindOf = (item) => item?.PROPERTY_VALUES?.type || "article";
const text = (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const userName = (user) => `${user?.NAME || ""} ${user?.LAST_NAME || ""}`.trim() || user?.EMAIL || "";

function Icon({ name }) {
  const paths = {
    learn: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21M8 7h8"/></>,
    kb: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11l2 2h4.5A2.5 2.5 0 0 1 20 8.5V19H4z"/><path d="M8 11h8M8 15h5"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    sync: <><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 9A7 7 0 0 1 18 6l2 6M18 15a7 7 0 0 1-12 3l-2-6"/></>,
    course: <><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12M9 8h6"/></>,
    article: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/></>,
    test: <><path d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4h8.8A3 3 0 0 0 19 17l-5-9V3"/><path d="M8 15h8"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg className="lr-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name] || paths.article}</svg>;
}

function Progress({ value, label }) {
  return <div className="lr-progress-wrap">
    <div className="lr-progress-copy"><span>{label}</span><strong>{value}%</strong></div>
    <div className="lr-progress" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}><span style={{ width: `${value}%` }} /></div>
  </div>;
}

function EmptyState({ title, children, action }) {
  return <section className="lr-empty">
    <span className="lr-empty-art"><Icon name="course" /></span>
    <h2>{title}</h2><p>{children}</p>{action}
  </section>;
}

function MaterialSurface({ bridge, material, course, onBack }) {
  const slot = useRef(null);
  useEffect(() => {
    const node = document.getElementById("userMaterialView");
    if (!node || !slot.current) return;
    const parent = node.parentNode;
    const next = node.nextSibling;
    slot.current.appendChild(node);
    node.classList.remove("hidden");
    const back = node.querySelector("#uBackToCourse");
    if (back) back.onclick = onBack;
    const done = node.querySelector("#uMarkMaterialDone");
    if (done) done.onclick = async () => { await bridge.completeMaterial(material.ID); onBack(); };
    const observer = new MutationObserver(() => { if (node.classList.contains("hidden")) onBack(); });
    observer.observe(node, { attributes: true, attributeFilter: ["class"] });
    return () => {
      observer.disconnect();
      if (parent) parent.insertBefore(node, next);
    };
  }, [bridge, material.ID, onBack]);
  return <main className="lr-material-shell">
    <div className="lr-material-context"><span>{course?.NAME || "База знаний"}</span><span aria-hidden="true">/</span><strong>{material.NAME}</strong></div>
    <div ref={slot} className="lr-legacy-material" />
  </main>;
}

function Courses({ snapshot, bridge, selectedCourse, setSelectedCourse, openMaterial }) {
  const [tab, setTab] = useState("active");
  const courses = snapshot.courses || [];
  const courseData = (course) => {
    const materials = bridge.courseMaterials(course.ID);
    const completed = materials.filter((item) => snapshot.done[String(item.ID)]).length;
    return { materials, completed, percent: materials.length ? Math.round(completed / materials.length * 100) : 0 };
  };
  if (selectedCourse) {
    const data = courseData(selectedCourse);
    const meta = parseMeta(selectedCourse);
    const sections = (meta.sections?.length ? meta.sections : [{ id: "nosection", title: "Материалы курса" }]);
    const next = data.materials.find((item) => !snapshot.done[String(item.ID)] && bridge.canOpen(item.ID)) || data.materials[0];
    return <main className="lr-page lr-course-page">
      <button className="lr-back" onClick={() => setSelectedCourse(null)}>← Все курсы</button>
      <section className="lr-course-hero">
        <span className="lr-course-art"><Icon name="course" /></span>
        <div className="lr-course-summary"><span className="lr-eyebrow">Курс</span><h1>{selectedCourse.NAME}</h1>
          {selectedCourse.PROPERTY_VALUES?.content && <p>{text(selectedCourse.PROPERTY_VALUES.content)}</p>}
          <Progress value={data.percent} label="Прогресс курса" />
          {next && <button className="lr-primary lr-wide-mobile" onClick={() => openMaterial(next, selectedCourse)}>{data.percent ? "Продолжить обучение" : "Начать обучение"}</button>}
        </div>
      </section>
      <section className="lr-course-content"><div className="lr-section-heading"><div><span className="lr-eyebrow">Программа</span><h2>Материалы курса</h2></div><span>{data.completed} из {data.materials.length} пройдено</span></div>
        {data.materials.length ? sections.map((section) => {
          const rows = data.materials.filter((item) => String(parseMeta(item).sectionId || "nosection") === String(section.id));
          if (!rows.length) return null;
          return <div className="lr-course-section" key={section.id}><h3>{section.title || "Материалы"}</h3><div className="lr-lesson-list">{rows.map((item, index) => {
            const done = snapshot.done[String(item.ID)], locked = !bridge.canOpen(item.ID), required = [true, "Y"].includes(parseMeta(item).required);
            return <button className="lr-lesson" key={item.ID} disabled={locked} onClick={() => openMaterial(item, selectedCourse)}>
              <span className={`lr-lesson-icon ${done ? "is-done" : ""}`}>{done ? <Icon name="check" /> : <Icon name={kindOf(item)} />}</span>
              <span className="lr-lesson-copy"><span>{index + 1}. {kindOf(item) === "test" ? "Тест" : "Материал"}{required ? " · обязательный" : ""}</span><strong>{item.NAME}</strong></span>
              <span className={`lr-status ${done ? "is-done" : locked ? "is-locked" : ""}`}>{done ? "Пройден" : locked ? "Закрыт" : "Открыть"}</span><Icon name="arrow" />
            </button>;
          })}</div></div>;
        }) : <EmptyState title="В курсе пока нет материалов">Когда автор добавит программу, она появится здесь.</EmptyState>}
      </section>
    </main>;
  }
  const visible = courses.filter((course) => tab === "completed" ? snapshot.done[String(course.ID)] : !snapshot.done[String(course.ID)]);
  return <main className="lr-page">
    <header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Моё обучение</h1><p>Курсы, которые назначены вам для прохождения.</p></div></header>
    <div className="lr-tabs" role="tablist" aria-label="Состояние курсов" onKeyDown={(event) => { if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return; event.preventDefault(); const next = tab === "active" ? "completed" : "active"; setTab(next); event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus(); }}>
      {["active", "completed"].map((value) => <button key={value} data-tab={value} role="tab" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)}>{value === "active" ? "Текущие" : "Завершённые"}<span>{courses.filter((course) => value === "completed" ? snapshot.done[String(course.ID)] : !snapshot.done[String(course.ID)]).length}</span></button>)}
    </div>
    {visible.length ? <div className="lr-course-grid">{visible.map((course) => { const data = courseData(course); return <button className="lr-course-card" key={course.ID} onClick={() => setSelectedCourse(course)}>
      <span className="lr-card-art"><Icon name="course" /></span><span className="lr-card-copy"><span className="lr-eyebrow">Курс</span><strong>{course.NAME}</strong><span className="lr-card-desc">{text(course.PROPERTY_VALUES?.content) || "Откройте курс, чтобы посмотреть программу."}</span><Progress value={data.percent} label="Пройдено" /></span><span className="lr-card-action">Открыть <Icon name="arrow" /></span>
    </button>})}</div> : <EmptyState title={tab === "active" ? "Новых курсов пока нет" : "Завершённых курсов пока нет"}>{tab === "active" ? "Курс появится здесь после назначения руководителем или преподавателем." : "Завершите первый курс — результат сохранится в этом разделе."}</EmptyState>}
  </main>;
}

function Knowledge({ snapshot, openMaterial }) {
  const [query, setQuery] = useState("");
  const [projectId, setProjectId] = useState("");
  const items = useMemo(() => (snapshot.items || []).filter((item) => item.PROPERTY_VALUES?.type !== "section" && item.PROPERTY_VALUES?.status !== "draft"), [snapshot.items]);
  const normalized = query.trim().toLowerCase();
  const projects = (snapshot.projects || []).filter((project) => `${project.NAME} ${items.filter((item) => String(item.PROPERTY_VALUES?.projectId) === String(project.ID)).map((item) => item.NAME).join(" ")}`.toLowerCase().includes(normalized));
  const project = projects.find((row) => String(row.ID) === String(projectId)) || (snapshot.projects || []).find((row) => String(row.ID) === String(projectId));
  const docs = items.filter((item) => String(item.PROPERTY_VALUES?.projectId) === String(projectId) && `${item.NAME} ${text(item.PROPERTY_VALUES?.content)}`.toLowerCase().includes(normalized));
  return <main className="lr-page"><header className="lr-page-head lr-kb-head"><div><span className="lr-eyebrow">Справочник</span><h1>База знаний</h1><p>Инструкции и материалы компании в одном месте.</p></div>
    <label className="lr-search"><span>Поиск по базе знаний</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Название или ключевое слово" /></label></header>
    {project && <button className="lr-back" onClick={() => setProjectId("")}>← Все разделы</button>}
    <div className="lr-section-heading"><div><span className="lr-eyebrow">{project ? "Раздел" : "Навигация"}</span><h2>{project?.NAME || "Разделы базы знаний"}</h2></div></div>
    {!project ? (projects.length ? <div className="lr-kb-grid">{projects.map((row) => { const count = items.filter((item) => String(item.PROPERTY_VALUES?.projectId) === String(row.ID)).length; return <button className="lr-kb-card" key={row.ID} onClick={() => setProjectId(String(row.ID))}><span><Icon name="kb" /></span><strong>{row.NAME}</strong><small>{count} {count === 1 ? "материал" : "материалов"}</small><Icon name="arrow" /></button>})}</div> : <EmptyState title="Ничего не найдено">Измените запрос или проверьте написание.</EmptyState>) : (docs.length ? <div className="lr-doc-list">{docs.map((item) => <button key={item.ID} onClick={() => openMaterial(item, null)}><span><Icon name={kindOf(item)} /></span><span><strong>{item.NAME}</strong><small>{kindOf(item) === "test" ? "Тест" : "Статья"}</small></span><Icon name="arrow" /></button>)}</div> : <EmptyState title="В разделе пока пусто">Материалы появятся после публикации.</EmptyState>)}
  </main>;
}

function Profile({ snapshot }) {
  const name = userName(snapshot.user), valid = snapshot.userId !== "0" && !!name;
  const courses = snapshot.courses || [], completedCourses = courses.filter((course) => snapshot.done[String(course.ID)]).length;
  const materialIds = new Set((snapshot.items || []).filter((item) => ["article", "test"].includes(kindOf(item))).map((item) => String(item.ID)));
  const doneMaterials = Object.entries(snapshot.done || {}).filter(([id, done]) => done && materialIds.has(id)).length;
  const scores = (snapshot.attempts || []).filter((row) => String(row.PROPERTY_VALUES?.userId) === String(snapshot.progressUserId || snapshot.userId)).map((row) => Number(row.PROPERTY_VALUES?.score)).filter(Number.isFinite);
  const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null;
  if (!valid) return <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Профиль</h1></div></header><EmptyState title="Не удалось определить пользователя">Откройте приложение из вашего портала Bitrix24, затем повторите синхронизацию.</EmptyState></main>;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  return <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Профиль</h1><p>Ваш прогресс и результаты обучения.</p></div></header>
    <section className="lr-profile"><div className="lr-profile-person"><span>{initials}</span><div><h2>{name}</h2>{snapshot.user.EMAIL && <p>{snapshot.user.EMAIL}</p>}</div></div>
      <div className="lr-stats"><div><strong>{courses.length - completedCourses}</strong><span>курсов в работе</span></div><div><strong>{completedCourses}</strong><span>курсов завершено</span></div><div><strong>{doneMaterials}</strong><span>материалов пройдено</span></div><div><strong>{average == null ? "—" : `${average}%`}</strong><span>средний результат тестов</span></div></div>
    </section>
  </main>;
}

export function LearnerApp({ bridge }) {
  const [snapshot, setSnapshot] = useState(() => bridge.getSnapshot());
  const [view, setView] = useState("learn");
  const [menu, setMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materialContext, setMaterialContext] = useState(null);
  useEffect(() => bridge.subscribe(() => setSnapshot(bridge.getSnapshot())), [bridge]);
  useEffect(() => { document.body.classList.toggle("rtm-learner-active", snapshot.mode === "user"); return () => document.body.classList.remove("rtm-learner-active"); }, [snapshot.mode]);
  const go = (next) => { setView(next); setSelectedCourse(null); setMaterialContext(null); setMenu(false); };
  const openMaterial = (material, course) => { bridge.openMaterial(material.ID); setMaterialContext({ material, course }); };
  const backFromMaterial = () => setMaterialContext(null);
  if (snapshot.mode !== "user") return null;
  return <div className="learner-app">
    <header className="lr-header"><button className="lr-brand" onClick={() => go("learn")} aria-label="RTM Обучение, на главную"><b>RTM</b><span>обучение</span></button>
      <nav className="lr-nav" aria-label="Основная навигация">{NAV.map(([id, label]) => <button key={id} className={view === id ? "active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => go(id)}><Icon name={id} />{label}</button>)}</nav>
      <div className="lr-header-actions"><button className="lr-sync" disabled={snapshot.syncing} onClick={() => bridge.refresh()}><Icon name="sync" />{snapshot.syncing ? "Обновляем…" : "Синхронизировать"}</button>{["admin", "moderator"].includes(snapshot.role) && <button className="lr-admin-mode" onClick={() => bridge.setMode("admin")}>Администрирование</button>}<button className="lr-menu-button" aria-label={menu ? "Закрыть меню" : "Открыть меню"} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"} /></button></div>
    </header>
    {menu && <nav className="lr-mobile-nav" aria-label="Мобильная навигация">{NAV.map(([id, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => go(id)}><Icon name={id} />{label}</button>)}<button disabled={snapshot.syncing} onClick={() => { setMenu(false); bridge.refresh(); }}><Icon name="sync" />Синхронизировать</button></nav>}
    {snapshot.syncError && <div className="lr-alert" role="alert"><span>{snapshot.syncError}</span><button onClick={() => bridge.refresh()}>Повторить</button></div>}
    {snapshot.userId === "0" ? <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Подключение</span><h1>Не удалось определить пользователя</h1><p>Для защиты учебных данных требуется действующая сессия Bitrix24.</p></div></header><EmptyState title="Откройте приложение из Bitrix24">Вернитесь в портал, откройте RTM Обучение и нажмите «Синхронизировать».</EmptyState></main> : materialContext ? <MaterialSurface bridge={bridge} material={materialContext.material} course={materialContext.course} onBack={backFromMaterial} /> : view === "learn" ? <Courses snapshot={snapshot} bridge={bridge} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} openMaterial={openMaterial} /> : view === "kb" ? <Knowledge snapshot={snapshot} openMaterial={openMaterial} /> : <Profile snapshot={snapshot} />}
  </div>;
}
