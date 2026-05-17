import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
}

interface StoreData {
  full_name: string;
  whatsapp_number: string;
  products: Product[];
}

const Store = () => {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<StoreData | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await api.get(`/store/${slug}`);
        setStore(response.data);
      } catch (error) {
        console.error(error);
        setErro(true);
      }
    };
    fetchStore();
  }, [slug]);

  const handleOrderWhatsApp = (product: Product) => {
    if (!store) return;
    
    // Monta a mensagem pré-pronta
    const mensagem = `Olá! Gostaria de encomendar o produto: *${product.name}* (R$ ${product.price.toFixed(2)}).`;
    
    // Redireciona para o WhatsApp do vendedor
    const url = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  if (erro) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loja não encontrada.</h2>;
  if (!store) return <p style={{ textAlign: 'center' }}>Carregando catálogo...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2563eb' }}>{store.full_name}</h1>
        <p>Faça seu pedido diretamente pelo nosso WhatsApp!</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {store.products.map(product => (
          <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', color: '#333' }}>
            <div style={{ width: '100%', height: '180px', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {product.image_url ? (
        <img 
          src={product.image_url} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Sem foto</span>
      )}
    </div>
            <h3 style={{ marginTop: 0 }}>{product.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{product.description}</p>
            <h2 style={{ color: '#10b981' }}>R$ {product.price.toFixed(2)}</h2>
            
            <button 
              onClick={() => handleOrderWhatsApp(product)}
              style={{
                width: '100%', padding: '12px', backgroundColor: '#25D366', color: 'white', 
                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Pedir no WhatsApp
            </button>
          </div>
        ))}
        {store.products.length === 0 && <p>Nenhum produto cadastrado ainda.</p>}
      </div>
    </div>
  );
};

export default Store;