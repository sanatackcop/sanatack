import { PlanType } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { PLAN_TYPE_LABEL_KEYS } from "./_SubscriptionPanel";
import { cn } from "@/lib/utils";

const PLAN_TYPE_BADGE_STYLES: Record<PlanType, string> = {
  [PlanType.FREE]:
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  [PlanType.STARTER]:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  [PlanType.ADVANCED]:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  [PlanType.UNLIMITED]:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function PlanTypeBadge({ planType }: { planType: PlanType }) {
  const { t } = useTranslation();
  const label = t(PLAN_TYPE_LABEL_KEYS[planType], planType);
  const styles =
    PLAN_TYPE_BADGE_STYLES[planType] || PLAN_TYPE_BADGE_STYLES[PlanType.FREE];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles,
      )}
    >
      {label}
    </span>
  );
}
