import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next'; 
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner'; // 1. Importa o toast da Sonner

const Login: React.FC = () => {
  const { t } = useTranslation(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loginGlobal = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/login', params);
      const { access_token, store_slug } = response.data; 
 
      loginGlobal(access_token, store_slug);

      // 2. Substituído o alert antigo por toast de sucesso
      toast.success(t('login_success'));
      navigate('/dashboard'); 
      
    } catch (error: any) {
      console.error(error);
      // Extrai o erro do FastAPI se houver, se não usa a tradução padrão
      const msgErro = error.response?.data?.detail || t('login_error');
      // 3. Substituído por toast de erro
      toast.error(msgErro);
    }
  };

  const testarConexao = async () => {
    try {
      await api.get('/'); 
      // 4. Toast informativo/sucesso para o teste de conexão
      toast.success("Conexão com a API está ativa!");
    } catch (error) {
      console.error("Connection Error:", error);
      // 5. Toast de erro para falha de conexão
      toast.error("O servidor Python está desligado ou o CORS bloqueou o acesso.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <LanguageSwitcher />
      
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