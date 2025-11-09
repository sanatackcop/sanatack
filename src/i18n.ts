import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar/translation.json";
import en from "./locales/en/translation.json";

const supportedLanguages = ["ar", "en"] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "ar",
    supportedLngs: supportedLanguages,
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
