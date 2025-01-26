import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const queryClient = new QueryClient()
const container = document.getElementById('root') || document.createElement('div')
if (!container.parentElement) {
  document.body.appendChild(container)
}

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/app">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)