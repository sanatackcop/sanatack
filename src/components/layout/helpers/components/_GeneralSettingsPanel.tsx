import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelCard, PanelHeader } from "./_Panel";
import { useSettings } from "@/context/SettingsContexts";

type ThemeOption = "light" | "dark";

const THEME_OPTIONS: Array<{ value: ThemeOption; labelKey: string }> = [
  { value: "light", labelKey: "theme.light" },
  { value: "dark", labelKey: "theme.dark" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", labelKey: "languages.en" },
  { value: "ar", labelKey: "languages.ar" },
];

export type GeneralSettings = {
  theme: ThemeOption;
  language: string;
  compactMode: boolean;
};

export default function GeneralSettingsPanel() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useSettings();

  const currentTheme: ThemeOption = darkMode ? "dark" : "light";

  const handleThemeChange = useCallback(
    (value: ThemeOption) => {
      const newDarkMode = value === "dark";
      if (darkMode !== newDarkMode) {
        toggleDarkMode();
        toast.success(t("settings.general.saved", "Settings updated."));
      }
    },
    [darkMode, toggleDarkMode, t],
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
      if (language !== value) {
        setLanguage(value);
        toast.success(t("settings.general.saved", "Settings updated."));
      }
    },
    [language, setLanguage, t],
  );

  return (
    <div className="space-y-6">
      <PanelHeader
        title={t("settings.general.title", "General")}
        description={t(
          "settings.general.description",
          "Appearance and language preferences.",
        )}
      />

      <PanelCard>
        <PanelHeader
          title={t("settings.general.appearance.title", "Appearance")}
          description={t(
            "settings.general.appearance.description",
            "Choose how the interface should look.",
          )}
        />
        <RadioGroup
          value={currentTheme}
          onValueChange={(value) => handleThemeChange(value as ThemeOption)}
          className="grid gap-3 sm:grid-cols-2"
        >
          {THEME_OPTIONS.map((option) => {
            const id = `theme-${option.value}`;
            return (
              <label
                key={option.value}
                htmlFor={id}
                className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-300"
              >
                <RadioGroupItem id={id} value={option.value} />
                {t(option.labelKey, option.value)}
              </label>
            );
          })}
        </RadioGroup>
      </PanelCard>

      <PanelCard>
        <PanelHeader
          title={t("settings.general.language.title", "Language")}
          description={t(
            "settings.general.language.description",
            "Pick the language used across the interface.",
          )}
        />
        <div className="space-y-3">
          <Label htmlFor="language-select">
            {t("settings.general.language.label", "Language")}
          </Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select">
              <SelectValue
                placeholder={t(
                  "settings.general.language.placeholder",
                  "Select language",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey, option.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PanelCard>
    </div>
  );
}
