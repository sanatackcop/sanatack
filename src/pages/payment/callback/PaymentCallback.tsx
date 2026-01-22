import { verifyPayment } from "@/utils/_apis/payment.api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaymentRes,
  PaymentResError,
  PaymentType,
} from "@/types/payment.types";
import { refreshTokens } from "@/utils/_apis/api";
import { useUserContext } from "@/context/UserContext";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const BRAND = "#0EB981";

type UIStatus = "verifying" | "success" | "failed" | "error";

const PaymentCallback = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserContext();
  const isRTL = i18n.dir() === "rtl";
  const locale = i18n.language || "en";

  const payment_id = searchParams.get("id");

  const [status, setStatus] = useState<UIStatus>("verifying");
  const [message, setMessage] = useState<string>(() =>
    t("paymentCallback.messages.verifying", {
      defaultValue: "Verifying your payment...",
    }),
  );
  const [paymentData, setPaymentData] = useState<PaymentRes | null>(null);

  const [redirectIn, setRedirectIn] = useState<number>(5);
  const redirectTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

  const header = useMemo(() => {
    switch (status) {
      case "verifying":
        return {
          title: t("paymentCallback.header.verifying.title", {
            defaultValue: "Verifying payment",
          }),
          subtitle: t("paymentCallback.header.verifying.subtitle", {
            defaultValue: "Please don't close this tab.",
          }),
        };
      case "success":
        return {
          title: t("paymentCallback.header.success.title", {
            defaultValue: "Payment successful",
          }),
          subtitle: t("paymentCallback.header.success.subtitle", {
            defaultValue: "Your subscription is now active.",
          }),
        };
      case "failed":
        return {
          title: t("paymentCallback.header.failed.title", {
            defaultValue: "Payment not completed",
          }),
          subtitle: t("paymentCallback.header.failed.subtitle", {
            defaultValue: "It looks like the payment didn't go through.",
          }),
        };
      case "error":
        return {
          title: t("paymentCallback.header.error.title", {
            defaultValue: "Something went wrong",
          }),
          subtitle: t("paymentCallback.header.error.subtitle", {
            defaultValue: "We couldn't verify your payment.",
          }),
        };
      default:
        return { title: "", subtitle: "" };
    }
  }, [status, t]);

  const tone = useMemo(() => {
    // Tailwind classes chosen to be clean in light & dark mode
    switch (status) {
      case "success":
        return {
          ring: "ring-1 ring-emerald-200 dark:ring-emerald-900/50",
          bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
          text: "text-emerald-700 dark:text-emerald-200",
          iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
        };
      case "failed":
        return {
          ring: "ring-1 ring-rose-200 dark:ring-rose-900/40",
          bg: "bg-rose-50/70 dark:bg-rose-950/20",
          text: "text-rose-700 dark:text-rose-200",
          iconBg: "bg-rose-100 dark:bg-rose-900/40",
        };
      case "error":
        return {
          ring: "ring-1 ring-amber-200 dark:ring-amber-900/40",
          bg: "bg-amber-50/70 dark:bg-amber-950/20",
          text: "text-amber-700 dark:text-amber-200",
          iconBg: "bg-amber-100 dark:bg-amber-900/40",
        };
      case "verifying":
      default:
        return {
          ring: "ring-1 ring-zinc-200 dark:ring-zinc-800",
          bg: "bg-zinc-50/70 dark:bg-zinc-900/40",
          text: "text-zinc-700 dark:text-zinc-200",
          iconBg: "bg-zinc-100 dark:bg-zinc-800",
        };
    }
  }, [status]);

  const clearTimers = () => {
    if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    if (tickTimerRef.current) window.clearInterval(tickTimerRef.current);
    redirectTimerRef.current = null;
    tickTimerRef.current = null;
  };

  const goDashboard = () => navigate("/dashboard/overview");

  const startRedirectCountdown = (seconds = 5) => {
    clearTimers();
    setRedirectIn(seconds);

    tickTimerRef.current = window.setInterval(() => {
      setRedirectIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    redirectTimerRef.current = window.setTimeout(() => {
      goDashboard();
    }, seconds * 1000);
  };

  const verify = async () => {
    clearTimers();
    setStatus("verifying");
    setMessage(
      t("paymentCallback.messages.verifying", {
        defaultValue: "Verifying your payment...",
      }),
    );
    setPaymentData(null);

    if (!payment_id) {
      setStatus("error");
      setMessage(
        t("paymentCallback.messages.missingId", {
          defaultValue: "Missing payment ID in the callback URL.",
        }),
      );
      return;
    }

    try {
      const { data }: { data: PaymentRes | PaymentResError } =
        await verifyPayment({ payment_id });

      // API error shape
      if ("type" in data) {
        setStatus("error");
        setMessage(
          data.message ||
            t("paymentCallback.messages.verificationFailed", {
              defaultValue: "Payment verification failed.",
            }),
        );
        return;
      }

      // Business status
      if (data.status === PaymentType.PAID) {
        setStatus("success");
        setMessage(
          t("paymentCallback.messages.confirmed", {
            defaultValue: "Thanks! Your payment was confirmed.",
          }),
        );
        setPaymentData(data);

        // Refresh auth ONLY on success (cleaner + avoids overriding session on failed payments)
        const loginRes = await refreshTokens();
        login(loginRes);

        // Auto redirect
        startRedirectCountdown(5);
        return;
      }

      setStatus("failed");
      setMessage(
        t("paymentCallback.messages.status", {
          status: data.status,
          defaultValue: `Payment status: ${data.status}`,
        }),
      );
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessage(
        t("paymentCallback.messages.verifyError", {
          defaultValue: "We couldn't verify your payment. Please try again.",
        }),
      );
    }
  };

  useEffect(() => {
    verify();
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Icon = () => {
    if (status === "verifying")
      return <Loader2 className="h-6 w-6 animate-spin" />;
    if (status === "success") return <CheckCircle2 className="h-6 w-6" />;
    if (status === "failed") return <XCircle className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  const primaryButtonStyle =
    status === "success"
      ? {
          background: `linear-gradient(90deg, ${BRAND}, ${BRAND}CC)`,
          boxShadow: `0 10px 24px -14px ${BRAND}AA`,
        }
      : undefined;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen px-4 flex items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="w-full max-w-md">
        {/* Brand top glow */}
        <div
          className="mx-auto mb-4 h-1.5 w-24 rounded-full"
          style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND}55)` }}
        />

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/60 backdrop-blur shadow-sm">
          <div className="p-6">
            {/* Status row */}
            <div
              className={`flex items-start gap-3 rounded-2xl p-4 ${tone.bg} ${tone.ring}`}
            >
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center ${tone.iconBg}`}
              >
                <span className={tone.text}>
                  <Icon />
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {header.title}
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {header.subtitle}
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
              {message}
            </p>

            {/* Success details (compact + clean) */}
            {status === "success" && paymentData && (
              <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-zinc-500">
                      {t("paymentCallback.details.amount", {
                        defaultValue: "Amount",
                      })}
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {paymentData.amount_formatted}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-500">
                      {t("paymentCallback.details.date", {
                        defaultValue: "Date",
                      })}
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {new Date(paymentData.created_at).toLocaleString(locale)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-zinc-500">
                      {t("paymentCallback.details.description", {
                        defaultValue: "Description",
                      })}
                    </div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 break-words">
                      {paymentData.description}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-xs text-zinc-500">
                      {t("paymentCallback.details.paymentId", {
                        defaultValue: "Payment ID",
                      })}
                    </div>
                    <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all">
                      {paymentData.payment_id}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {status === "success" ? (
                <>
                  <button
                    onClick={goDashboard}
                    className={`w-full rounded-2xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition ${isRTL ? "flex-row-reverse" : ""}`}
                    style={primaryButtonStyle}
                  >
                    {t("paymentCallback.actions.goDashboard", {
                      defaultValue: "Go to Dashboard",
                    })}
                    <ArrowRight
                      className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                    {t("paymentCallback.redirecting", {
                      seconds: redirectIn,
                      defaultValue: "Redirecting in {{seconds}}s",
                    })}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={verify}
                    className={`w-full rounded-2xl py-3 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t("paymentCallback.actions.tryAgain", {
                      defaultValue: "Try again",
                    })}
                  </button>

                  <button
                    onClick={goDashboard}
                    className="w-full rounded-2xl py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                  >
                    {t("paymentCallback.actions.backToDashboard", {
                      defaultValue: "Back to Dashboard",
                    })}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: BRAND }}
              />
              {t("paymentCallback.secureVerification", {
                defaultValue: "Secure payment verification",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
