import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import jaTranslations from '../locales/ja.json';
import enTranslations from '../locales/en.json';
import zhTranslations from '../locales/zh.json';

const resources = {
  ja: {
    translation: jaTranslations,
  },
  en: {
    translation: enTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja', // デフォルト言語
    fallbackLng: 'ja',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
