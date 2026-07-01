import axios from 'axios';

const api = axios.create({
  // O Vite usa import.meta.env para ler variáveis de ambiente.
  // Se existir um link de produção, ele usa. Se não, cai no localhost.
  baseURL: import.meta.env.VITE_API_URL || 'https://api-catalogo-digital.onrender.com/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Ludus:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;