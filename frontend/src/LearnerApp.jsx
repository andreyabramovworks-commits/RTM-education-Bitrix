import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./learner.css";

const NAV = [["learn", "Обучение"], ["kb", "База знаний"], ["profile", "Профиль"]];
const parseMeta = (item) => { try { return JSON.parse(item?.PROPERTY_VALUES?.meta || "{}"); } catch { return {}; } };
const kindOf = (item) => item?.PROPERTY_VALUES?.type || "article";
const plainText = (html) => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const userName = (user) => `${user?.NAME || ""} ${user?.LAST_NAME || ""}`.trim() || user?.EMAIL || "";
const formatDate = (value) => value ? new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value)) : "—";
const ackDone = (status) => ["completed", "exempted"].includes(status);

function Icon({ name }) {
  const paths = {
    learn: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5V21M8 7h8"/></>,
    kb: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11l2 2h4.5A2.5 2.5 0 0 1 20 8.5V19H4z"/><path d="M8 11h8M8 15h5"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    sync: <><path d="M20 11a8 8 0 0 0-14.9-4M4 4v5h5"/><path d="M4 13a8 8 0 0 0 14.9 4M20 20v-5h-5"/></>,
    course: <><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h12M9 8h6"/></>,
    article: <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M10 12h5M10 16h5"/></>,
    test: <><path d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4h8.8A3 3 0 0 0 19 17l-5-9V3"/><path d="M8 15h8"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>, menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>, check: <path d="m5 12 4 4L19 6"/>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.27c-.7.28-1 .73-1 1.48V13M12 17h.01"/></>,
    admin: <><path d="M12 3 4 7v5c0 4.6 3.2 7.4 8 9 4.8-1.6 8-4.4 8-9V7z"/><path d="m9 12 2 2 4-4"/></>,
    folder: <path d="M3 6h7l2 2h9v11H3z"/>, trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0zM12 12v5M9 20h6"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
    music: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
  };
  return <svg className="lr-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name] || paths.article}</svg>;
}

function Hint({ bridge, hintKey, label }) {
  return <button className="lr-context-help" aria-label={`Подсказка: ${label}`} onClick={(event) => bridge.openHint(event.currentTarget, hintKey)}><span aria-hidden="true">?</span></button>;
}

function Progress({ value, label }) {
  return <div className="lr-progress-wrap"><div className="lr-progress-copy"><span>{label}</span><strong>{value}%</strong></div><div className="lr-progress" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}><span style={{ width: `${value}%` }} /></div></div>;
}

function EmptyState({ title, children, action }) {
  return <section className="lr-empty"><span className="lr-empty-art"><Icon name="course" /></span><h2>{title}</h2><p>{children}</p>{action}</section>;
}

function ResourceState({ state, retry, emptyTitle = "Данных пока нет", children }) {
  if (state.loading) return <section className="lr-resource-state" role="status"><span className="lr-spinner" />Загружаем данные…</section>;
  if (state.error) return <EmptyState title="Не удалось загрузить данные">{state.error}<button className="lr-secondary" onClick={retry}>Повторить</button></EmptyState>;
  if (!state.data) return <EmptyState title={emptyTitle}>Нажмите «Синхронизировать» и повторите попытку.</EmptyState>;
  return children(state.data);
}

function MaterialSurface({ bridge, material, course, onBack }) {
  const slot = useRef(null);
  useEffect(() => {
    const node = document.getElementById("userMaterialView");
    if (!node || !slot.current) return;
    const parent = node.parentNode, next = node.nextSibling;
    slot.current.appendChild(node); node.classList.remove("hidden");
    const back = node.querySelector("#uBackToCourse"); if (back) back.onclick = onBack;
    const done = node.querySelector("#uMarkMaterialDone"); if (done) done.onclick = async () => { await bridge.completeMaterial(material.ID); onBack(); };
    const observer = new MutationObserver(() => { if (node.classList.contains("hidden")) onBack(); });
    observer.observe(node, { attributes: true, attributeFilter: ["class"] });
    return () => { observer.disconnect(); if (parent) parent.insertBefore(node, next); };
  }, [bridge, material.ID, onBack]);
  return <main className="lr-material-shell"><button className="lr-back lr-material-back" onClick={onBack}><Icon name="back" />Назад</button><div className="lr-material-context"><span>{course?.NAME || "Материал"}</span><span aria-hidden="true">/</span><strong>{material.NAME}</strong></div><div ref={slot} className="lr-legacy-material" /></main>;
}

function Revisions({ bridge, hintsEnabled }) {
  const [innerTab, setInnerTab] = useState("active");
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const load = useCallback((force = false) => { setState((old) => ({ ...old, loading: true, error: "" })); bridge.loadAcknowledgements(force).then((data) => setState({ loading: false, data, error: "" })).catch((error) => setState({ loading: false, data: null, error: error.message || String(error) })); }, [bridge]);
  useEffect(() => load(false), [load]);
  return <ResourceState state={state} retry={() => load(true)}>{(rows) => {
    const visible = rows.filter((row) => innerTab === "history" ? ackDone(row.status) : !ackDone(row.status));
    return <section className="lr-revisions"><div className="lr-section-heading"><div><span className="lr-eyebrow">Документы</span><h2>Редакции для изучения {hintsEnabled && <Hint bridge={bridge} hintKey="mandatory-documents" label="Редакции для изучения" />}</h2></div></div><div className="lr-subtabs" role="tablist" aria-label="Редакции документов">{[["active", "Требуют ознакомления"], ["history", "История"]].map(([id, label]) => <button key={id} role="tab" aria-selected={innerTab === id} onClick={() => setInnerTab(id)}>{label}<span>{rows.filter((row) => id === "history" ? ackDone(row.status) : !ackDone(row.status)).length}</span></button>)}</div>
      {visible.length ? <div className="lr-revision-list">{visible.map((row) => <article key={row.id} className={row.status === "overdue" ? "is-overdue" : ""}><header><div><small>Редакция от {formatDate(row.edition?.editionDate)}</small><h2>{row.document?.title || "Документ"}</h2></div><span>{row.status === "completed" ? "Ознакомлен" : row.status === "exempted" ? "Снято" : row.status === "overdue" ? "Просрочено" : "Ожидает"}</span></header><div className="lr-revision-grid"><div><b>Что изменилось</b><p>{row.edition?.changeLog || "Изменения не описаны"}</p></div><div><b>Что нужно сделать</b><p>{row.campaign?.mode === "question" ? "Ответить на контрольный вопрос" : row.campaign?.mode === "test" ? "Пройти связанный тест" : "Подтвердить ознакомление"}</p>{row.dueAt && <small>Срок до {formatDate(row.dueAt)}</small>}<button className="lr-primary" onClick={() => bridge.openAcknowledgement(row.id)}>{ackDone(row.status) ? "Посмотреть" : "Открыть редакцию"}</button></div></div></article>)}</div> : <EmptyState title={innerTab === "active" ? "Нет документов, требующих ознакомления" : "История пока пуста"}>{innerTab === "active" ? "Новые редакции появятся здесь после назначения." : "Завершённые и снятые назначения сохраняются здесь."}</EmptyState>}
    </section>;
  }}</ResourceState>;
}

function Courses({ snapshot, bridge, selectedCourse, setSelectedCourse, openMaterial }) {
  const [tab, setTab] = useState("active");
  const courses = snapshot.courses || [];
  const courseData = (course) => { const materials = bridge.courseMaterials(course.ID); const completed = materials.filter((item) => snapshot.done[String(item.ID)]).length; return { materials, completed, percent: materials.length ? Math.round(completed / materials.length * 100) : 0 }; };
  if (selectedCourse) {
    const data = courseData(selectedCourse), meta = parseMeta(selectedCourse), sections = meta.sections?.length ? meta.sections : [{ id: "nosection", title: "Материалы курса" }];
    const next = data.materials.find((item) => !snapshot.done[String(item.ID)] && bridge.canOpen(item.ID)) || data.materials[0];
    return <main className="lr-page lr-course-page"><button className="lr-back" onClick={() => setSelectedCourse(null)}>← Все курсы</button><section className="lr-course-hero"><span className="lr-course-art"><Icon name="course" /></span><div className="lr-course-summary"><span className="lr-eyebrow">Курс</span><h1>{selectedCourse.NAME}</h1>{selectedCourse.PROPERTY_VALUES?.content && <p>{plainText(selectedCourse.PROPERTY_VALUES.content)}</p>}<Progress value={data.percent} label="Прогресс курса" />{next && <button className="lr-primary lr-wide-mobile" onClick={() => openMaterial(next, selectedCourse)}>{data.percent ? "Продолжить обучение" : "Начать обучение"}</button>}</div></section><section className="lr-course-content"><div className="lr-section-heading"><div><span className="lr-eyebrow">Программа</span><h2>Материалы курса</h2></div><span>{data.completed} из {data.materials.length} пройдено</span></div>{data.materials.length ? sections.map((section) => { const rows = data.materials.filter((item) => String(parseMeta(item).sectionId || "nosection") === String(section.id)); if (!rows.length) return null; return <div className="lr-course-section" key={section.id}><h3>{section.title || "Материалы"}</h3><div className="lr-lesson-list">{rows.map((item, index) => { const done = snapshot.done[String(item.ID)], locked = !bridge.canOpen(item.ID), required = [true, "Y"].includes(parseMeta(item).required); return <button className="lr-lesson" key={item.ID} disabled={locked} onClick={() => openMaterial(item, selectedCourse)}><span className={`lr-lesson-icon ${done ? "is-done" : ""}`}>{done ? <Icon name="check" /> : <Icon name={kindOf(item)} />}</span><span className="lr-lesson-copy"><span>{index + 1}. {kindOf(item) === "test" ? "Тест" : "Материал"}{required ? " · обязательный" : ""}</span><strong>{item.NAME}</strong></span><span className={`lr-status ${done ? "is-done" : locked ? "is-locked" : ""}`}>{done ? "Пройден" : locked ? "Закрыт" : "Открыть"}</span><Icon name="arrow" /></button>; })}</div></div>; }) : <EmptyState title="В курсе пока нет материалов">Когда автор добавит программу, она появится здесь.</EmptyState>}</section></main>;
  }
  const counts = { active: courses.filter((course) => !snapshot.done[String(course.ID)]).length, completed: courses.filter((course) => snapshot.done[String(course.ID)]).length };
  const visible = tab === "revisions" ? [] : courses.filter((course) => tab === "completed" ? snapshot.done[String(course.ID)] : !snapshot.done[String(course.ID)]);
  const tabs = [["active", "Текущие", "assigned-learning"], ["completed", "Завершённые", "completed-learning"], ["revisions", "Редакции", "mandatory-documents"]];
  return <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Моё обучение {snapshot.hintsEnabled && <Hint bridge={bridge} hintKey="assigned-learning" label="Моё обучение" />}</h1><p>Курсы и редакции документов, назначенные вам для прохождения.</p></div></header><div className="lr-tabs" role="tablist" aria-label="Состояние обучения" onKeyDown={(event) => { const index = tabs.findIndex(([id]) => id === tab); if (!['ArrowLeft','ArrowRight'].includes(event.key)) return; event.preventDefault(); const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length][0]; setTab(next); event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus(); }}>{tabs.map(([id, label]) => <button key={id} data-tab={id} role="tab" aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)}>{label}{id !== "revisions" && <span>{counts[id]}</span>}</button>)}</div>{tab === "revisions" ? <Revisions bridge={bridge} hintsEnabled={snapshot.hintsEnabled} /> : visible.length ? <div className="lr-course-grid">{visible.map((course) => { const data = courseData(course); return <button className="lr-course-card" key={course.ID} onClick={() => setSelectedCourse(course)}><span className="lr-card-art"><Icon name="course" /></span><span className="lr-card-copy"><span className="lr-eyebrow">Курс</span><strong>{course.NAME}</strong><span className="lr-card-desc">{plainText(course.PROPERTY_VALUES?.content) || "Откройте курс, чтобы посмотреть программу."}</span><Progress value={data.percent} label="Пройдено" /></span><span className="lr-card-action">Открыть <Icon name="arrow" /></span></button>; })}</div> : <EmptyState title={tab === "active" ? "Новых курсов пока нет" : "Завершённых курсов пока нет"}>{tab === "active" ? "Курс появится здесь после назначения руководителем или преподавателем." : "Завершите первый курс — результат сохранится в этом разделе."}</EmptyState>}</main>;
}

function findTreeNode(root, path) { let node = root; for (const id of path) node = (node?.children || []).find((child) => String(child.id) === String(id)) || node; return node; }
function flattenMaterials(node, out = []) { (node?.children || []).forEach((child) => child.type === "material" ? out.push(child) : flattenMaterials(child, out)); return out; }

function Knowledge({ bridge, hintsEnabled }) {
  const [query, setQuery] = useState(""), [path, setPath] = useState([]), [selected, setSelected] = useState(null), [editionsState, setEditionsState] = useState({ loading: false, data: [], error: "" });
  const [expandedEditions, setExpandedEditions] = useState(() => new Set());
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const load = useCallback((force = false) => { setState((old) => ({ ...old, loading: true, error: "" })); bridge.loadKnowledge(force).then((data) => setState({ loading: false, data, error: "" })).catch((error) => setState({ loading: false, data: null, error: error.message || String(error) })); }, [bridge]);
  useEffect(() => load(false), [load]);
  useEffect(() => { if (!selected) { setEditionsState({ loading: false, data: [], error: "" }); return; } setEditionsState({ loading: true, data: [], error: "" }); bridge.loadEditions(selected.id, false).then((data) => setEditionsState({ loading: false, data, error: "" })).catch((error) => setEditionsState({ loading: false, data: [], error: error.message || String(error) })); }, [bridge, selected]);
  return <main className="lr-page lr-kb-page"><header className="lr-page-head lr-kb-head"><div className="lr-kb-title-row">{(path.length > 0 || selected) && <button className="lr-kb-inline-back" onClick={() => selected ? setSelected(null) : setPath(path.slice(0, -1))} aria-label="Вернуться назад"><Icon name="back" /></button>}<h1>База знаний {hintsEnabled && <Hint bridge={bridge} hintKey="knowledge-base" label="База знаний" />}</h1></div>{!selected && <label className="lr-search"><input aria-label="Поиск" value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} placeholder="Поиск" /><Icon name="search" /></label>}</header><ResourceState state={state} retry={() => load(true)}>{({ tree, documents }) => {
    const byRow = new Map((documents || []).map((doc) => [Number(doc.sourceRow), doc]));
    const q = query.trim().toLowerCase();
    const node = findTreeNode(tree, path);
    const rows = q ? flattenMaterials(tree).filter((item) => { const doc = byRow.get(Number(item.row)); return `${item.title} ${doc?.description || ""}`.toLowerCase().includes(q); }) : (node?.children || []);
    if (selected) return <section className="lr-kb-detail">
      <h2>{selected.title}</h2>
      {selected.description && <p>{selected.description}</p>}
      <div className="lr-kb-actions">{selected.documentUrl && <a className="lr-primary lr-original-action" href={selected.documentUrl} target="_blank" rel="noreferrer">Открыть оригинал <span aria-hidden="true">↗</span></a>}</div>
      <details className="lr-edition-history"><summary><span>История редакций</span><small>{editionsState.data.length || 0}</small><Icon name="arrow" /></summary><div className="lr-edition-list">{editionsState.loading ? <div className="lr-resource-state">Загружаем историю…</div> : editionsState.error ? <p className="lr-inline-error">{editionsState.error}</p> : editionsState.data.length ? editionsState.data.map((edition) => { const expanded = expandedEditions.has(edition.id), text = edition.changeLog || "Изменения не описаны", long = text.length > 150; return <article key={edition.id} className={expanded ? "is-expanded" : ""}><header><b>Редакция от {formatDate(edition.editionDate)}</b>{edition.googleVersionName && <small>{edition.googleVersionName}</small>}</header><p>{text}</p>{long && <button className="lr-text-action" aria-expanded={expanded} onClick={() => setExpandedEditions((old) => { const next = new Set(old); expanded ? next.delete(edition.id) : next.add(edition.id); return next; })}>{expanded ? "Свернуть" : "Показать полностью"}</button>}</article>; }) : <p className="lr-muted">История редакций пока пуста.</p>}</div></details>
    </section>;
    const rootLevel = !q && path.length === 0;
    return <>{!rootLevel && <div className="lr-kb-crumbs"><button onClick={() => { setPath([]); setQuery(""); }}>Главная</button>{path.map((id, index) => { const part = findTreeNode(tree, path.slice(0, index + 1)); return <React.Fragment key={id}><span>›</span><button aria-current={index === path.length - 1 ? "page" : undefined} onClick={() => setPath(path.slice(0, index + 1))}>{part?.title}</button></React.Fragment>; })}</div>}{!rootLevel && <div className="lr-section-heading"><div><span className="lr-eyebrow">{q ? "Результаты поиска" : "Раздел"}</span><h2>{q ? `По запросу «${query.trim()}»` : node?.title || "Раздел"}</h2></div></div>}{rows.length ? <div className="lr-kb-grid">{rows.map((item, index) => { const doc = item.type === "material" ? byRow.get(Number(item.row)) : null; const count = item.type === "folder" ? flattenMaterials(item).length : 0; return <button className="lr-kb-card" style={{ "--lr-item-index": index }} key={item.id} onClick={() => item.type === "folder" ? setPath([...path, item.id]) : doc && setSelected({ ...doc, title: item.title || doc.title })}><span className="lr-kb-icon"><Icon name={item.type === "folder" ? "folder" : "article"} /></span><span className="lr-kb-copy"><strong>{item.title}</strong><small>{item.type === "folder" ? `${count} ${count === 1 ? "материал" : count < 5 ? "материала" : "материалов"}` : "Документ и история редакций"}</small></span><span className="lr-kb-arrow"><Icon name="arrow" /></span></button>; })}</div> : <EmptyState title="Ничего не найдено">Измените запрос или вернитесь на уровень выше.</EmptyState>}</>;
  }}</ResourceState></main>;
}

function Profile({ snapshot, bridge }) {
  const name = userName(snapshot.user), valid = snapshot.userId !== "0" && !!name;
  const courses = snapshot.courses || [], completedCourses = courses.filter((course) => snapshot.done[String(course.ID)]).length;
  const materialIds = new Set((snapshot.items || []).filter((item) => ["article", "test"].includes(kindOf(item))).map((item) => String(item.ID)));
  const doneMaterials = Object.entries(snapshot.done || {}).filter(([id, done]) => done && materialIds.has(id)).length;
  if (!valid) return <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Профиль</h1></div></header><EmptyState title="Не удалось определить пользователя">Откройте приложение из вашего портала Bitrix24, затем повторите синхронизацию.</EmptyState></main>;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join(""), photo = snapshot.user?.PERSONAL_PHOTO;
  return <main className="lr-page lr-profile-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Личный кабинет</span><h1>Профиль {snapshot.hintsEnabled && <Hint bridge={bridge} hintKey="learner-profile" label="Профиль" />}</h1><p>Ваш прогресс, очки и место среди участников обучения.</p></div></header><section className="lr-profile"><div className="lr-profile-person"><span>{photo ? <img src={photo} alt={`Фотография ${name}`} /> : initials}</span><div><h2>{name}</h2>{snapshot.user.EMAIL && <p>{snapshot.user.EMAIL}</p>}</div></div><div className="lr-stats"><div><strong>{courses.length - completedCourses}</strong><span>курсов в работе</span></div><div><strong>{completedCourses}</strong><span>курсов завершено</span></div><div><strong>{doneMaterials}</strong><span>материалов пройдено</span></div><div><strong>{snapshot.points || 0}</strong><span>очков набрано</span></div></div></section><section className="lr-leaderboard"><div className="lr-section-heading"><div><span className="lr-eyebrow">Рейтинг</span><h2>Топ пользователей по очкам</h2></div><Icon name="trophy" /></div>{(snapshot.leaderboard || []).length ? <ol>{snapshot.leaderboard.map((row, index) => <li key={row.uid} className={String(row.uid) === String(snapshot.progressUserId || snapshot.userId) ? "is-current" : ""}><span>{index + 1}</span><strong>{row.name}</strong><small>{row.done} завершено</small><b>{row.points} очков</b></li>)}</ol> : <EmptyState title="Рейтинг пока пуст">Он появится после первых завершённых материалов и тестов.</EmptyState>}</section><footer className="lr-version">Версия v{snapshot.releaseVersion || "—"}</footer></main>;
}

export function LearnerApp({ bridge, onSetMode }) {
  const [snapshot, setSnapshot] = useState(() => bridge.getSnapshot()), [view, setView] = useState("learn"), [menu, setMenu] = useState(false), [selectedCourse, setSelectedCourse] = useState(null), [materialContext, setMaterialContext] = useState(null);
  const [history, setHistory] = useState([]), [music, setMusic] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => bridge.subscribe(() => setSnapshot(bridge.getSnapshot())), [bridge]);
  useEffect(() => { const update = () => setSnapshot(bridge.getSnapshot()); window.addEventListener("rtm:help-change", update); return () => window.removeEventListener("rtm:help-change", update); }, [bridge]);
  useEffect(() => { const learner = snapshot.mode === "user"; document.body.classList.toggle("rtm-learner-active", learner); document.body.classList.toggle("rtm-admin-active", !learner); return () => { document.body.classList.remove("rtm-learner-active"); document.body.classList.remove("rtm-admin-active"); }; }, [snapshot.mode]);
  const go = (next) => { if (next !== view || selectedCourse || materialContext) setHistory((old) => [...old.slice(-8), { view, selectedCourse, materialContext }]); setView(next); setSelectedCourse(null); setMaterialContext(null); setMenu(false); };
  const goBack = () => setHistory((old) => { const next = old[old.length - 1]; if (!next) return old; setView(next.view); setSelectedCourse(next.selectedCourse); setMaterialContext(next.materialContext); return old.slice(0, -1); });
  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;
    if (music) player.play().catch(() => setMusic(false));
    else player.pause();
  }, [music, snapshot.appearance?.musicUrl]);
  const openMaterial = async (material, course) => { const hydrated = await bridge.openMaterial(material.ID); if (hydrated) { setHistory((old) => [...old.slice(-8), { view, selectedCourse, materialContext: null }]); setMaterialContext({ material: hydrated, course }); } };
  const setHints = () => bridge.setHintsEnabled(!snapshot.hintsEnabled);
  if (snapshot.mode !== "user") return null;
  const appearance = snapshot.appearance || {}, style = { "--lr-primary": appearance.primaryColor || "#3157d5" };
  return <div className="learner-app" style={style}>{appearance.musicUrl && <audio ref={audioRef} src={appearance.musicUrl} loop preload="none" />}<header className="lr-header"><button className="lr-brand" onClick={() => go("learn")} aria-label={`${appearance.brandName || "RTM Обучение"}, на главную`}>{appearance.logo ? <img src={appearance.logo} alt="" /> : <b>RTM</b>}<span>{appearance.brandName?.replace(/^RTM\s*/i, "") || "обучение"}</span></button><nav className="lr-nav" aria-label="Основная навигация">{NAV.map(([id, label]) => <button key={id} className={view === id ? "active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => go(id)}><Icon name={id} />{label}</button>)}</nav><div className="lr-header-actions">{appearance.musicUrl && <button className={`lr-music ${music ? "is-active" : ""}`} aria-label={music ? "Выключить музыку" : "Включить музыку"} aria-pressed={music} onClick={() => setMusic(!music)}><Icon name="music" /><span>Музыка</span></button>}<button className={`lr-hints ${snapshot.hintsEnabled ? "is-active" : ""}`} aria-label="Подсказки" aria-pressed={snapshot.hintsEnabled} onClick={setHints}><Icon name="help" /><span>Подсказки</span></button><button className="lr-sync" disabled={snapshot.syncing} onClick={() => bridge.refresh()}><Icon name="sync" />{snapshot.syncing ? "Обновляем…" : "Синхронизировать"}</button>{snapshot.canOpenAdmin && <button className="lr-admin-mode" onClick={() => onSetMode("admin")}><Icon name="admin" />Администрирование</button>}<button className="lr-menu-button" aria-label={menu ? "Закрыть меню" : "Открыть меню"} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name={menu ? "close" : "menu"} /></button></div></header>{menu && <nav className="lr-mobile-nav" aria-label="Мобильная навигация">{NAV.map(([id, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => go(id)}><Icon name={id} />{label}</button>)}{appearance.musicUrl && <button className={music ? "is-active" : ""} onClick={() => setMusic(!music)}><Icon name="music" />{music ? "Музыка включена" : "Музыка для обучения"}</button>}<button disabled={snapshot.syncing} onClick={() => { setMenu(false); bridge.refresh(); }}><Icon name="sync" />Синхронизировать</button>{snapshot.canOpenAdmin && <button onClick={() => { setMenu(false); onSetMode("admin"); }}><Icon name="admin" />Перейти в админку</button>}</nav>}{snapshot.syncError && <div className="lr-alert" role="alert"><span>{snapshot.syncError}</span><button onClick={() => bridge.refresh()}>Повторить</button></div>}{snapshot.userId === "0" ? <main className="lr-page"><header className="lr-page-head"><div><span className="lr-eyebrow">Подключение</span><h1>Не удалось определить пользователя</h1><p>Для защиты учебных данных требуется действующая сессия Bitrix24.</p></div></header><EmptyState title="Откройте приложение из Bitrix24">Вернитесь в портал, откройте RTM Обучение и нажмите «Синхронизировать».</EmptyState></main> : materialContext ? <MaterialSurface bridge={bridge} material={materialContext.material} course={materialContext.course} onBack={() => setMaterialContext(null)} /> : view === "learn" ? <Courses snapshot={snapshot} bridge={bridge} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} openMaterial={openMaterial} /> : view === "kb" ? <Knowledge bridge={bridge} hintsEnabled={snapshot.hintsEnabled} /> : <Profile snapshot={snapshot} bridge={bridge} />}{history.length > 0 && !materialContext && <button className="lr-floating-back" onClick={goBack} aria-label="Вернуться к предыдущему экрану"><Icon name="back" /><span>Назад</span></button>}</div>;
}
