import { useTranslation } from "react-i18next";
import EmptyState from "./EmptyState";

export default function Recent({ isRTL }: { isRTL: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2
            className={`text-lg font-semibold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("sidebar.recent")}
          </h2>
        </div>
        <EmptyState />
      </section>
    </>
  );
}
