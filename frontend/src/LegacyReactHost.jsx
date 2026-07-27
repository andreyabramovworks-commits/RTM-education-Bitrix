import React, { useEffect, useState } from "react";

const RELEASE_VERSION = "50.4.3";
const releaseAsset = (path) => `${path}?v=${RELEASE_VERSION}`;
const LEGACY_STYLES = [
  "/legacy/style.css",
  "/legacy/excalidraw-dist/rtm-canvas.css",
  "/legacy/v040-layout.css",
  "/legacy/v040-inline.css",
  "/legacy/v046-layout.css",
  "/legacy/v0492.css",
  "/legacy/v050.css",
  "/legacy/v051.css",
  "/legacy/v052.css",
  "/legacy/v053.css",
  "/legacy/v053-extra.css",
  "/legacy/v053-modal.css",
  "/legacy/v053-review.css",
  "/legacy/v054.css",
  "/legacy/v5038.css",
  "/legacy/v5039-pages.css",
  "/legacy/v5041.css",
  "/legacy/v5042.css",
].map(releaseAsset);

const LEGACY_SCRIPTS = [
  [releaseAsset("/legacy/v046-shell.js"), false],
  [releaseAsset("/legacy/kb-data.js"), false],
  [releaseAsset("/legacy/app.js"), false],
  [releaseAsset("/legacy/v037-overrides.js"), false],
  [releaseAsset("/legacy/v039-patch.js"), false],
  [releaseAsset("/legacy/v040-assets.js"), false],
  [releaseAsset("/legacy/excalidraw-dist/rtm-canvas.js"), true],
  [releaseAsset("/legacy/v046-canvas.js"), false],
  [releaseAsset("/legacy/v047-api.js"), false],
  [releaseAsset("/legacy/v049.js"), false],
  [releaseAsset("/legacy/v0492.js"), false],
  [releaseAsset("/legacy/v050.js"), false],
  [releaseAsset("/legacy/v051.js"), false],
  [releaseAsset("/legacy/v052.js"), false],
  [releaseAsset("/legacy/v053.js"), false],
  [releaseAsset("/legacy/v054.js"), false],
  [releaseAsset("/legacy/v5038-knowledge.js"), false],
  [releaseAsset("/legacy/v5040-workspaces.js"), false],
  [releaseAsset("/legacy/v5041.js"), false],
  [releaseAsset("/legacy/v5042.js"), false],
];
function loadScript(src, module) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.dataset.rtmV48 = "true";
    if (module) script.type = "module";
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Не удалось загрузить ${src}`));
    document.body.appendChild(script);
  });
}

export function LegacyReactHost() {
  const [markup, setMarkup] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(releaseAsset("/legacy/index.html"), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => {
        const legacyDocument = new DOMParser().parseFromString(html, "text/html");
        const app = legacyDocument.querySelector("#app");
        if (!app) throw new Error("В разметке v47 отсутствует #app");
        if (active) setMarkup(app.outerHTML);
      })
      .catch((cause) => active && setError(String(cause.message || cause)));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!markup) return;
    document.querySelectorAll('[data-rtm-v48="true"]').forEach((node) => node.remove());
    try { localStorage.setItem("rtm_v492_test_ui", "modern"); } catch (_) {}
    window.__RTM_V48__ = true;
    window.__RTM_V49__ = true;
    window.__RTM_VERSION__ = RELEASE_VERSION;
    window.__RTM_STANDALONE__ =
      new URLSearchParams(window.location.search).get("rtm_fullscreen") === "1";

    LEGACY_STYLES.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.rtmV48 = "true";
      document.head.appendChild(link);
    });

    (async () => {
      try {
        for (const [src, module] of LEGACY_SCRIPTS) await loadScript(src, module);
      } catch (cause) {
        setError(String(cause.message || cause));
      }
    })();
  }, [markup]);

  if (error) return <div className="v48-load-error">Ошибка запуска v{RELEASE_VERSION}: {error}</div>;
  if (!markup) return <div className="v48-loading">Запускаем RTM обучение…</div>;
  return <div className="v48-react-host" dangerouslySetInnerHTML={{ __html: markup }} />;
}
