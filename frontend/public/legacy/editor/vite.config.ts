import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../excalidraw-dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: "src/main.tsx",
      name: "RTMCanvas",
      formats: ["es"],
      fileName: () => "rtm-canvas.js"
    },
    rollupOptions: {
      output: {
        assetFileNames: "rtm-canvas.[ext]"
      }
    }
  }
});
