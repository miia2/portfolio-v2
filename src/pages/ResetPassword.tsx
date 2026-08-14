import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      toast.error('Token de recuperação não encontrado ou link incompleto.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: token,
        new_password: password
      });

      toast.success('Senha redefinida com sucesso! Faça login.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Token expirado ou inválido. Solicite uma nova recuperação.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', color: '#fff', maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Link Inválido</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>O link de recuperação está incompleto ou expirou.</p>
          <Link to="/forgot-password" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', color: '#fff', maxWidth: '400px', width: '100%', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center' }}>Redefinir Senha</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
          Digite sua nova senha abaixo para recuperar o acesso.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>Nova Senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Redefinindo...' : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;