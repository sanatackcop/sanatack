import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PlanType, useUserContext } from "@/context/UserContext";
import { PanelCard, PanelHeader, PanelSkeleton } from "./_Panel";
import { Badge } from "@/components/ui/badge";
import { DateDisplay } from "@/lib/utils";
import UpgradeModal from "@/shared/workspaces/modals/UpgradeModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SettingsNotification from "./_SettingsNotification";
import Api, { API_METHODS } from "@/utils/_apis/api";

export enum SubscriptionStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  EXPIRED = "expired",
}

const statusVariantMap: Record<
  SubscriptionStatus,
  "default" | "secondary" | "destructive"
> = {
  [SubscriptionStatus.ACTIVE]: "default",
  [SubscriptionStatus.INACTIVE]: "secondary",
  [SubscriptionStatus.PAST_DUE]: "destructive",
  [SubscriptionStatus.CANCELED]: "destructive",
  [SubscriptionStatus.EXPIRED]: "destructive",
};

export const PLAN_TYPE_LABEL_KEYS: Record<PlanType, string> = {
  [PlanType.FREE]: "plans.free",
  [PlanType.STARTER]: "plans.starter",
  [PlanType.ADVANCED]: "plans.advanced",
  [PlanType.UNLIMITED]: "plans.unlimited",
};

export type SubscriptionSettings = {
  id: string;
  billing_interval: "monthly" | "yearly";
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  next_billing_at: string | null;
  canceled_at: string | null;
  last_payment_at: string | null;
  last_transaction_id: string | null;
  plan_type: PlanType;
  status: SubscriptionStatus;
  renewalDate: string;
  paymentMethod: string;
  billingDetails: {
    email: string;
    address: string;
  };
};

const DEFAULT_SUBSCRIPTION: SubscriptionSettings = {
  id: "",
  billing_interval: "monthly",
  amount: 0,
  currency: "SAR",
  created_at: "",
  updated_at: "",
  current_period_start: null,
  current_period_end: null,
  next_billing_at: null,
  canceled_at: null,
  last_payment_at: null,
  last_transaction_id: null,
  plan_type: PlanType.FREE,
  status: SubscriptionStatus.INACTIVE,
  renewalDate: "",
  paymentMethod: "",
  billingDetails: {
    email: "",
    address: "",
  },
};

type SubscriptionResponse = {
  subscription: SubscriptionSettings | null;
};

const fetchSubscriptionStatus = async (
  user_id: string,
): Promise<SubscriptionSettings> => {
  try {
    const response = await Api<SubscriptionResponse>({
      method: API_METHODS.GET,
      url: `/payments/subscription/${user_id}`,
    });

    const sub = response.data.subscription;
    if (!sub) {
      return DEFAULT_SUBSCRIPTION;
    }

    return sub;
  } catch (error) {
    console.error("Failed to fetch subscription status:", error);
    return DEFAULT_SUBSCRIPTION;
  }
};

const cancelSubscription = async (
  user_id: string,
): Promise<{
  status: SubscriptionStatus;
  renewalDate: string;
  canceled_at: string;
}> => {
  const response = await Api<{
    subscription: {
      id: string;
      status: string;
      canceled_at: string;
      current_period_end: string;
      plan_type: PlanType;
    };
  }>({
    method: API_METHODS.POST,
    url: `/payments/subscription/${user_id}/cancel`,
  });

  return {
    status: SubscriptionStatus.CANCELED,
    renewalDate: response.data.subscription.current_period_end || "",
    canceled_at: response.data.subscription.canceled_at,
  };
};

export default function SubscriptionPanel() {
  const { t } = useTranslation();
  const { auth } = useUserContext();

  const [data, setData] = useState<SubscriptionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSubscription = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const subscription = await fetchSubscriptionStatus(auth.user.id);
        if (!cancelled) {
          setData(subscription);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load subscription.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [auth.user.id]);

  const handleCancel = useCallback(async () => {
    try {
      const updated = await cancelSubscription(auth.user.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              status: updated.status,
              renewalDate: updated.renewalDate,
              canceled_at: updated.canceled_at,
            }
          : prev,
      );
      toast.success(
        t("settings.subscription.canceled", "Subscription canceled."),
      );
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to cancel subscription.";
      toast.error(message);
      return false;
    }
  }, [auth.user.id, t]);

  if (isLoading || !data) {
    return <PanelSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        title={t("settings.subscription.title", "Subscription")}
        description={t(
          "settings.subscription.description",
          "Manage your plan and billing details.",
        )}
      />

      {error ? (
        <SettingsNotification
          title={t("settings.subscription.errorTitle", "Billing unavailable")}
          description={error}
          variant="destructive"
        />
      ) : null}

      <PanelCard>
        <div className="flex items-start justify-between gap-3 rtl:flex-row-reverse">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-neutral-500">
              {t("settings.subscription.currentPlan", "Current plan")}
            </p>
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {t(
                PLAN_TYPE_LABEL_KEYS[data.plan_type as PlanType] ||
                  `plans.${data.plan_type}`,
                data.plan_type,
              )}
            </h4>
          </div>
          <Badge variant={statusVariantMap[data.status]}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300 pt-3">
          {data.plan_type !== PlanType.FREE && (
            <>
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <span>{t("settings.subscription.billingInterval", "Billing interval")}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  {t(`settings.subscription.interval.${data.billing_interval}`, data.billing_interval)}
                </span>
              </div>
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <span>{t("settings.subscription.amount", "Amount")}</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  {data.amount} {data.currency}
                </span>
              </div>
            </>
          )}

          {data.status === SubscriptionStatus.CANCELED && data.canceled_at && (
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <span>{t("settings.subscription.canceledAt", "Canceled at")}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {DateDisplay(data.canceled_at)}
              </span>
            </div>
          )}

          {data.current_period_end && (
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <span>
                {data.status === SubscriptionStatus.CANCELED
                  ? t("settings.subscription.accessEnds", "Access ends")
                  : t("settings.subscription.currentPeriodEnd", "Current period ends")}
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {DateDisplay(data.current_period_end)}
              </span>
            </div>
          )}

          {data.status === SubscriptionStatus.ACTIVE && data.next_billing_at && (
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <span>{t("settings.subscription.nextBilling", "Next billing")}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {DateDisplay(data.next_billing_at)}
              </span>
            </div>
          )}

          {data.last_payment_at && (
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <span>{t("settings.subscription.lastPayment", "Last payment")}</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {DateDisplay(data.last_payment_at)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 rtl:flex-row-reverse">
          <UpgradeModal />
          {data.plan_type !== PlanType.FREE && data.status !== SubscriptionStatus.CANCELED && (
            <ConfirmDialog
              triggerLabel={t(
                "settings.subscription.cancel",
                "Cancel subscription",
              )}
              triggerVariant="destructive"
              title={t(
                "settings.subscription.cancelTitle",
                "Cancel subscription",
              )}
              description={t(
                "settings.subscription.cancelDescription",
                "This will stop your renewal at the end of the billing period.",
              )}
              confirmLabel={t(
                "settings.subscription.cancelConfirm",
                "Yes, cancel",
              )}
              cancelLabel={t("settings.subscription.cancelKeep", "Keep plan")}
              onConfirm={handleCancel}
              dataTestId="settings-cancel-subscription"
            />
          )}
        </div>
      </PanelCard>

      <PanelCard>
        <PanelHeader
          title={t("settings.subscription.billing.title", "Billing details")}
          description={t(
            "settings.subscription.billing.description",
            "Update payment methods and invoices.",
          )}
        />
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <span>
              {t(
                "settings.subscription.billing.paymentMethod",
                "Payment method",
              )}
            </span>
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              {data.paymentMethod || t("common.notSet", "Not set")}
            </span>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
