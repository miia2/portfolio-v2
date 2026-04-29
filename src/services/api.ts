import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // O endereço do seu Python
});

// Essa função anexa o Token automaticamente em todas as chamadas futuras
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Ludus:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;