import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Sparkles, DollarSign, SaudiRiyal } from "lucide-react";
import { Plan, plans } from "@/landingpage/Pricing";
import { PaymentData } from "@/shared/workspaces/modals/PaymentForm";

export default function PricingDialog({
  handleGetStarted,
}: {
  handleGetStarted: ({
    plan_type,
    amount,
    billing_interval,
  }: PaymentData) => void;
}) {
  const { t } = useTranslation();

  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");

  const USD_TO_SAR = 3.75;

  const price = (plan: Plan): number => {
    const base = isYearly ? plan.yearlyPriceUSD : plan.monthlyPriceUSD;
    return currency === "USD" ? Number(base) : Number(base) * USD_TO_SAR;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl h-full flex flex-col">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {t("pricing.title")}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          {t("pricing.subtitle")}
        </p>
      </div>

      <div className="px-6 py-4 flex flex-wrap gap-3 justify-between items-center">
        <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 py-1.5 text-sm rounded-md ${
              !isYearly ? "bg-white dark:bg-zinc-900 shadow" : "text-zinc-500"
            }`}
          >
            {t("pricing.billedMonthly")}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 py-1.5 text-sm rounded-md ${
              isYearly ? "bg-white dark:bg-zinc-900 shadow" : "text-zinc-500"
            }`}
          >
            {t("pricing.pro.subtitle")}
          </button>
        </div>

        <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
          <button
            onClick={() => setCurrency("SAR")}
            className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
              currency === "SAR"
                ? "bg-white dark:bg-zinc-900 shadow"
                : "text-zinc-500"
            }`}
          >
            <SaudiRiyal className="w-4 h-4" /> SAR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${
              currency === "USD"
                ? "bg-white dark:bg-zinc-900 shadow"
                : "text-zinc-500"
            }`}
          >
            <DollarSign className="w-4 h-4" /> USD
          </button>
        </div>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {plans.map((plan, ind) => (
          <div
            key={ind}
            className={`relative rounded-lg border flex flex-col ${
              plan.isPopular
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10">
                <Sparkles className="w-3 h-3" />
                {t("pricing.popularBadge")}
              </span>
            )}

            <div className="p-5 border-b border-zinc-200 dark:border-zinc-700">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {t(plan.nameKey as any)}
              </h3>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {t(plan.descriptionKey as any)}
              </p>

              <div className="mt-4">
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {price(plan).toFixed(2)}{" "}
                  <span className="text-base font-medium text-zinc-500">
                    {currency}
                  </span>
                </div>

                <div className="text-xs text-zinc-500">
                  {isYearly
                    ? t("pricing.pro.subtitle")
                    : t("pricing.billedMonthly")}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 flex-1 overflow-y-auto">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {t(feature.key as any)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() =>
                  handleGetStarted({
                    plan_type: plan.plan_type,
                    amount: price(plan),
                    billing_interval: isYearly ? "yearly" : "monthly",
                    currency,
                  })
                }
                disabled={plan.plan_type === "free"}
                className={`w-full py-3 rounded-md text-sm font-semibold transition ${
                  plan.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {t(plan.buttonTextKey as any)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
