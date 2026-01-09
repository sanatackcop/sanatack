import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Sparkles,
  DollarSign,
  SaudiRiyal,
  ArrowRight,
} from "lucide-react";
import { Plan, plans } from "@/landingpage/Pricing";
import { PaymentData } from "@/shared/workspaces/modals/PaymentForm";

const BRAND = "#0EB981";
const USD_TO_SAR = 3.75;

export default function PricingDialog({
  handleGetStarted,
}: {
  handleGetStarted: (data: PaymentData) => void;
}) {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");

  const orderedPlans = useMemo(() => {
    const byType = new Map(plans.map((p) => [p.plan_type, p]));
    return ["starter", "advanced", "unlimited"]
      .map((k) => byType.get(k as any))
      .filter(Boolean) as Plan[];
  }, []);

  const price = (plan: Plan): number => {
    const sar = plan.monthlyPriceSAR;
    return currency === "SAR" ? sar : Number((sar / USD_TO_SAR).toFixed(2));
  };

  // Hard cap to guarantee “no scrollbar” in modal
  const visibleFeaturesCount: Record<Plan["plan_type"], number> = {
    free: 0,
    starter: 5,
    advanced: 6,
    unlimited: 7,
  };

  const heightClass: Record<Plan["plan_type"], string> = {
    free: "",
    starter: "lg:min-h-[380px]",
    advanced: "lg:min-h-[405px]",
    unlimited: "lg:min-h-[430px]",
  };

  return (
    <div className="flex flex-col">
      {/* Compact header row */}
      <div className="flex items-start justify-between ">
        <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 shrink-0">
          <button
            onClick={() => setCurrency("SAR")}
            className={[
              "px-3 py-2 text-sm rounded-lg flex items-center gap-1 transition",
              currency === "SAR"
                ? "bg-white dark:bg-zinc-900 shadow text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
            ].join(" ")}
          >
            <SaudiRiyal className="w-4 h-4" /> SAR
          </button>

          <button
            onClick={() => setCurrency("USD")}
            className={[
              "px-3 py-2 text-sm rounded-lg flex items-center gap-1 transition",
              currency === "USD"
                ? "bg-white dark:bg-zinc-900 shadow text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
            ].join(" ")}
          >
            <DollarSign className="w-4 h-4" /> USD
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
        {orderedPlans.map((plan) => {
          const isPopular = !!plan.isPopular; // advanced
          const isDisabled = plan.plan_type === "free";

          const allFeatures = plan.features;
          const maxVisible =
            visibleFeaturesCount[plan.plan_type] ?? allFeatures.length;
          const visible = allFeatures.slice(0, maxVisible);
          const remaining = Math.max(0, allFeatures.length - visible.length);

          return (
            <div key={plan.plan_type} className={heightClass[plan.plan_type]}>
              {/* badge */}
              {isPopular && (
                <div className="relative z-20 flex justify-center">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm -mb-3"
                    style={{
                      background: `linear-gradient(90deg, ${BRAND}, ${BRAND}CC)`,
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    {t("pricing.popularBadge")}
                  </span>
                </div>
              )}

              <div
                className={[
                  "h-full rounded-3xl border bg-white dark:bg-zinc-900",
                  "shadow-sm hover:shadow-md transition-shadow",
                  isPopular
                    ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
                    : "",
                ].join(" ")}
                style={isPopular ? ({ ringColor: BRAND } as any) : undefined}
              >
                {/* Smooth top accent */}
                <div className="rounded-3xl overflow-hidden">
                  <div
                    className="h-9"
                    style={{
                      background: isPopular
                        ? `linear-gradient(135deg, ${BRAND}, ${BRAND}55)`
                        : `linear-gradient(135deg, ${BRAND}66, transparent)`,
                    }}
                  />

                  <div className="p-4">
                    {/* Title/desc */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                          {t(plan.nameKey as any)}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
                          {t(plan.descriptionKey as any)}
                        </p>
                      </div>

                      <span
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap"
                        style={{
                          borderColor: `${BRAND}33`,
                          color: BRAND,
                          background: `${BRAND}10`,
                        }}
                      >
                        {t("pricing.perMonth")}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-end gap-2">
                      <div className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
                        {price(plan).toFixed(2)}
                      </div>
                      <div className="pb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {currency}
                      </div>
                    </div>

                    {/* Features (capped, no scroll) */}
                    <div className="mt-3 h-px bg-zinc-200 dark:bg-zinc-800" />
                    <ul className="mt-3 space-y-2">
                      {visible.map((feature, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span
                            className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0"
                            style={{ background: `${BRAND}16` }}
                          >
                            <Check
                              className="h-4 w-4"
                              style={{ color: BRAND }}
                            />
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300 leading-snug">
                            {t(feature.key as any)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {remaining > 0 && (
                      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        +{remaining}{" "}
                        {t("pricing.moreFeatures", "more features")}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          handleGetStarted({
                            plan_type: plan.plan_type,
                            amount: price(plan),
                            billing_interval: "monthly",
                            currency,
                          })
                        }
                        disabled={isDisabled}
                        className={[
                          "w-full rounded-2xl py-3 text-sm font-semibold transition",
                          "flex items-center justify-center gap-2",
                          isDisabled ? "opacity-60 cursor-not-allowed" : "",
                        ].join(" ")}
                        style={
                          isPopular
                            ? {
                                background: `linear-gradient(90deg, ${BRAND}, ${BRAND}CC)`,
                                color: "white",
                                boxShadow: `0 10px 22px -14px ${BRAND}AA`,
                              }
                            : {
                                background: "transparent",
                                color: "inherit",
                                border: `1px solid ${BRAND}55`,
                              }
                        }
                        onMouseEnter={(e) => {
                          if (isPopular || isDisabled) return;
                          e.currentTarget.style.background = `${BRAND}10`;
                        }}
                        onMouseLeave={(e) => {
                          if (isPopular || isDisabled) return;
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {t(plan.buttonTextKey as any)}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
