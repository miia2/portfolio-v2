import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORTA O HOOK DE TRADUÇÃO
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
  const { t } = useTranslation(); // <-- 2. ATIVA A FUNÇÃO t()
  
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
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
    if (slug) fetchStore();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
        <h2>{t('loading_catalog')}</h2> {/* <-- TRADUZIDO */}
      </div>
    );
  }

  if (error || !store) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
        <h2>{t('store_not_found')}</h2> {/* <-- TRADUZIDO */}
      </div>
    );
  }

  const handleOrder = (product: Product) => {
    // Monta a mensagem usando o formato do i18next
    const message = t('whatsapp_message', { name: product.name, price: product.price.toFixed(2) });
    const cleanNumber = store.whatsapp_number.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>{store.full_name}</h1>
        <LanguageSwitcher />
      </div>
      
      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '40px' }}>
        {t('order_prompt')} {/* <-- TRADUZIDO */}
      </p>

      {store.products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('no_products')}</p> 
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {store.products.map((product) => (
            <div key={product.id} style={{ background: '#1f2937', padding: '15px', borderRadius: '8px' }}>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                />
              ) : (
                <div style={{ height: '150px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#9ca3af' }}>
                  {t('no_photo')} {/* <-- TRADUZIDO */}
                </div>
              )}
              <h3 style={{ marginTop: '10px' }}>{product.name}</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{product.description}</p>
              <p style={{ fontWeight: 'bold', color: '#10b981', margin: '10px 0' }}>R$ {product.price.toFixed(2)}</p>
              
              <button 
                onClick={() => handleOrder(product)}
                style={{ width: '100%', padding: '10px', background: '#25d366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t('order_button')} {/* <-- TRADUZIDO */}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;