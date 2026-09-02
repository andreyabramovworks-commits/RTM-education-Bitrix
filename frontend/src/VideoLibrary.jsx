import React, { useEffect, useMemo, useRef, useState } from "react";
import "./learner-video.css";

const time = (seconds) => (seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "Видео");
export function VideoLibrary({ Icon }) {
  const [state, setState] = useState({ loading: true, data: null, error: "" });
  const [query, setQuery] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [theater, setTheater] = useState(false);
  const playerRef = useRef(null);
  useEffect(() => {
    let live = true;
    (async () => {
      if (!window.RTMV47?.request) throw new Error("Авторизация Bitrix24 ещё не готова");
      await window.RTMV47.ready();
      return window.RTMV47.request("/api/v53/videos/library");
    })()
      .then((data) => live && setState({ loading: false, data, error: "" }))
      .catch((e) => live && setState({ loading: false, data: null, error: e.message }));
    return () => {
      live = false;
    };
  }, []);
  const videos = state.data?.videos || [],
    folders = state.data?.collections || [],
    folder = folders.find((item) => item.id === folderId);
  const normalized = query.trim().toLowerCase();
  const filteredVideos = useMemo(() => videos.filter((item) => (!folderId || item.collectionId === folderId) && (!normalized || `${item.title} ${item.description}`.toLowerCase().includes(normalized))), [videos, folderId, normalized]);
  const filteredFolders = useMemo(() => folders.filter((item) => !normalized || `${item.title} ${item.description}`.toLowerCase().includes(normalized)), [folders, normalized]);
  const recent = videos.filter((item) => item.percent > 0 && item.percent < 100).slice(0, 8);
  const openFolder = (id) => {
    setFolderId(id);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goHome = () => {
    setFolderId(null);
    setQuery("");
  };
  useEffect(() => {
    if (!theater) return undefined;
    const unlockOrientation = () => {
      try {
        if (screen.orientation?.unlock) screen.orientation.unlock();
      } catch {
        // Orientation control is optional in embedded mobile browsers.
      }
    };
    const closeTheater = (event) => {
      if (event.type === "fullscreenchange" && document.fullscreenElement) return;
      if (event.type === "keydown" && event.key !== "Escape") return;
      unlockOrientation();
      setTheater(false);
    };
    document.addEventListener("fullscreenchange", closeTheater);
    document.addEventListener("keydown", closeTheater);
    return () => {
      document.removeEventListener("fullscreenchange", closeTheater);
      document.removeEventListener("keydown", closeTheater);
      unlockOrientation();
    };
  }, [theater]);
  const toggleFullscreen = async () => {
    const element = playerRef.current;
    if (theater) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // The internal theater mode still closes below.
        }
      }
      try {
        if (screen.orientation?.unlock) screen.orientation.unlock();
      } catch {
        // Orientation control is optional in embedded mobile browsers.
      }
      setTheater(false);
      return;
    }
    setTheater(true);
    const requestFullscreen = element?.requestFullscreen || element?.webkitRequestFullscreen || element?.msRequestFullscreen;
    if (requestFullscreen) {
      try {
        await requestFullscreen.call(element);
      } catch {
        // Bitrix may deny the native API; CSS theater mode remains inside the app.
      }
    }
    try {
      if (screen.orientation?.lock) await screen.orientation.lock("landscape");
    } catch {
      // iOS and some Bitrix WebViews keep the user's current orientation.
    }
  };
  const card = (item) => (
    <button key={item.id} onClick={() => setPlaying(item)}>
      <span className="lr-video-thumb">
        {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" /> : <span className="lr-play">▶</span>}
        <em>{time(item.durationSeconds)}</em>
      </span>
      <b>{item.title}</b>
      <small>{item.percent ? `${item.percent}% просмотрено` : item.description || "Обучающее видео"}</small>
      {item.percent > 0 && (
        <span className="lr-video-progress">
          <i style={{ width: `${item.percent}%` }} />
        </span>
      )}
    </button>
  );
  return (
    <main className="lr-page lr-video-page">
      <header className="lr-video-head">
        <div className="lr-video-title-row">
          {folderId && (
            <button className="lr-back-circle" onClick={goHome} aria-label="Назад к папкам">
              <Icon name="back" />
            </button>
          )}
          <h1>Видеотека</h1>
        </div>
        <label className="lr-video-search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по видеотеке" />
          <Icon name="search" />
        </label>
      </header>
      {state.loading ? (
        <section className="lr-resource-state">Загружаем видео…</section>
      ) : state.error ? (
        <section className="lr-empty">
          <h2>Не удалось загрузить видеотеку</h2>
          <p>{state.error}</p>
        </section>
      ) : (
        <>
          <nav className="lr-video-crumbs" aria-label="Путь">
            <button onClick={goHome}>Главная</button>
            {folder && (
              <>
                <span>›</span>
                <button aria-current="page">{folder.title}</button>
              </>
            )}
          </nav>
          {!folderId && !normalized && recent.length > 0 && (
            <section className="lr-video-section">
              <header>
                <h2>Продолжить просмотр</h2>
              </header>
              <div className="lr-video-rail">{recent.map(card)}</div>
            </section>
          )}
          {!folderId && (
            <section className="lr-video-section">
              <header>
                <h2>{normalized ? "Результаты поиска" : "Папки видеотеки"}</h2>
              </header>
              <div className="lr-folder-list">
                {filteredFolders.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openFolder(item.id)}
                    style={{
                      "--folder-accent": item.appearance?.accent || "#e57a00",
                    }}
                  >
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt="" />
                    ) : (
                      <span>
                        <Icon name="folder" />
                      </span>
                    )}
                    <div>
                      <b>{item.title}</b>
                      <p>{item.description || "Обучающие видео"}</p>
                      <small>{item.videoCount} видео</small>
                    </div>
                    <em>›</em>
                  </button>
                ))}
              </div>
              {normalized && filteredVideos.length > 0 && <div className="lr-video-grid lr-global-results">{filteredVideos.map(card)}</div>}
              {!filteredFolders.length && !filteredVideos.length && (
                <section className="lr-empty">
                  <h2>Ничего не найдено</h2>
                  <p>Измените запрос.</p>
                </section>
              )}
            </section>
          )}
          {folderId && (
            <section className="lr-video-section">
              <header>
                <div>
                  <span className="lr-folder-kicker">Папка</span>
                  <h2>{folder?.title || "Видео"}</h2>
                </div>
              </header>
              <div className="lr-video-grid">{filteredVideos.map(card)}</div>
              {!filteredVideos.length && (
                <section className="lr-empty">
                  <h2>Видео не найдены</h2>
                  <p>Измените запрос или вернитесь к папкам.</p>
                </section>
              )}
            </section>
          )}
        </>
      )}
      {playing && (
        <div className="lr-video-modal" onMouseDown={(e) => e.target === e.currentTarget && setPlaying(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="lr-video-title">
            <header>
              <div>
                <small>{playing.provider === "youtube" ? "Для YouTube может потребоваться VPN" : "Видеотека"}</small>
                <h2 id="lr-video-title">{playing.title}</h2>
              </div>
              <button onClick={() => setPlaying(null)} aria-label="Закрыть">
                ×
              </button>
            </header>
            <div className={`lr-player-shell ${theater ? "is-theater" : ""}`} ref={playerRef}>
              <iframe src={playing.embedUrl} title={playing.title} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
              <button className="lr-fullscreen" type="button" onClick={toggleFullscreen} aria-pressed={theater}>
                {theater ? "Вернуться" : "На весь экран"}
              </button>
            </div>
            <p>{playing.description}</p>
          </section>
        </div>
      )}
    </main>
  );
}
