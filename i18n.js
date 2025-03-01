import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// todo: this should be in (ar.json, en.json)
const resources = {
  en: {
    translation: {
      navbar :{ home: "Home", about: "About", contact: "Contact" },
    },
  },
  ar: {
    translation: {
      navbar: { home: "الرئيسية", about: "حول", contact: "اتصل" },
    },
  },
};



i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
