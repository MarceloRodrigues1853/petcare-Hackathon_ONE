import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // =======================================================
    // A CORREÇÃO FINAL ESTÁ AQUI
    // =======================================================
    proxy: {
      // Mantém a regra existente para todos os endpoints /api
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
      // ADICIONA uma nova regra específica para o endpoint /pets
      '/pets': {
        target: 'http://backend:8080',
        changeOrigin: true,
      }
    },
    // =======================================================
    watch: {
      usePolling: true,
    },
  },
})