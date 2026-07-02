import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-catalogo-digital.onrender.com/api/v1',
});

// INTERCEPTOR MÁGICO: Ele lê o token do localStorage bem na hora do clique e injeta na requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;