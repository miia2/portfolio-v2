import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt', flagUrl: 'https://flagcdn.com/w40/br.png', label: 'PT' },
    { code: 'en', flagUrl: 'https://flagcdn.com/w40/us.png', label: 'EN' },
    { code: 'es', flagUrl: 'https://flagcdn.com/w40/es.png', label: 'ES' },
  ];

  // Normaliza o código do idioma (ex: 'pt-BR' vira 'pt')
  const currentLang = (i18n.language || 'pt').split('-')[0];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#e0e7ff' : '#ffffff',
              border: isActive ? '2px solid #4f46e5' : '1px solid #ccc',
              borderRadius: '5px',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            <img 
              src={lang.flagUrl} 
              alt={lang.label} 
              style={{ width: '20px', height: 'auto', borderRadius: '2px' }} 
            />
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;