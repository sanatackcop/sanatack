import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContexts";
import type { SidebarRefreshContextValue } from "@/context/SidebarRefreshContext";
import clsx from "clsx";
import Modal from "@/components/Modal";
import AppSidebarContent from "./helpers/AppSidebarContent";

type MenuItem =
  | {
      title: string;
      icon: any;
      comingSoon?: boolean;
      url: string;
      type?: "link";
      onClick?: any;
    }
  | {
      title: string;
      icon: any;
      type: "feedback";
    };

export type FeedbackMenuItem = Extract<MenuItem, { type: "feedback" }>;

interface AppSidebarProps {
  onCollapse?: () => void;
  onRefreshersChange?: (value: SidebarRefreshContextValue) => void;
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  onMobileMenuChange?: (open: boolean) => void;
}

export function AppSidebar({
  onCollapse,
  onRefreshersChange,
  isMobile: externalIsMobile,
  isMobileMenuOpen: externalIsMobileMenuOpen,
  onMobileMenuChange,
}: AppSidebarProps) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useSettings();
  const [internalIsMobile, setInternalIsMobile] = useState(false);
  const [internalIsMobileMenuOpen, setInternalIsMobileMenuOpen] =
    useState(false);

  const isMobile = externalIsMobile ?? internalIsMobile;
  const isMobileMenuOpen =
    typeof externalIsMobileMenuOpen === "boolean"
      ? externalIsMobileMenuOpen
      : internalIsMobileMenuOpen;

  const setIsMobileMenuOpen = useCallback(
    (open: boolean) => {
      if (onMobileMenuChange) {
        onMobileMenuChange(open);
      } else {
        setInternalIsMobileMenuOpen(open);
      }
    },
    [onMobileMenuChange]
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const location = useLocation();

  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    if (typeof externalIsMobile === "boolean") return;
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setInternalIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [externalIsMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile, setIsMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isMobile]);

  const handleLanguageSelect = (lng: string) => {
    if (lng === language) return;
    setLanguage(lng);
    toast.success(
      t("languages.changed", { lang: t(`languages.${lng}` as any) })
    );
  };

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {!isMobile && (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          lang={i18n.language}
          className="h-full flex flex-col border-r bg-[#F7F7F7] border
         dark:bg-zinc-950 dark:border-zinc-800"
        >
          <AppSidebarContent
            i18n={i18n}
            language={language}
            darkMode={darkMode}
            isMobile={isMobile}
            isRTL={isRTL}
            onCollapse={onCollapse}
            onRefreshersChange={onRefreshersChange}
            setIsSettingsOpen={setIsSettingsOpen}
            toggleDarkMode={toggleDarkMode}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            setLanguage={handleLanguageSelect}
          />
        </div>
      )}

      {isMobile && (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          lang={i18n.language}
          className={clsx(
            "fixed top-0 h-full w-[280px] max-w-[85vw] z-50 transition-transform duration-300 ease-in-out",
            "bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800",
            "shadow-2xl",
            isMobileMenuOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full",
            isRTL ? "right-0" : "left-0"
          )}
        >
          <AppSidebarContent
            i18n={i18n}
            language={language}
            darkMode={darkMode}
            isMobile={isMobile}
            isRTL={isRTL}
            onCollapse={onCollapse}
            onRefreshersChange={onRefreshersChange}
            setIsSettingsOpen={setIsSettingsOpen}
            toggleDarkMode={toggleDarkMode}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            setLanguage={handleLanguageSelect}
          />
        </div>
      )}

      <Modal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        title={t("sidebar.settingsModal.title")}
        description={t("sidebar.settingsModal.description")}
        confirmLabel={t("common.close")}
        showCancel={false}
        onConfirm={() => setIsSettingsOpen(false)}
        dir={isRTL ? "rtl" : "ltr"}
        className="rounded-2xl"
      >
        <div className="space-y-6">
          <div
            className={clsx(
              "flex items-start justify-between gap-3",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {t("sidebar.settingsModal.appearance.title")}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("sidebar.settingsModal.appearance.description")}
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={() => toggleDarkMode()}
              aria-label={t("sidebar.settingsModal.appearance.ariaLabel")}
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {t("sidebar.settingsModal.language.title")}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("sidebar.settingsModal.language.description")}
              </p>
            </div>
            <div
              className={clsx(
                "flex gap-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Button
                type="button"
                size="sm"
                variant={language === "ar" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleLanguageSelect("ar")}
              >
                {t("languages.ar")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={language === "en" ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleLanguageSelect("en")}
              >
                {t("languages.en")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
