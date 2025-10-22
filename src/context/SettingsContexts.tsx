import { MaterialType } from "@/utils/types/adminTypes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import i18n from "@/i18n";

// ================== Types ==================
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
  // dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // ✅ language: default Arabic if nothing saved
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "ar";
  });

  // current material
  const [currentCheck, setCurrentCheck] = useState<MaterialCheckInfo>();

  // sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // ✅ sync language with i18n + save to localStorage + set dir
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = i18n.dir(language);
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  const updateCurrentMaterial = (material: MaterialCheckInfo) => {
    setCurrentCheck(() => material);
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
      <div>{children}</div>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
