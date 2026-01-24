import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  Sparkles,
  DollarSign,
  SaudiRiyal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const orderedPlans = useMemo(() => {
    const byType = new Map(plans.map((p) => [p.plan_type, p]));
    return ["starter", "advanced", "unlimited"]
      .map((k) => byType.get(k as Plan["plan_type"]))
      .filter(Boolean) as Plan[];
  }, []);

  const price = (plan: Plan): number => {
    const monthlyPrice = plan.monthlyPriceSAR;
    const basePrice = billingInterval === "yearly" 
      ? monthlyPrice * 10 / 12
      : monthlyPrice;
    return currency === "SAR" ? basePrice : Number((basePrice / USD_TO_SAR).toFixed(2));
  };

  const scrollToCard = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll("[data-plan]");
    if (cards.length === 0 || index < 0 || index >= cards.length) return;

    const card = cards[index] as HTMLElement;
    if (!card) return;

    const scrollLeft =
      card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: isInitialized.current ? "smooth" : "instant",
    });

    setActiveIndex(index);
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll("[data-plan]");
      if (cards.length === 0) return;

      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const element = card as HTMLElement;
        const cardCenter = element.offsetLeft + element.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCard(1);
    }, 50);
    return () => clearTimeout(timer);
  }, [scrollToCard]);

  const goToPrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < orderedPlans.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const heightClass: Record<Plan["plan_type"], string> = {
    free: "",
    starter: "lg:min-h-[400px]",
    advanced: "lg:min-h-[440px]",
    unlimited: "lg:min-h-[400px]",
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
            <button
              onClick={() => setCurrency("SAR")}
              className={[
                "px-3 py-2 text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all duration-200",
                currency === "SAR"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              ].join(" ")}
            >
              <SaudiRiyal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>SAR</span>
            </button>

            <button
              onClick={() => setCurrency("USD")}
              className={[
                "px-3 py-2 text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all duration-200",
                currency === "USD"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              ].join(" ")}
            >
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>USD</span>
            </button>
          </div>

          <div className="flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={[
                "px-3 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200",
                billingInterval === "monthly"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              ].join(" ")}
            >
              {t("pricing.monthly", "Monthly")}
            </button>

            <button
              onClick={() => setBillingInterval("yearly")}
              className={[
                "px-3 py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5",
                billingInterval === "yearly"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-50 font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
              ].join(" ")}
            >
              {t("pricing.yearly", "Yearly")}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                {t("pricing.save", "Save")} 17%
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 disabled:opacity-30 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label={t("actions.previousPage")}
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400 rtl:rotate-180" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === orderedPlans.length - 1}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 disabled:opacity-30 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label={t("actions.nextPage")}
          >
            <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400 rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="lg:hidden flex justify-center gap-2">
        {orderedPlans.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToCard(idx)}
            className={[
              "h-2 rounded-full transition-all duration-300",
              activeIndex === idx
                ? "w-8"
                : "w-2 bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500",
            ].join(" ")}
            style={activeIndex === idx ? { backgroundColor: BRAND } : {}}
            aria-label={orderedPlans[idx].plan_type}
          />
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-4 -mx-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {orderedPlans.map((plan) => (
          <div
            key={plan.plan_type}
            data-plan={plan.plan_type}
            className="flex-shrink-0 w-[calc(100%-2rem)] snap-center min-h-[420px]"
          >
            <PlanCard
              plan={plan}
              price={price(plan)}
              currency={currency}
              billingInterval={billingInterval}
              handleGetStarted={handleGetStarted}
              t={t}
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-end">
        {orderedPlans.map((plan) => (
          <div key={plan.plan_type} className={heightClass[plan.plan_type]}>
            <PlanCard
              plan={plan}
              price={price(plan)}
              currency={currency}
              billingInterval={billingInterval}
              handleGetStarted={handleGetStarted}
              t={t}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  price,
  currency,
  billingInterval,
  handleGetStarted,
  t,
}: {
  plan: Plan;
  price: number;
  currency: "SAR" | "USD";
  billingInterval: "monthly" | "yearly";
  handleGetStarted: (data: PaymentData) => void;
  t: any;
}) {
  const isPopular = !!plan.isPopular;
  const isDisabled = plan.plan_type === "free";

  const visibleFeaturesCount: Record<Plan["plan_type"], number> = {
    free: 0,
    starter: 5,
    advanced: 6,
    unlimited: 7,
  };

  const allFeatures = plan.features;
  const maxVisible = visibleFeaturesCount[plan.plan_type] ?? allFeatures.length;
  const visible = allFeatures.slice(0, maxVisible);
  const remaining = Math.max(0, allFeatures.length - visible.length);

  return (
    <div className="relative h-full">
      {isPopular && (
        <div className="relative z-20 flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md -mb-3"
            style={{
              background: `linear-gradient(90deg, ${BRAND}, ${BRAND}CC)`,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("pricing.popularBadge")}
          </span>
        </div>
      )}

      <div
        className={[
          "h-full rounded-2xl sm:rounded-3xl border bg-white dark:bg-zinc-900",
          "shadow-sm hover:shadow-lg transition-all duration-300",
          isPopular
            ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900"
            : "",
        ].join(" ")}
        style={
          isPopular
            ? ({ "--tw-ring-color": BRAND } as React.CSSProperties)
            : undefined
        }
      >
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden h-full flex flex-col">
          <div
            className="h-8 sm:h-9"
            style={{
              background: isPopular
                ? `linear-gradient(135deg, ${BRAND}, ${BRAND}55)`
                : `linear-gradient(135deg, ${BRAND}66, transparent)`,
            }}
          />

          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {t(`pricing.${plan.plan_type}.name`)}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
                  {t(`pricing.${plan.plan_type}.description`)}
                </p>
              </div>

              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0"
                style={{
                  borderColor: `${BRAND}33`,
                  color: BRAND,
                  background: `${BRAND}10`,
                }}
              >
                {billingInterval === "yearly" 
                  ? t("pricing.billedYearly", "Billed yearly") 
                  : t("pricing.perMonth")}
              </span>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
                {price.toFixed(2)}
              </div>
              <div className="pb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {currency}
              </div>
            </div>

            <div className="mt-3 h-px bg-zinc-200 dark:bg-zinc-800" />

            <ul className="mt-3 space-y-2 flex-1 max-h-[180px] sm:max-h-none scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600">
              {visible.map((feature, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: `${BRAND}16` }}
                  >
                    <Check className="h-3.5 w-3.5" style={{ color: BRAND }} />
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 leading-snug">
                    {t(feature.key as any)}
                  </span>
                </li>
              ))}
            </ul>

            {remaining > 0 && (
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                +{remaining} {t("pricing.moreFeatures")}
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() =>
                  handleGetStarted({
                    plan_type: plan.plan_type,
                    amount: price,
                    billing_interval: billingInterval,
                    currency,
                  })
                }
                disabled={isDisabled}
                className={[
                  "w-full rounded-2xl py-3 text-sm font-semibold transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  isDisabled
                    ? "opacity-60 cursor-not-allowed"
                    : "active:scale-[0.98]",
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
                  e.currentTarget.style.borderColor = BRAND;
                }}
                onMouseLeave={(e) => {
                  if (isPopular || isDisabled) return;
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = `${BRAND}55`;
                }}
              >
                {t(`pricing.${plan.plan_type}.button`)}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
