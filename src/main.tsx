import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import './i18n'; // Seu sistema de internacionalização

// 1. Cria a instância única de cache do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita refazer requisições ao mudar de aba
      retry: 1,                    // Se falhar, tenta apenas mais 1 vez
      staleTime: 1000 * 60 * 5,    // Dados ficam no cache por 5 minutos
    },
  },
});

// 2. Inicializa o app injetando o QueryClientProvider corretamente
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

