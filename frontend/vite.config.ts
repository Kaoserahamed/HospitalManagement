import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: ['/auth', '/departments', '/appointments', '/schedules', '/patients', '/prescriptions'].reduce(
      (proxies, path) => ({
        ...proxies,
        [path]: {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      }),
      {},
    ),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
