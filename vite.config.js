import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Sadece '/stats' ve '/currentlyPlaying' ile başlayan istekleri proxy'le
      '/stats': {
        target: 'http://api.ibrahimhalilsezgin.fun',
        changeOrigin: true,
        secure: false,
      },
      '/currentlyPlaying': {
        target: 'http://api.ibrahimhalilsezgin.fun',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

