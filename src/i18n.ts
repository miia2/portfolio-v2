import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPT from './locales/pt/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: translationPT },
      'pt-BR': { translation: translationPT },
      en: { translation: translationEN },
      'en-US': { translation: translationEN },
      es: { translation: translationES },
      'es-ES': { translation: translationES }
    },
    lng: 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;