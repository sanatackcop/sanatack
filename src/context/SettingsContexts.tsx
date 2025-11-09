import { MaterialType } from "@/utils/types/adminTypes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "@/i18n";

export declare type VideoCheck = {
  id: string;
  type: MaterialType.VIDEO;
  duration: number;
};

export declare type QuizGroupCheck = {
  id: string;
  type: MaterialType.QUIZ_GROUP;
  duration: number;
  result: number;
};

export declare type ArticleCheck = {
  id: string;
  type: MaterialType.ARTICLE;
  duration: number;
  total_read: number;
};

export declare type CodeCheck = {
  id: string;
  type: MaterialType.CODE;
};

export declare type MaterialCheckInfo =
  | VideoCheck
  | QuizGroupCheck
  | ArticleCheck
  | CodeCheck;

interface SettingsContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lng: string) => void;
  currentCheck: MaterialCheckInfo | undefined;
  updateCurrentCheck: (material: MaterialCheckInfo) => void;
}

// ================== Context ==================
const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

const SUPPORTED_LANGUAGES = ["ar", "en"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const supportedLanguageSet = new Set<string>(SUPPORTED_LANGUAGES);
const FALLBACK_LANGUAGE: SupportedLanguage = "ar";

const isBrowser = () => typeof window !== "undefined";

const getSystemPrefersDark = () => {
  if (!isBrowser()) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const getStoredDarkPreference = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem("darkMode");
};

const getInitialDarkMode = () => {
  const savedPreference = getStoredDarkPreference();
  if (savedPreference !== null) {
    return savedPreference === "true";
  }
  return getSystemPrefersDark();
};

const hasManualDarkPreference = () => getStoredDarkPreference() !== null;

const normalizeLanguage = (
  value?: string | null
): SupportedLanguage | undefined => {
  if (!value) return undefined;
  const base = value.split("-")[0]?.toLowerCase();
  if (base && supportedLanguageSet.has(base)) {
    return base as SupportedLanguage;
  }
  return undefined;
};

const getInitialLanguage = (): SupportedLanguage => {
  if (!isBrowser()) return FALLBACK_LANGUAGE;

  const saved = normalizeLanguage(localStorage.getItem("language"));
  if (saved) return saved;

  const primaryNavigatorLang = normalizeLanguage(navigator.language);
  if (primaryNavigatorLang) return primaryNavigatorLang;

  if (Array.isArray(navigator.languages)) {
    for (const lang of navigator.languages) {
      const normalized = normalizeLanguage(lang);
      if (normalized) return normalized;
    }
  }

  return FALLBACK_LANGUAGE;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);
  const [manualDarkPreference, setManualDarkPreference] = useState(
    hasManualDarkPreference
  );

  const [language, setLanguageState] =
    useState<SupportedLanguage>(getInitialLanguage);

  // Current material check
  const [currentCheck, setCurrentCheck] = useState<MaterialCheckInfo>();

  // Sync dark mode class and, when manually chosen, persist the preference
  useEffect(() => {
    if (!isBrowser()) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (manualDarkPreference) {
      localStorage.setItem("darkMode", String(darkMode));
    }
  }, [darkMode, manualDarkPreference]);

  // Keep dark mode aligned with OS preference until the user overrides it
  useEffect(() => {
    if (!isBrowser() || manualDarkPreference) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [manualDarkPreference]);

  // Sync language to i18n, DOM, and localStorage
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = i18n.dir(language);
    document.documentElement.lang = language;
    if (isBrowser()) {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const toggleDarkMode = () => {
    setManualDarkPreference(true);
    setDarkMode((prev) => !prev);
  };

  const updateCurrentMaterial = (material: MaterialCheckInfo) => {
    setCurrentCheck(material);
  };

  const setLanguage = (lng: string) => {
    setLanguageState(normalizeLanguage(lng) || FALLBACK_LANGUAGE);
  };

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
        currentCheck,
        updateCurrentCheck: updateCurrentMaterial,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
