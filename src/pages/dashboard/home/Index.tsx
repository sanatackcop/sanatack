import { useTranslation } from "react-i18next";
import Recent from "@/pages/dashboard/workspaces/Recent";
import Spaces from "@/pages/dashboard/spaces/Index";
import { useState } from "react";

export default function LearningDashboard() {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <section className="px-32  py-4 my-5" dir={isRTL ? "rtl" : "ltr"}>
        <header className="mb-2">
          <h2
            className={`text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-5 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("common.workspaceTitle")}
          </h2>
        </header>
        <Recent setParentRefresh={setRefresh} refreshParent={refresh} />
        <Spaces setParentRefresh={setRefresh} refreshParent={refresh} />
      </section>
    </>
  );
}
