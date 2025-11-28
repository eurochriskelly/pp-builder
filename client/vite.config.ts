import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/event': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/planning': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/execution': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/chronicle': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/scripts': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      },
      '/styles': {
        target: 'http://localhost:5421',
        changeOrigin: true,
      }
    }
  }
})
