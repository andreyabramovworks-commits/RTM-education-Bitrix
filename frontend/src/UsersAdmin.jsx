import React, { useEffect, useMemo, useRef, useState } from "react";
import "./users.css";

const ROLES = { student: "Пользователь", teacher: "Преподаватель", editor: "Редактор", admin: "Администратор", developer: "Разработчик" };
const RANK = { student: 1, teacher: 2, editor: 3, admin: 4, developer: 5 };
const userName = (user) => `${user.NAME || ""} ${user.LAST_NAME || ""}`.trim() || user.EMAIL || `ID ${user.ID}`;

export function filterUsers(users, { query, department, role, sort }) {
  const search = query.trim().toLocaleLowerCase("ru-RU");
  return users.filter((user) => {
    const text = `${userName(user)} ${user.EMAIL || ""}`.toLocaleLowerCase("ru-RU");
    return (!search || text.includes(search))
      && (department === "all" || (user.DEPARTMENT_IDS || []).map(String).includes(department))
      && (role === "all" || user.ROLE === role);
  }).sort((a, b) => sort === "role"
    ? (RANK[b.ROLE] || 0) - (RANK[a.ROLE] || 0) || userName(a).localeCompare(userName(b), "ru")
    : userName(a).localeCompare(userName(b), "ru"));
}

async function api(path, options = {}) {
  if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
  await window.RTMV47.ready();
  return window.RTMV47.request(path, options);
}

export function UsersAdmin({ bridge }) {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("name");
  const [selected, setSelected] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const selectRef = useRef(null);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setError("");
    Promise.all([api("/api/v47/users"), api("/api/v47/departments")])
      .then(([people, units]) => { if (live) { setUsers(people); setDepartments(units); } })
      .catch((cause) => { if (live) setError(cause?.message || "Не удалось загрузить пользователей"); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [revision]);

  useEffect(() => { if (selected) selectRef.current?.focus(); }, [selected]);
  const rows = useMemo(() => filterUsers(users, { query, department, role, sort }), [users, query, department, role, sort]);
  const names = new Map(departments.map((row) => [String(row.id), row.name]));
  const openRole = (user) => { if (user.CAN_EDIT_ROLE) { setSelected(user); setSelectedRole(user.ROLE); } };
  const saveRole = async () => {
    if (!selected || !selectedRole || selectedRole === selected.ROLE) { setSelected(null); return; }
    setSaving(true); setError("");
    try {
      await api(`/api/v47/users/${encodeURIComponent(selected.ID)}/role`, { method: "PUT", body: JSON.stringify({ role: selectedRole }) });
    } catch (cause) {
      setError(cause?.message || "Не удалось сохранить роль");
      setSaving(false);
      return;
    }
    setSelected(null);
    setRevision((value) => value + 1);
    try { await bridge.refresh(); }
    catch { setError("Роль сохранена, но общий список пока не обновился. Повторите синхронизацию."); }
    finally { setSaving(false); }
  };
  const sync = async () => {
    setLoading(true); setError("");
    try { await bridge.refresh(); setRevision((value) => value + 1); }
    catch (cause) { setError(cause?.message || "Не удалось синхронизировать пользователей"); setLoading(false); }
  };

  return <section className="ua-page" aria-label="Пользователи и роли">
    <header className="ua-head"><div><h1>Пользователи</h1><p>Всего: {users.length}</p></div><button onClick={sync} disabled={loading}>Синхронизировать</button></header>
    <p className="ua-note">Пользователи и отделы берутся из Bitrix24. Роли приложения хранятся на сервере.</p>
    <div className="ua-toolbar">
      <input aria-label="Поиск пользователей" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по имени или email" />
      <select aria-label="Отдел" value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">Все департаменты</option>{departments.map((row) => <option key={row.id} value={String(row.id)}>{row.name}</option>)}</select>
      <select aria-label="Роль" value={role} onChange={(event) => setRole(event.target.value)}><option value="all">Все роли</option>{Object.entries(ROLES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
      <select aria-label="Сортировка" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">По алфавиту</option><option value="role">По роли</option></select>
    </div>
    {error && <div className="ua-error" role="alert">{error} <button onClick={() => setRevision((value) => value + 1)}>Повторить</button></div>}
    <div className="ua-table">{loading ? <p role="status">Загружаем пользователей…</p> : rows.length ? <div className="ua-scroll"><table><thead><tr><th>Пользователь</th><th>Статус</th><th>Департаменты</th><th>Роль</th><th></th></tr></thead><tbody>{rows.map((user) => <tr key={user.ID}><td><div className="ua-person">{user.PERSONAL_PHOTO ? <img src={user.PERSONAL_PHOTO} alt="" /> : <span>{userName(user).slice(0, 1)}</span>}<div><b>{userName(user)}</b><small>{user.EMAIL}</small></div></div></td><td>Активен</td><td>{(user.DEPARTMENT_IDS || []).map((id) => names.get(String(id)) || `Отдел ${id}`).join(", ") || "—"}</td><td>{ROLES[user.ROLE] || user.ROLE}{user.IS_BITRIX_ADMIN ? " · Bitrix24" : ""}</td><td>{user.CAN_EDIT_ROLE && <button onClick={() => openRole(user)} aria-label={`Изменить роль: ${userName(user)}`}>Изменить</button>}</td></tr>)}</tbody></table></div> : <p>Пользователи не найдены</p>}</div>
    {selected && <div className="ua-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setSelected(null); }}><div className="ua-modal" role="dialog" aria-modal="true" aria-label={`Роль пользователя ${userName(selected)}`} onKeyDown={(event) => { if (event.key === "Escape" && !saving) setSelected(null); }}><h2>{userName(selected)}</h2><p>Права наследуются: разработчик → администратор → редактор → преподаватель → пользователь.</p><select ref={selectRef} aria-label="Новая роль" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>{selected.ALLOWED_ROLES.map((id) => <option key={id} value={id}>{ROLES[id]}</option>)}</select><div className="ua-modal-actions"><button onClick={() => setSelected(null)} disabled={saving}>Отмена</button><button onClick={saveRole} disabled={saving}>{saving ? "Сохраняем…" : "Сохранить"}</button></div></div></div>}
  </section>;
}
