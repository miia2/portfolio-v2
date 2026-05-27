import { useState, useEffect } from 'react';
import type { MensagemContato } from '../types';
import api from '../services/api';

// 1. IMPORTAMOS O HOOK DE TRADUÇÃO
import { useTranslation } from 'react-i18next';

const Home = () => {
  // 2. ATIVAMOS A FUNÇÃO DE TRADUÇÃO (t)
  const { t } = useTranslation();

  const [formulario, setFormulario] = useState<MensagemContato>({
    nome: '',
    email: '',
    mensagem: ''
  });

  const testarConexao = async () => {
    try {
      const resposta = await api.get('/'); 
      console.log("Conexão ok:", resposta.data);
    } catch (error) {
      console.log("API alcançada, mas rota não encontrada (404).");
    }
  };

  useEffect(() => {
    testarConexao();
  }, []);

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await fetch("https://formspree.io/f/xwvrzagb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario)
      });

      if (resposta.ok) {
        // 3. ATÉ OS ALERTAS PODEM SER TRADUZIDOS!
        // Passamos o nome dinamicamente para dentro da tradução
        alert(t('alertas.sucesso', { nome: formulario.nome }));
        setFormulario({ nome: '', email: '', mensagem: '' });
      }
    } catch (erro) {
      alert(t('alertas.erro'));
    }
  };

  return (
    <div className="container">
      <header>
        {/* 4. SUBSTITUÍMOS OS TEXTOS FIXOS PELAS CHAVES */}
        <h1>{t('header.nome')}</h1>
        <h2>{t('header.profissao')}</h2>
      </header>
      <main>
        <section className="secao">
            <h2>📩 {t('contato.titulo')}</h2>
            <form onSubmit={enviarMensagem} className="form-contato">
                {/* Exemplo de como ficaria em um input: */}
                {/* <input placeholder={t('contato.placeholder_nome')} /> */}
                <button type="submit">{t('contato.botao_enviar')}</button>
            </form>
        </section>
      </main>
    </div>
  );
};

export default Home;