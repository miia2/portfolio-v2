import { useState, useEffect } from 'react';
import type { MensagemContato } from '../types';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home = () => {
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
        // Alerta traduzido passando o nome de quem enviou como dado dinâmico
        alert(t('contact_success', { nome: formulario.nome }));
        setFormulario({ nome: '', email: '', mensagem: '' });
      }
    } catch (erro) {
      alert(t('contact_error'));
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <LanguageSwitcher />
      
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1>{t('home_title')}</h1>
        <h2>{t('home_subtitle')}</h2>
      </header>
      
      <main>
        <section className="secao" style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', color: '#fff' }}>
          <h2>📩 {t('contact_title')}</h2>
          
          <form onSubmit={enviarMensagem} className="form-contato" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t('contact_name_label')}</label>
              <input 
                type="text"
                value={formulario.nome}
                onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t('contact_email_label')}</label>
              <input 
                type="email"
                value={formulario.email}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>{t('contact_message_label')}</label>
              <textarea 
                value={formulario.mensagem}
                onChange={(e) => setFormulario({ ...formulario, mensagem: e.target.value })}
                required
                rows={4}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#000', resize: 'vertical' }}
              />
            </div>

            <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {t('button_send')}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Home;