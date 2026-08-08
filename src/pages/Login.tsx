import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next'; 
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

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

      toast.success(t('login_success'));
      navigate('/dashboard'); 
      
    } catch (error: any) {
      console.error(error);
      const msgErro = error.response?.data?.detail || t('login_error');
      toast.error(msgErro);
    }
  };

  const testarConexao = async () => {
    try {
      await api.get('/'); 
      toast.success("Conexão com a API está ativa!");
    } catch (error) {
      console.error("Connection Error:", error);
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
            style={{ width: '100%', marginBottom: '5px' }}
          />
          
          {/* 🌟 LINK PARA RECUPERAÇÃO DE SENHA */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link 
              to="/forgot-password" 
              style={{ color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              {t('forgot_password') || "Esqueceu sua senha?"}
            </Link>
          </div>
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