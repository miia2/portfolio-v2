import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Usamos links de imagens públicas de alta qualidade para as bandeiras (evita bugs no Windows)
  const languages = [
    { code: 'pt', flagUrl: 'https://flagcdn.com/w40/br.png', label: 'PT' },
    { code: 'en', flagUrl: 'https://flagcdn.com/w40/us.png', label: 'EN' },
    { code: 'es', flagUrl: 'https://flagcdn.com/w40/es.png', label: 'ES' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: i18n.language === lang.code ? '#e0e7ff' : '#ffffff',
            border: i18n.language === lang.code ? '2px solid #4f46e5' : '1px solid #ccc',
            borderRadius: '5px',
            fontWeight: i18n.language === lang.code ? 'bold' : 'normal',
          }}
        >
          {/* Imagem da bandeira que nunca quebra */}
          <img 
            src={lang.flagUrl} 
            alt={lang.label} 
            style={{ width: '20px', height: 'auto', borderRadius: '2px' }} 
          />
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;