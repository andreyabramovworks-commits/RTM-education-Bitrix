import React, { useEffect, useState } from "react";
import {
  LEGACY_SCRIPTS,
  LEGACY_STYLES,
  RELEASE_VERSION,
  releaseAsset,
} from "./legacyRuntime";

let runtimePromise = null;

function loadScript(path, module) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = releaseAsset(path);
    script.dataset.rtmRuntime = RELEASE_VERSION;
    if (module) script.type = "module";
    script.onload = resolve;
    script.onerror = () => reject(new Error("Не удалось загрузить " + path));
    document.body.appendChild(script);
  });
}

function loadRuntime() {
  if (runtimePromise) return runtimePromise;
  runtimePromise = (async () => {
    document.querySelectorAll("[data-rtm-runtime]").forEach((node) => node.remove());
    try { localStorage.setItem("rtm_v492_test_ui", "modern"); } catch (_) {}
    window.__RTM_V48__ = true;
    window.__RTM_V49__ = true;
    window.__RTM_VERSION__ = RELEASE_VERSION;
    window.__RTM_STANDALONE__ =
      new URLSearchParams(window.location.search).get("rtm_fullscreen") === "1";

    LEGACY_STYLES.forEach((path) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = releaseAsset(path);
      link.dataset.rtmRuntime = RELEASE_VERSION;
      document.head.appendChild(link);
    });

    if (window.RTM_BITRIX_READY) await window.RTM_BITRIX_READY;
    for (const [path, module] of LEGACY_SCRIPTS) await loadScript(path, module);
  })().catch((error) => {
    runtimePromise = null;
    throw error;
  });
  return runtimePromise;
}

export function LegacyReactHost() {
  const [markup, setMarkup] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(releaseAsset("/legacy/index.html"), {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then((html) => {
        const legacyDocument = new DOMParser().parseFromString(html, "text/html");
        const app = legacyDocument.querySelector("#app");
        if (!app) throw new Error("В разметке приложения отсутствует #app");
        setMarkup(app.outerHTML);
      })
      .catch((cause) => {
        if (cause.name !== "AbortError") setError(String(cause.message || cause));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!markup) return;
    loadRuntime().catch((cause) => setError(String(cause.message || cause)));
  }, [markup]);

  if (error) return <div className="v48-load-error">Ошибка запуска v{RELEASE_VERSION}: {error}</div>;
  if (!markup) return <div className="v48-loading">Запускаем RTM обучение…</div>;
  return <div className="v48-react-host" dangerouslySetInnerHTML={{ __html: markup }} />;
}