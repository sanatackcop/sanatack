import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  fetchRateLimitCatalog,
  fetchRateLimitSummary,
} from "@/utils/_apis/rate-limit-api";
import type {
  RateLimitCatalogItem,
  RateLimitSummaryResponse,
} from "@/types/rateLimit";

type UsageMap = Record<string, RateLimitSummaryResponse["usage"]>;

const orderByCategory = (category?: string) => {
  switch (category) {
    case "ai":
      return 0;
    case "content":
      return 1;
    case "ingest":
      return 2;
    default:
      return 3;
  }
};

const formatResetLabel = (
  isoDate: string,
  translate: (key: string, options?: Record<string, unknown>) => string,
  locale: string
) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const formatted = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return translate("dashboard.usage.resets", { time: formatted });
};

export default function UsageSummary() {
  const { t, i18n } = useTranslation();
  const translate = (key: string, options?: Record<string, unknown>) =>
    t(key as any, options as any) as string;
  const [summary, setSummary] = useState<RateLimitSummaryResponse | null>(null);
  const [, setCatalog] = useState<RateLimitCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const [summaryResponse, catalogResponse] = await Promise.all([
          fetchRateLimitSummary(),
          fetchRateLimitCatalog(),
        ]);

        if (!mounted) return;
        setSummary(summaryResponse);
        setCatalog(catalogResponse);
      } catch (err) {
        console.error("Failed to load usage data", err);
        if (mounted) setError(translate("dashboard.usage.error"));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [t]);

  const groupedByCategory = useMemo(() => {
    if (!summary) return {} as UsageMap;
    return summary.usage.reduce((acc, item) => {
      const key = item.category || "default";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as UsageMap);
  }, [summary]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedByCategory).sort((a, b) => {
      return orderByCategory(a) - orderByCategory(b);
    });
  }, [groupedByCategory]);

  const tierLabel = useMemo(() => {
    if (!summary) return "";
    switch (summary.tier) {
      case "free":
        return translate("pricing.free.name");
      case "pro":
        return translate("pricing.pro.name");
      case "team":
        return translate("pricing.team.name");
      case "admin":
        return translate("common.admin", { defaultValue: "Admin" });
      default:
        return summary.tier;
    }
  }, [summary, translate]);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{translate("dashboard.usage.title")}</CardTitle>
          <CardDescription>
            {translate("dashboard.usage.loading")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{translate("dashboard.usage.title")}</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{translate("dashboard.usage.title")}</CardTitle>
          <CardDescription>
            {translate("dashboard.usage.currentPlan")}: {tierLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedCategories.map((category) => {
            const items = groupedByCategory[category];
            if (!items?.length) return null;

            const categoryLabel = (() => {
              switch (category) {
                case "ai":
                  return translate("dashboard.usage.categories.ai");
                case "content":
                  return translate("dashboard.usage.categories.content");
                case "ingest":
                  return translate("dashboard.usage.categories.ingest");
                default:
                  return translate("dashboard.usage.categories.default");
              }
            })();

            return (
              <div key={category} className="space-y-4">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                  {categoryLabel}
                </h4>
                <div className="space-y-4">
                  {items.map((item) => {
                    const limitLabel =
                      item.limit === null
                        ? translate("dashboard.usage.unlimited")
                        : String(item.limit);
                    const progressValue = (() => {
                      if (!item.limit || item.limit <= 0) return 0;
                      return Math.min(
                        (item.usedCredits / item.limit) * 100,
                        100
                      );
                    })();

                    const resetLabel =
                      item.limit !== null
                        ? formatResetLabel(
                            item.windowEndsAt,
                            (key, options) => translate(key, options),
                            i18n.language
                          )
                        : "";

                    return (
                      <div
                        key={item.action}
                        className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {item.label || item.action}
                            </p>
                            {item.description && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {item.limit === null
                              ? translate("dashboard.usage.unlimited")
                              : translate("dashboard.usage.usageSummary", {
                                  used: item.usedCredits,
                                  limit: limitLabel,
                                })}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Progress value={progressValue} />
                          <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                            <span>
                              {translate("dashboard.usage.usageSummary", {
                                used: item.usedCredits,
                                limit:
                                  item.limit === null
                                    ? translate("dashboard.usage.unlimited")
                                    : limitLabel,
                              })}
                            </span>
                            {resetLabel ? <span>{resetLabel}</span> : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
