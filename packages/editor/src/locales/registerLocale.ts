import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';

i18n.use(initReactI18next).init({
  resources: { en },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export function registerLocale(locales: { [lang: string]: { [key: string]: string } }) {
  Object.entries(locales).forEach(([lang, res]) => {
    i18n.addResourceBundle(lang, 'translation', res, true, true);
  });
}

export { i18n };
