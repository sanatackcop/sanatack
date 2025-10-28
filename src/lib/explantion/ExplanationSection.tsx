import { Card } from "@/components/ui/card";
import { ExplanationPayload } from "./DeepExplnation";
import { useTranslation } from "react-i18next";

export default function ExplanationSections({
  explanation,
}: {
  explanation: ExplanationPayload;
}) {
  const { t } = useTranslation();
  const hasSections =
    explanation.main_content && explanation.main_content.length > 0;
  const hasAnalysis = explanation.comprehensive_analysis;
  // const hasTips = explanation.study_tips && explanation.study_tips.length > 0;
  const hasApplications =
    explanation.practical_applications &&
    explanation.practical_applications.length > 0;
  const hasKeyTakeaways =
    explanation.key_takeaways && explanation.key_takeaways.length > 0;

  return (
    <div className="space-y-6 h-full">
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {explanation.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {explanation.introduction}
        </p>
      </section>

      {hasSections && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("explanations.view.mainSections", "Main Sections")}
          </h3>
          {explanation.main_content!.map((section, idx) => (
            <Card key={idx} className="p-5 space-y-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {section.section}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
              {section.detailed_breakdown && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                  {section.detailed_breakdown}
                </div>
              )}
              {section.examples && section.examples.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {t("explanations.view.examples", "Examples")}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {section.examples.map((example, exampleIdx) => (
                      <li key={exampleIdx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.key_points && section.key_points.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {t("explanations.view.keyPoints", "Key Points")}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {section.key_points.map((point, pointIdx) => (
                      <li key={pointIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {section.practical_significance && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
                  {section.practical_significance}
                </div>
              )}
            </Card>
          ))}
        </section>
      )}

      {hasAnalysis && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("explanations.view.comprehensiveAnalysis", "Comprehensive Analysis")}
          </h3>
          {explanation.comprehensive_analysis?.core_themes && (
            <Card className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {t("explanations.view.coreThemes", "Core Themes")}
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {explanation.comprehensive_analysis.core_themes.map(
                  (theme, idx) => (
                    <li key={idx}>{theme}</li>
                  )
                )}
              </ul>
            </Card>
          )}
          {explanation.comprehensive_analysis?.detailed_concepts?.map(
            (concept, idx) => (
              <Card key={idx} className="p-4 space-y-2">
                <div className="text-lg font-semibold text-gray-900">
                  {concept.concept}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {concept.in_depth_explanation}
                </p>
                {concept.supporting_details &&
                  concept.supporting_details.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {concept.supporting_details.map((detail, detailIdx) => (
                        <li key={detailIdx}>{detail}</li>
                      ))}
                    </ul>
                  )}
              </Card>
            )
          )}
        </section>
      )}

      {hasApplications && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("explanations.view.practicalApplications", "Practical Applications")}
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.practical_applications!.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* {hasTips && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">Study Tips</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.study_tips!.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      )} */}

      {hasKeyTakeaways && (
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("explanations.view.keyTakeaways", "Key Takeaways")}
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {explanation.key_takeaways!.map((takeaway, idx) => (
              <li key={idx}>{takeaway}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
