import { create } from 'zustand';

interface AuthState {
  token: string | null;
  storeSlug: string | null;
  isAuthenticated: boolean;
  login: (token: string, storeSlug: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Inicializa tentando ler o token já salvo no localStorage
  token: localStorage.getItem('access_token'),
  storeSlug: localStorage.getItem('store_slug'),
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: (token, storeSlug) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('store_slug', storeSlug);
    set({ token, storeSlug, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('store_slug');
    set({ token: null, storeSlug: null, isAuthenticated: false });
  },
}));