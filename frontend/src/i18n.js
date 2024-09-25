import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from "i18next-browser-languagedetector";

const sortedlanguage = localStorage.getItem('i18nextLng');
if(sortedlanguage === "en-US"){
  localStorage.setItem("i18nextLng",	"en")
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locals/{{lng}}/translation.json', // Path to your translation files
    },
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
