import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token de recuperação inválido ou ausente!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: token,
        new_password: newPassword,
      });

      toast.success('Senha alterada com sucesso! Faça login com a nova senha.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Token expirado ou inválido. Solicite um novo link.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '400px', background: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Redefinir Senha</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
          Digite sua nova senha abaixo para recuperar o acesso à sua conta.
        </p>

        {!token ? (
          <div style={{ textAlign: 'center', color: '#f87171' }}>
            <p>Link de recuperação inválido ou sem token.</p>
            <Link to="/forgot-password" style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Nova Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Confirmar Nova Senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
                Voltar para o Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;