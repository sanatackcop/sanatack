import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export type SettingsSection = "general" | "subscription" | "usage" | "account";
type SettingsSidebarProps = {
  items: Array<{ value: SettingsSection; labelKey: string; testId: string }>;
};

export function SettingsSidebar({ items }: SettingsSidebarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex h-full w-full flex-col rtl:text-right">
      <div className="shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {t("settings.categories", "Categories")}
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 pb-5 pt-2">
          <TabsList className="flex h-auto w-full flex-col gap-1 bg-transparent p-0">
            {items.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                data-testid={item.testId}
                className="w-full justify-start rtl:justify-end rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-200/60 data-[state=active]:bg-neutral-200 data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-neutral-50"
              >
                {t(item.labelKey, item.value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </ScrollArea>
    </div>
  );
}

export function SettingsMobileTabs({ items }: SettingsSidebarProps) {
  const { t } = useTranslation();
  return (
    <TabsList className="flex w-full justify-between gap-1 rounded-full bg-neutral-100 p-1 text-xs dark:bg-neutral-900 rtl:flex-row-reverse">
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          data-testid={`${item.testId}-mobile`}
          className="flex-1 justify-center rounded-full px-2 py-1 text-xs text-neutral-600 data-[state=active]:bg-white data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:data-[state=active]:bg-neutral-950 dark:data-[state=active]:text-neutral-50"
        >
          {t(item.labelKey, item.value)}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
