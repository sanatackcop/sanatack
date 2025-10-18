import { useTranslation } from "react-i18next";
import Recent from "@/pages/dashboard/workspaces/Recent";
import Spaces from "@/pages/dashboard/spaces/Index";

export default function LearningDashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      <section className="px-32  py-4">
        <header className="mb-2">
          <h1 className={`text-left text-xl md:text-[24px] font-medium my-5`}>
            Recent Learning Playgrounds 🧠
          </h1>
        </header>
        <Recent isRTL={isRTL} />
        <Spaces isRTL={isRTL} />
      </section>
    </>
  );
}
