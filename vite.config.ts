import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true, // Pour Replit
    proxy: {
      '/api/intuition': {
        target: 'https://api.intuition-testnet.gelato.digital',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/intuition/, ''),
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@base-org/account', '@base-org/blockchain']
  },
  esbuild: {
    target: 'es2020',
    supported: {
      'import-assertions': false
    }
  }
})
