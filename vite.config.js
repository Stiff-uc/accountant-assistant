import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@vitejs/plugin-vue'],
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
