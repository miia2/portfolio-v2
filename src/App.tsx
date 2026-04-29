import { useState } from 'react';
import type { MensagemContato } from './types'; // Trazendo o nosso contrato
import './App.css';



function App() {
  // 1. O ESTADO BLINDADO
  // O TypeScript obriga que "formulario" tenha nome, email e mensagem.
  const [formulario, setFormulario] = useState<MensagemContato>({
    nome: '',
    email: '',
    mensagem: ''
  });

  // 2. A FUNÇÃO DE ENVIO REAL (Agora conversando com a internet)
  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar

    try {
      // O 'fetch' é o carteiro do JavaScript que leva os dados
      const resposta = await fetch("https://formspree.io/f/xwvrzagb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formulario) // Transforma nossos dados validados em texto para a viagem
      });

      if (resposta.ok) {
        alert(`Sucesso, ${formulario.nome}! Sua mensagem foi enviada para o e-mail da Mia.`);
        // Limpa os campos do formulário após o envio dar certo!
        setFormulario({ nome: '', email: '', mensagem: '' });
      } else {
        alert("Ops! O servidor recusou a mensagem. Tente novamente.");
      }
    } catch (erro) {
      alert("Erro de conexão. Verifique sua internet.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Mírian Gomes</h1>
        <h2>Engenheira de Software Full-Stack</h2>
        <p>Desenvolvendo soluções robustas e escaláveis com React, TypeScript e Python.</p>
      </header>

      <main>
        <section className="secao">
          <h2>🚀 Ecossistema Ludus 2.0</h2>
          <p>
            Uma aplicação Full-Stack completa com foco em performance e arquitetura limpa. 
            O front-end utiliza React com TypeScript para garantir a segurança dos dados, 
            enquanto a API em Python gerencia a persistência no banco de dados.
          </p>
          <div className="acoes-portal">
            <a href="https://miia2.github.io/Ludus-App/" className="btn-voltar" target="_blank" rel="noreferrer">
              ⚔️ Acessar o Jogo Ludus
            </a>
          </div>
        </section>

        {/* NOVA SEÇÃO: O Formulário */}
        <section className="secao">
          <h2 style={{ textAlign: 'center' }}>📩 Contato Seguro</h2>
          <form onSubmit={enviarMensagem} className="form-contato">
            <input 
              type="text" 
              placeholder="Seu Nome" 
              value={formulario.nome}
              onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
              required 
            />
            <input 
              type="email" 
              placeholder="Seu E-mail" 
              value={formulario.email}
              onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
              required 
            />
            <textarea 
              placeholder="Sua Mensagem" 
              rows={4}
              value={formulario.mensagem}
              onChange={(e) => setFormulario({ ...formulario, mensagem: e.target.value })}
              required 
            />
            <button type="submit" className="btn-enviar">
              Enviar Mensagem
            </button>
          </form>
        </section>
      </main>

      <footer>
        <section className="secao" style={{ textAlign: 'center' }}>
          <h2>Conecte-se comigo</h2>
          <div className="links-contato">
            <a href="https://www.linkedin.com/in/mia-gomes-0172b53b7" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/miia2" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:seu-email@gmail.com">E-mail</a>
          </div>
        </section>
      </footer>
    </div>
  )
}

export default App;