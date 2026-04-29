import { useState, useEffect } from 'react'; // Agrupei os imports do React
import type { MensagemContato } from '../types';
// O "../" diz para o sistema: saia da pasta atual e procure na pasta de cima
import api from '../services/api';

const Home = () => {
  // 1. ESTADOS (States) sempre no topo do componente
  const [formulario, setFormulario] = useState<MensagemContato>({
    nome: '',
    email: '',
    mensagem: ''
  });

  // 2. FUNÇÕES DE LÓGICA (Moram aqui dentro agora)
  const testarConexao = async () => {
    try {
      // Isso vai tentar falar com o seu FastAPI
      const resposta = await api.get('/'); 
      console.log("Conexão ok:", resposta.data);
    } catch (error) {
      // Como ainda não criamos a rota "/" no Python, 
      // ele pode dar erro 404, mas se aparecer no console, a conexão funcionou!
      console.log("API alcançada, mas rota não encontrada (404).");
    }
  };

  // 3. EFEITOS (Executam quando a página carrega)
  useEffect(() => {
    testarConexao();
  }, []); // O colchete vazio garante que só executa uma vez

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // DICA: No futuro, você trocará esse link do Formspree 
      // pela sua própria rota no FastAPI!
      const resposta = await fetch("https://formspree.io/f/xwvrzagb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      });

      if (resposta.ok) {
        alert(`Sucesso, ${formulario.nome}! Mensagem enviada.`);
        setFormulario({ nome: '', email: '', mensagem: '' });
      }
    } catch (erro) {
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Mírian Gomes</h1>
        <h2>Engenheira de Software Full-Stack</h2>
      </header>
      <main>
        <section className="secao">
            <h2>📩 Contato Seguro</h2>
            <form onSubmit={enviarMensagem} className="form-contato">
                {/* Aqui vão seus inputs... */}
                <button type="submit">Enviar Mensagem</button>
            </form>
        </section>
      </main>
    </div>
  );
};

export default Home;