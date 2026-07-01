import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// ATUALIZADO: Substituído o localhost pela URL oficial da Render
const API_URL = 'https://api-catalogo-digital.onrender.com/api/v1';

export function useRegisterUser() {
  return useMutation({
    mutationFn: async (userData: any) => {
      // Agora a requisição vai direto para o servidor correto na nuvem!
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    },
  });
}