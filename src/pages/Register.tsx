import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useRegisterUser } from '../hooks/useAuth'; // Importa o novo hook

const Register: React.FC = () => {
  const navigate = useNavigate(); 
  const { t } = useTranslation(); 
  
  // Instancia o hook de registro do React Query
  const registerMutation = useRegisterUser();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    store_slug: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.store_slug.includes(' ')) {
      alert(t('error_space')); 
      return;
    }

    // Executa a mutação do React Query
    registerMutation.mutate(formData, {
      onSuccess: () => {
        alert(t('register_success'));
        navigate('/login'); 
      },
      onError: (error: any) => {
        console.error(error);
        // Captura o erro vindo da nossa nova estrutura do FastAPI
        const mensagemErro = error.response?.data?.detail || t('register_error_default');
        alert(mensagemErro);
      }
    });
  };

  // O estado de loading agora vem diretamente e de forma automática do React Query
  const isLoading = registerMutation.isPending;

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>{t('register_title')}</h2>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('name_label')}</label>
          <input 
            type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
            placeholder={t('name_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('email_label')}</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            placeholder={t('email_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('password_label')}</label>
          <input 
            type="password" name="password" required value={formData.password} onChange={handleChange}
            placeholder={t('password_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('whatsapp_label')}</label>
          <input 
            type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleChange}
            placeholder={t('whatsapp_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#6b7280' }}>{t('whatsapp_hint')}</small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t('slug_label')}</label>
          <input 
            type="text" name="store_slug" required value={formData.store_slug} onChange={handleChange}
            placeholder={t('slug_placeholder')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#10b981', fontWeight: 'bold' }}>
            {formData.store_slug ? `${t('slug_active')} /loja/${formData.store_slug}` : t('slug_hint')}
          </small>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
        >
          {isLoading ? t('button_loading') : t('button_register')}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#6b7280' }}>
          {t('has_account')}{' '}
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
            {t('login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;