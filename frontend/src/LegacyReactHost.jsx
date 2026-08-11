import React, { useEffect, useState } from "react";
import {
  LEGACY_SCRIPTS,
  LEGACY_STYLES,
  CANVAS_SCRIPTS,
  CANVAS_STYLES,
  RELEASE_VERSION,
  releaseAsset,
} from "./legacyRuntime";
import { LearnerApp } from "./LearnerApp";

let runtimePromise = null;
let canvasRuntimePromise = null;

function createLearnerPreviewBridge() {
  const course = { ID: "course-1", NAME: "Адаптация нового сотрудника", PROPERTY_VALUES: { type: "course", status: "published", content: "Короткий маршрут по правилам, инструментам и рабочим процессам компании.", meta: JSON.stringify({ sections: [{ id: "start", title: "Начало работы" }] }) } };
  const items = [
    { ID: "article-1", NAME: "Добро пожаловать в команду", PROPERTY_VALUES: { type: "article", status: "published", parentId: course.ID, projectId: "project-1", meta: JSON.stringify({ sectionId: "start", required: true, order: 100 }) } },
    { ID: "article-2", NAME: "Рабочие инструменты и доступы", PROPERTY_VALUES: { type: "article", status: "published", parentId: course.ID, projectId: "project-1", meta: JSON.stringify({ sectionId: "start", required: true, order: 200 }) } },
    { ID: "test-1", NAME: "Проверка знаний", PROPERTY_VALUES: { type: "test", status: "published", parentId: course.ID, projectId: "project-1", meta: JSON.stringify({ sectionId: "start", required: true, order: 300 }) } },
  ];
  let snapshot = { mode: "user", role: "developer", canOpenAdmin: true, syncing: false, syncError: "", lastSyncAt: new Date().toISOString(), user: { ID: "36", NAME: "Андрей", LAST_NAME: "Абрамов", EMAIL: "andrey@example.ru" }, userId: "36", progressUserId: "36", courses: [course], items, projects: [{ ID: "project-1", NAME: "Корпоративные материалы" }], assigns: [], attempts: [{ PROPERTY_VALUES: { userId: "36", score: "86" } }], progress: [], leaderboard: [{ uid: "36", name: "Андрей Абрамов", points: 18, done: 5 }, { uid: "12", name: "Мария Петрова", points: 12, done: 4 }], points: 18, appearance: { brandName: "RTM обучение", logo: "", primaryColor: "#16845b" }, releaseVersion: RELEASE_VERSION, hintsEnabled: true, done: { "course-1": false, "article-1": true, "article-2": false, "test-1": false }, activeCourseId: "", activeMaterialId: "" };
  const listeners = new Set();
  const emit = (patch) => { snapshot = { ...snapshot, ...patch }; listeners.forEach((listener) => listener()); };
  const knowledge = { tree: { id: "root", type: "folder", title: "База знаний", children: [{ id: "folder-1", type: "folder", title: "Общие документы", children: [{ id: "doc-1", type: "material", title: "Этический кодекс", row: 5 }] }] }, documents: [{ id: 1, sourceRow: 5, title: "Этический кодекс", description: "Правила и ценности команды", documentUrl: "https://example.com", lightTest: { created: true }, fullTest: { created: false } }] };
  return { getSnapshot: () => snapshot, subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); }, refresh: async () => {}, setMode: () => {}, openMaterial: () => {}, completeMaterial: async () => {}, completeCourse: async () => {}, courseMaterials: () => items, canOpen: (id) => id !== "test-1", loadKnowledge: async () => knowledge, openKnowledge: async () => items[0], loadAcknowledgements: async () => [], loadEditions: async () => [], openAcknowledgement: () => {}, setHintsEnabled: (value) => emit({ hintsEnabled: Boolean(value) }), openHint: () => {} };
}

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

function loadStyle(path) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = releaseAsset(path);
    link.dataset.rtmRuntime = RELEASE_VERSION;
    link.onload = resolve;
    link.onerror = () => reject(new Error("Не удалось загрузить " + path));
    document.head.appendChild(link);
  });
}

function promoteAppStyles() {
  document.querySelectorAll('link[rel="stylesheet"][href*="/assets/index-"]').forEach((link) => document.head.appendChild(link));
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
    window.process ||= { env: { NODE_ENV: "production" } };
    window.process.env ||= { NODE_ENV: "production" };
    window.process.env.NODE_ENV ||= "production";
    window.EXCALIDRAW_ASSET_PATH = new URL("/legacy/excalidraw-dist/", window.location.origin).href;

    await Promise.all(LEGACY_STYLES.map(loadStyle));
    promoteAppStyles();

    if (window.RTM_BITRIX_READY) await window.RTM_BITRIX_READY;
    for (const [path, module] of LEGACY_SCRIPTS) await loadScript(path, module);
    if (typeof window.__RTM_SHELL_INIT__ === "function") window.__RTM_SHELL_INIT__();
    if (typeof window.__RTM_V48_INIT__ !== "function") {
      throw new Error("Runtime не предоставил функцию запуска");
    }
    window.__RTM_LOAD_CANVAS__ = loadCanvasRuntime;
    await window.__RTM_V48_INIT__();
  })().catch((error) => {
    runtimePromise = null;
    throw error;
  });
  return runtimePromise;
}

function loadCanvasRuntime() {
  if (window.RTMCanvas) return Promise.resolve(window.RTMCanvas);
  if (canvasRuntimePromise) return canvasRuntimePromise;
  canvasRuntimePromise = (async () => {
    await Promise.all(CANVAS_STYLES.map(loadStyle));
    promoteAppStyles();
    for (const [path, module] of CANVAS_SCRIPTS) await loadScript(path, module);
    return window.RTMCanvas;
  })().catch((error) => {
    canvasRuntimePromise = null;
    throw error;
  });
  return canvasRuntimePromise;
}

export function LegacyReactHost() {
  const [markup, setMarkup] = useState("");
  const [error, setError] = useState("");
  const [learnerBridge, setLearnerBridge] = useState(null);

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
        app.querySelector("#modalBackdrop")?.remove();
        setMarkup(app.outerHTML);
      })
      .catch((cause) => {
        if (cause.name !== "AbortError") setError(String(cause.message || cause));
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!markup) return;
    const preview = ["localhost", "127.0.0.1"].includes(window.location.hostname) && new URLSearchParams(window.location.search).get("learner_preview") === "1";
    if (preview) {
      setLearnerBridge(createLearnerPreviewBridge());
      return;
    }
    loadRuntime()
      .then(() => {
        if (!window.__RTM_LEARNER__) throw new Error("Runtime не предоставил интерфейс ученика");
        const mode = window.__RTM_LEARNER__.getSnapshot().mode;
        document.body.classList.toggle("rtm-learner-active", mode === "user");
        document.body.classList.toggle("rtm-admin-active", mode === "admin");
        setLearnerBridge(window.__RTM_LEARNER__);
      })
      .catch((cause) => setError(String(cause.message || cause)));
  }, [markup]);

  if (error) return <div className="v48-load-error"><strong>Не удалось запустить RTM Обучение</strong><span>{error}</span><button onClick={() => window.location.reload()}>Повторить</button></div>;
  return <>
    {!learnerBridge && <div className="v48-loading" role="status" aria-live="polite"><span className="v48-loading-mark">RTM <b>обучение</b></span><span className="v48-loading-line" aria-hidden="true" /><small>{markup ? "Загружаем ваши материалы…" : "Подготавливаем приложение…"}</small></div>}
    {markup && <div className={`v48-react-host ${learnerBridge ? "rtm-ready" : "rtm-pending"}`} aria-hidden={!learnerBridge} inert={!learnerBridge} dangerouslySetInnerHTML={{ __html: markup }} />}
    {markup && <div id="modalBackdrop" className="modal-backdrop hidden" role="presentation"><div id="modalBox" className="modal-box" role="dialog" aria-modal="true" /></div>}
    {learnerBridge && <LearnerApp bridge={learnerBridge} />}
  </>;
}
