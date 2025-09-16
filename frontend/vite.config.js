import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      // CORREÇÃO: Apontando para o NOME DO SERVIÇO ('backend') definido no docker-compose.yml
      "/api": { target: "http://backend:8080", changeOrigin: true },
    },
    watch: { usePolling: true },
  },
});

