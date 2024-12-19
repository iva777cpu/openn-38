import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()
const container = document.createElement('div');
document.body.appendChild(container);

createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);