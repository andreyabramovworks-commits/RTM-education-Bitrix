export const RELEASE_VERSION = "53.1.9";
export const RELEASE_ASSET_REVISION = "53.1.9-r12";

export const LEGACY_STYLES = [
  "/legacy/runtime-core.css",
  "/legacy/assignment-picker.css",
  "/legacy/knowledge.css",
  "/legacy/acknowledgements.css",
];

export const LEGACY_SCRIPTS = [
  ["/legacy/runtime-core.js", false],
  ["/legacy/assignment-picker.js", false],
  ["/legacy/api.js", false],
  ["/legacy/learning.js", false],
  ["/legacy/knowledge.js", false],
  ["/legacy/acknowledgements.js", false],
  ["/legacy/material-session.js", false],
];

export const CANVAS_STYLES = ["/legacy/excalidraw-dist/rtm-canvas.css"];
export const CANVAS_SCRIPTS = [
  ["/legacy/excalidraw-dist/rtm-canvas.js", true],
  ["/legacy/scene-migrations.js", false],
  ["/legacy/canvas.js", false],
];

export const releaseAsset = (path) => path + "?v=" + RELEASE_ASSET_REVISION;
