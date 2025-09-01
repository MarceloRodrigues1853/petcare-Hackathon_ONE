import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // expõe no host (0.0.0.0), útil em Docker
    port: 5173,
    proxy: {
      // qualquer chamada que começar com /api será redirecionada para o backend
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
