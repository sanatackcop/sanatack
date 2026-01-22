import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Crown } from "lucide-react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentData } from "./PaymentForm";

import PaymentForm from "@/shared/workspaces/modals/PaymentForm";
import PricingDialog from "@/components/layout/PricingDialog";
import UserContext from "@/context/UserContext";

enum UpgradeSteps {
  SELECT_PLAN = 1,
  PAY_SUBSCRIPTION = 2,
}

export default function UpgradeModal() {
  const { t, i18n } = useTranslation();
  const userContext = useContext(UserContext);

  const isRTL = i18n.dir() === "rtl";

  const [step, setStep] = useState<UpgradeSteps>(UpgradeSteps.SELECT_PLAN);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  function handleGetStarted(data: PaymentData) {
    const finalData = { ...data };

    if (finalData.billing_interval === "yearly") {
      finalData.amount = finalData.amount * 12;
    }

    setPaymentData(finalData);
    setStep(UpgradeSteps.PAY_SUBSCRIPTION);
  }

  function goBack() {
    setStep(UpgradeSteps.SELECT_PLAN);
  }

  const isPaymentStep = step === UpgradeSteps.PAY_SUBSCRIPTION;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full flex ${
            isRTL ? "justify-between" : "justify-start"
          } p-2 m-0 hover:bg-yellow-50 dark:hover:bg-yellow-900/20`}
        >
          {!isRTL && (
            <Crown
              size={16}
              strokeWidth={2}
              className="text-yellow-600 dark:text-yellow-500"
            />
          )}
          <p>{t("payment.upgrade", "Upgrade")}</p>
          {isRTL && (
            <Crown
              size={16}
              strokeWidth={2}
              className="text-yellow-600 dark:text-yellow-500"
            />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {t("payment.upgrade", "Upgrade")}
            </DialogTitle>

            <span className="text-xs text-zinc-500">
              {t("payment.step", "Step")} {step} {t("common.of", "of")} 2
            </span>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            {step === UpgradeSteps.SELECT_PLAN
              ? t(
                  "payment.upgradePrompt",
                  "Choose the plan that fits your learning goals."
                )
              : t(
                  "payment.paymentPrompt",
                  "Complete your secure payment to activate your subscription."
                )}
          </p>

          <div className="mt-3 h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{
                width: step === UpgradeSteps.SELECT_PLAN ? "50%" : "100%",
              }}
            />
          </div>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto">
          {step === UpgradeSteps.SELECT_PLAN && (
            <PricingDialog handleGetStarted={handleGetStarted} />
          )}

          {step === UpgradeSteps.PAY_SUBSCRIPTION && (
            <>
              {!paymentData ? (
                <EmptyState
                  title="Something went wrong"
                  description="Please go back and select a plan again."
                />
              ) : !userContext?.auth?.user?.id ? (
                <EmptyState
                  title="User not found"
                  description="Please sign in again to continue."
                />
              ) : (
                <div className="mx-auto max-w-xl">
                  <div
                    className="
              rounded-xl
              border border-zinc-200 dark:border-zinc-800
              bg-white dark:bg-zinc-900
              shadow-sm
              p-6
            "
                  >
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("payment.completePayment", "Complete your payment")}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {t(
                          "payment.secureSubscription",
                          "Secure subscription payment"
                        )}
                      </p>
                    </div>

                    <PaymentForm
                      amount={Math.round(paymentData.amount * 100)}
                      currency={paymentData.currency}
                      description={`Subscribing ${paymentData.billing_interval} to Sanatack`}
                      callback_url={`${
                        import.meta.env.VITE_BASE_URL
                      }/payment/callback`}
                      language={i18n.language === "ar" ? "ar" : "en"}
                      metadata={{
                        user_id: userContext.auth.user.id,
                        plan_type: paymentData.plan_type,
                        billing_interval: paymentData.billing_interval,
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {isPaymentStep ? (
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="flex items-center gap-1 text-zinc-600"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("common.back", "Back")}
            </Button>
          </div>
        ) : (
          <span />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
        {description}
      </p>
    </div>
  );
}
