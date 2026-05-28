import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

interface StoreData {
  full_name: string;
  whatsapp_number: string;
  products: Product[];
}

const Store: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation(); // Ativando a tradução
  
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStoreCatalog = async () => {
      try {
        const response = await api.get(`/store/${slug}`);
        setStore(response.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchStoreCatalog();
  }, [slug]);

  const handleOrder = (product: Product) => {
    if (!store) return;

    // Remove caracteres não numéricos do WhatsApp
    const cleanPhone = store.whatsapp_number.replace(/\D/g, '');
    
    // Puxa a mensagem traduzida do arquivo JSON injetando o nome e preço do produto
    const text = t('whatsapp_message', { name: product.name, price: product.price.toFixed(2) });
    const encodedText = encodeURIComponent(text);
    
    // Redireciona para o WhatsApp
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#fff', background: '#0f172a', minHeight: '100vh' }}>
        <p>{t('loading_catalog')}</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#fff', background: '#0f172a', minHeight: '100vh' }}>
        <LanguageSwitcher />
        <p style={{ marginTop: '20px' }}>{t('store_not_found')}</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#fff', padding: '20px' }}>
      {/* Botões de idioma no topo da vitrine pública */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <LanguageSwitcher />
      </div>

      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{store.full_name}</h1>
        <p style={{ color: '#94a3b8' }}>{t('order_prompt')}</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        {store.products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>{t('no_products')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {store.products.map((product) => (
              <div 
                key={product.id} 
                style={{ 
                  background: '#1e293b', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  display: 'flex', 
                  gap: '20px', 
                  alignItems: 'center',
                  border: '1px solid #334155'
                }}
              >
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ width: '100px', height: '100px', background: '#475569', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {t('no_photo')}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '5px' }}>{product.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '10px' }}>{product.description}</p>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                <button 
                  onClick={() => handleOrder(product)}
                  style={{ 
                    background: '#25d366', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 20px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#20ba56')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#25d366')}
                >
                  {t('order_button')}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Store;