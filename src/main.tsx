import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

const root = document.getElementById("root")!;
if (root) {
  root.className = "min-h-screen bg-background text-foreground";
}

createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);