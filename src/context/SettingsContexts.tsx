import { MaterialType } from "@/utils/types/adminTypes";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

export declare type MaterialCheckInfo =
  | VideoCheck
  | QuizGroupCheck
  | ArticleCheck;

interface SettingsContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentCheck: MaterialCheckInfo | undefined;
  updateCurrentCheck: (material: MaterialCheckInfo) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [currentCheck, setCurrentCheck] = useState<MaterialCheckInfo>();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
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
