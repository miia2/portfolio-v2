import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export function useRegisterUser() {
  return useMutation({
    mutationFn: async (userData: any) => {
      // Repare que a rota agora segue a nossa nova estrutura modular do backend
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    },
  });
}