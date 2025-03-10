import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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