import React, { useEffect, useState } from 'react';
import api from '../services/api';

// 1. Definindo os Contratos (Tipagens)
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
}

interface UserData {
  full_name: string;
  store_slug: string;
}

const Dashboard = () => {
  // 2. Estados da Tela
  const [user, setUser] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Controle do Formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [produtoEditando, setProdutoEditando] = useState<Product | null>(null);

  // 3. Carregar dados ao entrar na página
  useEffect(() => {
    carregarPerfilEProdutos();
  }, []);

  const carregarPerfilEProdutos = async () => {
    try {
      // Pega os dados do lojista logado
      const resUser = await api.get('/users/me');
      setUser(resUser.data);

      // DICA: Precisaremos criar esta rota no Python no próximo passo!
      const resProducts = await api.get('/products/me');
      setProducts(resProducts.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  // 4. Função para Salvar (Criar ou Editar)
  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosProduto = {
      name: nome,
      description: descricao,
      price: parseFloat(preco),
      is_available: true
    };

    try {
      if (produtoEditando) {
        // Modo Edição (PUT)
        await api.put(`/products/${produtoEditando.id}`, dadosProduto);
        alert('Produto atualizado com sucesso!');
      } else {
        // Modo Criação (POST)
        await api.post('/products', dadosProduto);
        alert('Produto criado com sucesso!');
      }

      // Limpa o formulário e recarrega a lista
      limparFormulario();
      carregarPerfilEProdutos();
    } catch (error) {
      alert('Erro ao salvar o produto.');
    }
  };

  // 5. Função para Excluir
  const excluirProduto = async (id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja apagar este produto?");
    if (!confirmar) return;

    try {
      await api.delete(`/products/${id}`);
      alert("Produto excluído!");
      carregarPerfilEProdutos(); // Recarrega a tabela
    } catch (error) {
      alert("Erro ao excluir o produto.");
    }
  };

  // 6. Preparar o formulário para edição
  const iniciarEdicao = (produto: Product) => {
    setProdutoEditando(produto);
    setNome(produto.name);
    setDescricao(produto.description);
    setPreco(produto.price.toString());
  };

  const limparFormulario = () => {
    setProdutoEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
  };

  // Se ainda estiver carregando, mostra uma mensagem
  if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando seu painel...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      
      {/* CABEÇALHO DO DASHBOARD */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e3a8a' }}>Painel da Loja</h1>
          <p style={{ margin: 0, color: '#6b7280' }}>Bem-vindo(a), {user.full_name}</p>
        </div>
        <div>
          <a 
            href={`/loja/${user.store_slug}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '10px 15px', textDecoration: 'none', borderRadius: '8px', marginRight: '10px' }}
          >
            👀 Ver minha Vitrine
          </a>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* ÁREA DO FORMULÁRIO */}
      <section style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ marginTop: 0, color: '#1f2937' }}>
          {produtoEditando ? '✏️ Editar Produto' : '📦 Novo Produto'}
        </h2>
        
        <form onSubmit={salvarProduto} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder="Nome do Produto (Ex: Bolo de Pote)" required
            value={nome} onChange={(e) => setNome(e.target.value)}
            style={{ flex: '1 1 200px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="number" step="0.01" placeholder="Preço (Ex: 15.90)" required
            value={preco} onChange={(e) => setPreco(e.target.value)}
            style={{ flex: '1 1 100px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <input 
            type="text" placeholder="Descrição rápida" required
            value={descricao} onChange={(e) => setDescricao(e.target.value)}
            style={{ flex: '2 1 300px', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button type="submit" style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {produtoEditando ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
            
            {produtoEditando && (
              <button type="button" onClick={limparFormulario} style={{ flex: 1, backgroundColor: '#6b7280', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </section>

      {/* TABELA DE PRODUTOS */}
      <section>
        <h2 style={{ color: '#1f2937' }}>Seus Produtos Cadastrados</h2>
        
        {products.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Você ainda não tem produtos. Adicione o primeiro acima!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>Nome</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>Preço</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(produto => (
                <tr key={produto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '15px', color: '#111827' }}>{produto.name}</td>
                  <td style={{ padding: '15px', color: '#059669', fontWeight: 'bold' }}>R$ {produto.price.toFixed(2)}</td>
                  <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => iniciarEdicao(produto)}
                      style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => excluirProduto(produto.id)}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Excluir
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