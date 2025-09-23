import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import your bundled translations
import ar from "./locales/ar/translation.json";
import en from "./locales/en/translation.json";

// check localStorage *before* init
const savedLang = localStorage.getItem("language") || "ar";

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: savedLang, // 👈 force Arabic if nothing saved
  fallbackLng: "ar",
  supportedLngs: ["ar", "en"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
