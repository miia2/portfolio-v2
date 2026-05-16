import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

const navigate = useNavigate(); // <-- ADICIONE ISTO AQUI (antes das outras funções)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/login', params);
      
      // Pegamos o token e o slug da loja que o backend novo envia
      const { access_token, store_slug } = response.data; 
 
      localStorage.setItem('@Ludus:token', access_token);
      localStorage.setItem('@Ludus:storeSlug', store_slug);

      alert("Login realizado com sucesso!");
      
      // O PULO DO GATO: Isso vai mandar o lojista direto para o painel dele!
      navigate('/dashboard'); 
      
    } catch (error) {
      console.error(error);
      alert("Erro ao entrar. Verifique seu e-mail e senha.");
    }
  };

  // --- 1. FUNÇÃO DE TESTE (Adicione esta parte aqui!) ---
  const testarConexao = async () => {
    try {
      const resposta = await api.get('/'); 
      alert("Conexão com a API está ativa! (Verifique o console F12)");
      console.log("Resposta da API:", resposta.data);
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert("O servidor Python está desligado ou o CORS bloqueou o acesso.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Ludus Comercial - Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>E-mail:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', marginBottom: '20px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          Entrar no Sistema
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
  <p style={{ color: '#6b7280' }}>
    Ainda não tem uma loja? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Crie sua conta de graça</Link>
  </p>
</div>

        <hr style={{ margin: '20px 0' }} /> 
        
        {/* IMPORTANTE: type="button" para não disparar o login ao testar */}
        <button 
          type="button" 
          onClick={testarConexao} 
          style={{ width: '100%', padding: '5px', background: '#f0f0f0', border: '1px solid #ccc' }}
        >
          Testar Conexão com a API
        </button>
      </form>
    </div>
  );
};

export default Login;