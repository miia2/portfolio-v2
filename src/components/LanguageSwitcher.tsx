import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  // Chamamos a função de tradução do i18next
  const { i18n } = useTranslation();

  // Função que muda o idioma
  const mudarIdioma = (idioma: string) => {
    i18n.changeLanguage(idioma);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '10px' }}>
      <button 
        onClick={() => mudarIdioma('pt')}
        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        🇧🇷 PT
      </button>
      
      <button 
        onClick={() => mudarIdioma('en')}
        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        🇺🇸 EN
      </button>
      
      <button 
        onClick={() => mudarIdioma('es')}
        style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        🇪🇸 ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;