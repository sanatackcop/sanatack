"use client";

import { useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContexts";
import { motion } from "framer-motion";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

const FAQs = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { t } = useTranslation();
  const { darkMode } = useSettings();
  const { isRTL, direction } = useLocaleDirection();

  const faqKeys = [
    "faq.questions.q1",
    "faq.questions.q2",
    "faq.questions.q3",
    "faq.questions.q4",
    "faq.questions.q5",
    "faq.questions.q6",
  ];

  const toggleItem = useCallback((index: number) => {
    setOpenItems((prev) => {
      const updated = new Set(prev);
      updated.has(index) ? updated.delete(index) : updated.add(index);
      return updated;
    });
  }, []);

  return (
    <div
      id="faqs"
      className={` py-20 px-4 transition-colors ${
        darkMode ? "bg-zinc-950" : "bg-zinc-50"
      }`}
      dir={direction}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="relative mx-auto max-w-6xl text-center space-y-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl tracking-tight text-gray-900 dark:text-white leading-tight mt-6">
              {t("faq.title")}
            </h2>

            <p className="text-md text-gray-600 dark:text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed">
              {t("faq.subtitle")}{" "}
              <a
                href="#contact"
                className={`underline hover:no-underline ${
                  darkMode ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                {t("faq.contactLink")}
              </a>{" "}
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0">
          {faqKeys.map((questionKey, index) => {
            const isOpen = openItems.has(index);
            const answerKey = questionKey.replace("questions", "answers");

            return (
              <div
                key={index}
                className={`border-b transition-colors ${
                  darkMode ? "border-zinc-800" : "border-zinc-200"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full py-5 flex items-center justify-between ${
                    isRTL ? "text-right flex-row-reverse" : "text-left"
                  } hover:${
                    darkMode ? "bg-zinc-900/50" : "bg-zinc-100/50"
                  } transition-all duration-200 group px-4`}
                >
                  <h3
                    className={`text-base md:text-lg font-medium flex-1 ${
                      isRTL ? "pl-4" : "pr-4"
                    } ${darkMode ? "text-zinc-100" : "text-zinc-900"}`}
                  >
                    {t(questionKey as any)}
                  </h3>

                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
                      isOpen
                        ? isRTL
                          ? "-rotate-90"
                          : "rotate-90"
                        : isRTL
                        ? "rotate-180"
                        : "rotate-0"
                    } ${darkMode ? "text-zinc-500" : "text-zinc-600"}`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`px-4 pb-5 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <p
                      className={`text-sm md:text-base leading-relaxed ${
                        darkMode ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {t(answerKey as any)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
