import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => ({
  base: '/app/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self' https://*.supabase.co https://maneblod.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://*.supabase.co https://maneblod.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co https://maneblod.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.cohere.ai https://api.anthropic.com https://generativelanguage.googleapis.com https://maneblod.com; frame-src 'self' https://*.supabase.co https://maneblod.com;"
    }
  }
}))