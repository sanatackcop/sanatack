import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";
import { SaudiRiyal, DollarSign, Sparkles } from "lucide-react";

interface Feature {
  key: string;
  boldKeys?: string[];
}

export interface Plan {
  nameKey: string;
  yearlyPriceUSD: number | string;
  monthlyPriceUSD: number | string;
  periodKey: string;
  subtitleKey?: string;
  descriptionKey: string;
  billingToggle?: boolean;
  isPopular?: boolean;
  features: Feature[];
  buttonTextKey: string;
  plan_type: "free" | "pro";
  buttonVariant: "outline" | "primary";
}

function AnimatedPrice({
  value,
  currency = "SAR",
}: {
  value: number | string;
  currency?: string;
}) {
  const [displayValue, setDisplayValue] = useState(
    typeof value === "number" ? value : 0
  );
  const prevValueRef = useRef(typeof value === "number" ? value : 0);

  useEffect(() => {
    if (typeof value !== "number") {
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 600;
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (endValue - startValue) / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(startValue + increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  if (typeof value === "string") {
    return <span>{value}</span>;
  }

  const CurrencyIcon = currency === "SAR" ? SaudiRiyal : DollarSign;

  return (
    <span className="tabular-nums flex items-center gap-1">
      <span>{displayValue.toFixed(2)}</span>
      <CurrencyIcon className="w-8 h-8 flex-shrink-0" />
    </span>
  );
}

export const plans: Plan[] = [
  {
    nameKey: "pricing.free.name",
    yearlyPriceUSD: 0,
    monthlyPriceUSD: 0,
    periodKey: "pricing.free.period",
    descriptionKey: "pricing.free.description",
    billingToggle: false,
    features: [
      { key: "pricing.free.features.uploads" },
      {
        key: "pricing.free.features.aiChats",
        boldKeys: ["pricing.free.features.learnPlus"],
      },
      { key: "pricing.free.features.quizAnswers" },
      { key: "pricing.free.features.practiceExams" },
      { key: "pricing.free.features.podcast" },
      {
        key: "pricing.free.features.uploadFiles",
        boldKeys: ["pricing.free.features.pages", "pricing.free.features.size"],
      },
    ],
    buttonTextKey: "pricing.free.button",
    buttonVariant: "outline",
    plan_type: "free",
  },
  {
    nameKey: "pricing.pro.name",
    yearlyPriceUSD: 10.99,
    monthlyPriceUSD: 15.99,
    periodKey: "pricing.pro.period",
    subtitleKey: "pricing.pro.subtitle",
    descriptionKey: "pricing.pro.description",
    billingToggle: true,
    isPopular: true,
    features: [
      {
        key: "pricing.pro.features.unlimitedUploads",
        boldKeys: ["pricing.pro.features.unlimited"],
      },
      {
        key: "pricing.pro.features.unlimitedAI",
        boldKeys: [
          "pricing.pro.features.unlimitedText",
          "pricing.pro.features.aiLimit",
        ],
      },
      {
        key: "pricing.pro.features.unlimitedQuiz",
        boldKeys: ["pricing.pro.features.unlimitedText"],
      },
      {
        key: "pricing.pro.features.unlimitedExams",
        boldKeys: ["pricing.pro.features.unlimitedText"],
      },
      {
        key: "pricing.pro.features.podcasts",
        boldKeys: ["pricing.pro.features.podcastCount"],
      },
      {
        key: "pricing.pro.features.uploadFilesLarge",
        boldKeys: [
          "pricing.pro.features.pagesLarge",
          "pricing.pro.features.sizeLarge",
        ],
      },
    ],
    buttonTextKey: "pricing.pro.button",
    buttonVariant: "primary",
    plan_type: "pro",
  },
];

export function Pricing() {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");

  const USD_TO_SAR = 3.75;

  const getPrice = (plan: Plan) => {
    const priceInUSD = isYearly ? plan.yearlyPriceUSD : plan.monthlyPriceUSD;

    if (typeof priceInUSD === "string") {
      return priceInUSD;
    }

    if (currency === "USD") {
      return priceInUSD;
    } else {
      return priceInUSD * USD_TO_SAR;
    }
  };

  const getSavings = (plan: Plan) => {
    if (
      typeof plan.monthlyPriceUSD === "string" ||
      typeof plan.yearlyPriceUSD === "string"
    ) {
      return 0;
    }

    const monthlyTotal = plan.monthlyPriceUSD * 12;
    const yearlyTotal = plan.yearlyPriceUSD * 12;
    const savingsUSD = monthlyTotal - yearlyTotal;

    return currency === "USD" ? savingsUSD : savingsUSD * USD_TO_SAR;
  };

  const handleCTAClick = () => {
    navigate("/signup");
  };

  return (
    <section
      id="pricing"
      className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-24 px-4 overflow-hidden transition-colors"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <div className="relative mx-auto max-w-4xl text-center space-y-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Main Heading */}
            <h2 className="text-5xl tracking-tight text-gray-900 dark:text-white leading-tight">
              {t("pricing.title")}
            </h2>

            {/* Subtitle */}
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mt-6 max-w-3xl mx-auto leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          {/* Controls Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {/* Currency Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-lg border border-zinc-200 dark:border-zinc-700"
            >
              <button
                onClick={() => setCurrency("SAR")}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                  currency === "SAR"
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-lg scale-105"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                <SaudiRiyal className="w-4 h-4" />
                <span>SAR</span>
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                  currency === "USD"
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-lg scale-105"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>USD</span>
              </button>
            </motion.div>

            {/* Billing Period Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-lg border border-zinc-200 dark:border-zinc-700"
            >
              <button
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
                  !isYearly
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200 text-white dark:text-zinc-900 shadow-lg scale-105"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                {t("pricing.billedMonthly")}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                  isYearly
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-105"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                <span>{t("pricing.pro.subtitle")}</span>
                {isYearly && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                    -20%
                  </span>
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-[1400px] mx-auto pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative transform transition-all duration-300 ${
                  plan.isPopular
                    ? "md:scale-110 z-10"
                    : "md:scale-90 hover:scale-95"
                }`}
                style={{ transformOrigin: "center" }}
              >
                <div
                  className={`flex flex-col rounded-3xl overflow-visible h-full ${
                    plan.isPopular
                      ? "bg-white dark:bg-zinc-900 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/30 border-2 border-blue-500/50"
                      : "bg-white dark:bg-zinc-900 shadow-xl hover:shadow-2xl border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-20">
                      <span className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t("pricing.popularBadge")}
                      </span>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 pb-6">
                      <h3 className="text-2xl text-zinc-900 dark:text-zinc-50 mb-2">
                        {t(plan.nameKey as any)}
                      </h3>

                      <div className="mt-6 mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl tracking-tight text-zinc-900 dark:text-zinc-50">
                            <AnimatedPrice
                              value={getPrice(plan)}
                              currency={currency}
                            />
                          </span>
                          <span className="text-base text-zinc-500 dark:text-zinc-400">
                            {t(plan.periodKey as any)}
                          </span>
                        </div>
                        {plan.billingToggle && isYearly && (
                          <p className="text-sm text-blue-600 dark:text-blue-500 mt-3 font-medium">
                            {t("pricing.savingsText", {
                              defaultValue: `Save ${
                                currency === "SAR" ? "SR" : "$"
                              }${getSavings(plan).toFixed(2)} annually`,
                            })}
                          </p>
                        )}
                      </div>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(plan.descriptionKey as any)}
                      </p>
                    </div>

                    {/* Billing Info */}
                    <div
                      className={`px-8 py-4 ${
                        plan.isPopular
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : "bg-zinc-50 dark:bg-zinc-800/50"
                      }`}
                    >
                      {plan.billingToggle ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 ${
                              plan.isPopular
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-blue-600 dark:text-blue-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                            {isYearly
                              ? t(plan.subtitleKey! as any)
                              : t("pricing.billedMonthly")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {t("pricing.free.freeForEveryone")}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="px-8 py-8 flex-grow">
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-left"
                          >
                            <div>
                              <svg
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  plan.isPopular
                                    ? "text-blue-500"
                                    : "text-blue-600 dark:text-blue-500"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                              {t(feature.key as any)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="p-8 pt-0">
                      <button
                        onClick={handleCTAClick}
                        className={`w-full py-4 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                          plan.buttonVariant === "primary"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:-translate-y-1"
                        } flex items-center justify-center gap-2`}
                      >
                        {t(plan.buttonTextKey as any)}
                        <svg
                          className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
