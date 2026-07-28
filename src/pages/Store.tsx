import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { ProductImage } from '../components/ProductImage';

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
  const { t } = useTranslation(); 
  
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStoreCatalog = async () => {
      try {
        // CORREÇÃO 1: Rota ajustada para /products/store/{slug}
        const response = await api.get(`/products/store/${slug}`);
        
        // CORREÇÃO 2: Mapeia o formato que o backend envia (store_info + products_pagination)
        const data = response.data;
        if (data && data.store_info) {
          setStore({
            full_name: data.store_info.full_name,
            whatsapp_number: data.store_info.whatsapp_number,
            products: data.products_pagination ? data.products_pagination.items : []
          });
        } else {
          setStore(data);
        }
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchStoreCatalog();
  }, [slug]);

  const handleOrder = (product: Product) => {
    if (!store) return;

    const cleanPhone = store.whatsapp_number.replace(/\D/g, '');
    const text = t('whatsapp_message', { name: product.name, price: product.price.toFixed(2) });
    const encodedText = encodeURIComponent(text);
    
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
                <ProductImage 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ width: '96px', height: '96px', borderRadius: '8px', objectFit: 'cover' }}
                />

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