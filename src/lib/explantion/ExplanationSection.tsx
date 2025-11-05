import { Card } from "@/components/ui/card";
import { ExplanationPayload } from "./DeepExplnation";
import { useTranslation } from "react-i18next";
import { BookOpen, Lightbulb, Target, Sparkles } from "lucide-react";

export default function ExplanationSections({
  explanation,
  language,
}: {
  explanation: ExplanationPayload;
  language: "ar" | "en";
}) {
  const { t } = useTranslation();
  const hasSections =
    explanation.main_content && explanation.main_content.length > 0;
  const hasAnalysis = explanation.comprehensive_analysis;
  const hasApplications =
    explanation.practical_applications &&
    explanation.practical_applications.length > 0;
  const hasKeyTakeaways =
    explanation.key_takeaways && explanation.key_takeaways.length > 0;

  return (
    <div
      className="space-y-8 h-full mt-5"
      dir={language == "ar" ? "rtl" : "ltr"}
    >
      {/* Header Section */}
      <section className="space-y-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {explanation.title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {explanation.introduction}
        </p>
      </section>

      {/* Main Content Sections */}
      {hasSections && (
        <section className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("explanations.view.mainSections", "Main Sections")}
            </h3>
          </div>
          <div className="space-y-4">
            {explanation.main_content!.map((section, idx) => (
              <Card
                key={idx}
                className="p-6 space-y-4 bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.section}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content}
                  </p>
                </div>

                {section.detailed_breakdown && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                      {section.detailed_breakdown}
                    </p>
                  </div>
                )}

                {section.examples && section.examples.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      {t("explanations.view.examples", "Examples")}
                    </p>
                    <ul className="space-y-2 pl-6">
                      {section.examples.map((example, exampleIdx) => (
                        <li
                          key={exampleIdx}
                          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.key_points && section.key_points.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      {t("explanations.view.keyPoints", "Key Points")}
                    </p>
                    <ul className="space-y-2 pl-6">
                      {section.key_points.map((point, pointIdx) => (
                        <li
                          key={pointIdx}
                          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.practical_significance && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      {section.practical_significance}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Comprehensive Analysis */}
      {hasAnalysis && (
        <section className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t(
                "explanations.view.comprehensiveAnalysis",
                "Comprehensive Analysis"
              )}
            </h3>
          </div>

          {explanation.comprehensive_analysis?.core_themes && (
            <Card className="p-5 bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t("explanations.view.coreThemes", "Core Themes")}
              </h4>
              <ul className="space-y-2 pl-6">
                {explanation.comprehensive_analysis.core_themes.map(
                  (theme, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                    >
                      {theme}
                    </li>
                  )
                )}
              </ul>
            </Card>
          )}

          {explanation.comprehensive_analysis?.detailed_concepts?.map(
            (concept, idx) => (
              <Card
                key={idx}
                className="p-5 space-y-3 bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800 hover:shadow-md transition-shadow duration-200"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {concept.concept}
                </h4>
                {concept.in_depth_explanation && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {concept.in_depth_explanation}
                  </p>
                )}
                {concept.supporting_details &&
                  concept.supporting_details.length > 0 && (
                    <ul className="space-y-2 pl-6">
                      {concept.supporting_details.map((detail, detailIdx) => (
                        <li
                          key={detailIdx}
                          className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
              </Card>
            )
          )}
        </section>
      )}

      {/* Practical Applications */}
      {hasApplications && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t(
                "explanations.view.practicalApplications",
                "Practical Applications"
              )}
            </h3>
          </div>
          <Card className="p-5 bg-white dark:bg-zinc-900/60 border-gray-200/60 dark:border-zinc-800">
            <ul className="space-y-3 pl-6">
              {explanation.practical_applications!.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Key Takeaways */}
      {hasKeyTakeaways && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("explanations.view.keyTakeaways", "Key Takeaways")}
            </h3>
          </div>
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-900/50">
            <ul className="space-y-3 pl-6">
              {explanation.key_takeaways!.map((takeaway, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed list-disc font-medium"
                >
                  {takeaway}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
