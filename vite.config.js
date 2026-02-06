import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // Optimizar chunks para mejor caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor (dependencias) del código de la app
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'axios-vendor': ['axios'],
        }
      }
    },
    // Reducir el tamaño de chunks
    chunkSizeWarningLimit: 1000,
    // Optimizar CSS
    cssCodeSplit: true,
    // Minificar
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
        drop_debugger: true
      }
    }
  },
  // Optimizar dependencias
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios']
  }
})
