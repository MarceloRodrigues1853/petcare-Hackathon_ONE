import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <-- IMPORTANTE: Adicione esta linha

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // =======================================================
  // INÍCIO DA CORREÇÃO: Bloco de configuração do Alias
  // =======================================================
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // =======================================================
  // FIM DA CORREÇÃO
  // =======================================================

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
  },
})