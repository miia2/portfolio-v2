import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next'; // Já estava aqui, perfeito!
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login: React.FC = () => {
  // A função 't' é a que traduz os textos. A 'i18n' serve para trocar de idioma depois.
  const { t } = useTranslation(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/login', params);
      
      const { access_token, store_slug } = response.data; 
 
      localStorage.setItem('@Ludus:token', access_token);
      localStorage.setItem('@Ludus:storeSlug', store_slug);

      // Usando o t() dentro dos alertas Javascript
      alert(t('login.alerts.success'));
      
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error(error);
      alert(t('login.alerts.error'));
    }
  };

  const testarConexao = async () => {
    try {
      const resposta = await api.get('/'); 
      alert(t('login.alerts.api_active'));
      console.log("API Response:", resposta.data);
    } catch (error) {
      console.error("Connection Error:", error);
      alert(t('login.alerts.api_error'));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <LanguageSwitcher />
      {/* Usando o t() dentro do HTML (JSX) com chaves {} */}
      <h2>{t('login.title')}</h2>
      
      <form onSubmit={handleLogin}>
        <div>
          <label>{t('login.email_label')}</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>{t('login.password_label')}</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '20px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {t('login.submit_button')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6b7280' }}>
            {t('login.no_store_text')} <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>{t('login.create_account_link')}</Link>
          </p>
        </div>

        <hr style={{ margin: '20px 0' }} /> 
        
        <button 
          type="button" 
          onClick={testarConexao} 
          style={{ width: '100%', padding: '5px', background: '#f0f0f0', border: '1px solid #ccc' }}
        >
          {t('login.test_api_button')}
        </button>
      </form>
    </div>
  );
};

export default Login;