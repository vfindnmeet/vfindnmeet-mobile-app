import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import bg from './translations/bg';
import en from './translations/en';

const resources = {
  en: {
    translation: en,
  },
  bg: {
    translation: bg,
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  //language to use if translations in user language are not available
  fallbackLng: 'bg',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
