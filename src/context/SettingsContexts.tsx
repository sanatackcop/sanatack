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

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Initialize dark mode from localStorage (default: false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  // Initialize language from localStorage (default: Arabic)
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "ar";
  });

  // Current material check
  const [currentCheck, setCurrentCheck] = useState<MaterialCheckInfo>();

  // Sync dark mode to DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Sync language to i18n, DOM, and localStorage
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = i18n.dir(language);
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateCurrentMaterial = (material: MaterialCheckInfo) => {
    setCurrentCheck(material);
  };

  const setLanguage = (lng: string) => {
    setLanguageState(lng);
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
