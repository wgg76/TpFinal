// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Todo lo que vaya a /api/* se pasa a http://localhost:5000/api/*
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
        // no hace falta rewrite porque tu backend ya monta en /api
      },
    },
    host: "localhost",
    hmr: { protocol: "ws", host: "localhost", port: 5173 },
  },
});
