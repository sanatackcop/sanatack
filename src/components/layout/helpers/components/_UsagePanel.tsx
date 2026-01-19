import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { PanelCard, PanelHeader, PanelSkeleton } from "./_Panel";
import SettingsNotification from "./_SettingsNotification";
import {
  RateLimitSummaryResponse,
  RateLimitUsageSummaryItem,
} from "@/types/rateLimit";
import PlanTypeBadge from "./_PlanTypeLabelKeys";
import Api, { API_METHODS } from "@/utils/_apis/api";
import { PlanType } from "@/context/UserContext";

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  ai: "usageCategories.ai",
  content: "usageCategories.content",
  ingest: "usageCategories.ingest",
  other: "usageCategories.other",
};

const DEFAULT_USAGE: RateLimitSummaryResponse = {
  plan_type: PlanType.FREE,
  usage: [],
};

const fetchUsageStats = async (): Promise<RateLimitSummaryResponse> => {
  try {
    const response = await Api<RateLimitSummaryResponse>({
      method: API_METHODS.GET,
      url: "/rate-limit/summary",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch usage stats:", error);
    return DEFAULT_USAGE;
  }
};

export default function UsagePanel() {
  const { t } = useTranslation();

  const [data, setData] = useState<RateLimitSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUsage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const usage = await fetchUsageStats();
        if (!cancelled) {
          setData(usage);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load usage data.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadUsage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading || !data) {
    return <PanelSkeleton />;
  }

  const groupedUsage = data.usage.reduce(
    (acc, item) => {
      const category = item.category || "other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, RateLimitUsageSummaryItem[]>,
  );

  const totalCreditsUsed = data.usage.reduce(
    (sum, item) => sum + item.usedCredits,
    0,
  );
  const totalCreditsLimit = data.usage.reduce(
    (sum, item) => sum + (item.limit ?? 0),
    0,
  );
  const hasUsage = data.usage.length > 0;

  return (
    <div className="space-y-6">
      <PanelHeader
        title={t("settings.usage.title", "Usage")}
        description={t(
          "settings.usage.description",
          "Track your usage for the current billing cycle.",
        )}
        action={<PlanTypeBadge planType={data.plan_type} />}
      />

      {error ? (
        <SettingsNotification
          title={t("settings.usage.errorTitle", "Usage data unavailable")}
          description={error}
          variant="destructive"
        />
      ) : null}

      {hasUsage ? (
        <>
          <PanelCard>
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {t("settings.usage.totalCredits", "Total Credits Used")}
                </p>
                <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                  {totalCreditsUsed.toLocaleString()}
                  <span className="text-base font-normal text-neutral-500">
                    {" "}
                    / {totalCreditsLimit.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="rtl:text-left text-right">
                <p className="text-sm text-neutral-500">
                  {t("settings.usage.actionsUsed", "Actions Used")}
                </p>
                <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
                  {data.usage.reduce((sum, item) => sum + item.hits, 0)}
                </p>
              </div>
            </div>
            <Progress
              value={
                totalCreditsLimit > 0
                  ? Math.min(
                      100,
                      Math.round((totalCreditsUsed / totalCreditsLimit) * 100),
                    )
                  : 0
              }
              className="h-2"
            />
          </PanelCard>

          {Object.entries(groupedUsage).map(([category, items]) => (
            <PanelCard key={category}>
              <PanelHeader
                title={t(
                  CATEGORY_LABEL_KEYS[category] ||
                    `usageCategories.${category}`,
                  category,
                )}
                description={t(
                  `settings.usage.category.${category}`,
                  `Usage for ${category} features`,
                )}
              />
              <div className="space-y-4">
                {items.map((item) => {
                  const percent =
                    item.limit !== null && item.limit > 0
                      ? Math.min(
                          100,
                          Math.round((item.usedCredits / item.limit) * 100),
                        )
                      : 0;
                  const isUnlimited = item.limit === null;
                  const isNearLimit = percent >= 80;

                  const actionLabel = t(
                    `settings.usage.actions.${item.action}.label`,
                    item.label || item.action,
                  );
                  const actionDescription = t(
                    `settings.usage.actions.${item.action}.description`,
                    item.description || "",
                  );

                  return (
                    <div key={item.action} className="space-y-2">
                      <div className="flex items-start justify-between gap-2 rtl:flex-row-reverse">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 rtl:flex-row-reverse">
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                              {actionLabel}
                            </span>
                            {isNearLimit && !isUnlimited && (
                              <Badge variant="destructive" className="text-xs">
                                {t("settings.usage.nearLimit", "Near limit")}
                              </Badge>
                            )}
                          </div>
                          {actionDescription && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                              {actionDescription}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                            {item.usedCredits}
                            {isUnlimited
                              ? ` ${t("settings.usage.credits", "credits")}`
                              : ` / ${item.limit}`}
                          </span>
                          <p className="text-xs text-neutral-500">
                            {item.hits}{" "}
                            {item.hits === 1
                              ? t("settings.usage.use", "use")
                              : t("settings.usage.uses", "uses")}{" "}
                            × {item.creditsPerUse}{" "}
                            {t("settings.usage.creditsEach", "credits each")}
                          </p>
                        </div>
                      </div>
                      {!isUnlimited && (
                        <Progress
                          value={percent}
                          className={cn(
                            "h-1.5",
                            isNearLimit && "[&>div]:bg-red-500",
                          )}
                        />
                      )}
                      {isUnlimited && (
                        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </PanelCard>
          ))}
        </>
      ) : (
        <SettingsNotification
          title={t("settings.usage.noUsage", "No usage yet")}
          description={t(
            "settings.usage.noUsageDescription",
            "Usage will appear once activity is recorded.",
          )}
        />
      )}
    </div>
  );
}
