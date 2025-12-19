import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  loginApi,
  LoginResult,
  firebaseSignInApi,
  signupApi,
  sendEmailOtpApi,
  verifyOtpApi,
} from "@/utils/_apis/auth-apis";
import UserContext from "@/context/UserContext";
import { ChangeEvent, FormEvent, useContext, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface LoginFormProps {
  useSignup?: boolean;
}

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = ({ className = "", type = "text", label, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
    )}
    <input
      type={type}
      className={`flex h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 transition-all ${className}`}
      {...props}
    />
  </div>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-xs text-red-600 font-semibold flex items-center gap-2 mt-1">
      {message}
    </p>
  ) : null;

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
};

type AuthStep = "form" | "verify-otp";

export const LoginForm: React.FC<LoginFormProps> = ({ useSignup = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const login = userContext?.login;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<AuthStep>("form");
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [otp, setOtp] = useState("");

  const copy = useMemo(
    () =>
      useSignup
        ? {
            title: t("auth.signup.title"),
            subtitle: t("auth.signup.subtitle"),
            primaryCta: t("auth.signup.submitButton"),
            switchPrompt: t("auth.signup.hasAccount"),
            switchAction: t("auth.signup.signIn"),
            switchHref: "/login",
            googleCta: t("auth.signup.googleButton"),
            successMessage: t("auth.signup.success"),
          }
        : {
            title: t("auth.login.title"),
            subtitle: t("auth.login.subtitle"),
            primaryCta: t("auth.login.submitButton"),
            switchPrompt: t("auth.login.noAccount"),
            switchAction: t("auth.login.signUp"),
            switchHref: "/signup",
            googleCta: t("auth.login.googleButton"),
            successMessage: t("auth.login.success"),
          },
    [useSignup, t]
  );

  const handleInputChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined, general: undefined }));
    };

  const validateForm = (): boolean => {
    const e: FormErrors = {};

    if (!formData.email) e.email = t("auth.validation.emailRequired");
    if (!formData.password) e.password = t("auth.validation.passwordRequired");

    if (useSignup) {
      if (!formData.firstName)
        e.firstName = t("auth.validation.firstNameRequired");
      if (!formData.lastName)
        e.lastName = t("auth.validation.lastNameRequired");
      if (formData.password.length < 6)
        e.password = t("auth.validation.passwordLength");
      if (formData.confirmPassword !== formData.password)
        e.confirmPassword = t("auth.validation.passwordMismatch");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const persistSession = (result: LoginResult) => {
    if (!login || result.message) return;

    login({
      role: result.role,
      type: result.type,
      user: result.user,
      refresh_token: result.refresh_token,
      is_pro: result.is_pro,
    });

    navigate("/dashboard", { replace: true });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOtpApi(otp, pendingEmail);

      persistSession(result);
      toast.success("Email verified successfully");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Invalid or expired verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await sendEmailOtpApi(pendingEmail);
      toast.success("Verification code resent");
    } catch {
      toast.error("Failed to resend code");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (useSignup) {
        await signupApi({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName!,
          last_name: formData.lastName!,
          phone: "",
          interests: [],
          userType: "student",
        });

        setPendingEmail(formData.email);
        setStep("verify-otp");

        toast.success("Verification code sent to your email");
        return;
      } else {
        await loginApi({
          email: formData.email,
          password: formData.password,
        });
        await sendEmailOtpApi(formData.email);

        setPendingEmail(formData.email);
        setStep("verify-otp");

        toast.success("Verification code sent to your email");
      }
    } catch (err: any) {
      setErrors({
        general:
          err?.response?.data?.message ||
          err?.message ||
          err?.error?.body ||
          t("auth.errors.unexpectedError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;

      if (!firebaseUser.email) {
        throw new Error(t("auth.errors.noEmail"));
      }

      const idToken = await firebaseUser.getIdToken(true);
      const nameParts =
        firebaseUser.displayName?.split(" ").filter(Boolean) ?? [];
      const [firstName, ...rest] = nameParts;

      const result = await firebaseSignInApi({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName ?? undefined,
        firstName: firstName ?? undefined,
        lastName: rest.join(" ") || undefined,
        phoneNumber: firebaseUser.phoneNumber ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        idToken,
      });

      persistSession(result);
      toast.success(copy.successMessage);
    } catch (error) {
      console.error("Google auth error:", error);
      if (error instanceof FirebaseError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("auth.errors.googleUnexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "google") => {
    if (provider === "google") {
      void handleGoogleAuth();
      return;
    }
    toast.info(t("auth.comingSoon"));
  };

  return (
    <div className="w-full space-y-6">
      {step === "form" && (
        <>
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">{copy.title}</h1>
            <p className="text-sm text-zinc-500">{copy.subtitle}</p>
          </div>

          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() => handleOAuth("google")}
            disabled={isLoading}
            type="button"
          >
            {copy.googleCta}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-300 dark:border-zinc-600" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white dark:bg-zinc-800 px-4 text-zinc-500 dark:text-zinc-400 font-medium">
                {t("auth.divider")}
              </span>
            </div>
          </div>

          {errors.general && (
            <p className="text-xs text-red-600 text-destructive text-center">
              {errors.general}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {useSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label={t("auth.fields.firstName")}
                    value={formData.firstName ?? ""}
                    onChange={handleInputChange("firstName")}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  <FieldError message={errors.firstName} />
                </div>
                <div>
                  <Input
                    label={t("auth.fields.lastName")}
                    value={formData.lastName ?? ""}
                    onChange={handleInputChange("lastName")}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  <FieldError message={errors.lastName} />
                </div>
              </div>
            )}

            <Input
              label={t("auth.fields.email")}
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              className={
                errors.email ? "border-destructive focus:ring-destructive" : ""
              }
            />
            <FieldError message={errors.email} />

            <div className="relative">
              <Input
                label={t("auth.fields.password")}
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-1 top-9 p-3 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {useSignup && (
              <>
                <Input
                  label={t("auth.fields.confirmPassword")}
                  type="password"
                  value={formData.confirmPassword ?? ""}
                  onChange={handleInputChange("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                <FieldError message={errors.confirmPassword} />
              </>
            )}

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.loading") : copy.primaryCta}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {copy.switchPrompt}{" "}
            <Link to={copy.switchHref} className="font-semibold text-primary">
              {copy.switchAction}
            </Link>
          </div>
        </>
      )}

      {step === "verify-otp" && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to
              <br />
              <span className="font-medium">{pendingEmail}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            className="w-full"
            onClick={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>

          <button
            type="button"
            onClick={resendOtp}
            className="text-sm text-primary hover:underline mx-auto block"
          >
            Resend code
          </button>
        </div>
      )}
    </div>
  );
};
