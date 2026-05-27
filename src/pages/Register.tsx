import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- 1. Importando o tradutor
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate(); 
  const { t } = useTranslation(); // <-- 2. Ativando a função de tradução (t)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    store_slug: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.store_slug.includes(' ')) {
      // 3. Trocando o texto fixo pela variável do dicionário
      alert(t('register.alerts.spaceError')); 
      setLoading(false);
      return;
    }

    try {
      await api.post('/register', formData);
      alert(t('register.alerts.success'));
      navigate('/login'); 
    } catch (error: any) {
      console.error(error);
      const mensagemErro = error.response?.data?.detail || t('register.alerts.defaultError');
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>{t('register.title')}</h2>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('register.fields.nameLabel')}</label>
          <input 
            type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
            placeholder={t('register.fields.namePlaceholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('register.fields.emailLabel')}</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            placeholder={t('register.fields.emailPlaceholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('register.fields.passwordLabel')}</label>
          <input 
            type="password" name="password" required value={formData.password} onChange={handleChange}
            placeholder={t('register.fields.passwordPlaceholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('register.fields.whatsappLabel')}</label>
          <input 
            type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleChange}
            placeholder={t('register.fields.whatsappPlaceholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#6b7280' }}>{t('register.fields.whatsappHint')}</small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('register.fields.slugLabel')}</label>
          <input 
            type="text" name="store_slug" required value={formData.store_slug} onChange={handleChange}
            placeholder={t('register.fields.slugPlaceholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#10b981', fontWeight: 'bold' }}>
            {formData.store_slug ? `${t('register.fields.slugActive')} /loja/${formData.store_slug}` : t('register.fields.slugHint')}
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
        >
          {loading ? t('register.buttons.loading') : t('register.buttons.submit')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#6b7280' }}>
          {t('register.footer.hasAccount')} <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>{t('register.footer.loginLink')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;