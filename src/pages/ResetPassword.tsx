import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Token inválido ou ausente!');

    setCarregando(true);
    try {
      await api.post('/auth/reset-password', { token, new_password: novaSenha });
      alert('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      alert('Token expirado ou inválido. Solicite novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Digite sua Nova Senha</h2>
      <form onSubmit={handleReset}>
        <input 
          type="password" 
          placeholder="Nova Senha" 
          value={novaSenha} 
          onChange={(e) => setNovaSenha(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={carregando} style={{ width: '100%', padding: '10px' }}>
          {carregando ? 'Redefinindo...' : 'Salvar Nova Senha'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;