// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // proxyea todo /api a tu backend en localhost:5000
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
    // explícitamente expón el host y HMR
    host: "localhost",
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
