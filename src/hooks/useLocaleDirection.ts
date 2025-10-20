import { useMemo } from "react";
import { useSettings } from "@/context/SettingsContexts";
import i18n from "@/i18n";

export const useLocaleDirection = () => {
  const { language } = useSettings();

  return useMemo(() => {
    const currentLanguage = language || i18n.language;
    const direction = i18n.dir(currentLanguage);

    return {
      language: currentLanguage,
      direction,
      isRTL: direction === "rtl",
    };
  }, [language]);
};
