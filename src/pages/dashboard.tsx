import { useEffect, useState } from 'react';
import api from '../services/api';

// Definimos o tipo de dado que esperamos (Engenharia de Software com TS)
interface UserData {
  full_name: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Busca os dados do usuário logado usando o Token salvo no localStorage
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        // Se der erro (token expirado), podemos deslogar o usuário
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Carregando seu portal...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vinda ao Ludus, {user.full_name}!</h1>
      <p>Seu e-mail de acesso: {user.email}</p>
      
      {/* Aqui entrarão as funcionalidades do seu SaaS */}
      <button onClick={() => {
        localStorage.clear();
        window.location.href = '/login';
      }}>
        Sair do Sistema
      </button>
    </div>
  );
};

export default Dashboard;