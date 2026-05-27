import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationPT from './locales/pt/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador do usuário
  .use(initReactI18next) // Passa a instância do i18n para o React
  .init({
    resources,
    fallbackLng: 'en', // Se ele não achar o idioma do cliente, usa EN por padrão
    interpolation: {
      escapeValue: false // O React já protege contra injeção de código (XSS)
    }
  });

export default i18n;