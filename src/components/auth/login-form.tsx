import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  loginApi,
  LoginResult,
  firebaseSignInApi,
  signupApi,
} from "@/utils/_apis/auth-apis";
import UserContext from "@/context/UserContext";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
  useSignup?: boolean;
}

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = ({ className = "", type = "text", label, ...props }) => {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        className={`flex h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const LoginForm: React.FC<LoginFormProps> = ({ useSignup = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const login = userContext?.login;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});

  // Firebase error mapping with translations
  const getFirebaseErrorMessage = useCallback(
    (code?: string) => {
      if (!code) return t("auth.errors.googleGeneral");
      const errorKey = `auth.errors.firebase.${code.replace("auth/", "")}`;
      return t(errorKey, { defaultValue: t("auth.errors.googleFallback") });
    },
    [t]
  );

  const copy = useMemo(() => {
    return useSignup
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
          successMessage: t("auth.login.googleSuccess"),
        };
  }, [useSignup, t]);

  const resetFieldError = useCallback(
    (field: keyof FormErrors) => {
      if (!errors[field]) return;
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    },
    [errors]
  );

  const handleInputChange = useCallback(
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      resetFieldError(field as keyof FormErrors);
      if (errors.general) {
        setErrors((prev) => ({ ...prev, general: undefined }));
      }
    },
    [errors.general, resetFieldError]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.validation.passwordLength");
    }

    if (useSignup) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t(
          "auth.validation.confirmPasswordRequired"
        );
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = t("auth.validation.passwordMismatch");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, useSignup, t]);

  const persistSession = useCallback(
    (result: LoginResult | (LoginResult & { accessToken?: string })) => {
      if (!login) return;
      login({
        role: result.role,
        type: result.type,
        user: result.user,
        refresh_token: result.refresh_token,
      });
      navigate("/dashboard", { replace: true });
    },
    [login, navigate]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (useSignup) {
        const nameSeed = formData.email.split("@")[0] ?? "";
        const signupResult = await signupApi({
          email: formData.email,
          password: formData.password,
          first_name: nameSeed || "user",
          last_name: "",
          phone: "",
          interests: [],
          userType: "student",
        });

        persistSession(signupResult as LoginResult);
        toast.success(t("auth.signup.success"));
      } else {
        const result = (await loginApi({
          email: formData.email,
          password: formData.password,
        })) as LoginResult;

        persistSession(result);
        toast.success(t("auth.login.success"));
      }
    } catch (error: any) {
      console.error("Auth form submission error:", error);

      if (error?.error?.type === "validationError") {
        setErrors({ general: error.error.body });
      } else if (error?.response?.status === 429) {
        setErrors({ general: t("auth.errors.tooManyAttempts") });
      } else if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: t("auth.errors.unexpectedError") });
      }
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
        firebaseUser.displayName
          ?.split(" ")
          .map((part) => part.trim())
          .filter(Boolean) ?? [];
      const [firstName, ...rest] = nameParts;

      const result = await firebaseSignInApi({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName ?? undefined,
        firstName: firstName || undefined,
        lastName: rest.length ? rest.join(" ") : undefined,
        phoneNumber: firebaseUser.phoneNumber ?? undefined,
        emailVerified: firebaseUser.emailVerified,
        idToken,
      });

      persistSession(result);
      toast.success(copy.successMessage);
    } catch (error: unknown) {
      console.error("Google auth error:", error);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/popup-closed-by-user") {
          toast.info(getFirebaseErrorMessage(error.code));
        } else {
          toast.error(getFirebaseErrorMessage(error.code));
        }
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response?.data?.message === "string"
      ) {
        toast.error((error as any).response.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("auth.errors.googleUnexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    if (provider === "google") {
      void handleGoogleAuth();
      return;
    }
    toast.info(t("auth.comingSoon"));
  };

  return (
    <div className="w-full space-y-6 ">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {copy.title}
        </h1>
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {copy.subtitle}
        </p>
      </div>

      <div className="space-y-3 text-black">
        <Button
          variant="outline"
          className="!bg-white w-full h-11 text-sm font-medium transition-all hover:shadow-sm"
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {copy.googleCta}
        </Button>
      </div>

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
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {errors.general}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 text-black dark:text-white"
        noValidate
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">
            {t("auth.fields.email")}
          </label>
          <Input
            type="email"
            placeholder={t("auth.placeholders.email")}
            value={formData.email}
            onChange={handleInputChange("email")}
            className={
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 "
                : ""
            }
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t("auth.fields.password")}
            </label>
            {!useSignup && (
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.placeholders.password")}
              value={formData.password}
              onChange={handleInputChange("password")}
              className={
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 "
                  : ""
              }
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 disabled:opacity-50"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={
                showPassword
                  ? t("auth.accessibility.hidePassword")
                  : t("auth.accessibility.showPassword")
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
              {errors.password}
            </p>
          )}
        </div>

        {useSignup && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">
              {t("auth.fields.confirmPassword")}
            </label>
            <Input
              type="password"
              placeholder={t("auth.placeholders.confirmPassword")}
              dir="ltr"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              className={
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 "
                  : ""
              }
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold text-white bg-gradient-to-br from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 transition-all hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              {t("auth.loading")}
            </div>
          ) : (
            copy.primaryCta
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {copy.switchPrompt}{" "}
        <Link
          to={copy.switchHref}
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {copy.switchAction}
        </Link>
      </div>
    </div>
  );
};
