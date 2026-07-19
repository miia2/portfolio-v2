import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { ProductImage } from '../components/ProductImage';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
}

interface UserData {
  full_name: string;
  store_slug: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { token, logout } = useAuthStore();

  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null); // Guardará o arquivo binário da foto
  const [produtoEditando, setProdutoEditando] = useState<Product | null>(null);

  // 1. Carrega dados do perfil do Usuário (Com redirecionamento em caso de erro)
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const resUser = await api.get('/auth/me'); // <-- Ajustado de '/users/me' para '/auth/me'
        setUser(resUser.data);
      } catch (error) {
        console.error(t('dash_error_loading'), error);
        // Se der erro de autenticação (ex: token inválido ou expirado), desloga e manda pro login
        logout();
        navigate('/login'); 
      }
    };

    if (token) {
      carregarPerfil();
    } else {
      navigate('/login'); // Se não tem token nenhum, nem tenta carregar, vai direto pro login
    }
  }, [token, t, navigate, logout]);

  // 2. React Query: Busca automática dos produtos mapeando a paginação do backend
  const { data: products = [], isLoading: carregandoProdutos } = useQuery<Product[]>({
    queryKey: ['my-products'],
    queryFn: async () => {
      const res = await api.get('/products/me?page=1&size=50'); // Envia parâmetros de paginação padrão
      
      // Se o backend retornar o objeto paginado com a chave 'items', extraímos ela.
      // Caso contrário (se retornar array puro), usamos o res.data direto.
      return res.data.items ? res.data.items : res.data;
    },
    enabled: !!token,
  });

  // 3. React Query: Mutation para Salvar / Editar Produto (Multipart Form Data para suportar arquivos)
  const salvarProdutoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (produtoEditando) {
        return await api.put(`/products/${produtoEditando.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        return await api.post('/products/', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }
    },
    onSuccess: () => {
      alert(produtoEditando ? t('dash_product_updated') : t('dash_product_created'));
      limparFormulario();
      // Atualiza o cache da tabela de produtos instantaneamente em segundo plano
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: () => {
      alert(t('dash_error_saving'));
    }
  });

  // 4. React Query: Mutation para Excluir Produto
  const excluirProdutoMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      alert(t('dash_product_deleted'));
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: () => {
      alert(t('dash_error_deleting'));
    }
  });

  const handleSubmeterFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    // Como o backend agora espera um Form padrão para processar arquivos no Cloudinary, usamos FormData
    const formData = new FormData();
    formData.append('name', nome);
    formData.append('description', descricao);
    formData.append('price', preco);
    formData.append('is_available', 'true');
    
    if (imagemArquivo) {
      formData.append('image', imagemArquivo); // Envia o arquivo selecionado
    }

    salvarProdutoMutation.mutate(formData);
  };

  const executarExclusao = (id: number) => {
    const confirmar = window.confirm(t('dash_confirm_delete'));
    if (confirmar) {
      excluirProdutoMutation.mutate(id);
    }
  };

  const iniciarEdicao = (produto: Product) => {
    setProdutoEditando(produto);
    setNome(produto.name);
    setDescricao(produto.description);
    setPreco(produto.price.toString());
    setImagemArquivo(null); // Reseta a seleção de arquivo para manter a imagem antiga caso não queira mudar
  };

  const limparFormulario = () => {
    setProdutoEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setImagemArquivo(null);
  };

  const copiarLinkLoja = () => {
    if (!user) return;
    const linkCompleto = `${window.location.origin}/loja/${user.store_slug}`;
    navigator.clipboard.writeText(linkCompleto);
    alert(t('dash_link_copied'));
  };

  const ejecutarLogout = () => {
    logout(); // Chama a limpeza global do Zustand (Limpa localStorage e estados)
    window.location.href = '/login';
  };

  // Se o perfil do usuário ainda não chegou da API, bloqueia a tela inteira com o loading genérico
  if (!user) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>{t('dash_loading')}</p>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e3a8a' }}>{t('dash_title')}</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>{t('dash_welcome')}, {user.full_name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <button 
            onClick={copiarLinkLoja}
            style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔗 {t('dash_copy_link')}
          </button>

          <a 
            href={`/loja/${user.store_slug}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '10px 15px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}
          >
            👀 {t('dash_view_store')}
          </a>

          <button 
            onClick={ejecutarLogout}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {t('dash_logout')}
          </button>
        </div>
      </header>

      <section style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>
          {produtoEditando ? `✏️ ${t('dash_edit_product')}` : `📦 ${t('dash_new_product')}`}
        </h2>
        
        <form onSubmit={handleSubmeterFormulario} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder={t('dash_placeholder_name')} required
            value={nome} onChange={(e) => setNome(e.target.value)}
            style={{ flex: '1 1 200px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="number" step="0.01" placeholder={t('dash_placeholder_price')} required
            value={preco} onChange={(e) => setPreco(e.target.value)}
            style={{ flex: '1 1 100px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="text" placeholder={t('dash_placeholder_desc')} required
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
            style={{ flex: '2 1 300px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          
          {/* Upload de arquivo local do computador/celular */}
          <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Imagem do Produto:</label>
            <input 
              type="file" 
              accept="image/*"
              required={!produtoEditando} // Exige foto apenas para novos registros
              onChange={(e) => setImagemArquivo(e.target.files ? e.target.files[0] : null)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff' }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={salvarProdutoMutation.isPending}
              style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: salvarProdutoMutation.isPending ? 0.6 : 1 }}
            >
              {salvarProdutoMutation.isPending ? 'Salvando...' : produtoEditando ? t('dash_btn_update') : t('dash_btn_register')}
            </button>
            
            {produtoEditando && (
              <button type="button" onClick={limparFormulario} style={{ flex: 1, backgroundColor: '#6b7280', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {t('dash_btn_cancel')}
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 style={{ color: '#1f2937' }}>{t('dash_your_products')}</h2>
        
        {/* Tratamento isolado do carregamento apenas na área dos produtos */}
        {carregandoProdutos ? (
          <p style={{ color: '#6b7280' }}>{t('dash_loading')}</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#6b7280' }}>{t('no_products')}</p> 
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>Foto</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dash_col_name')}</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dash_col_price')}</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dash_col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(produto => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px' }}>
                    {produto.image_url ? (
                      <ProductImage 
                        src={produto.image_url} 
                        alt={produto.name} 
                        style={{ width: '50px', height: '50px', borderRadius: '6px' }} 
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#e5e7eb', borderRadius: '6px' }} />
                    )}
                  </td>
                  <td style={{ padding: '15px', color: '#111827', verticalAlign: 'middle' }}>{produto.name}</td>
                  <td style={{ padding: '15px', color: '#059669', fontWeight: 'bold', verticalAlign: 'middle' }}>$ {produto.price.toFixed(2)}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px', alignItems: 'center', height: '80px' }}>
                    <button 
                      onClick={() => iniciarEdicao(produto)}
                      style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {t('dash_btn_edit')}
                    </button>
                    <button 
                      onClick={() => executarExclusao(produto.id)}
                      disabled={excluirProdutoMutation.isPending}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', opacity: excluirProdutoMutation.isPending ? 0.6 : 1 }}
                    >
                      {t('dash_btn_delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Dashboard;