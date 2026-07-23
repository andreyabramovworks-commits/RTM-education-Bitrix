import React, { useEffect, useState } from "react";

const LEGACY_STYLES = [
  "/legacy/style.css?v=046.3",
  "/legacy/excalidraw-dist/rtm-canvas.css?v=050.3.8",
  "/legacy/v040-layout.css?v=046.3",
  "/legacy/v040-inline.css?v=046.3",
  "/legacy/v046-layout.css?v=050.3.2",
  "/legacy/v0492.css?v=050.3.10",
  "/legacy/v050.css?v=050.3.2",
  "/legacy/v051.css?v=050.3.2",
  "/legacy/v052.css?v=050.3.2",
  "/legacy/v053.css?v=050.3.4",
  "/legacy/v053-extra.css?v=050.3.4",
  "/legacy/v053-modal.css?v=050.3.4",
  "/legacy/v053-review.css?v=050.3.4",
  "/legacy/v054.css?v=050.3.4",
  "/legacy/v5038.css?v=050.3.10",
  "/legacy/v5039-pages.css?v=050.3.10",
];

const LEGACY_SCRIPTS = [
  ["/legacy/v046-shell.js?v=050.3.2", false],
  ["/legacy/kb-data.js?v=046.3", false],
  ["/legacy/app.js?v=050.3.2", false],
  ["/legacy/v037-overrides.js?v=046.3", false],
  ["/legacy/v039-patch.js?v=046.3", false],
  ["/legacy/v040-assets.js?v=046.3", false],
  ["/legacy/excalidraw-dist/rtm-canvas.js?v=050.3.8", true],
  ["/legacy/v046-canvas.js?v=050.3.10", false],
  ["/legacy/v047-api.js?v=050.3.2", false],
  ["/legacy/v049.js?v=050.3.2", false],
  ["/legacy/v0492.js?v=050.3.10.1", false],
  ["/legacy/v050.js?v=050.3.2", false],
  ["/legacy/v051.js?v=050.3.2", false],
  ["/legacy/v052.js?v=050.3.2", false],
  ["/legacy/v053.js?v=050.3.4", false],
  ["/legacy/v054.js?v=050.3.4", false],
  ["/legacy/v5038-knowledge.js?v=050.3.10", false],
  ["/legacy/v5040-workspaces.js?v=050.4.1", false],
  ["/legacy/v5039-pages.js?v=050.3.10", false],
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
    fetch("/legacy/index.html?v=050.3.10", { cache: "no-store" })
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
    try { localStorage.setItem("rtm_v492_test_ui", "modern"); } catch (_) {}
    window.__RTM_V48__ = true;
    window.__RTM_V49__ = true;
    window.__RTM_VERSION__ = "50.3.10";
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
        // Keep the established visual selector contract used by v052.css.
        document.documentElement.dataset.rtmVersion = "50.3.2";
      } catch (cause) {
        setError(String(cause.message || cause));
      }
    })();
  }, [markup]);

  if (error) return <div className="v48-load-error">Ошибка запуска v50.3.10: {error}</div>;
  if (!markup) return <div className="v48-loading">Запускаем RTM обучение…</div>;
  return <div className="v48-react-host" dangerouslySetInnerHTML={{ __html: markup }} />;
}
