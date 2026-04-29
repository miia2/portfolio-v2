import { useEffect, useState } from 'react';
import api from '../services/api'; // Importa a central que criamos no Passo 2

// Definimos o que esperamos receber do Python para o TypeScript não reclamar
interface UserData {
  full_name: string;
  email: string;
}

export function Dashboard() {
  const [usuario, setUsuario] = useState<UserData | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Esta é a função do Passo 4!
    async function buscarMeuPerfil() {
      try {
        const resposta = await api.get('/users/me');
        setUsuario(resposta.data); // Guarda os dados do Python no estado do React
      } catch (error) {
        console.error("Erro: Você provavelmente não está logada.");
      } finally {
        setCarregando(false);
      }
    }

    buscarMeuPerfil();
  }, []); // Os colchetes vazios garantem que isso só rode UMA vez

  if (carregando) return <p>Carregando dados do Ludus...</p>;

  return (
    <div>
      <h1>Bem-vinda ao seu Painel, {usuario?.full_name}!</h1>
      <p>Seu e-mail cadastrado é: {usuario?.email}</p>
      
      <button onClick={() => {
        localStorage.clear(); // Limpa o token
        window.location.href = '/login'; // Manda pro login
      }}>
        Sair do Sistema
      </button>
    </div>
  );
}