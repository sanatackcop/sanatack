import { useTranslation } from "react-i18next";
import Recent from "@/pages/dashboard/workspaces/Recent";
import Spaces from "@/pages/dashboard/spaces/Index";

export default function LearningDashboard() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      <section className="px-32  py-4 my-5" dir={isRTL ? "rtl" : "ltr"}>
        <header className="mb-2">
          <h2
            className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-5 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            Recent Learning Playgrounds
          </h2>
        </header>
        <Recent isRTL={isRTL} />
        <Spaces isRTL={isRTL} />
      </section>
    </>
  );
}
