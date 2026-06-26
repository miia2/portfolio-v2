import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://127.0.0.1:8000/api/v1';

// 1. Hook para BUSCAR os produtos do lojista logado (Substitui o useEffect)
export function useMyProducts(page: number, search: string) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    // Adicionamos page e search na queryKey para o React Query saber que cada página/busca tem um cache diferente!
    queryKey: ['my-products', page, search], 
    queryFn: async () => {
      // Alterado aqui para usar a constante API_URL
      const response = await axios.get(`${API_URL}/products/me`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          size: 20,
          search: search || undefined // Se estiver vazio, não envia o parâmetro
        }
      });
      return response.data; // Agora response.data terá .items e .total
    },
    enabled: !!token,
  });
}

export function useCreateProduct() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Alterado aqui para usar a constante API_URL
      const response = await axios.post(`${API_URL}/products/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      
      // 2. Dispara o alerta de sucesso na tela!
      toast.success('Produto cadastrado com sucesso!');
    },
    onError: (error: any) => {
      // 3. Pega a mensagem de erro que veio do FastAPI backend se algo falhar
      const mensagemErro = error.response?.data?.detail || 'Erro ao cadastrar produto.';
      toast.error(mensagemErro);
    }
  });
}