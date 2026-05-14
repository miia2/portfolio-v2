import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate(); // Ferramenta do React Router para mudar de página
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    store_slug: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Atualiza apenas o campo que o usuário está digitando
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação de segurança: O link da loja não pode ter espaços
    if (formData.store_slug.includes(' ')) {
      alert('O link da loja não pode conter espaços. Tente algo como "minha-loja-doces".');
      setLoading(false);
      return;
    }

    try {
      // Chama a rota que criamos no Python
      await api.post('/register', formData);
      alert('Sua loja foi criada com sucesso! Faça login para começar.');
      navigate('/login'); // Manda o usuário para a tela de login
    } catch (error: any) {
      console.error(error);
      // Pega a mensagem de erro que o Python manda (ex: "E-mail já existe")
      const mensagemErro = error.response?.data?.detail || 'Erro ao criar conta. Tente novamente.';
      alert(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Criar minha Loja</h2>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Lojista:</label>
          <input 
            type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
            placeholder="Ex: Maria da Silva"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>E-mail de Acesso:</label>
          <input 
            type="email" name="email" required value={formData.email} onChange={handleChange}
            placeholder="loja@email.com"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Senha:</label>
          <input 
            type="password" name="password" required value={formData.password} onChange={handleChange}
            placeholder="Mínimo de 6 caracteres"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>WhatsApp (com DDD):</label>
          <input 
            type="text" name="whatsapp_number" required value={formData.whatsapp_number} onChange={handleChange}
            placeholder="Ex: 5511999999999"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#6b7280' }}>Apenas números, inclua o código do país (55).</small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link da sua Loja:</label>
          <input 
            type="text" name="store_slug" required value={formData.store_slug} onChange={handleChange}
            placeholder="ex: doces-da-maria"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <small style={{ color: '#10b981', fontWeight: 'bold' }}>
            {formData.store_slug ? `Seu link será: /loja/${formData.store_slug}` : 'Escolha um nome único sem espaços.'}
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
        >
          {loading ? 'Criando loja...' : 'Criar minha Loja agora'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#6b7280' }}>
          Já tem uma conta? <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Faça Login aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;