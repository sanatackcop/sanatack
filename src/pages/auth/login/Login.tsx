import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Github,
  Bell,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Clock,
  LucideIcon,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Notification {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info";
}

interface InputProps {
  className?: string;
  type?: string;
  placeholder?: string;
  dir?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface LoginFormProps {
  darkMode: boolean;
}

interface NotificationCardProps extends Notification {
  icon: LucideIcon;
}

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

const NotificationCard: React.FC<NotificationCardProps> = ({
  icon: Icon,
  title,
  description,
  time,
  type = "info",
}) => {
  const typeColors = {
    success: "bg-white/10 border-green-400/50 text-white",
    warning: "bg-white/10 border-yellow-400/50 text-white",
    info: "bg-white/10 border-blue-400/50 text-white",
  };

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:bg-white/15 ${typeColors[type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-white/90" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1 text-white">{title}</p>
          <p className="text-xs text-white/80 mb-2 leading-relaxed line-clamp-2">
            {description}
          </p>
          <p className="text-xs text-white/60">{time}</p>
        </div>
      </div>
    </div>
  );
};

const LoginForm: React.FC<LoginFormProps> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login attempt:", formData);
      alert("تم تسجيل الدخول بنجاح!");
    } catch (error) {
      console.error("Login failed", error);
      alert("فشل في تسجيل الدخول");
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
    };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          أهلاً وسهلاً بك
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          سجّل دخولك للوصول إلى حسابك وإدارة أعمالك
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-11 text-sm font-medium transition-all hover:scale-[1.01] hover:shadow-md"
          type="button"
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            placeholder="مثال: ahmed@example.com"
            dir="ltr"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              كلمة المرور
            </label>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              dir="ltr"
              value={formData.password}
              onChange={handleInputChange("password")}
              className={`pr-12 ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
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
        <a
          href="#"
          className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          إنشاء حساب جديد
        </a>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const { darkMode } = useSettings();
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: Users,
      title: "أكثر من 100,000 مستخدم",
      description: "ينضم إلينا يومياً مئات المحترفين من جميع أنحاء العالم",
    },
    {
      icon: Shield,
      title: "حماية متقدمة",
      description: "تشفير من الدرجة العسكرية وحماية شاملة لبياناتك",
    },
    {
      icon: Zap,
      title: "أداء فائق السرعة",
      description: "تقنيات حديثة توفر تجربة سريعة وسلسة",
    },
    {
      icon: TrendingUp,
      title: "نمو مستمر",
      description: "نسبة نمو 400% في عدد المستخدمين خلال العام الماضي",
    },
  ];

  const notifications: Notification[] = [
    {
      icon: Award,
      title: "تهانينا! تم قبول طلبك",
      description: "تمت الموافقة على طلب الانضمام للبرنامج المتقدم بنجاح",
      time: "منذ 3 دقائق",
      type: "success",
    },
    {
      icon: Bell,
      title: "إصدار جديد متوفر",
      description: "تحديث جديد يحتوي على ميزات محسّنة وأدوات إضافية",
      time: "منذ 45 دقيقة",
      type: "info",
    },
    {
      icon: Clock,
      title: "تذكير: انتهاء الجلسة قريباً",
      description: "يُرجى حفظ عملك، ستنتهي الجلسة خلال 15 دقيقة",
      time: "منذ ساعتين",
      type: "warning",
    },
  ];

  const goToHome = (): void => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="grid min-h-screen lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-6 lg:p-8">
              <div
                className="flex items-center cursor-pointer group"
                onClick={goToHome}
              >
                <img
                  src={String(darkMode ? LogoDark : LogoLight)}
                  alt="صنعتك"
                  className="w-28 h-auto transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                />
              </div>
              <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
              <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                  <LoginForm darkMode={darkMode} />
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium">© 2024 صنعتك. جميع الحقوق محفوظة.</p>
              <p className="mt-1 text-xs">
                صُنع بـ ❤️ في المملكة العربية السعودية
              </p>
            </div>
          </div>

          <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="diagonals"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M0,40 L40,0"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M20,40 L40,20"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                    />
                    <path
                      d="M0,20 L20,0"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diagonals)" />
              </svg>
            </div>

            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                  backgroundSize: "60px 60px",
                }}
              ></div>
            </div>

            <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 z-10">
              <div className="text-center text-white space-y-6 max-w-lg mx-auto">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-white to-gray-300 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-10 h-10 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                    أهلاً بك في صنعتك
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    المنصة الرائدة في المملكة لإدارة الأعمال وتطوير المهارات
                    المهنية
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/40"
                  >
                    <feature.icon className="w-7 h-7 text-white mb-3" />
                    <h3 className="text-sm font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-white mb-5">
                  <Bell className="w-5 h-5 ml-3 text-gray-300" />
                  <span className="text-base font-bold">
                    آخر التحديثات والإشعارات
                  </span>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                  {notifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 right-10 w-20 h-20 bg-gray-400/10 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-32 right-32 w-16 h-16 bg-white/15 rounded-full blur-md animate-bounce"
              style={{ animationDelay: "3s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-16 w-12 h-12 bg-gray-300/20 rounded-full blur-sm animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
