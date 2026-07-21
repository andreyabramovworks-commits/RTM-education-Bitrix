import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot, Root } from "react-dom/client";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  CaptureUpdateAction,
  convertToExcalidrawElements,
  exportToSvg,
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
  fitToContent?: boolean;
  completionRequired?: boolean;
  testDefinition?: { questions?: any[] } | null;
  testAnswers?: Record<string, any>;
  testMode?: "author" | "take";
  onTestAnswer?: (questionId: string, value: any) => void;
};

type DialogState = { kind: MediaKind; source: "url" | "stock" } | null;

const roots = new Map<HTMLElement, Root>();
const COMPLETE_LINK = "#rtm-complete-material";
const COMPLETE_TEXT = /^\s*завершить(?:\s+материал)?\s*[!.]?\s*$/i;
const RTM_FONT_IDS = { Architexture: 20, Manrope: 21, Montserrat: 22, Oswald: 23 } as const;
const EXCALIDRAW_FONT_OPTIONS = [["Excalifont", 5], ["Nunito", 6], ["Lilita One", 7], ["Comic Shanns", 8]] as const;
const RTM_FONT_OPTIONS = Object.entries(RTM_FONT_IDS) as [keyof typeof RTM_FONT_IDS, number][];
const FONT_OPTIONS = [...EXCALIDRAW_FONT_OPTIONS, ...RTM_FONT_OPTIONS] as readonly (readonly [string, number])[];
const fontCssFamily = (id: number) => FONT_OPTIONS.find((item) => item[1] === id)?.[0] || "Excalifont";
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

const completionScore = (marker: any, elements: readonly any[]) => {
  const groups = new Set(marker?.groupIds || []);
  const members = elements.filter((el: any) => !el.isDeleted && (el.id === marker?.id || (el.groupIds || []).some((id: string) => groups.has(id))));
  const hasReminder = members.some((el: any) => el.type === "text" && /не забудьте|следующему материалу/i.test(String(el.text || el.originalText || "")));
  const hasCard = members.some((el: any) => el.type === "rectangle" && Number(el.width || 0) >= 320 && Number(el.height || 0) >= 110);
  return (marker?.customData?.rtmCompletionCard ? 200 : 0) + (hasReminder ? 100 : 0) + (hasCard ? 50 : 0) - Number(marker?.width || 0) / 1000;
};

const dedupeCompletion = (elements: readonly any[]) => {
  const markers = elements.filter(isCompleteMarker);
  if (markers.length < 2) return elements;
  const preferred = [...markers].sort((a: any, b: any) => completionScore(b, elements) - completionScore(a, elements))[0];
  const duplicateGroups = new Set(markers.filter((el: any) => el.id !== preferred.id).flatMap((el: any) => el.groupIds || []));
  const duplicateIds = new Set(markers.filter((el: any) => el.id !== preferred.id).map((el: any) => el.id));
  return elements.map((el: any) => {
    const inDuplicateGroup = (el.groupIds || []).some((id: string) => duplicateGroups.has(id));
    if (!duplicateIds.has(el.id) && !inDuplicateGroup) return el;
    return { ...el, isDeleted: true, version: Number(el.version || 1) + 1, updated: Date.now() };
  });
};

const createRequiredCompletion = (elements: readonly any[]) => {
  const visible = elements.filter((el: any) => !el.isDeleted && el.type !== "frame" && !el.customData?.rtmProtectedCompletion);
  const last = [...visible].sort((a: any, b: any) => (Number(b.y || 0) + Number(b.height || 0)) - (Number(a.y || 0) + Number(a.height || 0)))[0];
  const targetFrame = last?.frameId ? elements.find((el: any) => !el.isDeleted && el.id === last.frameId && el.type === "frame") : null;
  const cardWidth = 590, cardHeight = 185;
  const fallbackX = last ? Number(last.x || 0) + (Number(last.width || cardWidth) - cardWidth) / 2 : 80;
  const fallbackY = last ? Number(last.y || 0) + Number(last.height || 0) + 52 : 72;
  const hasFrameRoom = targetFrame && fallbackY + cardHeight <= Number(targetFrame.y || 0) + Number(targetFrame.height || 0) - 18;
  const x = targetFrame ? Number(targetFrame.x || 0) + (Number(targetFrame.width || cardWidth) - cardWidth) / 2 : fallbackX;
  const y = fallbackY;
  const frameId = hasFrameRoom ? targetFrame.id : null;
  const groupId = elementId(), cardId = elementId(), noteId = elementId(), boxId = elementId(), textId = elementId();
  const created = convertToExcalidrawElements([
    { type: "rectangle", id: cardId, x, y, width: cardWidth, height: cardHeight, strokeColor: "#12b886", backgroundColor: "#e6fcf5", fillStyle: "solid", strokeStyle: "solid", strokeWidth: 4, roughness: 1, roundness: { type: 3 }, groupIds: [groupId], frameId },
    { type: "text", id: noteId, x: x + 38, y: y + 34, width: 514, height: 58, text: "Не забудь нажать кнопку «Завершить», чтобы\nполучить доступ к следующему материалу!", originalText: "Не забудь нажать кнопку «Завершить», чтобы\nполучить доступ к следующему материалу!", fontSize: 23, fontFamily: 5, textAlign: "left", verticalAlign: "middle", autoResize: false, strokeColor: "#1e1e1e", groupIds: [groupId], frameId },
    { type: "rectangle", id: boxId, x: x + 214, y: y + 105, width: 162, height: 58, strokeColor: "#087f5b", backgroundColor: "#12b886", fillStyle: "solid", strokeStyle: "solid", strokeWidth: 2, roughness: 1, roundness: { type: 3 }, groupIds: [groupId], frameId, boundElements: [{ id: textId, type: "text" }], link: COMPLETE_LINK, customData: { rtmAction: "complete-material", rtmProtectedCompletion: true, rtmCompletionCard: true, rtmCompletionVersion: 51 } },
    { type: "text", id: textId, x: x + 214, y: y + 118, width: 162, height: 32, text: "Завершить", originalText: "Завершить", fontSize: 23, fontFamily: 5, textAlign: "center", verticalAlign: "middle", autoResize: false, strokeColor: "#ffffff", groupIds: [groupId], frameId, containerId: boxId, customData: { rtmActionLabel: true, rtmProtectedCompletion: true, rtmCompletionCard: true, rtmCompletionVersion: 51 } },
  ] as any, { regenerateIds: false }) as any[];
  return created.map((el: any) => ({ ...el, groupIds: [groupId], frameId, customData: { ...(el.customData || {}), rtmProtectedCompletion: true, rtmCompletionCard: true } }));
};

const repairCompletionCard = (elements: readonly any[]) => {
  const marker = elements.find((el: any) => isCompleteMarker(el) && el.customData?.rtmCompletionCard);
  if (!marker) return elements;
  const groups = new Set(marker.groupIds || []);
  const members = elements.filter((el: any) => el.id === marker.id || (el.groupIds || []).some((id: string) => groups.has(id)));
  const label = members.find((el: any) => el.type === "text" && (el.customData?.rtmActionLabel || COMPLETE_TEXT.test(String(el.text || el.originalText || ""))));
  const reminder = members.find((el: any) => el.type === "text" && /не забудь/i.test(String(el.text || el.originalText || "")));
  return elements.map((el: any) => {
    if (label && el.id === label.id) return {
      ...el, x: Number(marker.x || 0), y: Number(marker.y || 0) + (Number(marker.height || 58) - 32) / 2,
      width: Number(marker.width || 162), height: 32, text: "Завершить", originalText: "Завершить",
      textAlign: "center", verticalAlign: "middle", autoResize: false, containerId: marker.id,
      customData: { ...(el.customData || {}), rtmActionLabel: true, rtmProtectedCompletion: true, rtmCompletionCard: true, rtmCompletionVersion: 51 },
    };
    if (reminder && el.id === reminder.id) {
      const text = String(el.text || el.originalText || "").replace(/что\s+бы/gi, "чтобы");
      return { ...el, text, originalText: text, customData: { ...(el.customData || {}), rtmCompletionVersion: 51 } };
    }
    if (el.id === marker.id) return {
      ...el, boundElements: label ? [{ id: label.id, type: "text" }] : el.boundElements,
      customData: { ...(el.customData || {}), rtmCompletionVersion: 51 },
    };
    return el;
  });
};

const ensureRequiredCompletion = (elements: readonly any[]) => {
  const normalized = [...repairCompletionCard(dedupeCompletion(normalizeCompletion(elements)))] as any[];
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
      const embed = new URL(`https://rutube.ru/play/embed/${rutube[1]}/`);
      const privateKey = url.searchParams.get("p");
      if (privateKey) embed.searchParams.set("p", privateKey);
      return embed.href;
    }
    return safe;
  } catch {
    return safe;
  }
};

const normalizeTextGeometry = (element: any) => {
  if (!element || element.isDeleted || element.type !== "text" || element.containerId) return element;
  const text = String(element.text || element.originalText || "");
  if (!text) return element;
  const lines = Math.max(1, text.split("\n").length);
  const fontSize = Math.max(1, Number(element.fontSize || 20));
  const lineHeight = Math.max(.8, Math.min(2, Number(element.lineHeight || 1.25)));
  const contentHeight = Math.max(fontSize, Math.ceil(lines * fontSize * lineHeight));
  const currentHeight = Number(element.height || contentHeight);
  // Imported/clipboard text can retain the height of a source selection box.
  // A normal text element should not contain hundreds of pixels of empty space.
  if (currentHeight <= contentHeight * 2 + 12) return element;
  return {
    ...element,
    height: contentHeight,
    version: Number(element.version || 1) + 1,
    versionNonce: Math.floor(Math.random() * 2147483647),
    updated: Date.now(),
  };
};

const normalizeTextGeometryList = (elements: readonly any[]) => {
  let changed = false;
  const normalized = elements.map((element: any) => {
    const next = normalizeTextGeometry(element);
    if (next !== element) changed = true;
    return next;
  });
  return changed ? normalized : elements;
};

type ElementBounds = { left: number; top: number; right: number; bottom: number; area: number; cx: number; cy: number };

const elementBounds = (element: any): ElementBounds => {
  const x = Number(element.x || 0), y = Number(element.y || 0);
  const width = Math.max(0, Number(element.width || 0)), height = Math.max(0, Number(element.height || 0));
  const cx = x + width / 2, cy = y + height / 2, angle = Number(element.angle || 0);
  if (!angle) return { left: x, top: y, right: x + width, bottom: y + height, area: Math.max(1, width * height), cx, cy };
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  const corners = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]].map(([px, py]) => ({
    x: cx + (px - cx) * cosine - (py - cy) * sine,
    y: cy + (px - cx) * sine + (py - cy) * cosine,
  }));
  const left = Math.min(...corners.map((point) => point.x)), right = Math.max(...corners.map((point) => point.x));
  const top = Math.min(...corners.map((point) => point.y)), bottom = Math.max(...corners.map((point) => point.y));
  return { left, top, right, bottom, area: Math.max(1, width * height), cx, cy };
};

/** Assign every element to the smallest frame which fully contains it. */
const reconcileFrameMembership = (elements: readonly any[]) => {
  const visible = elements.filter((element: any) => element && !element.isDeleted);
  const frames = visible.filter((element: any) => element.type === "frame").map((frame: any) => ({ frame, bounds: elementBounds(frame) }));
  if (!frames.length) {
    let detached = false;
    const next = elements.map((element: any) => {
      if (!element || element.isDeleted || !element.frameId) return element;
      detached = true;
      return { ...element, frameId: null, version: Number(element.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() };
    });
    return detached ? next : elements;
  }
  const desired = new Map<string, string | null>();
  const tolerance = 2;
  visible.forEach((element: any) => {
    if (element.type === "text" && element.containerId) return;
    const bounds = elementBounds(element);
    const candidates = frames.filter(({ frame, bounds: frameBounds }) => {
      if (frame.id === element.id) return false;
      if (element.type === "frame" && frameBounds.area <= bounds.area + 1) return false;
      return bounds.left >= frameBounds.left - tolerance && bounds.top >= frameBounds.top - tolerance
        && bounds.right <= frameBounds.right + tolerance && bounds.bottom <= frameBounds.bottom + tolerance;
    }).sort((a, b) => a.bounds.area - b.bounds.area
      || Math.hypot(a.bounds.cx - bounds.cx, a.bounds.cy - bounds.cy) - Math.hypot(b.bounds.cx - bounds.cx, b.bounds.cy - bounds.cy));
    desired.set(String(element.id), candidates[0]?.frame.id || null);
  });
  const byId = new Map(visible.map((element: any) => [String(element.id), element]));
  visible.forEach((element: any) => {
    if (element.type !== "text" || !element.containerId) return;
    const container: any = byId.get(String(element.containerId));
    desired.set(String(element.id), container ? (desired.get(String(container.id)) ?? container.frameId ?? null) : null);
  });
  let changed = false;
  const next = elements.map((element: any) => {
    if (!element || element.isDeleted) return element;
    const frameId = desired.get(String(element.id)) ?? null;
    if ((element.frameId || null) === frameId) return element;
    changed = true;
    return { ...element, frameId, version: Number(element.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() };
  });
  return changed ? next : elements;
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
    const normalizedText = normalizeTextGeometryList(options.scene.elements);
    const framed = reconcileFrameMembership(normalizedText);
    return {
      type: "excalidraw",
      version: 2,
      source: "rtm-v45",
      elements: options.completionRequired === false ? framed : reconcileFrameMembership(ensureRequiredCompletion(framed)),
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
          <div data-rtm-media-id={el.id} className={`rtm-media-overlay kind-${media.kind} ${active ? "is-active" : ""}`} style={overlayStyle(el, viewport, origin)} key={el.id}>
            {!readOnly && <button type="button" className="rtm-media-activate" onClick={() => onActivate(active ? null : el.id)}>{active ? "Вернуться к перемещению" : "▶ Проверить"}</button>}
            {media.kind === "audio" && <audio controls preload="metadata" src={media.url} title={media.title || "Аудио"} />}
            {media.kind === "video" && (/youtube\.com|youtu\.be|rutube\.ru/i.test(media.url)
              ? <iframe src={embedMediaUrl(media.url)} title={media.title || "Видео"} allow="clipboard-write; autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
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

function TestOverlay({ elements, viewport, origin, options }: { elements: readonly any[]; viewport: Viewport; origin: { left: number; top: number }; options: RTMCanvasOptions }) {
  if (options.testMode !== "take" || !options.testDefinition) return null;
  const questions = options.testDefinition.questions || [];
  const byId = new Map(questions.map((question: any) => [String(question.id), question]));
  const answers = options.testAnswers || {};
  const controls = elements.filter((el: any) => !el.isDeleted && el.customData?.rtmTestControl);
  return <div className="rtm-test-layer">{controls.map((el: any) => {
    const binding = el.customData.rtmTestControl || {};
    const question: any = byId.get(String(binding.questionId));
    if (!question) return null;
    const style = overlayStyle(el, viewport, origin);
    if (binding.kind === "free") return <textarea key={el.id} className="rtm-test-free" style={style} aria-label={question.text || "Свободный ответ"} value={String(answers[question.id] || "")} onChange={(event) => options.onTestAnswer?.(String(question.id), event.target.value)} />;
    if (binding.kind === "media") {
      const media = question.media || {};
      if (!media.url) return null;
      if (media.kind === "audio") return <div key={el.id} className="rtm-test-media" style={style}><audio controls preload="metadata" src={media.url} /></div>;
      if (media.kind === "image") return <div key={el.id} className="rtm-test-media" style={style}><img src={media.url} alt={media.title || question.text || "Изображение"} /></div>;
      return <div key={el.id} className="rtm-test-media" style={style}><video controls preload="metadata" src={media.url} /></div>;
    }
    if (binding.kind !== "choice") return null;
    const option = (question.options || []).find((item: any) => String(item.id) === String(binding.optionId));
    if (!option) return null;
    const current = Array.isArray(answers[question.id]) ? answers[question.id].map(String) : [];
    const selected = current.includes(String(option.id));
    const multiple = question.type === "multiple";
    const choose = () => options.onTestAnswer?.(String(question.id), multiple
      ? (selected ? current.filter((id: string) => id !== String(option.id)) : [...current, String(option.id)])
      : (selected ? [] : [String(option.id)]));
    return <button key={el.id} type="button" className={`rtm-test-choice ${selected ? "is-selected" : ""} ${option.image?.url ? "has-image" : ""}`} style={style} aria-pressed={selected} onClick={choose}>
      {option.image?.url && <img src={option.image.url} alt={option.text || "Вариант ответа"} />}
      {!option.image?.url && <span>{option.text || "Вариант ответа"}</span>}
      {selected && <i aria-hidden="true">✓</i>}
    </button>;
  })}</div>;
}

const sceneBounds = (elements: readonly any[]) => {
  const visible = elements.filter((el: any) => !el.isDeleted);
  const frame = visible.find((el: any) => el.type === "frame" && !el.frameId)
    || visible.find((el: any) => el.type === "frame");
  if (frame) return {
    x: Number(frame.x || 0), y: Number(frame.y || 0),
    width: Math.max(1, Number(frame.width || 1)), height: Math.max(1, Number(frame.height || 1)),
    frame,
  };
  if (!visible.length) return { x: 0, y: 0, width: 900, height: 600, frame: null };
  const x = Math.min(...visible.map((el: any) => Number(el.x || 0)));
  const y = Math.min(...visible.map((el: any) => Number(el.y || 0)));
  const right = Math.max(...visible.map((el: any) => Number(el.x || 0) + Number(el.width || 0)));
  const bottom = Math.max(...visible.map((el: any) => Number(el.y || 0) + Number(el.height || 0)));
  return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y), frame: null };
};

const intrinsicStyle = (el: any, bounds: ReturnType<typeof sceneBounds>): React.CSSProperties => ({
  left: Number(el.x || 0) - bounds.x,
  top: Number(el.y || 0) - bounds.y,
  width: Math.max(1, Number(el.customData?.rtmTestControl?.controlWidth || el.width || 1)),
  height: Math.max(1, Number(el.height || 1)),
  transform: `rotate(${Number(el.angle || 0)}rad)`,
});

/**
 * Reader elements and their interactive controls live in one intrinsic scene.
 * Scrolling and zooming therefore move a single layer instead of continuously
 * recalculating a second DOM overlay over the Excalidraw viewport.
 */
function UnifiedReaderSurface({ options }: { options: RTMCanvasOptions }) {
  const scene = useMemo(() => normalizeScene(options), [options.pageKey, options.scene]);
  const elements = scene.elements || [];
  const bounds = useMemo(() => sceneBounds(elements), [elements]);
  const hostRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState("");
  const [baseScale, setBaseScale] = useState(1);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const baseRef = useRef(1);
  const atBaseRef = useRef(true);
  const answers = options.testAnswers || {};
  const questions = options.testDefinition?.questions || [];
  const questionById = useMemo(() => new Map(questions.map((question: any) => [String(question.id), question])), [questions]);

  useEffect(() => {
    let cancelled = false;
    const visible = elements.filter((el: any) => !el.isDeleted) as any[];
    exportToSvg({
      elements: visible,
      appState: {
        ...(scene.appState || {}),
        exportBackground: true,
        exportWithDarkMode: false,
        viewBackgroundColor: String(scene.appState?.viewBackgroundColor || "#f8fafc"),
      } as any,
      files: (scene.files || {}) as any,
      exportingFrame: bounds.frame as any,
      exportPadding: bounds.frame ? 0 : 1,
      renderEmbeddables: true,
    }).then((svg: SVGSVGElement) => {
      if (cancelled) return;
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("preserveAspectRatio", "none");
      setSvgMarkup(svg.outerHTML);
    }).catch(() => { if (!cancelled) setSvgMarkup(""); });
    return () => { cancelled = true; };
  }, [elements, scene.appState, scene.files, bounds.frame]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => {
      const available = Math.max(1, host.clientWidth - 12);
      const nextBase = Math.min(1, available / bounds.width);
      const wasAtBase = atBaseRef.current || Math.abs(scaleRef.current - baseRef.current) < .002;
      baseRef.current = nextBase;
      setBaseScale(nextBase);
      if (wasAtBase) {
        scaleRef.current = nextBase;
        atBaseRef.current = true;
        setScale(nextBase);
        host.scrollLeft = 0;
      } else if (scaleRef.current < nextBase) {
        scaleRef.current = nextBase;
        setScale(nextBase);
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(host);
    return () => observer.disconnect();
  }, [bounds.width, options.pageKey]);

  const setReaderScale = (next: number) => {
    const value = Math.max(baseRef.current, Math.min(3, next));
    scaleRef.current = value;
    atBaseRef.current = Math.abs(value - baseRef.current) < .002;
    setScale(value);
    if (atBaseRef.current && hostRef.current) hostRef.current.scrollLeft = 0;
  };
  const controls = elements.filter((el: any) => !el.isDeleted && el.customData?.rtmTestControl);
  const complete = completionTarget(elements);
  const zoomed = scale > baseScale + .002;

  return <div className="rtm-unified-reader" style={{ "--rtm-reader-scaled-width": `${bounds.width * scale}px` } as React.CSSProperties}>
    <div ref={hostRef} className={`rtm-unified-reader-scroll ${zoomed ? "is-zoomed" : "is-base"}`}>
      <div className="rtm-unified-reader-space" style={{ width: bounds.width * scale, height: bounds.height * scale }}>
        <div className="rtm-unified-reader-scene" style={{ width: bounds.width, height: bounds.height, transform: `scale(${scale})` }}>
          <div className="rtm-unified-reader-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
          {elements.filter((el: any) => !el.isDeleted && el.customData?.rtmMedia).map((el: any) => {
            const media = el.customData.rtmMedia as RTMMediaSpec;
            const style = intrinsicStyle(el, bounds);
            return <div className={`rtm-unified-media kind-${media.kind}`} style={style} key={el.id}>
              {media.kind === "audio" && <audio controls preload="metadata" src={media.url} title={media.title || "Аудио"} />}
              {media.kind === "video" && (/youtube\.com|youtu\.be|rutube\.ru/i.test(media.url)
                ? <iframe src={embedMediaUrl(media.url)} title={media.title || "Видео"} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
                : <video controls preload="metadata" src={media.url} title={media.title || "Видео"} />)}
              {media.kind === "image" && <img src={media.url} alt={media.title || "Изображение"} />}
            </div>;
          })}
          {elements.filter((el: any) => !el.isDeleted && (el.link || el.customData?.rtmAction === "complete-material" || el.id === complete?.id)).map((el: any) => {
            const style = intrinsicStyle(el, bounds);
            if (el.id === complete?.id || isCompleteMarker(el)) return <button type="button" aria-label="Завершить материал" className="rtm-unified-complete-hit" style={style} key={el.id} onClick={() => options.onComplete?.()} />;
            const href = safeHttpsUrl(el.link);
            return href ? <a className="rtm-unified-link-hit" style={style} key={el.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={el.text || "Открыть ссылку"} /> : null;
          })}
          {options.testMode === "take" && controls.map((el: any) => {
            const binding = el.customData.rtmTestControl || {};
            const question: any = questionById.get(String(binding.questionId));
            if (!question) return null;
            const style = intrinsicStyle(el, bounds);
            if (binding.kind === "free") return <textarea key={el.id} className="rtm-unified-test-free" style={style} aria-label={question.text || "Свободный ответ"} value={String(answers[question.id] || "")} onChange={(event) => options.onTestAnswer?.(String(question.id), event.target.value)} />;
            if (binding.kind === "media") {
              const media = question.media || {};
              if (!media.url) return null;
              return <div key={el.id} className="rtm-unified-test-media" style={style}>
                {media.kind === "audio" ? <audio controls preload="metadata" src={media.url} /> : media.kind === "image" ? <img src={media.url} alt={media.title || question.text || "Изображение"} /> : <video controls preload="metadata" src={media.url} />}
              </div>;
            }
            if (binding.kind !== "choice") return null;
            const option = (question.options || []).find((item: any) => String(item.id) === String(binding.optionId));
            if (!option) return null;
            const current = Array.isArray(answers[question.id]) ? answers[question.id].map(String) : [];
            const selected = current.includes(String(option.id));
            const multiple = question.type === "multiple";
            const choose = () => options.onTestAnswer?.(String(question.id), multiple
              ? (selected ? current.filter((id: string) => id !== String(option.id)) : [...current, String(option.id)])
              : (selected ? [] : [String(option.id)]));
            return <button key={el.id} type="button" className={`rtm-unified-test-choice ${selected ? "is-selected" : ""} ${option.image?.url ? "has-image" : ""}`} style={style} aria-pressed={selected} onClick={choose}>
              {option.image?.url && <img src={option.image.url} alt={option.text || "Вариант ответа"} />}
              {selected && <i aria-hidden="true">✓</i>}
            </button>;
          })}
        </div>
      </div>
    </div>
    <div className="rtm-unified-reader-zoom" aria-label="Масштаб материала">
      <button type="button" onClick={() => setReaderScale(scaleRef.current - .15)} disabled={!zoomed} aria-label="Уменьшить">−</button>
      <button type="button" onClick={() => setReaderScale(scaleRef.current + .15)} aria-label="Увеличить">+</button>
      <button type="button" onClick={() => setReaderScale(baseRef.current)} aria-label="Вернуть базовый масштаб"><HandIcon kind="expand" /></button>
    </div>
  </div>;
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

type HandIconKind = "media" | "link" | "upload" | "import" | "expand" | "phone";

function HandIcon({ kind }: { kind: HandIconKind }) {
  const common = { className: "rtm-hand-icon", viewBox: "0 0 28 28", "aria-hidden": true } as const;
  if (kind === "media") return <svg {...common}><circle cx="14" cy="14" r="10.5" /><path d="m11.5 9 7.5 5-7.5 5Z" /></svg>;
  if (kind === "link") return <svg {...common}><circle cx="14" cy="14" r="10.5" /><path d="M14 9v10M9 14h10" /></svg>;
  if (kind === "upload") return <svg {...common}><circle cx="14" cy="14" r="10.5" /><path d="M14 6.5v12M9.5 14l4.5 4.5 4.5-4.5M9 21.5h10" /></svg>;
  if (kind === "import") return <svg {...common}><path d="M10 8.5v-1a4 4 0 0 1 8 0v11a5 5 0 0 1-10 0V8a3 3 0 0 1 6 0v9.5a1.5 1.5 0 0 1-3 0V10" /></svg>;
  if (kind === "phone") return <svg {...common}><rect x="8.5" y="3.5" width="11" height="21" rx="2" /><path d="M12 6h4M13 21.5h2" /></svg>;
  return <svg {...common}><path d="M10 4H4v6M18 4h6v6M10 24H4v-6M18 24h6v-6" /></svg>;
}

function MobilePreview({ scene, onClose }: { scene: RTMScene; onClose: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const bridge = (window as any).RTMV49;
    if (bridge?.renderPreview) bridge.renderPreview(host, scene);
    else host.innerHTML = '<div class="rtm-preview-wait">Подготавливаю мобильный предпросмотр…</div>';
  }, [scene]);
  return <div className="rtm-mobile-preview-backdrop" role="dialog" aria-label="Мобильный предпросмотр">
    <div className="rtm-mobile-preview-panel">
      <div className="rtm-mobile-preview-head"><b>Мобильный предпросмотр</b><button type="button" onClick={onClose}>×</button></div>
      <div className="rtm-mobile-preview-phone"><div ref={hostRef} /></div>
    </div>
  </div>;
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
  const readerBaseZoomRef = useRef(0);
  const readerBaseScrollXRef = useRef(0);
  const readerClampRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const fontTriggerRef = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState({ left: 0, top: 0 });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [saveState, setSaveState] = useState("");
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [captureShortcuts, setCaptureShortcuts] = useState(false);
  const [selectedFont, setSelectedFont] = useState<number>(decodeStyledFont(Number(initialAppState.currentItemFontFamily || 5)).base);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [fontMenuPosition, setFontMenuPosition] = useState({ left: 0, top: 0, maxHeight: 360 });
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [, setSettingsRevision] = useState(0);
  const changed = useRef(false);
  const readOnly = Boolean(options.readOnly);
  const brand = options.brandColor || "#7c3aed";
  const shortcutsActive = !readOnly && (editorFullscreen || captureShortcuts);

  useEffect(() => {
    if (readOnly || !options.scene?.elements?.length || !options.onChange) return;
    const source = new Map(options.scene.elements.map((element: any) => [String(element.id), element]));
    const repaired = (initial.elements || []).some((element: any) => {
      const original: any = source.get(String(element.id));
      return original && ((original.frameId || null) !== (element.frameId || null) || Number(original.height || 0) !== Number(element.height || 0));
    });
    if (!repaired) return;
    changed.current = true;
    options.onChange(initial);
  }, [options.pageKey]);

  useEffect(() => {
    if (!fontMenuOpen) return;
    const update = () => {
      const rect = fontTriggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 210;
      const roomBelow = window.innerHeight - rect.bottom - 10;
      const roomAbove = rect.top - 10;
      const openAbove = roomBelow < 210 && roomAbove > roomBelow;
      const maxHeight = Math.max(140, Math.min(420, openAbove ? roomAbove : roomBelow));
      setFontMenuPosition({
        left: Math.max(8, Math.min(window.innerWidth - width - 8, rect.left)),
        top: openAbove ? Math.max(8, rect.top - maxHeight - 4) : rect.bottom + 4,
        maxHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [fontMenuOpen, editorFullscreen]);

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
    api.updateScene({ elements: next, appState: { currentItemFontFamily: nextCurrent }, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
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
    api.updateScene({ elements: next, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
  };

  const decorateText = (mark: "underline" | "strike") => {
    const selected = selectedTextElements();
    if (!selected.length) { window.alert("\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0432\u044b\u0434\u0435\u043b\u0438\u0442\u0435 \u0442\u0435\u043a\u0441\u0442"); return; }
    const code = mark === "underline" ? "\u0332" : "\u0336";
    const turnOn = selected.some((el: any) => !String(el.text || "").includes(code));
    transformSelectedText((text) => Array.from(text.replace(new RegExp(code, "g"), "")).map((char) => {
      if (char === "\n") return char;
      return turnOn ? char + code : char;
    }).join(""));
  };
  const makeList = (ordered: boolean) => transformSelectedText((text) => {
    const lines = text.split("\n");
    const matcher = ordered ? /^\s*\d+\.\s+/ : /^\s*•\s+/;
    const remove = lines.filter((line) => line.trim()).every((line) => matcher.test(line));
    return lines.map((line, index) => {
      const clean = line.replace(/^\s*(?:•|\d+\.)\s*/, "");
      return remove ? clean : `${ordered ? `${index + 1}.` : "•"} ${clean}`;
    }).join("\n");
  });

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
    window.addEventListener("scroll", updateOrigin, true);
    document.addEventListener("fullscreenchange", updateOrigin);
    requestAnimationFrame(updateOrigin);
    setTimeout(updateOrigin, 180);
    const saveListener = (event: Event) => { const detail = (event as CustomEvent).detail; if (detail?.pageKey === options.pageKey) setSaveState(detail.text || ""); };
    const insertListener = (event: Event) => { const detail = (event as CustomEvent).detail; if (!detail?.pageKey || detail.pageKey === options.pageKey) insertComplete(); };
    window.addEventListener("rtm-canvas-save-state", saveListener);
    window.addEventListener("rtm-canvas-insert-complete", insertListener);
    return () => { observer?.disconnect(); window.removeEventListener("resize", updateOrigin); window.removeEventListener("scroll", updateOrigin, true); document.removeEventListener("fullscreenchange", updateOrigin); window.removeEventListener("rtm-canvas-save-state", saveListener); window.removeEventListener("rtm-canvas-insert-complete", insertListener); if (viewportFrameRef.current) cancelAnimationFrame(viewportFrameRef.current); if (overlayFrameRef.current) cancelAnimationFrame(overlayFrameRef.current); };
  }, [options.pageKey, editorFullscreen, activeMediaId]);

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
    api.updateScene({ elements: reconcileFrameMembership([...api.getSceneElements(), ...next]), captureUpdate: CaptureUpdateAction.IMMEDIATELY });
    setDialog(null);
  };

  const importScene = (data: any) => {
    const api = apiRef.current;
    if (!api || !Array.isArray(data?.elements)) return false;
    const existing = api.getSceneElements();
    const incoming = data.elements.filter((el: any) => el && el.id && !el.isDeleted).map((el: any) => typeof structuredClone === "function" ? structuredClone(el) : JSON.parse(JSON.stringify(el))) as any[];
    if (!incoming.length) return false;
    const idMap = new Map<string, string>(incoming.map((el: any) => [String(el.id), elementId()]));
    const groupMap = new Map<string, string>();
    incoming.forEach((el: any) => (el.groupIds || []).forEach((id: string) => { if (!groupMap.has(id)) groupMap.set(id, elementId()); }));
    const fileMap = new Map<string, string>(Object.keys(data.files || {}).map((id) => [id, elementId()]));
    incoming.forEach((el: any, index: number) => {
      const oldId = String(el.id);
      el.id = idMap.get(oldId);
      el.groupIds = (el.groupIds || []).map((id: string) => groupMap.get(id) || id);
      el.frameId = el.frameId ? idMap.get(String(el.frameId)) || null : null;
      el.containerId = el.containerId ? idMap.get(String(el.containerId)) || null : null;
      el.boundElements = (el.boundElements || []).map((item: any) => ({ ...item, id: idMap.get(String(item.id)) })).filter((item: any) => item.id);
      if (el.startBinding?.elementId) el.startBinding = { ...el.startBinding, elementId: idMap.get(String(el.startBinding.elementId)) || null };
      if (el.endBinding?.elementId) el.endBinding = { ...el.endBinding, elementId: idMap.get(String(el.endBinding.elementId)) || null };
      if (el.fileId && fileMap.has(String(el.fileId))) el.fileId = fileMap.get(String(el.fileId));
      el.seed = Math.floor(Math.random() * 2147483647);
      el.versionNonce = Math.floor(Math.random() * 2147483647);
      el.updated = Date.now();
      incoming[index] = normalizeTextGeometry(el);
    });
    const appState = api.getAppState();
    const rect = stageRef.current?.getBoundingClientRect();
    const zoom = Number(appState.zoom?.value || appState.zoom || 1);
    const minX = Math.min(...incoming.map((el: any) => Number(el.x || 0)));
    const minY = Math.min(...incoming.map((el: any) => Number(el.y || 0)));
    const maxX = Math.max(...incoming.map((el: any) => Number(el.x || 0) + Number(el.width || 0)));
    const maxY = Math.max(...incoming.map((el: any) => Number(el.y || 0) + Number(el.height || 0)));
    const pointer = lastPointerRef.current;
    const sceneX = pointer && rect
      ? (pointer.x - rect.left - Number(appState.offsetLeft || 0)) / zoom - Number(appState.scrollX || 0)
      : ((rect?.width || 900) / 2 - Number(appState.offsetLeft || 0)) / zoom - Number(appState.scrollX || 0);
    const sceneY = pointer && rect
      ? (pointer.y - rect.top - Number(appState.offsetTop || 0)) / zoom - Number(appState.scrollY || 0)
      : ((rect?.height || 600) / 2 - Number(appState.offsetTop || 0)) / zoom - Number(appState.scrollY || 0);
    const dx = sceneX - (minX + maxX) / 2;
    const dy = sceneY - (minY + maxY) / 2;
    incoming.forEach((el: any) => { el.x = Number(el.x || 0) + dx; el.y = Number(el.y || 0) + dy; });
    if (data.files) api.addFiles?.(Object.entries(data.files).map(([id, file]: [string, any]) => ({ ...file, id: fileMap.get(id) || id })) as any);
    api.updateScene({ elements: reconcileFrameMembership([...existing, ...incoming]), appState: { selectedElementIds: Object.fromEntries(incoming.map((el: any) => [el.id, true])) }, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
    api.scrollToContent?.(incoming, { fitToContent: false });
    setSaveState("Макет вставлен — черновик будет сохранён автоматически");
    return true;
  };

  const parseClipboardScene = (raw: string) => {
    const source = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const candidates = [source];
    const start = source.indexOf("{");
    const end = source.lastIndexOf("}");
    if (start > 0 && end > start) candidates.push(source.slice(start, end + 1));
    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed?.type === "excalidraw/clipboard" || parsed?.type === "excalidraw" || Array.isArray(parsed?.elements)) return parsed;
      } catch { /* try the next representation */ }
    }
    return null;
  };
  const copySelectionToInternalClipboard = async () => {
    const api = apiRef.current; if (!api) return;
    const selectedIds = api.getAppState().selectedElementIds || {};
    const selected = api.getSceneElements().filter((el: any) => !el.isDeleted && selectedIds[el.id]);
    if (!selected.length) { window.alert("Сначала выделите объекты"); return; }
    const ids = new Set(selected.map((el: any) => el.fileId).filter(Boolean));
    const allFiles = api.getFiles?.() || {};
    const files = Object.fromEntries(Object.entries(allFiles).filter(([fileId]) => ids.has(fileId)));
    const raw = JSON.stringify({ type: "excalidraw/clipboard", elements: selected, files });
    try { sessionStorage.setItem("rtm_excalidraw_clipboard", raw); } catch { /* memory-only environments */ }
    try { await navigator.clipboard.writeText(raw); setSaveState("Скопировано"); }
    catch { setSaveState("Скопировано во внутренний буфер RTM"); }
  };
  const pasteFromInternalClipboard = () => {
    let raw = ""; try { raw = sessionStorage.getItem("rtm_excalidraw_clipboard") || ""; } catch { /* blocked storage */ }
    const parsed = parseClipboardScene(raw);
    if (parsed && importScene(parsed)) return;
    const manual = window.prompt("Bitrix24 запретил чтение системного буфера. Вставьте Excalidraw JSON сюда сочетанием Ctrl+V:");
    const manualScene = manual && parseClipboardScene(manual); if (manualScene) importScene(manualScene);
  };

  const insertComplete = () => {
    const api = apiRef.current;
    if (!api) return;
    const existing = completionTarget(api.getSceneElements());
    if (existing) { api.updateScene({ appState: { selectedElementIds: { [existing.id]: true } }, captureUpdate: CaptureUpdateAction.NEVER }); api.scrollToContent?.([existing], { fitToContent: false }); return; }
    const created = createRequiredCompletion(api.getSceneElements());
    const selectedElementIds = Object.fromEntries(created.map((el: any) => [el.id, true]));
    api.updateScene({ elements: reconcileFrameMembership([...api.getSceneElements(), ...created]), appState: { selectedElementIds }, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
    api.scrollToContent?.(created, { fitToContent: false });
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

  const syncMediaOverlayPositions = (nextElements: readonly any[], nextViewport: Viewport) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const byId = new Map(nextElements.filter((el: any) => !el.isDeleted && el.customData?.rtmMedia).map((el: any) => [String(el.id), el]));
    stage.querySelectorAll<HTMLElement>("[data-rtm-media-id]").forEach((node) => {
      const el = byId.get(String(node.dataset.rtmMediaId || ""));
      if (!el) return;
      const style = overlayStyle(el, nextViewport, { left: rect.left, top: rect.top });
      node.style.left = `${Number(style.left || 0)}px`;
      node.style.top = `${Number(style.top || 0)}px`;
      node.style.width = `${Number(style.width || 0)}px`;
      node.style.height = `${Number(style.height || 0)}px`;
      node.style.transform = String(style.transform || "");
    });
  };

  const save = async () => {
    setSaveState("Сохраняю…");
    try { await options.onManualSave?.(); changed.current = false; setSaveState(""); }
    catch { setSaveState("Сохранено на устройстве — ожидаю Bitrix24"); }
  };
  const toggleAppSetting = (key: string) => {
    const api = apiRef.current; if (!api) return;
    const appState = api.getAppState(); api.updateScene({ appState: { [key]: !Boolean(appState[key]) }, captureUpdate: CaptureUpdateAction.NEVER }); setSettingsRevision((value) => value + 1);
  };
  const toggleToolLock = () => {
    const api = apiRef.current; if (!api) return;
    const appState = api.getAppState(), activeTool = appState.activeTool || { type: "selection" };
    api.updateScene({ appState: { activeTool: { ...activeTool, locked: !Boolean(activeTool.locked) } }, captureUpdate: CaptureUpdateAction.NEVER }); setSettingsRevision((value) => value + 1);
  };
  const settingMark = (key: string) => apiRef.current?.getAppState?.()[key] ? "✓ " : "";
  const toggleSelectionMode = () => {
    const api = apiRef.current; if (!api) return; const current = api.getAppState().selectionMode || "wrap";
    api.updateScene({ appState: { selectionMode: current === "overlap" ? "wrap" : "overlap" }, captureUpdate: CaptureUpdateAction.NEVER }); setSettingsRevision((value) => value + 1);
  };

  const readerTargetElements = () => {
    const all = apiRef.current?.getSceneElements?.().filter((el: any) => !el.isDeleted) || [];
    const frames = all.filter((el: any) => el.type === "frame" && !el.frameId);
    return frames.length ? frames : all;
  };
  const fitReader = (animate = true) => {
    const api = apiRef.current;
    if (!api) return;
    const target = readerTargetElements();
    if (!target.length) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const minX = Math.min(...target.map((el: any) => Number(el.x || 0)));
    const minY = Math.min(...target.map((el: any) => Number(el.y || 0)));
    const maxX = Math.max(...target.map((el: any) => Number(el.x || 0) + Number(el.width || 0)));
    const width = Math.max(1, maxX - minX);
    const mobile = rect.width <= 800;
    const readableWidth = Math.max(260, Math.min(mobile ? rect.width - 18 : 620, rect.width - (mobile ? 18 : 80)));
    // Base scale is always width-driven: tall frames stay readable and scroll
    // vertically, while genuinely wide frames still fit without base panning.
    const zoom = Math.max(0.08, Math.min(2, readableWidth / width));
    const state = api.getAppState();
    const offsetLeft = Number(state.offsetLeft || 0), offsetTop = Number(state.offsetTop || 0);
    const left = Math.max(8, (rect.width - width * zoom) / 2);
    const top = mobile ? 10 : 14;
    const scrollX = (left - offsetLeft) / zoom - minX;
    const scrollY = (top - offsetTop) / zoom - minY;
    readerBaseZoomRef.current = zoom;
    readerBaseScrollXRef.current = scrollX;
    api.updateScene({ appState: { zoom: { value: zoom }, scrollX, scrollY }, captureUpdate: CaptureUpdateAction.NEVER });
  };
  const readerZoom = (direction: number) => {
    const api = apiRef.current;
    if (!api) return;
    const appState = api.getAppState();
    const current = Number(appState.zoom?.value || appState.zoom || 1);
    const base = readerBaseZoomRef.current || current;
    const value = Math.max(base, Math.min(Math.max(4, base * 8), current + direction * Math.max(base * 0.15, current * 0.15)));
    api.updateScene({ appState: { zoom: { value } }, captureUpdate: CaptureUpdateAction.NEVER });
  };
  const readerFit = () => fitReader(true);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (readOnly) return;
      const target = event.target as HTMLElement | null;
      const editingText = Boolean(target?.closest("input,textarea,select,[contenteditable=true]"));
      if (!stageRef.current?.contains(target)) return;
      const raw = (event.clipboardData?.getData("application/vnd.excalidraw+json") || event.clipboardData?.getData("application/json") || event.clipboardData?.getData("text/plain") || "").trim();
      if (!raw) return;
      const data = parseClipboardScene(raw);
      if (data) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        importScene(data);
        return;
      }
      if (!editingText && stageRef.current?.contains(target) && /^https?:\/\/\S+$/i.test(raw)) { event.preventDefault(); event.stopImmediatePropagation(); addMedia({ kind: "link", url: raw, title: raw }); }
    };
    window.addEventListener("paste", onPaste, true);
    return () => window.removeEventListener("paste", onPaste, true);
  }, [readOnly, options.pageKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!shortcutsActive) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input,textarea,select,[contenteditable=true]") && !target.closest("[data-type=wysiwyg]")) return;
      if ((event.key === "Delete" || event.key === "Backspace") && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const api = apiRef.current;
        const ids = api?.getAppState?.().selectedElementIds || {};
        if (!Object.keys(ids).some((id) => ids[id])) return;
        const current = api.getSceneElements();
        const protectedSelected = current.some((el: any) => ids[el.id] && el.customData?.rtmProtectedCompletion);
        // Normal deletions stay native: Excalidraw correctly handles groups,
        // bindings, frame descendants and its own undo/redo history.
        if (!protectedSelected) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const deleteIds = new Set(current.filter((el: any) => ids[el.id] && !el.customData?.rtmProtectedCompletion).map((el: any) => String(el.id)));
        let expanded = true;
        while (expanded) {
          expanded = false;
          current.forEach((el: any) => {
            if (!el.isDeleted && !el.customData?.rtmProtectedCompletion && !deleteIds.has(String(el.id))
              && ((el.frameId && deleteIds.has(String(el.frameId))) || (el.containerId && deleteIds.has(String(el.containerId))))) {
              deleteIds.add(String(el.id)); expanded = true;
            }
          });
        }
        if (!deleteIds.size) return;
        const next = current.map((el: any) => deleteIds.has(String(el.id))
          ? { ...el, isDeleted: true, version: Number(el.version || 1) + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() }
          : el);
        api.updateScene({ elements: next, appState: { selectedElementIds: {} }, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
        return;
      }
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "z" || key === "y") {
        const redo = key === "y" || event.shiftKey;
        const button = stageRef.current?.querySelector<HTMLButtonElement>(redo
          ? ".undo-redo-buttons .redo-button-container button"
          : ".undo-redo-buttons .undo-button-container button");
        if (!button || button.disabled) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        button.click();
      } else if (key === "b" || key === "i") {
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
      {!readOnly && <div className="rtm-canvas-toolbar rtm-hand-toolbar" aria-label="RTM контент">
        <button type="button" className="rtm-text-style" title="Жирный текст (Ctrl+B)" onClick={() => toggleTextStyle("bold")}><b>B</b></button>
        <button type="button" className="rtm-text-style" title="Курсив (Ctrl+I)" onClick={() => toggleTextStyle("italic")}><i>I</i></button>
        <button type="button" className="rtm-text-style" title="Подчёркнутый текст" onClick={() => decorateText("underline")}><u>U</u></button>
        <button type="button" className="rtm-text-style" title="Зачёркнутый текст" onClick={() => decorateText("strike")}><s>S</s></button>
        <div className="rtm-font-select rtm-icon-control" title="Список шрифтов">
          <button ref={fontTriggerRef} type="button" className="rtm-font-trigger" aria-haspopup="listbox" aria-expanded={fontMenuOpen} style={{ fontFamily: fontCssFamily(selectedFont) }} onClick={() => setFontMenuOpen((value) => !value)}>{fontCssFamily(selectedFont)} <span>▾</span></button>
          {fontMenuOpen && createPortal(<div className="rtm-font-options rtm-font-options-portal" role="listbox" style={{ left: fontMenuPosition.left, top: fontMenuPosition.top, maxHeight: fontMenuPosition.maxHeight }}>
            <b>Штатные Excalidraw</b>{EXCALIDRAW_FONT_OPTIONS.map(([name, id]) => <button type="button" role="option" aria-selected={selectedFont === id} key={id} style={{ fontFamily: name }} onClick={() => { applyFont(id); setFontMenuOpen(false); }}>{name}</button>)}
            <b>Шрифты RTM</b>{RTM_FONT_OPTIONS.map(([name, id]) => <button type="button" role="option" aria-selected={selectedFont === id} key={id} style={{ fontFamily: name }} onClick={() => { applyFont(id); setFontMenuOpen(false); }}>{name}</button>)}
          </div>, document.body)}
        </div>
        <button type="button" title="Маркированный список" onClick={() => makeList(false)}><span className="rtm-hand-list">▪<i></i>▪<i></i>▪<i></i></span></button>
        <button type="button" title="Нумерованный список" onClick={() => makeList(true)}><span className="rtm-hand-list numbered">1<i></i>2<i></i>3<i></i></span></button>
        <button type="button" className="rtm-hand-circle" title="Ссылка на видео или аудио" onClick={requestMediaUrl}><HandIcon kind="media" /></button>
        <button type="button" className="rtm-hand-circle" title="Файл с ПК или Bitrix.Диска" onClick={() => requestDisk("image")}><HandIcon kind="link" /></button>
        <label className="rtm-canvas-import rtm-hand-circle" title="Импорт макета .excalidraw"><HandIcon kind="upload" /><input type="file" accept=".excalidraw,application/json" onChange={(event) => { handleImportFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
        <button type="button" className="rtm-hand-circle" title="Добавить ссылку с названием" onClick={() => setDialog({ kind: "link", source: "url" })}><HandIcon kind="import" /></button>
        <button type="button" className="rtm-hand-expand" title={editorFullscreen ? "Свернуть" : "Развернуть редактор"} aria-pressed={editorFullscreen} onClick={() => setEditorFullscreen((value) => !value)}><HandIcon kind="expand" /></button>
        <button type="button" className="rtm-mobile-preview-open" title="Мобильный предпросмотр" onClick={() => setMobilePreview(true)}><HandIcon kind="phone" /></button>
        <button type="button" className="rtm-canvas-save" onClick={save}>Сохранить статью</button>
        {saveState && <span className={`rtm-canvas-save-state ${saveState.includes("Ошибка") || saveState.includes("ожидаю") ? "is-error" : ""}`}>{saveState}</span>}
      </div>}
      {mobilePreview && <MobilePreview scene={{ type: "excalidraw", version: 2, source: "rtm-v49-preview", elements: [...elements], appState: apiRef.current?.getAppState?.() || initial.appState || {}, files: initial.files || {} }} onClose={() => setMobilePreview(false)} />}
      <div className="rtm-canvas-stage" ref={stageRef} tabIndex={-1} onPointerMove={(event) => { lastPointerRef.current = { x: event.clientX, y: event.clientY }; }} onPointerDown={(event) => { lastPointerRef.current = { x: event.clientX, y: event.clientY }; setCaptureShortcuts(true); stageRef.current?.focus({ preventScroll: true }); }}>
        <Excalidraw
          key={options.pageKey}
          excalidrawAPI={(nextApi: any) => {
            apiRef.current = nextApi;
            if (readOnly && options.fitToContent) requestAnimationFrame(() => fitReader(false));
          }}
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
              const normalizedText = normalizeTextGeometryList(nextElements);
              if (normalizedText !== nextElements) { apiRef.current?.updateScene({ elements: normalizedText, captureUpdate: CaptureUpdateAction.NEVER }); return; }
              const protectedElements = options.completionRequired === false ? nextElements : protectRequiredCompletion(nextElements, lastSceneElementsRef.current);
              if (protectedElements !== nextElements) { apiRef.current?.updateScene({ elements: protectedElements, captureUpdate: CaptureUpdateAction.NEVER }); return; }
              const interacting = Boolean(nextAppState.selectedElementsAreBeingDragged || nextAppState.resizingElement || nextAppState.draggingElement || nextAppState.newElement || nextAppState.editingTextElement);
              if (!interacting) {
                const framedElements = reconcileFrameMembership(nextElements);
                if (framedElements !== nextElements) { apiRef.current?.updateScene({ elements: framedElements, captureUpdate: CaptureUpdateAction.NEVER }); return; }
              }
              lastSceneElementsRef.current = protectedElements;
              const currentBaseFont = decodeStyledFont(Number(nextAppState.currentItemFontFamily || 5)).base;
              if (currentBaseFont !== selectedFont) setSelectedFont(currentBaseFont);
              const completion = nextElements.filter(isCompleteMarker);
              if (completion.length > 1) {
                const duplicateIds = new Set(completion.slice(1).flatMap((el: any) => el.groupIds?.length ? el.groupIds : [el.id]));
                const normalized = nextElements.map((el: any) => !el.isDeleted && (duplicateIds.has(el.id) || el.groupIds?.some((id: string) => duplicateIds.has(id))) ? { ...el, isDeleted: true, version: Number(el.version || 1) + 1 } : el);
                apiRef.current?.updateScene({ elements: normalized, captureUpdate: CaptureUpdateAction.NEVER });
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
                options.onChange?.({ type: "excalidraw", version: 2, source: "rtm-v45", elements: options.completionRequired === false ? nextElements : ensureRequiredCompletion(nextElements), appState: { viewBackgroundColor: nextAppState.viewBackgroundColor, scrollX: nextAppState.scrollX, scrollY: nextAppState.scrollY, zoom: nextAppState.zoom, gridSize: nextAppState.gridSize }, files });
              }
            }
            const nextViewport: Viewport = { zoom: Number(nextAppState.zoom?.value || nextAppState.zoom || 1), left: Number(nextAppState.offsetLeft || 0), top: Number(nextAppState.offsetTop || 0), sx: Number(nextAppState.scrollX || 0), sy: Number(nextAppState.scrollY || 0) };
            if (readOnly && readerBaseZoomRef.current > 0 && nextViewport.zoom + 0.0001 < readerBaseZoomRef.current && !readerClampRef.current) {
              readerClampRef.current = true;
              apiRef.current?.updateScene({ appState: { zoom: { value: readerBaseZoomRef.current } }, captureUpdate: CaptureUpdateAction.NEVER });
              requestAnimationFrame(() => { readerClampRef.current = false; });
              return;
            }
            if (readOnly && readerBaseZoomRef.current > 0 && nextViewport.zoom <= readerBaseZoomRef.current + 0.0001 && Math.abs(nextViewport.sx - readerBaseScrollXRef.current) > 0.01 && !readerClampRef.current) {
              readerClampRef.current = true;
              apiRef.current?.updateScene({ appState: { scrollX: readerBaseScrollXRef.current }, captureUpdate: CaptureUpdateAction.NEVER });
              requestAnimationFrame(() => { readerClampRef.current = false; });
              return;
            }
            syncMediaOverlayPositions(nextElements, nextViewport);
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
            <MainMenu.DefaultItems.SearchMenu />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.Separator />
            <MainMenu.Item onSelect={toggleSelectionMode}>Выбор: {apiRef.current?.getAppState?.().selectionMode === "overlap" ? "Overlap" : "Wrap"}</MainMenu.Item>
            <MainMenu.Item onSelect={toggleToolLock}>{apiRef.current?.getAppState?.().activeTool?.locked ? "✓ " : ""}Закрепить инструмент</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("objectsSnapModeEnabled")}>{settingMark("objectsSnapModeEnabled")}Привязка к объектам</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("gridModeEnabled")}>{settingMark("gridModeEnabled")}Переключить сетку</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("zenModeEnabled")}>{settingMark("zenModeEnabled")}Режим «Дзен»</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("viewModeEnabled")}>{settingMark("viewModeEnabled")}Режим просмотра</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("isBindingEnabled")}>{settingMark("isBindingEnabled")}Привязка стрелок</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("snapToCenter")}>{settingMark("snapToCenter")}Привязка к средней точке</MainMenu.Item>
            <MainMenu.Item onSelect={() => toggleAppSetting("showStats")}>{settingMark("showStats")}Свойства холста и фигур</MainMenu.Item>
            <MainMenu.Separator />
            <MainMenu.Item onSelect={copySelectionToInternalClipboard}>Копировать в буфер RTM</MainMenu.Item>
            <MainMenu.Item onSelect={pasteFromInternalClipboard}>Вставить из буфера RTM</MainMenu.Item>
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
        <TestOverlay elements={elements} viewport={viewport} origin={origin} options={options} />
        <ActionOverlay elements={elements} viewport={viewport} origin={origin} readOnly={readOnly} onComplete={options.onComplete} />
        {readOnly && <div className="rtm-reader-zoom" aria-label="Масштаб статьи"><button type="button" onClick={() => readerZoom(-1)} aria-label="Уменьшить">−</button><button type="button" onClick={() => readerZoom(1)} aria-label="Увеличить">+</button><button type="button" onClick={readerFit} aria-label="Вписать в экран"><HandIcon kind="expand" /></button></div>}
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
    root.render(options.readOnly
      ? <UnifiedReaderSurface key={options.pageKey} options={options} />
      : <RTMCanvasApp key={options.pageKey} options={options} />);
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
