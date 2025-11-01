import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

interface Feature {
  key: string;
  boldKeys?: string[];
}

interface Plan {
  nameKey: string;
  yearlyPrice: number | string;
  monthlyPrice: number | string;
  periodKey: string;
  subtitleKey?: string;
  descriptionKey: string;
  billingToggle?: boolean;
  isPopular?: boolean;
  features: Feature[];
  buttonTextKey: string;
  buttonVariant: "outline" | "primary";
}

function AnimatedPrice({
  value,
  currency = "SR",
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

  return (
    <span className="tabular-nums">
      {currency}
      {displayValue}
    </span>
  );
}

export function Pricing() {
  const { t } = useTranslation();
  const { isRTL, direction } = useLocaleDirection();
  const [isYearly, setIsYearly] = useState(true);

  const plans: Plan[] = [
    {
      nameKey: "pricing.free.name",
      yearlyPrice: 0,
      monthlyPrice: 0,
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
          boldKeys: [
            "pricing.free.features.pages",
            "pricing.free.features.size",
          ],
        },
      ],
      buttonTextKey: "pricing.free.button",
      buttonVariant: "outline",
    },
    {
      nameKey: "pricing.pro.name",
      yearlyPrice: 45,
      monthlyPrice: 55,
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
    },
    {
      nameKey: "pricing.team.name",
      yearlyPrice: 34,
      monthlyPrice: 42,
      periodKey: "pricing.team.period",
      subtitleKey: "pricing.team.subtitle",
      descriptionKey: "pricing.team.description",
      billingToggle: true,
      features: [
        {
          key: "pricing.team.features.everythingPro",
          boldKeys: ["pricing.team.features.pro"],
        },
        {
          key: "pricing.team.features.discounts",
          boldKeys: ["pricing.team.features.teamSize"],
        },
        {
          key: "pricing.team.features.billing",
          boldKeys: ["pricing.team.features.centralized"],
        },
        {
          key: "pricing.team.features.spaces",
          boldKeys: ["pricing.team.features.shared"],
        },
        {
          key: "pricing.team.features.permissions",
          boldKeys: [
            "pricing.team.features.custom",
            "pricing.team.features.teamWord",
          ],
        },
        {
          key: "pricing.team.minSeats",
          boldKeys: [
            "pricing.team.features.custom",
            "pricing.team.features.teamWord",
          ],
        },
      ],
      buttonTextKey: "pricing.team.button",
      buttonVariant: "outline",
    },
  ];

  const renderFeatureText = (feature: Feature) => {
    const text = t(feature.key as any);

    if (!feature.boldKeys || feature.boldKeys.length === 0) {
      return <span>{text}</span>;
    }

    const parts: (string | JSX.Element)[] = [];
    let remainingText = text;
    let partIndex = 0;

    feature.boldKeys.forEach((boldKey) => {
      const boldText = t(boldKey as any);
      const index = remainingText.indexOf(boldText);

      if (index !== -1) {
        if (index > 0) {
          parts.push(remainingText.substring(0, index));
        }
        parts.push(
          <span
            key={`bold-${partIndex++}`}
            className="text-zinc-900 dark:text-zinc-100"
          >
            {boldText}
          </span>
        );
        remainingText = remainingText.substring(index + boldText.length);
      }
    });

    if (remainingText.length > 0) {
      parts.push(remainingText);
    }

    return <>{parts}</>;
  };

  const getPrice = (plan: Plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  return (
    <section
      id="pricing"
      className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-24 px-4 overflow-hidden transition-colors"
      dir={direction}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mx-auto max-w-4xl text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl tracking-tight text-gray-900 dark:text-white leading-tight">
              {t("pricing.title")}
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mt-5 max-w-2xl mx-auto leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          {/* Global Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg border border-zinc-200 dark:border-zinc-700"
          >
            <span
              className={`px-4 py-2 rounded-full transition-all text-sm ${
                !isYearly
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {t("pricing.billedMonthly")}
            </span>
            <Switch
              checked={isYearly}
              onChange={(e) => setIsYearly(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#10b981",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#10b981",
                },
              }}
            />
            <span
              className={`px-4 py-2 rounded-full transition-all text-sm flex items-center gap-2 ${
                isYearly
                  ? "bg-emerald-500 text-white"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {t("pricing.pro.subtitle")}
              {isYearly && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  -20%
                </span>
              )}
            </span>
          </motion.div>
        </div>

        {/* Floating Pricing Cards */}
        <div className="max-w-[1400px] mx-auto pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
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
                      ? "bg-white dark:bg-zinc-900 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-500/30 border-2 border-emerald-500/30"
                      : "bg-white dark:bg-zinc-900 shadow-xl hover:shadow-2xl border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-5 left-0 right-0 flex justify-center z-20">
                      <span className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-full shadow-lg">
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
                              currency={
                                typeof plan.yearlyPrice === "number" &&
                                plan.yearlyPrice === 0
                                  ? "$"
                                  : "SR"
                              }
                            />
                          </span>
                          <span className="text-base text-zinc-500 dark:text-zinc-400">
                            {t(plan.periodKey as any)}
                          </span>
                        </div>
                        {plan.billingToggle && isYearly && (
                          <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-2">
                            {t("pricing.savingsText", {
                              defaultValue: `Save SR${
                                (plan.monthlyPrice as number) * 12 -
                                (plan.yearlyPrice as number) * 12
                              } annually`,
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
                          ? "bg-emerald-50 dark:bg-emerald-950/20"
                          : "bg-zinc-50 dark:bg-zinc-800/50"
                      }`}
                    >
                      {plan.billingToggle ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-4 h-4 ${
                              plan.isPopular
                                ? "text-emerald-600 dark:text-emerald-500"
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
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
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
                            className={`flex items-start gap-3 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                plan.isPopular
                                  ? "text-emerald-500"
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
                            <span
                              className={`text-sm leading-relaxed ${
                                isRTL ? "text-right" : "text-left"
                              } text-zinc-700 dark:text-zinc-300`}
                            >
                              {renderFeatureText(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="p-8 pt-0">
                      <button
                        className={`w-full py-4 px-6 rounded-2xl text-sm transition-all duration-200 ${
                          plan.buttonVariant === "primary"
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
