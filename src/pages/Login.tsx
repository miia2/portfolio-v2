import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next'; 
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login: React.FC = () => {
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

      alert(t('login_success'));
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error(error);
      alert(t('login_error'));
    }
  };

  const testarConexao = async () => {
    try {
      await api.get('/'); 
      // Como não havia esses alertas no seu JSON de tradução, mantive o fallback em texto direto ou você pode mapeá-los depois!
      alert("Conexão com a API está ativa!");
    } catch (error) {
      console.error("Connection Error:", error);
      alert("O servidor Python está desligado ou o CORS bloqueou o acesso.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <LanguageSwitcher />
      
      {/* Alinhado com as chaves exatas do seu translation.json */}
      <h2>{t('login_title')}</h2>
      
      <form onSubmit={handleLogin}>
        <div>
          <label>{t('email_label')}</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>{t('password_label')}</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '20px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {t('button_enter')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6b7280' }}>
            {t('no_account')}{' '}
            <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
              {t('create_account')}
            </Link>
          </p>
        </div>

        <hr style={{ margin: '20px 0' }} /> 
        
        <button 
          type="button" 
          onClick={testarConexao} 
          style={{ width: '100%', padding: '5px', background: '#f0f0f0', border: '1px solid #ccc' }}
        >
          {t('test_connection')}
        </button>
      </form>
    </div>
  );
};

export default Login;