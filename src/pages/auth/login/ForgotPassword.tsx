import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { sendEmailOtpApi } from "@/utils/_apis/auth-apis";

interface FormErrors {
  email?: string;
  general?: string;
}

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (errors.email || errors.general) {
        setErrors({});
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      /**
       * ✅ OTP-based forgot password
       * Backend handles security (no email enumeration)
       */
      await sendEmailOtpApi(email.toLowerCase());

      setSuccess(true);
      toast.success(t("auth.forgot.successToast"));

      /**
       * Optional: redirect after short delay
       */
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1500);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrors({
        general:
          error?.response?.data?.message || t("auth.errors.unexpectedError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
          {t("auth.forgot.title")}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("auth.forgot.subtitle")}
        </p>
      </div>

      {/* Success State */}
      {success ? (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400 text-center">
            {t("auth.forgot.successMessage")}
          </p>

          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t("auth.forgot.continue")}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {errors.general}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label>{t("auth.fields.email")}</Label>
              <Input
                type="email"
                value={email}
                onChange={handleChange}
                placeholder={t("auth.placeholders.email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? t("auth.loading") : t("auth.forgot.submit")}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t("auth.forgot.backToLogin")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
