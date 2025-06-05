import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loginApi, LoginResult } from "@/utils/_apis/auth-apis";
import { useNavigate } from "react-router-dom";
import UserContext, { ContextType } from "@/context/UserContext";
import { ChangeEvent, useContext, useState, FormEvent } from "react";
import { Eye, EyeOff, Github } from "lucide-react";

interface LoginFormProps {}

const Input: React.FC<InputProps> = ({
  className = "",
  type = "text",
  ...props
}) => {
  return (
    <input
      type={type}
      className={`flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 transition-all duration-200 ${className}`}
      {...props}
    />
  );
};

interface InputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  dir?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const login = userContext?.login;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = (await loginApi({
        email: formData.email,
        password: formData.password,
      })) as unknown as LoginResult;

      if (result.role && login) {
        login({
          role: result.role,
          type: result.type as ContextType,
          user: result.user,
          refresh_token: result.refresh_token,
        });
        navigate("/dashboard", { replace: true });
      } else {
        setErrors({ general: "فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى." });
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error?.error?.type === "validationError") {
        setErrors({ general: error.error.body });
      } else if (error?.error?.type === "network") {
        setErrors({ general: "مشكلة في الاتصال. يرجى التحقق من الإنترنت." });
      } else if (error?.response?.status === 401) {
        setErrors({ general: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
      } else if (error?.response?.status === 429) {
        setErrors({ general: "محاولات كثيرة. يرجى المحاولة لاحقاً." });
      } else {
        setErrors({ general: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      if (errors.general) {
        setErrors((prev) => ({
          ...prev,
          general: undefined,
        }));
      }
    };

  const handleOAuthLogin = (provider: string) => {
    console.log(`OAuth login with ${provider}`);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          أهلاً وسهلاً بك
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          سجّل دخولك للوصول إلى حسابك
        </p>
      </div>

      <div className="space-y-3 text-black dark:text-white">
        <Button
          variant="outline"
          className="w-full h-11 text-sm font-medium transition-all hover:scale-[1.01] hover:shadow-md"
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
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
          المتابعة باستخدام جوجل
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 text-sm font-medium transition-all hover:scale-[1.01] hover:shadow-md"
          type="button"
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading}
        >
          <Github className="w-5 h-5 ml-3" />
          المتابعة باستخدام جيت هاب
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400 font-medium">
            أو
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
        className="space-y-5 text-black dark:text-white text-right"
        noValidate
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            placeholder="example@example.com"
            dir="ltr"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-right"
                : "text-right"
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              كلمة المرور
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              dir="ltr"
              value={formData.password}
              onChange={handleInputChange("password")}
              className={`${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-right"
                  : "text-right"
              }`}
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 disabled:opacity-50"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
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

        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] hover:shadow-lg disabled:hover:scale-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              جاري تسجيل الدخول...
            </div>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        ليس لديك حساب؟{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
};
