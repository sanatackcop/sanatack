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
            className="font-semibold text-zinc-900 dark:text-zinc-100"
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
      className="relative min-h-screen dark:bg-zinc-950 py-20 px-4 overflow-hidden transition-colors"
      dir={direction}
    >
      {/* <Hyperspeed
        effectOptions={{
          onSpeedUp: () => {},
          onSlowDown: () => {},
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3,
          },
        }}
      /> */}

      <div className="max-w-7xl mx-auto">
        <div className="relative mx-auto max-w-6xl text-center space-y-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl tracking-tight text-gray-900 dark:text-white leading-tight mt-6">
              {t("pricing.title")}
            </h2>

            <p className="text-md text-gray-600 dark:text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </motion.div>
        </div>

        <div className="max-w-[1300px] mx-auto relative">
          {/* Shadow wrapper for Pro card */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
            <div className="w-[33.333%] h-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-2xl" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col relative ${
                  index !== plans.length - 1
                    ? `${
                        isRTL ? "border-l" : "border-r"
                      } border-zinc-200 dark:border-zinc-800`
                    : ""
                }`}
              >
                {/* Plan Header */}
                <div className="p-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl  text-zinc-900 dark:text-zinc-50">
                      {t(plan.nameKey as any)}
                    </h2>
                    {plan.isPopular && (
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        {t("pricing.popularBadge")}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">
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
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {t(plan.periodKey as any)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {t(plan.descriptionKey as any)}
                  </p>
                </div>

                <div className="px-8 py-6 min-h-[80px] flex items-center border-b border-zinc-200 dark:border-zinc-800">
                  {plan.billingToggle ? (
                    <div className="flex items-center gap-3">
                      <Switch
                        value={isYearly}
                        onClick={() => setIsYearly(!isYearly)}
                      />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
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

                {/* Features List */}
                <div className="px-8 py-7 flex-grow">
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
                              ? "text-emerald-500 dark:text-emerald-500"
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
                <div className="p-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                      plan.buttonVariant === "primary"
                        ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
