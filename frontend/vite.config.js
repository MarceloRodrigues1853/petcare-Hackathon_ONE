import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // A sua configuração de porta
    port: 5173,
    
    // A sua configuração de proxy (mantida)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },

    // A nova configuração para forçar o hot-reloading no Docker
    watch: {
      usePolling: true,
    },
  },
})