import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://127.0.0.1:8000/api/v1';

// 1. Hook para BUSCAR os produtos do lojista logado (Substitui o useEffect)
export function useMyProducts() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['my-products'], // Identificador único deste cache no React Query
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token, // Só roda a busca se o usuário estiver logado (token existir)
  });
}

// 2. Hook para CRIAR um novo produto (Mutation)
export function useCreateProduct() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(`${API_URL}/products/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Lembra do passo anterior das imagens?
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalida o cache antigo de produtos e força o React Query a buscar a lista atualizada
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
}