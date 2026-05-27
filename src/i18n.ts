import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationPT from './locales/pt/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

const resources = {
  // Mapeamos tanto a sigla curta quanto a sigla com região para o mesmo arquivo
  pt: { translation: translationPT },
  'pt-BR': { translation: translationPT },
  
  en: { translation: translationEN },
  'en-US': { translation: translationEN },
  
  es: { translation: translationES },
  'es-ES': { translation: translationES }
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'pt', // <-- FORÇA o sistema a começar em português para você testar localmente
    fallbackLng: 'pt', // Se der erro em algo, volta para o português
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;