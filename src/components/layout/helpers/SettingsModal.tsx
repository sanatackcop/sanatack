import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContexts";
import GeneralSettingsPanel from "./components/_GeneralSettingsPanel";
import SubscriptionPanel from "./components/_SubscriptionPanel";
import UsagePanel from "./components/_UsagePanel";
import {
  SettingsMobileTabs,
  SettingsSection,
  SettingsSidebar,
} from "./components/_SettingsSidebars";

const NAV_ITEMS: Array<{
  value: SettingsSection;
  labelKey: string;
  testId: string;
}> = [
  {
    value: "general",
    labelKey: "navItems.general",
    testId: "settings-nav-general",
  },  
  {
    value: "subscription",
    labelKey: "navItems.subscription",
    testId: "settings-nav-subscription",
  },
  { value: "usage", labelKey: "navItems.usage", testId: "settings-nav-usage" },
  // { value: "account", labelKey: "navItems.account", testId: "settings-nav-account" },
];

export default function SettingsModal({
  isSettingsOpen,
  setIsSettingsOpen,
}: {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const { language } = useSettings();
  const isRTL = language === "ar";

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent
        dir={isRTL ? "rtl" : "ltr"}
        lang={language}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
        className={cn(
          "flex h-[100dvh] w-full flex-col overflow-hidden border border-neutral-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-950",
          "left-auto right-0 top-0 translate-x-0 translate-y-0",
          "sm:left-1/2 sm:right-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "max-w-none sm:h-[88vh] sm:max-w-[1080px] sm:rounded-2xl",
          "[&>button]:hidden",
        )}
      >
        <Tabs
          value={activeSection}
          onValueChange={(value) => setActiveSection(value as SettingsSection)}
          className="flex h-full flex-col"
        >
          <div className="border-b border-neutral-200 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-wrap items-start justify-between gap-4 rtl:flex-row-reverse">
              <div className="space-y-1 rtl:text-right">
                <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {t("sidebar.settings")}
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t(
                    "settings.description",
                    "Manage your preferences, billing, and usage in one place.",
                  )}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  aria-label="Close settings"
                  data-testid="settings-close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 sm:hidden">
              <SettingsMobileTabs items={NAV_ITEMS} />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden rtl:flex-row-reverse">
            <aside className="hidden w-[260px] border-e border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/30 sm:flex">
              <SettingsSidebar items={NAV_ITEMS} />
            </aside>

            <ScrollArea className="flex-1">
              <div className="space-y-8 p-6 rtl:text-right">
                <TabsContent value="general" className="mt-0">
                  <GeneralSettingsPanel />
                </TabsContent>

                <TabsContent value="subscription" className="mt-0">
                  <SubscriptionPanel />
                </TabsContent>

                <TabsContent value="usage" className="mt-0">
                  <UsagePanel />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
