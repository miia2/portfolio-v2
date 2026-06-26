import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useRegisterUser } from '../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate(); 
  const { t } = useTranslation(); 
  const registerMutation = useRegisterUser();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    store_slug: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'store_slug') {
      const formattedSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')       
        .replace(/[^a-z0-9-]/g, ''); 
      setFormData({ ...formData, [name]: formattedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData, {
      onSuccess: () => {
        alert(t('register_success'));
        navigate('/login'); 
      },
      onError: (error: any) => {
        const mensagemErro = error.response?.data?.detail || t('register_error_default');
        alert(mensagemErro);
      }
    });
  };

  const isLoading = registerMutation.isPending;

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>{t('register_title')}</h2>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Campos adicionados de volta */}
        <input type="text" name="full_name" placeholder={t('name_label')} value={formData.full_name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        <input type="email" name="email" placeholder={t('email_label')} value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        <input type="password" name="password" placeholder={t('password_label')} value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        <input type="text" name="whatsapp_number" placeholder={t('whatsapp_label')} value={formData.whatsapp_number} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />

        {/* Campo do Slug */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('slug_label')}</label>
          <input 
            type="text" 
            name="store_slug" 
            required 
            value={formData.store_slug} 
            onChange={handleChange} 
            placeholder={t('slug_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#10b981', fontWeight: 'bold' }}>
            {formData.store_slug ? `${t('slug_active')} /loja/${formData.store_slug}` : t('slug_hint')}
          </small>
        </div>

        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLoading ? t('button_loading') : t('button_register')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {t('has_account')}{' '}
        <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>{t('login_link')}</Link>
      </p>
    </div>
  );
};

export default Register;