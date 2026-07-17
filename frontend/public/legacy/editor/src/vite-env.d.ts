/// <reference types="vite/client" />

interface Window {
  EXCALIDRAW_ASSET_PATH?: string;
  RTMCanvas?: import("./main").RTMCanvasBridge;
}
