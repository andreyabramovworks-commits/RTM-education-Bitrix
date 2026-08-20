export const RELEASE_VERSION = "53.0.18";
export const RELEASE_ASSET_REVISION = "53.0.18-r1";

export const LEGACY_STYLES = [
  "/legacy/runtime-core.css",
  "/legacy/knowledge.css",
  "/legacy/acknowledgements.css",
  "/legacy/release-53-0-18.css",
];

export const LEGACY_SCRIPTS = [
  ["/legacy/runtime-core.js", false],
  ["/legacy/api.js", false],
  ["/legacy/learning.js", false],
  ["/legacy/knowledge.js", false],
  ["/legacy/acknowledgements.js", false],
  ["/legacy/release-53-0-18.js", false],
];

export const CANVAS_STYLES = ["/legacy/excalidraw-dist/rtm-canvas.css"];
export const CANVAS_SCRIPTS = [
  ["/legacy/excalidraw-dist/rtm-canvas.js", true],
  ["/legacy/canvas.js", false],
];

export const releaseAsset = (path) => path + "?v=" + RELEASE_ASSET_REVISION;
