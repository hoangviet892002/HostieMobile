import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en.json";
import viTranslation from "./vi.json";
import store from "@/redux/stores";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";

// get current language from redux

const currentLanguage = selectCurrentLanguage(store.getState());

// init i18n
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: {
      translation: enTranslation,
    },
    vi: {
      translation: viTranslation,
    },
  },
  lng: currentLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
