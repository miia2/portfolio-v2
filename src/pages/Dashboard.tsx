import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORTAÇÃO DO TRADUTOR

// 1. Definindo os Contratos (Tipagens)
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
  const { t } = useTranslation(); // <-- 2. ATIVAÇÃO DO TRADUTOR

  // 2. Estados da Tela
  const [user, setUser] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Controle do Formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [produtoEditando, setProdutoEditando] = useState<Product | null>(null);

  useEffect(() => {
    carregarPerfilEProdutos();
  }, []);

  const carregarPerfilEProdutos = async () => {
    try {
      const resUser = await api.get('/users/me');
      setUser(resUser.data);

      const resProducts = await api.get('/products/me');
      setProducts(resProducts.data);
    } catch (error) {
      console.error(t('dashboard.error_loading'), error); // <-- TEXTO TRADUZIDO
    }
  };

  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosProduto = {
      name: nome,
      description: descricao,
      price: parseFloat(preco),
      image_url: imageUrl,
      is_available: true
    };

    try {
      if (produtoEditando) {
        await api.put(`/products/${produtoEditando.id}`, dadosProduto);
        alert(t('dashboard.product_updated')); // <-- TEXTO TRADUZIDO
      } else {
        await api.post('/products', dadosProduto);
        alert(t('dashboard.product_created')); // <-- TEXTO TRADUZIDO
      }

      limparFormulario();
      carregarPerfilEProdutos();
    } catch (error) {
      alert(t('dashboard.error_saving')); // <-- TEXTO TRADUZIDO
    }
  };

  const excluirProduto = async (id: number) => {
    const confirmar = window.confirm(t('dashboard.confirm_delete')); // <-- TEXTO TRADUZIDO
    if (!confirmar) return;

    try {
      await api.delete(`/products/${id}`);
      alert(t('dashboard.product_deleted')); // <-- TEXTO TRADUZIDO
      carregarPerfilEProdutos(); 
    } catch (error) {
      alert(t('dashboard.error_deleting')); // <-- TEXTO TRADUZIDO
    }
  };

  const iniciarEdicao = (produto: Product) => {
    setProdutoEditando(produto);
    setNome(produto.name);
    setDescricao(produto.description);
    setPreco(produto.price.toString());
    setImageUrl(produto.image_url || '');
  };

  const limparFormulario = () => {
    setProdutoEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setImageUrl('');
  };

  const copiarLinkLoja = () => {
    if (!user) return;
    const linkCompleto = `${window.location.origin}/loja/${user.store_slug}`;
    navigator.clipboard.writeText(linkCompleto);
    alert(t('dashboard.link_copied')); // <-- TEXTO TRADUZIDO
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>{t('dashboard.loading')}</p>; // <-- TEXTO TRADUZIDO

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* CABEÇALHO DO DASHBOARD */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e3a8a' }}>{t('dashboard.title')}</h1> {/* <-- TEXTO TRADUZIDO */}
          <p style={{ margin: 0, color: '#6b7280' }}>{t('dashboard.welcome')}, {user.full_name}</p> {/* <-- TEXTO TRADUZIDO */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <button 
            onClick={copiarLinkLoja}
            style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🔗 {t('dashboard.copy_link')} {/* <-- TEXTO TRADUZIDO */}
          </button>

          <a 
            href={`/loja/${user.store_slug}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '10px 15px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}
          >
            👀 {t('dashboard.view_store')} {/* <-- TEXTO TRADUZIDO */}
          </a>

          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}
          >
            {t('dashboard.logout')} {/* <-- TEXTO TRADUZIDO */}
          </button>
        </div>
      </header>

      {/* ÁREA DO FORMULÁRIO */}
      <section style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>
          {produtoEditando ? `✏️ ${t('dashboard.edit_product')}` : `📦 ${t('dashboard.new_product')}`} {/* <-- TEXTO TRADUZIDO */}
        </h2>
        
        <form onSubmit={salvarProduto} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder={t('dashboard.placeholder_name')} required
            value={nome} onChange={(e) => setNome(e.target.value)}
            style={{ flex: '1 1 200px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="number" step="0.01" placeholder={t('dashboard.placeholder_price')} required
            value={preco} onChange={(e) => setPreco(e.target.value)}
            style={{ flex: '1 1 100px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="text" placeholder={t('dashboard.placeholder_desc')} required
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
            style={{ flex: '2 1 300px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
           type="url" placeholder={t('dashboard.placeholder_image')} 
           value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
           style={{ flex: '1 1 100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
          />
          
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button type="submit" style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {produtoEditando ? t('dashboard.btn_update') : t('dashboard.btn_register')} {/* <-- TEXTO TRADUZIDO */}
            </button>
            
            {produtoEditando && (
              <button type="button" onClick={limparFormulario} style={{ flex: 1, backgroundColor: '#6b7280', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {t('dashboard.btn_cancel')} {/* <-- TEXTO TRADUZIDO */}
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TABELA DE PRODUTOS */}
      <section>
        <h2 style={{ color: '#1f2937' }}>{t('dashboard.your_products')}</h2> {/* <-- TEXTO TRADUZIDO */}
        
        {products.length === 0 ? (
          <p style={{ color: '#6b7280' }}>{t('dashboard.no_products')}</p> 
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dashboard.col_name')}</th> {/* <-- TEXTO TRADUZIDO */}
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dashboard.col_price')}</th> {/* <-- TEXTO TRADUZIDO */}
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>{t('dashboard.col_actions')}</th> {/* <-- TEXTO TRADUZIDO */}
              </tr>
            </thead>
            <tbody>
              {products.map(produto => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px', color: '#111827' }}>{produto.name}</td>
                  <td style={{ padding: '15px', color: '#059669', fontWeight: 'bold' }}>$ {produto.price.toFixed(2)}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => iniciarEdicao(produto)}
                      style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {t('dashboard.btn_edit')} {/* <-- TEXTO TRADUZIDO */}
                    </button>
                    <button 
                      onClick={() => excluirProduto(produto.id)}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {t('dashboard.btn_delete')} {/* <-- TEXTO TRADUZIDO */}
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