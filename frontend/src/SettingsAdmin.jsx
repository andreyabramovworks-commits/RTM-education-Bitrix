import React, { useEffect, useMemo, useState } from "react";
import "./settings.css";

const THEMES = [
  ["indigo", "Индиго", "#5146e5"], ["blue", "Синий", "#2563eb"],
  ["emerald", "Изумруд", "#059669"], ["rose", "Розовый", "#e11d48"],
  ["amber", "Янтарный", "#d97706"], ["violet", "Фиолетовый", "#7c3aed"],
  ["teal", "Бирюзовый", "#0d9488"], ["cyan", "Циан", "#0891b2"],
  ["fuchsia", "Фуксия", "#c026d3"], ["lime", "Лайм", "#65a30d"],
  ["slate", "Серый", "#475569"], ["custom", "Свой цвет", null],
];

export function countMedia(items = []) {
  const diskIds = new Set();
  let blocks = 0;
  let materials = 0;
  for (const item of items) {
    const raw = `${item.PROPERTY_VALUES?.content || ""} ${item.PROPERTY_VALUES?.meta || ""}`;
    for (const match of raw.matchAll(/data-disk-id=["']([^"']+)/g)) diskIds.add(match[1]);
    const count = (raw.match(/rtm-(?:video|audio|image)-block/g) || []).length;
    if (count) { materials += 1; blocks += count; }
  }
  return { disk: diskIds.size, blocks, materials };
}

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(new Error("Не удалось прочитать логотип"));
  reader.readAsDataURL(file);
});

export function SettingsAdmin({ snapshot }) {
  const canEdit = ["developer", "admin", "editor"].includes(snapshot.role);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const stats = useMemo(() => countMedia(snapshot.items), [snapshot.items]);

  useEffect(() => {
    let live = true;
    setError("");
    (async () => {
      if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
      await window.RTMV47.ready();
      return window.RTMV47.request("/api/v47/appearance");
    })().then((value) => { if (live) setSettings(value); })
      .catch((cause) => { if (live) setError(cause?.message || "Не удалось загрузить настройки"); });
    return () => { live = false; };
  }, [revision]);

  const update = (patch) => { setSettings((current) => ({ ...current, ...patch })); setNotice(""); };
  const save = async (next = settings) => {
    if (!next || busy || !canEdit) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await window.RTMV47.request("/api/v47/appearance", { method: "PUT", body: JSON.stringify(next) });
      setSettings(saved);
      window.dispatchEvent(new CustomEvent("rtm:appearance-updated", { detail: saved }));
      setNotice("Настройки сохранены для всех пользователей");
    } catch (cause) {
      setError(cause?.message || "Не удалось сохранить настройки");
    } finally { setBusy(false); }
  };
  const chooseLogo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("Размер логотипа должен быть не больше 10 МБ"); return; }
    if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type)) { setError("Поддерживаются PNG, JPEG, WebP и SVG"); return; }
    try { update({ logo: await readFile(file) }); setError(""); }
    catch (cause) { setError(cause.message); }
    event.target.value = "";
  };

  return <section className="sa-page" aria-label="Настройки портала">
    <header className="sa-head"><div><h1>Настройки портала</h1><p>Оформление и общие параметры</p></div>{canEdit && <button className="primary" onClick={() => save()} disabled={!settings || busy}>{busy ? "Сохраняем…" : "Сохранить"}</button>}</header>
    {error && <div className="sa-error" role="alert">{error} {!settings && <button onClick={() => setRevision((value) => value + 1)}>Повторить</button>}</div>}
    {notice && <div className="sa-notice" role="status">{notice}</div>}
    {!settings ? <p role="status">Загружаем настройки…</p> : <fieldset className="sa-fields" disabled={!canEdit}>
      <div className="sa-grid">
        <section className="sa-card"><h2>Логотип и название</h2><div className="sa-logo-row"><div className="sa-logo-preview">{settings.logo ? <img src={settings.logo} alt="Логотип портала" /> : <b>{settings.brandName || "RTM"}</b>}</div><div><label className="sa-field">Название в шапке<input value={settings.brandName || ""} maxLength={120} onChange={(event) => update({ brandName: event.target.value })} /></label><div className="sa-actions"><label className="sa-file">Загрузить логотип<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={chooseLogo} /></label><button onClick={() => update({ logo: "" })} disabled={!settings.logo}>Очистить</button></div></div></div><p>PNG, JPEG, WebP или SVG до 10 МБ.</p></section>
        <section className="sa-card"><h2>Хранилище и контент</h2><div className="sa-stats"><div><span>Файлов Bitrix.Диска в статьях</span><b>{stats.disk}</b></div><div><span>Медиаблоков добавлено</span><b>{stats.blocks}</b></div><div><span>Материалов с медиа</span><b>{stats.materials}</b></div></div></section>
      </div>
      <section className="sa-card"><h2>Цветовая схема</h2><div className="sa-themes">{THEMES.map(([id, label, color]) => <label key={id} className={settings.theme === id ? "selected" : ""}><input type="radio" name="portal-theme" value={id} checked={settings.theme === id} onChange={() => update({ theme: id })} /><i style={{ background: color || settings.customColor || "#315cf6" }} /><span>{label}</span></label>)}</div>{settings.theme === "custom" && <label className="sa-color">Свой цвет <input type="color" value={settings.customColor || "#315cf6"} onChange={(event) => update({ customColor: event.target.value })} /></label>}</section>
      <div className="sa-grid">
        <section className="sa-card"><h2>Раздел по умолчанию</h2><p>Откроется при следующем входе пользователя.</p><div className="sa-choices">{[["learn", "Обучение", "Назначенные материалы и курсы"], ["kb", "База знаний", "Пространства и материалы"]].map(([id, label, hint]) => <label key={id}><input type="radio" name="default-section" checked={settings.defaultSection === id} onChange={() => update({ defaultSection: id })} /><span><b>{label}</b><small>{hint}</small></span></label>)}</div></section>
        <section className="sa-card"><h2>Онбординг</h2><p>Состояние приветствия пользователей</p><div className="sa-onboarding"><strong>{settings.onboarding === "completed" ? "Пройдено" : "Будет показан при следующем входе"}</strong><button onClick={() => save({ ...settings, onboarding: "pending" })} disabled={busy}>Сбросить онбординг</button></div></section>
      </div>
    </fieldset>}
  </section>;
}
