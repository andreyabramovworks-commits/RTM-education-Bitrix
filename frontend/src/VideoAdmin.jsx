import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./video.css";

async function api(path, options = {}) {
  if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
  await window.RTMV47.ready();
  return window.RTMV47.request(path, options);
}
const labels = {
  rutube: "RUTUBE",
  youtube: "YouTube",
  file: "Файл",
  link: "Ссылка",
};
const duration = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "—");

function Sources({ rows, connect, sync, importRutubeStudio }) {
  return (
    <section className="va-source-page">
      <header>
        <h2>Источники видео</h2>
        <p>Подключения, разрешения и актуальность каталога.</p>
      </header>
      <div className="va-source-list">
        {rows.map((s) => (
          <article className="va-source" key={s.provider}>
            <div className={`va-provider ${s.provider}`}>{s.provider === "file" ? "ФАЙЛЫ" : s.title}</div>
            <div className="va-source-copy">
              <div>
                <h2>{s.title}</h2>
                <span className={`va-status ${s.connected ? "ok" : "off"}`}>{s.connected ? "Подключено" : "Не подключено"}</span>
              </div>
              <p>{s.connected ? s.accountName || "Источник активен" : s.provider === "rutube" ? "Подключите канал по ссылке" : s.provider === "file" ? "Загрузка с компьютера и прямые ссылки" : "Нужны OAuth-параметры на сервере"}</p>
              {s.externalAccountId && <small>ID канала: {s.externalAccountId}</small>}
            </div>
            <dl>
              <div>
                <dt>Видео</dt>
                <dd>{s.videoCount}</dd>
              </div>
              <div>
                <dt>Последняя синхронизация</dt>
                <dd>{s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleString("ru-RU") : "Ещё не выполнялась"}</dd>
              </div>
              <div>
                <dt>Состояние</dt>
                <dd>{s.lastError || s.lastSyncStatus || (s.connected ? "В порядке" : "Ожидает настройки")}</dd>
              </div>
            </dl>
            <div className="va-source-buttons">
              {s.connected && s.provider === "rutube" && <button onClick={() => sync(s)}>Синхронизировать</button>}
              {s.provider === "rutube" && (
                <label className="va-studio-import">
                  {s.studioConnected ? "Обновить доступ Studio" : "Подключить RUTUBE Studio"}
                  <input type="file" accept=".har,application/json" onChange={importRutubeStudio} />
                </label>
              )}
              <button onClick={() => connect(s)} disabled={!s.configured || s.provider === "file"}>
                {s.connected ? "Настроить" : s.configured ? "Подключить" : "Нужна настройка сервера"}
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="va-source-help">
        <b>Видео RUTUBE «Только по ссылке»</b>
        <p>Подключение Studio импортирует открытые и скрытые видео вместе с ключами доступа. HAR обрабатывается в браузере; на сервер передаётся только временный токен, который хранится зашифрованным.</p>
      </div>
    </section>
  );
}

export function VideoAdmin() {
  const [tab, setTab] = useState("catalog"),
    [data, setData] = useState({ collections: [], videos: [] }),
    [sources, setSources] = useState([]),
    [video, setVideo] = useState(null),
    [folder, setFolder] = useState(null),
    [sourceConfig, setSourceConfig] = useState(null),
    [busy, setBusy] = useState(true),
    [movingVideoId, setMovingVideoId] = useState(null),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [folderQuery, setFolderQuery] = useState(""),
    [status, setStatus] = useState(""),
    [folderId, setFolderId] = useState("");
  const autoSyncDone = useRef(false);
  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const [library, sourceRows] = await Promise.all([api("/api/v53/videos/admin"), api("/api/v53/videos/sources")]);
      setData(library);
      setSources(sourceRows);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    load();
    document.querySelector(".adm-workspace")?.scrollTo({ top: 0 });
  }, [load]);
  useEffect(() => {
    const rutube = sources.find((source) => source.provider === "rutube");
    if (!rutube?.studioConnected || autoSyncDone.current) return;
    autoSyncDone.current = true;
    sync(rutube, true);
  }, [sources]);
  useEffect(() => {
    const fn = (e) => e.origin === location.origin && e.data?.type === "rtm-video-source-connected" && load();
    addEventListener("message", fn);
    return () => removeEventListener("message", fn);
  }, [load]);
  const folderMap = useMemo(() => Object.fromEntries(data.collections.map((x) => [x.id, x])), [data.collections]);
  const folderRows = useMemo(() => data.collections.filter((x) => !folderQuery || `${x.title} ${x.description}`.toLowerCase().includes(folderQuery.toLowerCase())), [data.collections, folderQuery]);
  const visible = useMemo(() => data.videos.filter((v) => (!query || `${v.title} ${v.description}`.toLowerCase().includes(query.toLowerCase())) && (!status || v.status === status) && (!folderId || String(v.collectionId || "none") === folderId)), [data.videos, query, status, folderId]);

  async function saveVideo(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api("/api/v53/videos", {
        method: "POST",
        body: JSON.stringify({
          title: f.get("title"),
          url: f.get("url"),
          collectionId: f.get("collectionId") ? Number(f.get("collectionId")) : null,
          description: f.get("description"),
          thumbnailUrl: f.get("thumbnailUrl"),
          status: f.get("status"),
        }),
      });
      setVideo(null);
      await load();
    } catch (x) {
      setError(x.message);
    }
  }
  async function saveFolder(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      id = folder?.id;
    try {
      await api(`/api/v53/videos/collections${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({
          title: f.get("title"),
          description: f.get("description"),
          coverUrl: folder.coverUrl || "",
          visibility: f.get("visibility"),
          appearance: { accent: f.get("accent") },
        }),
      });
      setFolder(null);
      await load();
    } catch (x) {
      setError(x.message);
    }
  }
  async function moveVideoToFolder(videoId, collectionId) {
    setMovingVideoId(videoId);
    try {
      await api(`/api/v53/videos/${videoId}/folder`, {
        method: "PATCH",
        body: JSON.stringify({
          collectionId: collectionId ? Number(collectionId) : null,
        }),
      });
      await load();
    } catch (x) {
      setError(x.message);
    } finally {
      setMovingVideoId(null);
    }
  }
  async function uploadCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5_000_000) {
      setError("Размер обложки должен быть не больше 5 МБ");
      return;
    }
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    try {
      const result = await api("/api/v53/videos/covers", {
        method: "POST",
        body: JSON.stringify({ dataUrl }),
      });
      setFolder((old) => ({ ...old, coverUrl: result.url }));
    } catch (x) {
      setError(x.message);
    }
  }
  async function connect(s) {
    if (s.provider === "rutube") {
      setSourceConfig(s);
      return;
    }
    if (s.provider !== "youtube") return;
    try {
      const r = await api("/api/v53/videos/sources/youtube/connect", {
        method: "POST",
        body: "{}",
      });
      window.open(r.authorizationUrl, "rtm-youtube-oauth", "width=620,height=760");
    } catch (x) {
      setError(x.message);
    }
  }
  async function sync(s, quiet = false) {
    try {
      setBusy(true);
      const result = await api(`/api/v53/videos/sources/${s.provider}/sync`, {
        method: "POST",
        body: "{}",
      });
      await load();
      if (!quiet) window.alert(`Синхронизация завершена. Добавлено: ${result.created}, обновлено: ${result.updated}`);
    } catch (x) {
      setError(x.message);
      setBusy(false);
    }
  }
  async function importRutubeStudio(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 20_000_000) {
      setError("HAR RUTUBE Studio должен быть не больше 20 МБ");
      return;
    }
    try {
      setBusy(true);
      const har = JSON.parse(await file.text());
      const entries = har?.log?.entries;
      if (!Array.isArray(entries)) throw new Error("Файл не является HAR RUTUBE Studio");
      let accessToken = "";
      for (const entry of entries) {
        const url = new URL(entry?.request?.url || "", location.origin);
        if (url.hostname !== "studio.rutube.ru" || url.pathname !== "/multipass/api/accounts/profile") continue;
        const content = entry?.response?.content || {};
        const text = content.encoding === "base64" ? atob(content.text || "") : content.text || "";
        accessToken = JSON.parse(text).jwt || "";
        if (accessToken) break;
      }
      if (!accessToken) throw new Error("В HAR не найден активный вход RUTUBE Studio");
      const result = await api("/api/v53/videos/sources/rutube/studio", { method: "PUT", body: JSON.stringify({ accessToken }) });
      autoSyncDone.current = true;
      await load();
      window.alert(`RUTUBE Studio подключена. Загружено видео: ${result.total}, из них скрытых: ${result.hidden}`);
    } catch (x) {
      setError(x.message || "Не удалось подключить RUTUBE Studio");
      setBusy(false);
    }
  }
  async function saveSource(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api("/api/v53/videos/sources/rutube", {
        method: "PUT",
        body: JSON.stringify({ channelUrl: f.get("channelUrl") }),
      });
      setSourceConfig(null);
      await load();
    } catch (x) {
      setError(x.message);
    }
  }

  return (
    <section className="video-admin">
      <header className="video-admin-head">
        <h1>Видеотека</h1>
      </header>
      <nav className="va-tabs" aria-label="Разделы видеотеки">
        <button className={tab === "catalog" ? "active" : ""} onClick={() => setTab("catalog")}>
          Видеотека
        </button>
        <button className={tab === "sources" ? "active" : ""} onClick={() => setTab("sources")}>
          Источники видео
        </button>
      </nav>
      {error && (
        <div className="va-alert" role="alert">
          <span>{error}</span>
          <button onClick={() => setError("")}>Закрыть</button>
        </div>
      )}
      {busy ? (
        <div className="va-loading">Загружаем актуальные данные…</div>
      ) : tab === "sources" ? (
        <Sources rows={sources} connect={connect} sync={sync} importRutubeStudio={importRutubeStudio} />
      ) : (
        <div className="va-catalog">
          <aside>
            <header>
              <b>Папки</b>
              <button aria-label="Создать папку" onClick={() => setFolder({})}>
                +
              </button>
            </header>
            <input className="va-folder-search" value={folderQuery} onChange={(e) => setFolderQuery(e.target.value)} placeholder="Поиск папок" />
            <button className={!folderId ? "active" : ""} onClick={() => setFolderId("")}>
              Все видео <span>{data.videos.length}</span>
            </button>
            <button className={folderId === "none" ? "active" : ""} onClick={() => setFolderId("none")}>
              Без папки <span>{data.videos.filter((v) => !v.collectionId).length}</span>
            </button>
            {folderRows.map((x) => (
              <div className="va-folder-row" key={x.id}>
                <button className={folderId === String(x.id) ? "active" : ""} onClick={() => setFolderId(String(x.id))}>
                  {x.title}
                  <span>{x.videoCount}</span>
                </button>
                <button aria-label={`Настроить ${x.title}`} onClick={() => setFolder(x)}>
                  •••
                </button>
              </div>
            ))}
          </aside>
          <div className="va-table-wrap">
            <div className="va-catalog-title">
              <h2>Видео</h2>
              <button
                className="va-primary"
                onClick={() =>
                  setVideo({
                    collectionId: /^\d+$/.test(folderId) ? Number(folderId) : null,
                  })
                }
              >
                Добавить видео
              </button>
            </div>
            <div className="va-toolbar">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию" aria-label="Поиск видео" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Статус">
                <option value="">Статус: все</option>
                <option value="published">Опубликовано</option>
                <option value="draft">Черновик</option>
              </select>
              {(query || status) && (
                <button
                  onClick={() => {
                    setQuery("");
                    setStatus("");
                  }}
                >
                  Сбросить
                </button>
              )}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Видео</th>
                  <th>Папка</th>
                  <th>Длительность</th>
                  <th>Видимость</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <button className="va-video-title" onClick={() => setVideo(v)}>
                        {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" /> : <span>{labels[v.provider]}</span>}
                        <b>{v.title}</b>
                      </button>
                    </td>
                    <td className="va-folder-cell">
                      <select aria-label={`Папка для ${v.title}`} value={v.collectionId || ""} disabled={movingVideoId === v.id} onChange={(e) => moveVideoToFolder(v.id, e.target.value)}>
                        <option value="">Без папки</option>
                        {data.collections.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <small>{folderMap[v.collectionId]?.title || "Без папки"}</small>
                    </td>
                    <td>{duration(v.durationSeconds)}</td>
                    <td>{v.visibility === "all" ? "Для всех" : "Ограничено"}</td>
                    <td>
                      <span className={`va-status ${v.status === "published" ? "ok" : "off"}`}>{v.status === "published" ? "Опубликовано" : "Черновик"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <div className="va-empty">
                <b>{data.videos.length ? "По фильтрам ничего не найдено" : "Видеотека пока пуста"}</b>
                <span>Подключите канал RUTUBE или добавьте скрытое видео по ссылке.</span>
                <button className="va-primary" onClick={() => setTab("sources")}>
                  Открыть источники видео
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {video && (
        <div className="va-drawer-scrim" onMouseDown={(e) => e.target === e.currentTarget && setVideo(null)}>
          <aside className="va-drawer" role="dialog" aria-modal="true" aria-labelledby="va-video-title">
            <header>
              <div>
                <small>{video.id ? "Предпросмотр" : "Добавить видео"}</small>
                <h2 id="va-video-title">{video.title || "Новое видео"}</h2>
              </div>
              <button onClick={() => setVideo(null)} aria-label="Закрыть">
                ×
              </button>
            </header>
            {video.id ? (
              <>
                <div className="va-player">
                  <iframe src={video.embedUrl} title={video.title} allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
                </div>
                <p>{video.description || "Описание не добавлено"}</p>
                <dl className="va-details">
                  <div>
                    <dt>Источник</dt>
                    <dd>{labels[video.provider]}</dd>
                  </div>
                  <div>
                    <dt>Папка</dt>
                    <dd>{folderMap[video.collectionId]?.title || "Без папки"}</dd>
                  </div>
                </dl>
                <a href={video.url} target="_blank" rel="noreferrer">
                  Открыть источник ↗
                </a>
              </>
            ) : (
              <form onSubmit={saveVideo}>
                <div className="va-source-tabs">
                  <b>По ссылке</b>
                  <span>RUTUBE Studio</span>
                  <span>YouTube</span>
                  <span>С компьютера</span>
                </div>
                <label>
                  Ссылка
                  <input name="url" type="url" required placeholder="https://rutube.ru/video/…" />
                </label>
                <label>
                  Название
                  <input name="title" required />
                </label>
                <label>
                  Описание
                  <textarea name="description" rows="4" />
                </label>
                <label>
                  Ссылка на обложку
                  <input name="thumbnailUrl" type="url" />
                </label>
                <label>
                  Папка
                  <select name="collectionId" defaultValue={video.collectionId || ""}>
                    <option value="">Без папки</option>
                    {data.collections.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Публикация
                  <select name="status">
                    <option value="published">Опубликовать сразу</option>
                    <option value="draft">Сохранить черновик</option>
                  </select>
                </label>
                <p className="va-note">Для YouTube может понадобиться VPN. Приватную ссылку RUTUBE вставляйте вместе с ключом доступа.</p>
                <button className="va-primary">Добавить в видеотеку</button>
              </form>
            )}
          </aside>
        </div>
      )}
      {folder && (
        <div className="va-drawer-scrim" onMouseDown={(e) => e.target === e.currentTarget && setFolder(null)}>
          <aside className="va-drawer" role="dialog" aria-modal="true" aria-labelledby="va-folder-title">
            <header>
              <div>
                <small>Отображение для пользователя</small>
                <h2 id="va-folder-title">{folder.id ? "Настройка папки" : "Новая папка"}</h2>
              </div>
              <button onClick={() => setFolder(null)} aria-label="Закрыть">
                ×
              </button>
            </header>
            <form onSubmit={saveFolder}>
              <label>
                Название
                <input name="title" required defaultValue={folder.title || ""} />
              </label>
              <label>
                Описание
                <textarea name="description" rows="4" defaultValue={folder.description || ""} />
              </label>
              <fieldset className="va-cover-field">
                <legend>Обложка</legend>
                {folder.coverUrl && <img src={folder.coverUrl} alt="Предпросмотр обложки" />}
                <label className="va-upload">
                  Загрузить с компьютера
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadCover} />
                </label>
                <label>
                  или вставить ссылку
                  <input type="url" value={folder.coverUrl || ""} onChange={(e) => setFolder((old) => ({ ...old, coverUrl: e.target.value }))} />
                </label>
                <small>JPG, PNG или WebP, до 5 МБ</small>
              </fieldset>
              <label>
                Акцентный цвет
                <input name="accent" type="color" defaultValue={folder.appearance?.accent || "#e57a00"} />
              </label>
              <label>
                Доступ
                <select name="visibility" defaultValue={folder.visibility || "all"}>
                  <option value="all">Для всех сотрудников</option>
                  <option value="restricted">По правилам доступа</option>
                </select>
              </label>
              <div className="va-folder-preview">
                <span>Предпросмотр папки</span>
                <b>{folder.title || "Название папки"}</b>
              </div>
              <button className="va-primary">Сохранить папку</button>
            </form>
          </aside>
        </div>
      )}
      {sourceConfig && (
        <div className="va-drawer-scrim" onMouseDown={(e) => e.target === e.currentTarget && setSourceConfig(null)}>
          <aside className="va-drawer" role="dialog" aria-modal="true" aria-labelledby="va-source-title">
            <header>
              <div>
                <small>Источник видео</small>
                <h2 id="va-source-title">Подключить RUTUBE</h2>
              </div>
              <button onClick={() => setSourceConfig(null)} aria-label="Закрыть">
                ×
              </button>
            </header>
            <form onSubmit={saveSource}>
              <div className="va-provider rutube">RUTUBE</div>
              <p>Канал синхронизируется по поддерживаемому публичному API. Видео «Только по ссылке» добавляются отдельно приватной ссылкой.</p>
              <label>
                Ссылка на канал
                <input name="channelUrl" type="url" required defaultValue={sourceConfig.externalAccountId ? `https://rutube.ru/channel/${sourceConfig.externalAccountId}/` : "https://rutube.ru/channel/47531598/"} />
              </label>
              <button className="va-primary">Подключить канал</button>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}
