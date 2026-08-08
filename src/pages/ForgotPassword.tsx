import React, { useState } from 'react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMensagem(res.data.message);
    } catch (err) {
      setMensagem('Erro ao solicitar recuperação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Recuperar Senha</h2>
      {mensagem ? <p>{mensagem}</p> : (
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Seu e-mail cadastrado" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={carregando} style={{ width: '100%', padding: '10px' }}>
            {carregando ? 'Enviando...' : 'Enviar Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;