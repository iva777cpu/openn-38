import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/app/',
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Content-Security-Policy': "default-src 'self' https://*.supabase.co https://maneblod.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co https://*.supabase.co https://maneblod.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co https://maneblod.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com https://api.cohere.ai https://api.anthropic.com https://generativelanguage.googleapis.com https://maneblod.com; frame-src 'self' https://*.supabase.co https://maneblod.com;"
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            'lucide-react'
          ],
          ui: [
            '@/components/ui/button',
            '@/components/ui/dialog',
            '@/components/ui/input',
            '@/components/ui/select',
            '@/components/ui/card',
            '@/components/ui/form'
          ]
        }
      }
    }
  }
}));