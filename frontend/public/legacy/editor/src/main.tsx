import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  convertToExcalidrawElements,
  FONT_FAMILY,
  sceneCoordsToViewportCoords,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./rtm-canvas.css";

type MediaKind = "link" | "image" | "audio" | "video";

export type RTMMediaSpec = {
  kind: MediaKind;
  url: string;
  title?: string;
  diskId?: string;
};

export type RTMScene = {
  type?: string;
  version?: number;
  source?: string;
  elements: readonly any[];
  appState?: Record<string, any>;
  files?: Record<string, any>;
};

export type RTMCanvasOptions = {
  pageKey: string;
  scene?: RTMScene | null;
  htmlFallback?: string;
  readOnly?: boolean;
  title?: string;
  brandColor?: string;
  onChange?: (scene: RTMScene) => void;
  onRequestDisk?: (kind: "image" | "audio" | "video") => Promise<RTMMediaSpec | null>;
  onManualSave?: () => void | Promise<void>;
  onComplete?: () => void | Promise<void>;
  contentHeight?: number;
};

type DialogState = { kind: MediaKind; source: "url" | "stock" } | null;

const roots = new Map<HTMLElement, Root>();
const COMPLETE_LINK = "#rtm-complete-material";
const COMPLETE_TEXT = /^\s*завершить\s*$/i;
const RTM_FONT_IDS = { Architexture: 20, Manrope: 21, Montserrat: 22, Oswald: 23 } as const;
const EXCALIDRAW_FONT_OPTIONS = [["Excalifont", 5], ["Nunito", 6], ["Lilita One", 7], ["Comic Shanns", 8]] as const;
const RTM_FONT_OPTIONS = Object.entries(RTM_FONT_IDS) as [keyof typeof RTM_FONT_IDS, number][];
const STYLE_BOLD = 100;
const STYLE_ITALIC = 200;
Object.entries(RTM_FONT_IDS).forEach(([name, id]) => {
  (FONT_FAMILY as any)[name] = id;
  (FONT_FAMILY as any)[`${name} Bold`] = id + STYLE_BOLD;
  (FONT_FAMILY as any)[`${name} Italic`] = id + STYLE_ITALIC;
  (FONT_FAMILY as any)[`${name} Bold Italic`] = id + STYLE_BOLD + STYLE_ITALIC;
});
const decodeStyledFont = (fontFamily: number) => {
  const italic = fontFamily >= 300 || (fontFamily >= 200 && fontFamily < 300);
  const bold = fontFamily >= 300 || (fontFamily >= 100 && fontFamily < 200);
  const base = fontFamily - (bold ? STYLE_BOLD : 0) - (italic ? STYLE_ITALIC : 0);
  return { base: base > 0 && base < 100 ? base : RTM_FONT_IDS.Manrope, bold, italic };
};
const styledFontId = (base: number, bold: boolean, italic: boolean) => base + (bold ? STYLE_BOLD : 0) + (italic ? STYLE_ITALIC : 0);
const elementId = () => `rtm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

// Comic Shanns bundled by Excalidraw has no Cyrillic glyphs. Use the
// Excalifont Cyrillic subset under the same family instead of a serif fallback.
if (typeof FontFace !== "undefined" && typeof document !== "undefined") {
  const face = new FontFace(
    "Comic Shanns",
    `url(${new URL("./fonts/Excalifont/Excalifont-Regular-b9dcf9d2e50a1eaf42fc664b50a3fd0d.woff2", import.meta.url).href})`,
    { style: "normal", weight: "400", unicodeRange: "U+0301,U+0400-045F,U+0490-0491,U+2116" },
  );
  document.fonts.add(face);
  face.load().catch((error) => console.warn("RTM Comic Shanns Cyrillic fallback failed", error));
}

const isCompleteMarker = (el: any) => Boolean(el && !el.isDeleted && (
  el.customData?.rtmAction === "complete-material" || String(el.link || "").endsWith(COMPLETE_LINK)
));

const completionTarget = (elements: readonly any[]) => {
  const direct = elements.find(isCompleteMarker);
  if (direct) return direct;
  const text = elements.find((el: any) => !el.isDeleted && el.type === "text" && COMPLETE_TEXT.test(String(el.text || el.originalText || "")));
  if (!text) return null;
  const groups = new Set(text.groupIds || []);
  const cx = Number(text.x || 0) + Number(text.width || 0) / 2;
  const cy = Number(text.y || 0) + Number(text.height || 0) / 2;
  return elements.find((el: any) => {
    if (!el || el.isDeleted || el.type === "text") return false;
    if ((el.groupIds || []).some((id: string) => groups.has(id))) return true;
    const x = Number(el.x || 0), y = Number(el.y || 0), w = Number(el.width || 0), h = Number(el.height || 0);
    return cx >= x && cx <= x + w && cy >= y && cy <= y + h;
  }) || text;
};

const normalizeCompletion = (elements: readonly any[]) => {
  const target = completionTarget(elements);
  if (!target || isCompleteMarker(target)) return elements;
  return elements.map((el: any) => el.id === target.id ? {
    ...el,
    link: COMPLETE_LINK,
    customData: { ...(el.customData || {}), rtmAction: "complete-material", rtmProtectedCompletion: true },
  } : el);
};

const createRequiredCompletion = (elements: readonly any[]) => {
  const visibleText = elements.filter((el: any) => !el.isDeleted && el.type === "text").sort((a: any, b: any) => Number(a.y || 0) - Number(b.y || 0))[0];
  const x = Number(visibleText?.x || 80) + Math.max(320, Number(visibleText?.width || 280) + 56);
  const y = Number(visibleText?.y || 72);
  const groupId = elementId(), boxId = elementId(), textId = elementId();
  const created = convertToExcalidrawElements([
    { type: "rectangle", id: boxId, x, y, width: 250, height: 76, strokeColor: "#1e1e1e", backgroundColor: "#a5d8ff", fillStyle: "solid", strokeStyle: "dashed", strokeWidth: 2, roughness: 1, roundness: { type: 3 }, groupIds: [groupId], link: COMPLETE_LINK, customData: { rtmAction: "complete-material", rtmProtectedCompletion: true } },
    { type: "text", id: textId, x: x + 18, y: y + 23, width: 214, height: 35, text: "Завершить", originalText: "Завершить", fontSize: 28, fontFamily: 8, textAlign: "center", verticalAlign: "middle", autoResize: false, strokeColor: "#1971c2", groupIds: [groupId], customData: { rtmActionLabel: true, rtmProtectedCompletion: true } },
  ] as any, { regenerateIds: false }) as any[];
  return created.map((el: any) => ({ ...el, groupIds: [groupId], customData: { ...(el.customData || {}), rtmProtectedCompletion: true } }));
};

const ensureRequiredCompletion = (elements: readonly any[]) => {
  const normalized = [...normalizeCompletion(elements)] as any[];
  const direct = normalized.find(isCompleteMarker);
  if (direct) {
    const groups = new Set(direct.groupIds || []);
    return normalized.map((el: any) => el.id === direct.id || (el.groupIds || []).some((id: string) => groups.has(id)) ? { ...el, customData: { ...(el.customData || {}), rtmProtectedCompletion: true } } : el);
  }
  return [...normalized, ...createRequiredCompletion(normalized)];
};

const protectRequiredCompletion = (nextElements: readonly any[], previousElements: readonly any[]) => {
  const protectedPrevious = previousElements.filter((el: any) => !el.isDeleted && el.customData?.rtmProtectedCompletion);
  if (!protectedPrevious.length) return ensureRequiredCompletion(nextElements);
  const protectedIds = new Set(protectedPrevious.map((el: any) => el.id));
  const previousById = new Map(protectedPrevious.map((el: any) => [el.id, el]));
  let restored = false;
  const next = nextElements.map((el: any) => {
    if (!protectedIds.has(el.id) || !el.isDeleted) return el;
    restored = true;
    return { ...el, isDeleted: false, customData: { ...(previousById.get(el.id)?.customData || {}), ...(el.customData || {}), rtmProtectedCompletion: true }, version: Number(el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() };
  });
  for (const old of protectedPrevious) if (!next.some((el: any) => el.id === old.id)) { next.push({ ...old, isDeleted: false, version: Number(old.version || 1) + 1, updated: Date.now() }); restored = true; }
  return restored ? next : nextElements;
};

const safeHttpsUrl = (raw: string) => {
  try {
    const url = new URL(String(raw || "").trim(), window.location.href);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
};


const embedMediaUrl = (raw: string) => {
  const safe = safeHttpsUrl(raw);
  if (!safe) return "";
  try {
    const url = new URL(safe);
    const rutube = /(^|\.)rutube\.ru$/i.test(url.hostname) && /\/(?:video|shorts)\/(?:private\/)?([a-f0-9]+)/i.exec(url.pathname);
    if (rutube) {
      const embed = new URL(`https://rutube.ru/play/embed/${rutube[1]}`);
      const privateKey = url.searchParams.get("p");
      if (privateKey) embed.searchParams.set("p", privateKey);
      return embed.href;
    }
    return safe;
  } catch {
    return safe;
  }
};

const mediaFromNode = (node: Element): RTMMediaSpec | null => {
  const media = node.matches("img,audio,video,iframe") ? node : node.querySelector("img,audio,video,iframe");
  const anchor = node.matches("a[href]") ? node : node.querySelector("a[href]");
  const raw = media?.getAttribute("src") || anchor?.getAttribute("href") || "";
  const url = safeHttpsUrl(raw);
  if (!url) return null;
  const tag = media?.tagName.toLowerCase();
  const kind: MediaKind = tag === "img" ? "image" : tag === "audio" ? "audio" : "video";
  return {
    kind,
    url,
    title: node.querySelector(".rtm-block-title")?.textContent?.trim() || media?.getAttribute("title") || media?.getAttribute("alt") || undefined,
    diskId: node.getAttribute("data-disk-id") || undefined,
  };
};

const textSkeleton = (text: string, y: number, size = 24, color = "#1f2937") => ({
  type: "text" as const,
  id: elementId(),
  x: 80,
  y,
  text,
  fontSize: size,
  fontFamily: 1,
  textAlign: "left" as const,
  verticalAlign: "top" as const,
  strokeColor: color,
  width: 760,
});

const mediaSkeleton = (media: RTMMediaSpec, y: number) => ({
  type: "rectangle" as const,
  id: elementId(),
  x: 80,
  y,
  width: media.kind === "audio" ? 560 : (/rutube\.ru\/shorts\//i.test(media.url) ? 380 : 680),
  height: media.kind === "audio" ? 112 : (/rutube\.ru\/shorts\//i.test(media.url) ? 680 : 380),
  strokeColor: "#00000000",
  backgroundColor: "transparent",
  opacity: 0,
  fillStyle: "solid" as const,
  strokeWidth: 2,
  roundness: { type: 3 },
  link: media.kind === "link" ? media.url : null,
  customData: { rtmMedia: media },
});

export const htmlToScene = (html: string, title = "Страница"): RTMScene => {
  const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
  const skeletons: any[] = [];
  let y = 72;
  const candidates = Array.from(doc.body.querySelectorAll("h1,h2,h3,p,li,.rtm-content-block,table,img,audio,video,iframe"));
  const visited = new Set<Element>();

  for (const node of candidates) {
    if (Array.from(visited).some((parent) => parent.contains(node))) continue;
    if (node.classList.contains("rtm-content-block") || node.matches("img,audio,video,iframe")) {
      const media = mediaFromNode(node);
      if (media) {
        skeletons.push(mediaSkeleton(media, y));
        y += media.kind === "audio" ? 148 : 416;
        visited.add(node);
        continue;
      }
    }
    if (node.closest(".rtm-content-block") && !node.classList.contains("rtm-content-block")) continue;
    const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const tag = node.tagName.toLowerCase();
    const size = tag === "h1" ? 40 : tag === "h2" ? 32 : tag === "h3" ? 27 : 22;
    skeletons.push(textSkeleton(text, y, size, tag.startsWith("h") ? "#111827" : "#374151"));
    y += Math.max(size * 1.5, Math.ceil(text.length / 62) * size * 1.25) + 18;
    visited.add(node);
  }

  if (!skeletons.length) skeletons.push(textSkeleton(title, y, 40));
  const elements = ensureRequiredCompletion(convertToExcalidrawElements(skeletons as any, { regenerateIds: false }) as any[]);
  return {
    type: "excalidraw",
    version: 2,
    source: "rtm-v45-html-import",
    elements,
    appState: { viewBackgroundColor: "#f8fafc", zoom: { value: 1 } },
    files: {},
  };
};

const normalizeScene = (options: RTMCanvasOptions): RTMScene => {
  if (options.scene?.elements) {
    return {
      type: "excalidraw",
      version: 2,
      source: "rtm-v45",
      elements: ensureRequiredCompletion(options.scene.elements),
      appState: { viewBackgroundColor: "#f8fafc", ...(options.scene.appState || {}) },
      files: options.scene.files || {},
    };
  }
  return htmlToScene(options.htmlFallback || "", options.title || "Страница");
};

type Viewport = { zoom: number; left: number; top: number; sx: number; sy: number };
const overlayStyle = (el: any, viewport: Viewport, origin: { left: number; top: number }): React.CSSProperties => {
  const state = { zoom: { value: viewport.zoom }, offsetLeft: viewport.left, offsetTop: viewport.top, scrollX: viewport.sx, scrollY: viewport.sy } as any;
  const start = sceneCoordsToViewportCoords({ sceneX: Number(el.x), sceneY: Number(el.y) }, state);
  const end = sceneCoordsToViewportCoords({ sceneX: Number(el.x) + Number(el.width), sceneY: Number(el.y) + Number(el.height) }, state);
  return {
    left: start.x - origin.left,
    top: start.y - origin.top,
    width: Math.max(24, end.x - start.x),
    height: Math.max(24, end.y - start.y),
    transform: `rotate(${Number(el.angle || 0)}rad)`,
  };
};

function MediaOverlay({ elements, viewport, readOnly, origin, activeId, onActivate }: { elements: readonly any[]; viewport: Viewport; readOnly: boolean; origin: { left: number; top: number }; activeId: string | null; onActivate: (id: string | null) => void }) {
  return (
    <div className={`rtm-media-layer ${readOnly ? "is-reader" : "is-editor"}`}>
      {elements.filter((el) => !el.isDeleted && el.customData?.rtmMedia).map((el) => {
        const media = el.customData.rtmMedia as RTMMediaSpec;
        const active = readOnly || activeId === el.id;
        return (
          <div className={`rtm-media-overlay kind-${media.kind} ${active ? "is-active" : ""}`} style={overlayStyle(el, viewport, origin)} key={el.id}>
            {!readOnly && <button type="button" className="rtm-media-activate" onClick={() => onActivate(active ? null : el.id)}>{active ? "Вернуться к перемещению" : "▶ Проверить"}</button>}
            {media.kind === "audio" && <audio controls preload="metadata" src={media.url} title={media.title || "Аудио"} />}
            {media.kind === "video" && (/youtube\.com|youtu\.be|rutube\.ru/i.test(media.url)
              ? <iframe src={embedMediaUrl(media.url)} title={media.title || "Видео"} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation" />
              : <video controls preload="metadata" src={media.url} title={media.title || "Видео"} />)}
            {media.kind === "image" && <img src={media.url} alt={media.title || "Изображение"} />}
          </div>
        );
      })}
    </div>
  );
}

function ActionOverlay({ elements, viewport, origin, readOnly, onComplete }: { elements: readonly any[]; viewport: Viewport; origin: { left: number; top: number }; readOnly: boolean; onComplete?: () => void | Promise<void> }) {
  if (!readOnly) return null;
  const complete = completionTarget(elements);
  return <div className="rtm-action-layer">{elements.filter((el) => !el.isDeleted && (el.link || el.customData?.rtmAction === "complete-material" || el.id === complete?.id)).map((el) => {
    const style = overlayStyle(el, viewport, origin);
    if (el.id === complete?.id || isCompleteMarker(el)) return <button type="button" aria-label="Завершить материал" className="rtm-complete-hit" style={style} key={el.id} onClick={() => onComplete?.()} />;
    const href = safeHttpsUrl(el.link);
    return href ? <a className="rtm-link-hit" style={style} key={el.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={el.text || "Открыть ссылку"} /> : null;
  })}</div>;
}

function MediaDialog({ state, onClose, onInsert }: { state: DialogState; onClose: () => void; onInsert: (media: RTMMediaSpec) => void }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  if (!state) return null;
  const label = state.source === "stock" ? "Стоковое изображение" : state.kind === "audio" ? "Добавить аудио" : state.kind === "video" ? "Добавить видео" : state.kind === "image" ? "Добавить изображение" : "Добавить ссылку";
  return (
    <div className="rtm-canvas-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="rtm-canvas-dialog" onSubmit={(event) => {
        event.preventDefault();
        const clean = safeHttpsUrl(url);
        if (!clean) return;
        onInsert({ kind: state.source === "stock" ? "image" : state.kind, url: clean, title: title.trim() || undefined });
      }}>
        <h3>{label}</h3>
        <p>{state.source === "stock" ? "Вставьте прямую HTTPS-ссылку на изображение из разрешённого фотобанка." : "Поддерживаются безопасные HTTPS-ссылки. Для видео — YouTube, Rutube, MP4/WebM; для аудио — MP3/M4A/OGG/WAV/AAC/FLAC."}</p>
        <label>Название<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Необязательно" autoFocus /></label>
        <label>HTTPS-ссылка<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required /></label>
        <div className="rtm-canvas-dialog-actions"><button type="button" onClick={onClose}>Отмена</button><button className="primary" type="submit">Вставить</button></div>
      </form>
    </div>
  );
}

function RTMCanvasApp({ options }: { options: RTMCanvasOptions }) {
  const initial = useMemo(() => normalizeScene(options), [options.pageKey]);
  const apiRef = useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastElementsRef = useRef("");
  const lastSceneElementsRef = useRef<readonly any[]>(initial.elements || []);
  const [elements, setElements] = useState<readonly any[]>(initial.elements || []);
  const initialAppState = initial.appState || {};
  const [viewport, setViewport] = useState<Viewport>({ zoom: Number(initialAppState.zoom?.value || initialAppState.zoom || 1), left: Number(initialAppState.offsetLeft || 0), top: Number(initialAppState.offsetTop || 0), sx: Number(initialAppState.scrollX || 0), sy: Number(initialAppState.scrollY || 0) });
  const viewportSignatureRef = useRef("");
  const viewportFrameRef = useRef<number | null>(null);
  const overlayFrameRef = useRef<number | null>(null);
  const overlayElementsRef = useRef<readonly any[]>(initial.elements || []);
  const viewportTimeRef = useRef(0);
  const [origin, setOrigin] = useState({ left: 0, top: 0 });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [saveState, setSaveState] = useState("");
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [captureShortcuts, setCaptureShortcuts] = useState(false);
  const [selectedFont, setSelectedFont] = useState<number>(decodeStyledFont(Number(initialAppState.currentItemFontFamily || 5)).base);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const changed = useRef(false);
  const readOnly = Boolean(options.readOnly);
  const brand = options.brandColor || "#7c3aed";
  const shortcutsActive = !readOnly && (editorFullscreen || captureShortcuts);

  const selectedTextElements = () => {
    const api = apiRef.current;
    if (!api) return [];
    const appState = api.getAppState();
    const ids = appState.selectedElementIds || {};
    return api.getSceneElements().filter((el: any) => !el.isDeleted && el.type === "text" && (ids[el.id] || (el.containerId && ids[el.containerId])));
  };

  const updateSelectedText = (fontFor: (current: number) => number) => {
    const api = apiRef.current;
    if (!api) return;
    const selected = new Set(selectedTextElements().map((el: any) => el.id));
    const next = api.getSceneElements().map((el: any) => selected.has(el.id) ? { ...el, fontFamily: fontFor(Number(el.fontFamily || selectedFont)), version: Number(el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() } : el);
    const nextCurrent = fontFor(Number(api.getAppState().currentItemFontFamily || selectedFont));
    api.updateScene({ elements: next, appState: { currentItemFontFamily: nextCurrent } });
    setSelectedFont(decodeStyledFont(nextCurrent).base);
  };

  const applyFont = (fontId: number) => {
    setSelectedFont(fontId);
    updateSelectedText((current) => {
      const style = decodeStyledFont(current);
      return styledFontId(fontId, style.bold, style.italic);
    });
  };

  const toggleTextStyle = (kind: "bold" | "italic") => {
    const selected = selectedTextElements();
    const source = selected.length ? Number(selected[0].fontFamily || selectedFont) : Number(apiRef.current?.getAppState().currentItemFontFamily || selectedFont);
    const style = decodeStyledFont(source);
    const turnOn = selected.length ? selected.some((el: any) => !decodeStyledFont(Number(el.fontFamily || selectedFont))[kind]) : !style[kind];
    updateSelectedText((current) => {
      const item = decodeStyledFont(current);
      return styledFontId(item.base, kind === "bold" ? turnOn : item.bold, kind === "italic" ? turnOn : item.italic);
    });
  };

  const transformSelectedText = (transform: (text: string) => string) => {
    const api = apiRef.current;
    if (!api) return;
    const selected = new Set(selectedTextElements().map((el: any) => el.id));
    if (!selected.size) { window.alert("Сначала выделите текст"); return; }
    const next = api.getSceneElements().map((el: any) => selected.has(el.id)
      ? { ...el, text: transform(String(el.text || "")), originalText: transform(String(el.originalText || el.text || "")), version: Number(el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() }
      : el);
    api.updateScene({ elements: next });
  };

  const decorateText = (mark: "underline" | "strike") => transformSelectedText((text) => {
    const code = mark === "underline" ? "\u0332" : "\u0336";
    return Array.from(text.replace(/[\u0332\u0336]/g, "")).map((char) => char === "\n" ? char : char + code).join("");
  });
  const makeList = (ordered: boolean) => transformSelectedText((text) => text.split("\n").map((line, index) => `${ordered ? `${index + 1}.` : "•"} ${line.replace(/^(?:•|\d+\.)\s*/, "")}`).join("\n"));

  useEffect(() => {
    lastElementsRef.current = (initial.elements || []).map((el: any) => [el.id, el.version, el.versionNonce, el.isDeleted ? 1 : 0].join(":" )).join("|");
    const updateOrigin = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect) setOrigin((current) => current.left === rect.left && current.top === rect.top ? current : { left: rect.left, top: rect.top });
    };
    updateOrigin();
    const observer = typeof ResizeObserver !== "undefined" && stageRef.current ? new ResizeObserver(updateOrigin) : null;
    if (observer && stageRef.current) observer.observe(stageRef.current);
    window.addEventListener("resize", updateOrigin);
    const saveListener = (event: Event) => { const detail = (event as CustomEvent).detail; if (detail?.pageKey === options.pageKey) setSaveState(detail.text || ""); };
    const insertListener = (event: Event) => { const detail = (event as CustomEvent).detail; if (!detail?.pageKey || detail.pageKey === options.pageKey) insertComplete(); };
    window.addEventListener("rtm-canvas-save-state", saveListener);
    window.addEventListener("rtm-canvas-insert-complete", insertListener);
    return () => { observer?.disconnect(); window.removeEventListener("resize", updateOrigin); window.removeEventListener("rtm-canvas-save-state", saveListener); window.removeEventListener("rtm-canvas-insert-complete", insertListener); if (viewportFrameRef.current) cancelAnimationFrame(viewportFrameRef.current); if (overlayFrameRef.current) cancelAnimationFrame(overlayFrameRef.current); };
  }, [options.pageKey]);

  const addMedia = (media: RTMMediaSpec) => {
    const api = apiRef.current;
    if (!api) return;
    const visible = api.getSceneElements().filter((el: any) => !el.isDeleted);
    const maxY = visible.reduce((max: number, el: any) => Math.max(max, Number(el.y || 0) + Number(el.height || 0)), 40);
    const skeleton = media.kind === "link"
      ? textSkeleton(media.title || media.url, maxY + 50, 24, brand)
      : mediaSkeleton(media, maxY + 50);
    if (media.kind === "link") (skeleton as any).link = media.url;
    const next = convertToExcalidrawElements([skeleton] as any, { regenerateIds: false }) as any[];
    api.updateScene({ elements: [...api.getSceneElements(), ...next] });
    setDialog(null);
  };

  const importScene = (data: any) => {
    const api = apiRef.current;
    if (!api || !Array.isArray(data?.elements)) return false;
    const existing = api.getSceneElements();
    const incoming = data.elements.filter((el: any) => el && el.id && !el.isDeleted).map((el: any) => ({ ...el })) as any[];
    if (!incoming.length) return false;
    const existingIds = new Set(existing.map((el: any) => el.id));
    if (incoming.some((el: any) => existingIds.has(el.id))) incoming.forEach((el: any) => { el.id = elementId(); });
    const appState = api.getAppState();
    const rect = stageRef.current?.getBoundingClientRect();
    const zoom = Number(appState.zoom?.value || appState.zoom || 1);
    const minX = Math.min(...incoming.map((el: any) => Number(el.x || 0)));
    const minY = Math.min(...incoming.map((el: any) => Number(el.y || 0)));
    const maxX = Math.max(...incoming.map((el: any) => Number(el.x || 0) + Number(el.width || 0)));
    const maxY = Math.max(...incoming.map((el: any) => Number(el.y || 0) + Number(el.height || 0)));
    const sceneCenterX = ((rect?.width || 900) / 2 - Number(appState.offsetLeft || 0)) / zoom - Number(appState.scrollX || 0);
    const sceneCenterY = ((rect?.height || 600) / 2 - Number(appState.offsetTop || 0)) / zoom - Number(appState.scrollY || 0);
    const dx = sceneCenterX - (minX + maxX) / 2;
    const dy = sceneCenterY - (minY + maxY) / 2;
    incoming.forEach((el: any) => { el.x = Number(el.x || 0) + dx; el.y = Number(el.y || 0) + dy; });
    if (data.files) api.addFiles?.(Object.values(data.files) as any);
    api.updateScene({ elements: [...existing, ...incoming], appState: { selectedElementIds: Object.fromEntries(incoming.map((el: any) => [el.id, true])) } });
    return true;
  };

  const insertComplete = () => {
    const api = apiRef.current;
    if (!api) return;
    const existing = completionTarget(api.getSceneElements());
    if (existing) { api.updateScene({ appState: { selectedElementIds: { [existing.id]: true } } }); api.scrollToContent?.([existing], { fitToContent: false }); return; }
    const state = api.getAppState();
    const rect = stageRef.current?.getBoundingClientRect();
    const zoom = Number(state.zoom?.value || state.zoom || 1);
    const x = ((rect?.width || 900) / 2 - Number(state.offsetLeft || 0)) / zoom - Number(state.scrollX || 0) - 140;
    const y = ((rect?.height || 600) / 2 - Number(state.offsetTop || 0)) / zoom - Number(state.scrollY || 0) - 48;
    const groupId = elementId();
    const boxId = elementId();
    const textId = elementId();
    const created = convertToExcalidrawElements([
      { type: "rectangle", id: boxId, x, y, width: 280, height: 96, strokeColor: "#1e1e1e", backgroundColor: "#a5d8ff", fillStyle: "solid", strokeStyle: "dashed", strokeWidth: 2, roughness: 1, roundness: { type: 3 }, groupIds: [groupId], link: COMPLETE_LINK, customData: { rtmAction: "complete-material" } },
      { type: "text", id: textId, x: x + 20, y: y + 30, width: 240, height: 35, text: "Завершить", originalText: "Завершить", fontSize: 28, fontFamily: 8, textAlign: "center", verticalAlign: "middle", autoResize: false, strokeColor: "#1971c2", groupIds: [groupId], link: COMPLETE_LINK, customData: { rtmActionLabel: true } },
    ] as any, { regenerateIds: false }) as any[];
    created.forEach((el: any) => {
      el.groupIds = [groupId];
      if (el.id === boxId) { el.link = COMPLETE_LINK; el.customData = { ...(el.customData || {}), rtmAction: "complete-material" }; }
      if (el.id === textId) { el.fontFamily = 8; el.textAlign = "center"; el.verticalAlign = "middle"; el.autoResize = false; el.x = x + 20; el.y = y + 30; el.width = 240; el.link = COMPLETE_LINK; el.customData = { ...(el.customData || {}), rtmActionLabel: true }; }
    });
    api.updateScene({ elements: [...api.getSceneElements(), ...created], appState: { selectedElementIds: { [boxId]: true, [textId]: true } } });
  };

  const handleImportFile = async (file?: File) => { if (!file) return; try { const data = JSON.parse(await file.text()); if (!importScene(data)) throw new Error("В файле нет элементов"); } catch (error: any) { window.alert("Не удалось импортировать макет: " + error.message); } };

  const requestDisk = async (kind: "image" | "audio" | "video") => {
    const media = await options.onRequestDisk?.(kind);
    if (media) addMedia(media);
  };

  const requestMediaUrl = () => {
    const url = window.prompt("Вставьте HTTPS-ссылку на видео или аудио");
    if (!url) return;
    const kind = /\.(?:mp3|m4a|ogg|wav|aac|flac)(?:$|[?#])/i.test(url) ? "audio" : "video";
    addMedia({ kind, url, title: kind === "audio" ? "Аудио" : "Видео" });
  };

  const save = async () => {
    setSaveState("Сохраняю…");
    try { await options.onManualSave?.(); changed.current = false; setSaveState(""); }
    catch { setSaveState("Сохранено на устройстве — ожидаю Bitrix24"); }
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (readOnly || !stageRef.current?.contains(event.target as Node)) return;
      const raw = event.clipboardData?.getData("text/plain")?.trim() || "";
      if (!raw) return;
      if (/^https?:\/\/\S+$/i.test(raw)) { event.preventDefault(); event.stopImmediatePropagation(); addMedia({ kind: "link", url: raw, title: raw }); return; }
      try { const data = JSON.parse(raw); if (data?.type === "excalidraw/clipboard" || data?.type === "excalidraw") { event.preventDefault(); event.stopImmediatePropagation(); importScene(data); } } catch { /* regular text is handled by Excalidraw */ }
    };
    window.addEventListener("paste", onPaste, true);
    return () => window.removeEventListener("paste", onPaste, true);
  }, [readOnly, options.pageKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!shortcutsActive || !(event.ctrlKey || event.metaKey) || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input,textarea,select,[contenteditable=true]") && !target.closest("[data-type=wysiwyg]")) return;
      const key = event.key.toLowerCase();
      if (key === "b" || key === "i") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        toggleTextStyle(key === "b" ? "bold" : "italic");
      } else if (key === "d") {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [shortcutsActive, selectedFont, options.pageKey]);

  return (
    <div className={`rtm-canvas-shell ${readOnly ? "is-reader" : "is-admin"} ${editorFullscreen ? "is-editor-fullscreen" : ""}`} style={{ "--rtm-canvas-brand": brand } as React.CSSProperties}>
      {!readOnly && <div className="rtm-canvas-toolbar" aria-label="RTM контент">
        <button type="button" className="rtm-text-style" title="Жирный текст (Ctrl+B)" onClick={() => toggleTextStyle("bold")}><b>B</b></button>
        <button type="button" className="rtm-text-style" title="Курсив (Ctrl+I)" onClick={() => toggleTextStyle("italic")}><i>I</i></button>
        <button type="button" className="rtm-text-style" title="Подчёркнутый текст" onClick={() => decorateText("underline")}><u>U</u></button>
        <button type="button" className="rtm-text-style" title="Зачёркнутый текст" onClick={() => decorateText("strike")}><s>S</s></button>
        <label className="rtm-font-select rtm-icon-control" title="Список шрифтов"><select aria-label="Список шрифтов" value={selectedFont} onChange={(event) => applyFont(Number(event.target.value))}><optgroup label="Штатные Excalidraw">{EXCALIDRAW_FONT_OPTIONS.map(([name, id]) => <option key={id} value={id}>{name}</option>)}</optgroup><optgroup label="Шрифты RTM">{RTM_FONT_OPTIONS.map(([name, id]) => <option key={id} value={id}>{name}</option>)}</optgroup></select></label>
        <button type="button" title="Маркированный список" onClick={() => makeList(false)}>☷</button>
        <button type="button" title="Нумерованный список" onClick={() => makeList(true)}>☰</button>
        <button type="button" title="Ссылка на видео или аудио" onClick={requestMediaUrl}>▶</button>
        <button type="button" title="Ссылка" onClick={() => setDialog({ kind: "link", source: "url" })}>＋</button>
        <button type="button" title="Файл с ПК или Bitrix.Диска" onClick={() => requestDisk("video")}>⇩</button>
        <label className="rtm-canvas-import" title="Импорт макета">◉<input type="file" accept=".excalidraw,application/json" onChange={(event) => { handleImportFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
        <button type="button" title={editorFullscreen ? "Свернуть" : "Развернуть редактор"} aria-pressed={editorFullscreen} onClick={() => setEditorFullscreen((value) => !value)}>⛶</button>
        {saveState && <span className={`rtm-canvas-save-state ${saveState.includes("Ошибка") || saveState.includes("ожидаю") ? "is-error" : ""}`}>{saveState}</span>}
        <button type="button" className="rtm-canvas-save" onClick={save}>Сохранить статью</button>
      </div>}
      <div className="rtm-canvas-stage" ref={stageRef} tabIndex={-1} onPointerDown={() => stageRef.current?.focus({ preventScroll: true })}>
        <Excalidraw
          key={options.pageKey}
          excalidrawAPI={(nextApi: any) => { apiRef.current = nextApi; }}
          initialData={initial as any}
          viewModeEnabled={readOnly}
          handleKeyboardGlobally={shortcutsActive}
          zenModeEnabled={readOnly}
          theme="light"
          langCode="ru-RU"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveToActiveFile: false,
              export: readOnly ? false : { saveFileToDisk: true },
              toggleTheme: false,
              clearCanvas: !readOnly,
            },
          } as any}
          onChange={(incomingElements: readonly any[], nextAppState: any, files: any) => {
            let nextElements = incomingElements;
            if (!readOnly) {
              const protectedElements = protectRequiredCompletion(nextElements, lastSceneElementsRef.current);
              if (protectedElements !== nextElements) { apiRef.current?.updateScene({ elements: protectedElements }); return; }
              lastSceneElementsRef.current = protectedElements;
              const currentBaseFont = decodeStyledFont(Number(nextAppState.currentItemFontFamily || 5)).base;
              if (currentBaseFont !== selectedFont) setSelectedFont(currentBaseFont);
              const completion = nextElements.filter(isCompleteMarker);
              if (completion.length > 1) {
                const duplicateIds = new Set(completion.slice(1).flatMap((el: any) => el.groupIds?.length ? el.groupIds : [el.id]));
                const normalized = nextElements.map((el: any) => !el.isDeleted && (duplicateIds.has(el.id) || el.groupIds?.some((id: string) => duplicateIds.has(id))) ? { ...el, isDeleted: true, version: Number(el.version || 1) + 1 } : el);
                apiRef.current?.updateScene({ elements: normalized });
                return;
              }
            }
            overlayElementsRef.current = nextElements;
            if (!overlayFrameRef.current) overlayFrameRef.current = requestAnimationFrame(() => { setElements(overlayElementsRef.current); overlayFrameRef.current = null; });
            const signature = nextElements.map((el: any) => [el.id, el.version, el.versionNonce, el.isDeleted ? 1 : 0].join(":" )).join("|");
            if (signature !== lastElementsRef.current) {
              lastElementsRef.current = signature;
              if (!readOnly) {
                changed.current = true;
                setSaveState("");
                options.onChange?.({ type: "excalidraw", version: 2, source: "rtm-v45", elements: ensureRequiredCompletion(nextElements), appState: { viewBackgroundColor: nextAppState.viewBackgroundColor, scrollX: nextAppState.scrollX, scrollY: nextAppState.scrollY, zoom: nextAppState.zoom, gridSize: nextAppState.gridSize }, files });
              }
            }
            const nextViewport: Viewport = { zoom: Number(nextAppState.zoom?.value || nextAppState.zoom || 1), left: Number(nextAppState.offsetLeft || 0), top: Number(nextAppState.offsetTop || 0), sx: Number(nextAppState.scrollX || 0), sy: Number(nextAppState.scrollY || 0) };
            const viewportSignature = [nextViewport.zoom, nextViewport.left, nextViewport.top, nextViewport.sx, nextViewport.sy].map((value, index) => index === 0 ? Math.round(value * 200) / 200 : Math.round(value * 4) / 4).join("|");
            if (viewportSignature !== viewportSignatureRef.current && (!readOnly || performance.now() - viewportTimeRef.current >= 50)) {
              viewportSignatureRef.current = viewportSignature;
              viewportTimeRef.current = performance.now();
              if (viewportFrameRef.current) cancelAnimationFrame(viewportFrameRef.current);
              viewportFrameRef.current = requestAnimationFrame(() => { setViewport(nextViewport); viewportFrameRef.current = null; });
            }
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.Item onSelect={save}>Сохранить в RTM</MainMenu.Item>
          </MainMenu>
          {!readOnly && <WelcomeScreen>
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>Полотно RTM</WelcomeScreen.Center.Heading>
              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItemLink href="https://docs.excalidraw.com/">Справка Excalidraw</WelcomeScreen.Center.MenuItemLink>
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
          </WelcomeScreen>}
        </Excalidraw>
        <MediaOverlay elements={elements} viewport={viewport} readOnly={readOnly} origin={origin} activeId={activeMediaId} onActivate={setActiveMediaId} />
        <ActionOverlay elements={elements} viewport={viewport} origin={origin} readOnly={readOnly} onComplete={options.onComplete} />
      </div>
      <MediaDialog state={dialog} onClose={() => setDialog(null)} onInsert={addMedia} />
    </div>
  );
}

export type RTMCanvasBridge = {
  mount: (host: HTMLElement, options: RTMCanvasOptions) => void;
  unmount: (host: HTMLElement) => void;
  htmlToScene: typeof htmlToScene;
};

const bridge: RTMCanvasBridge = {
  mount(host, options) {
    for (const [node, oldRoot] of roots) {
      if (!node.isConnected) {
        try { oldRoot.unmount(); } catch { /* stale root */ }
        roots.delete(node);
      }
    }
    let root = roots.get(host);
    if (!root) {
      host.replaceChildren();
      root = createRoot(host);
      roots.set(host, root);
    }
    root.render(<RTMCanvasApp key={options.pageKey} options={options} />);
  },
  unmount(host) {
    const root = roots.get(host);
    if (root) {
      try { root.unmount(); } finally { roots.delete(host); }
    }
    host.replaceChildren();
  },
  htmlToScene,
};

window.RTMCanvas = bridge;

export default bridge;
