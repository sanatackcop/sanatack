import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  Check,
  Moon,
  Sun,
  Zap,
  Shield,
  Target,
  BookOpen,
  Globe,
  Sparkles,
  Award,
  Users2,
  Rocket,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";

interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface UserOption {
  key: string;
  icon: React.ComponentType<any>;
  title: string;
  desc: string;
}

interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
}

const SignupFormSchema = z.object({
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  last_name: z.string().min(1, "اسم العائلة مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type SignupFormData = z.infer<typeof SignupFormSchema>;

const SignupFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userType, setUserType] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showMobileSteps, setShowMobileSteps] = useState<boolean>(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { darkMode, toggleDarkMode } = useSettings();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const steps: Step[] = [
    {
      title: "المعلومات الشخصية",
      description: "أدخل بياناتك الأساسية",
      icon: User,
    },
    {
      title: "نوع المستخدم",
      description: "اختر الفئة التي تناسبك",
      icon: Target,
    },
    { title: "الاهتمامات", description: "اختر مجالات اهتمامك", icon: BookOpen },
    { title: "تأكيد الهوية", description: "تحقق من رقم الهاتف", icon: Shield },
  ];

  const marketingFeatures: Feature[] = [
    {
      icon: Zap,
      title: "تعلم سريع",
      description: "احصل على المهارات بأسرع وقت",
    },
    { icon: Globe, title: "محتوى عالمي", description: "تعلم من أفضل الخبراء" },
    {
      icon: Award,
      title: "شهادات معتمدة",
      description: "احصل على شهادات معترف بها",
    },
    { icon: Users2, title: "مجتمع نشط", description: "انضم لمجتمع المتعلمين" },
  ];

  const stats: Stat[] = [
    { number: "100K+", label: "طالب نشط" },
    { number: "500+", label: "دورة تدريبية" },
    { number: "95%", label: "معدل النجاح" },
    { number: "24/7", label: "دعم فني" },
  ];

  const userOptions: UserOption[] = [
    {
      key: "student",
      icon: User,
      title: "طالب",
      desc: "أو سيلتحق قريباً بالدراسة",
    },
    {
      key: "professional",
      icon: Briefcase,
      title: "محترف",
      desc: "يسعى لتطوير مهنته",
    },
    { key: "other", icon: Users, title: "أخرى", desc: "فئة أخرى" },
  ];

  const handleFormSubmit = (values: SignupFormData): void => {
    setFormData(values);
    setCurrentStep(1);
  };

  const handleUserTypeNext = (): void => {
    if (userType) setCurrentStep(2);
  };

  const handleInterestsNext = (): void => {
    if (selectedInterests.length >= 3) setCurrentStep(3);
  };

  const handleOtpChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const toggleInterest = (interest: string): void => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFinalSubmit = (): void => {
    console.log("بيانات التسجيل:", {
      personalInfo: formData,
      userType,
      interests: selectedInterests,
      otp: otp.join(""),
    });
    alert("تم إنشاء الحساب بنجاح!");
  };

  const goToPrevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderMobileHeader = (): JSX.Element => (
    <div
      className={`md:hidden sticky top-0 z-50 ${
        darkMode
          ? "bg-black/90 border-b border-gray-800"
          : "bg-white/90 border-b border-gray-200"
      } backdrop-blur-md`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              صنع تك
            </h1>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              الخطوة {currentStep + 1} من {steps.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileSteps(!showMobileSteps)}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <Target className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleDarkMode()}
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div
          className={`w-full h-2 rounded-full ${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              darkMode ? "bg-white" : "bg-black"
            }`}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {showMobileSteps && (
        <div
          className={`${
            darkMode
              ? "bg-gray-900 border-t border-gray-800"
              : "bg-gray-50 border-t border-gray-200"
          } p-4`}
        >
          <div className="space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? "bg-black text-white"
                        : isCurrent
                        ? darkMode
                          ? "bg-white text-black"
                          : "bg-black text-white"
                        : darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-medium ${
                        isCurrent || isCompleted
                          ? darkMode
                            ? "text-white"
                            : "text-black"
                          : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderStepsProgress = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-b from-black to-gray-900 border-l border-gray-800"
          : "bg-gradient-to-b from-gray-50 to-white border-l border-gray-200"
      } overflow-hidden`}
    >
      <div
        className={`p-6 shrink-0 border-b ${
          darkMode
            ? "border-gray-800 bg-gray-900/50"
            : "border-gray-200 bg-white/80"
        } backdrop-blur-sm`}
      >
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-black"
          } mb-2`}
        >
          خطوات التسجيل
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          تتبع تقدمك في عملية التسجيل
        </p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isCompleted
                        ? "bg-black text-white shadow-lg shadow-black/30"
                        : isCurrent
                        ? darkMode
                          ? "bg-white text-black shadow-lg shadow-white/30"
                          : "bg-black text-white shadow-lg shadow-black/30"
                        : darkMode
                        ? "bg-gray-800 text-gray-400 border-2 border-gray-700"
                        : "bg-white text-gray-400 border-2 border-gray-300 shadow-sm"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-10 mt-3 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-black"
                          : darkMode
                          ? "bg-gray-800"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-3 min-w-0">
                  <h4
                    className={`font-bold text-base transition-all duration-300 ${
                      isCurrent || isCompleted
                        ? darkMode
                          ? "text-white"
                          : "text-black"
                        : darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-sm mt-1 leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {step.description}
                  </p>
                  {isCurrent && (
                    <div
                      className={`mt-3 text-xs px-3 py-1.5 rounded-full inline-block font-medium ${
                        darkMode
                          ? "bg-white/10 text-white border border-gray-700"
                          : "bg-black/10 text-black border border-gray-300"
                      }`}
                    >
                      الخطوة الحالية
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`p-6 shrink-0 border-t ${
          darkMode
            ? "border-gray-800 bg-gray-900/50"
            : "border-gray-200 bg-white/80"
        } backdrop-blur-sm`}
      >
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              التقدم العام
            </span>
            <span
              className={`text-sm font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {Math.round((currentStep / (steps.length - 1)) * 100)}%
            </span>
          </div>
          <div
            className={`w-full h-3 rounded-full ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } overflow-hidden`}
          >
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                darkMode ? "bg-white" : "bg-black"
              }`}
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSidebar = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      } overflow-hidden relative`}
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className={`absolute top-10 right-10 w-32 h-32 ${
            darkMode ? "bg-white" : "bg-black"
          } rounded-full blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-10 left-10 w-24 h-24 ${
            darkMode ? "bg-white" : "bg-black"
          } rounded-full blur-3xl`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${
            darkMode ? "bg-white" : "bg-black"
          } rounded-full blur-3xl`}
        ></div>
      </div>

      <div className="relative z-10 flex-1 px-4 pb-4 overflow-y-auto">
        <img
          src={String(darkMode ? LogoDark : LogoLight)}
          alt="logo"
          className="w-28 h-auto filter transition-all duration-300 hover:brightness-110"
        />
        <div className="mb-4">
          <div className="space-y-2 mt-5">
            {marketingFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group p-3 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    darkMode
                      ? "bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80"
                      : "bg-white/80 border border-gray-200/50 hover:bg-white shadow-lg hover:shadow-gray-200/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        darkMode ? "bg-white text-black" : "bg-black text-white"
                      } group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <FeatureIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-xs mb-1 ${
                          darkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {feature.title}
                      </h4>
                      <p
                        className={`text-xs leading-relaxed ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50"
              : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/50 shadow-lg"
          }`}
        >
          <div className="text-center mb-3">
            <Sparkles
              className={`w-5 h-5 mx-auto mb-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            />
            <h4
              className={`font-bold text-xs ${
                darkMode ? "text-white" : "text-black"
              } mb-1`}
            >
              انضم لمجتمع المتعلمين
            </h4>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              آلاف الطلاب يثقون بنا
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`text-sm font-bold mb-1 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {stat.number}
                </div>
                <div
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInput = (
    name: keyof SignupFormData,
    label: string,
    placeholder: string,
    type: string = "text"
  ): JSX.Element => (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          {...form.register(name)}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          onFocus={() => setFocusedInput(name)}
          onBlur={() => setFocusedInput(null)}
          className={`w-full p-4 md:p-4 sm:p-3 rounded-xl border-2 transition-all duration-300 text-base ${
            focusedInput === name
              ? darkMode
                ? "border-white ring-4 ring-white/20 bg-gray-800 text-white"
                : "border-black ring-4 ring-black/20 bg-white text-black"
              : form.formState.errors[name]
              ? "border-red-500 bg-red-50"
              : darkMode
              ? "border-gray-600 bg-gray-800 text-white hover:border-gray-500"
              : "border-gray-300 bg-gray-50/50 text-black hover:border-gray-400"
          } focus:outline-none placeholder:text-gray-400`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {form.formState.errors[name] && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            !
          </span>
          {form.formState.errors[name]?.message}
        </p>
      )}
    </div>
  );

  const renderPersonalInfoStep = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-black to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-white"
      } overflow-y-auto`}
    >
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6 ">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 mrounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl ${
                darkMode
                  ? "bg-white text-black shadow-white/25"
                  : "bg-black text-white shadow-black/25"
              }`}
            >
              <User className="w-4 h-4 md:w-10 md:h-10" />
            </div>
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              إنشاء حساب جديد
            </h2>
            <p
              className={`text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              أدخل بياناتك الشخصية للبدء في رحلة التعلم
            </p>
          </div>
          <div
            className={`${
              darkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-gray-200"
            } rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 space-y-4 md:space-y-6 border-2 backdrop-blur-sm`}
          >
            {renderInput("first_name", "الاسم الأول", "أدخل اسمك الأول")}
            {renderInput("last_name", "اسم العائلة", "أدخل اسم العائلة")}
            {renderInput("phone", "رقم الهاتف", "أدخل رقم الهاتف", "tel")}
            {renderInput(
              "email",
              "البريد الإلكتروني",
              "أدخل بريدك الإلكتروني",
              "email"
            )}
            {renderInput(
              "password",
              "كلمة المرور",
              "أدخل كلمة المرور",
              "password"
            )}
            <div className="flex gap-3 pt-2">
              {currentStep > 0 && (
                <button
                  onClick={goToPrevStep}
                  className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600 shadow-gray-700/25"
                      : "bg-gray-200 text-black hover:bg-gray-300 shadow-gray-200/25"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </button>
              )}
              <button
                onClick={form.handleSubmit(handleFormSubmit)}
                className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 ${
                  darkMode
                    ? "bg-white text-black hover:bg-gray-100 shadow-white/25"
                    : "bg-black text-white hover:bg-gray-800 shadow-black/25"
                }`}
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserTypeStep = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-black to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-white"
      } overflow-y-auto`}
    >
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6 md:mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl ${
                darkMode
                  ? "bg-white text-black shadow-white/25"
                  : "bg-black text-white shadow-black/25"
              }`}
            >
              <Target className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              ما الذي يصفك بشكل أفضل؟
            </h2>
            <p
              className={`text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              سيساعدنا هذا في تخصيص تجربتك التعليمية
            </p>
          </div>
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {userOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = userType === option.key;
              return (
                <div
                  key={option.key}
                  onClick={() => setUserType(option.key)}
                  className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 cursor-pointer transition-all duration-300 transform active:scale-95 hover:scale-105 ${
                    isSelected
                      ? darkMode
                        ? "border-white bg-white/10 shadow-2xl shadow-white/25"
                        : "border-black bg-black/5 shadow-2xl shadow-black/25"
                      : darkMode
                      ? "border-gray-700 bg-gray-800/80 hover:border-gray-600 backdrop-blur-sm"
                      : "border-gray-300 bg-white/80 hover:border-gray-400 hover:shadow-lg backdrop-blur-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 ${
                        isSelected
                          ? darkMode
                            ? "bg-white text-black shadow-lg"
                            : "bg-black text-white shadow-lg"
                          : darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <OptionIcon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold text-lg md:text-xl ${
                          darkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {option.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {option.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mr-auto">
                        <Check
                          className={`w-5 h-5 md:w-6 md:h-6 ${
                            darkMode ? "text-white" : "text-black"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={goToPrevStep}
              className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600 shadow-gray-700/25"
                  : "bg-gray-200 text-black hover:bg-gray-300 shadow-gray-200/25"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>
            <button
              onClick={handleUserTypeNext}
              disabled={!userType}
              className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-100 shadow-white/25"
                  : "bg-black text-white hover:bg-gray-800 shadow-black/25"
              }`}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterestsStep = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-black to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-white"
      } overflow-hidden`}
    >
      <div className="p-4 sm:p-6 lg:p-8 shrink-0">
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl ${
              darkMode
                ? "bg-white text-black shadow-white/25"
                : "bg-black text-white shadow-black/25"
            }`}
          >
            <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2
            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            اختر مجالات اهتمامك
          </h2>
          <p
            className={`text-base md:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mb-4 md:mb-6`}
          >
            اختر على الأقل 3 مجالات من اهتماماتك
          </p>
          <div
            className={`inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium ${
              selectedInterests.length >= 3
                ? darkMode
                  ? "bg-white/20 text-white border-2 border-white"
                  : "bg-black/10 text-black border-2 border-black"
                : darkMode
                ? "bg-gray-700 text-gray-300 border-2 border-gray-600"
                : "bg-gray-200 text-gray-700 border-2 border-gray-300"
            }`}
          >
            تم اختيار {selectedInterests.length} من أصل 3
            {selectedInterests.length >= 3 && <Check className="w-4 h-4" />}
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 overflow-hidden flex flex-col">
        <div
          className={`${
            darkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-gray-200"
          } rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 flex flex-col h-full overflow-hidden border-2 backdrop-blur-sm`}
        >
          {selectedInterests.length > 0 && (
            <div
              className={`pt-3 md:pt-4 border-t-2 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } shrink-0`}
            >
              <h4
                className={`text-sm font-medium mb-2 md:mb-3 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                اهتماماتك المختارة:
              </h4>
              <div className="flex flex-wrap gap-1 md:gap-2 max-h-16 md:max-h-20 overflow-y-auto">
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm shrink-0 ${
                      darkMode
                        ? "bg-white/20 text-white"
                        : "bg-black/10 text-black"
                    }`}
                  >
                    {interest}
                    <button
                      onClick={() => toggleInterest(interest)}
                      className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-2 h-2 md:w-3 md:h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4 md:mt-6 shrink-0">
          <button
            onClick={goToPrevStep}
            className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600 shadow-gray-700/25"
                : "bg-gray-200 text-black hover:bg-gray-300 shadow-gray-200/25"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          <button
            onClick={handleInterestsNext}
            disabled={selectedInterests.length < 3}
            className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-white text-black hover:bg-gray-100 shadow-white/25"
                : "bg-black text-white hover:bg-gray-800 shadow-black/25"
            }`}
          >
            التالي ({selectedInterests.length}/3)
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderOtpStep = (): JSX.Element => (
    <div
      className={`h-full flex flex-col ${
        darkMode
          ? "bg-gradient-to-br from-black to-gray-900"
          : "bg-gradient-to-br from-gray-50 to-white"
      } overflow-y-auto`}
    >
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6 md:mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl ${
                darkMode
                  ? "bg-white text-black shadow-white/25"
                  : "bg-black text-white shadow-black/25"
              }`}
            >
              <Shield className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              تأكيد رقم الهاتف
            </h2>
            <p
              className={`text-base md:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } mb-4 md:mb-6`}
            >
              أدخل الرمز المرسل إلى رقم هاتفك
            </p>
            {formData && (
              <div
                className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium ${
                  darkMode
                    ? "bg-white/20 text-white border border-white"
                    : "bg-black/10 text-black border border-black"
                }`}
              >
                📱 {formData.phone}
              </div>
            )}
          </div>
          <div
            className={`${
              darkMode
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-gray-200"
            } rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border-2 backdrop-blur-sm`}
          >
            <div className="flex justify-center gap-2 md:gap-4 mb-6 md:mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg md:rounded-2xl text-center text-lg md:text-xl font-bold transition-all duration-300 ${
                    digit
                      ? darkMode
                        ? "border-white bg-white/20 text-white shadow-lg shadow-white/20"
                        : "border-black bg-black/5 text-black shadow-lg shadow-black/20"
                      : darkMode
                      ? "border-gray-600 bg-gray-700 text-white"
                      : "border-gray-300 bg-gray-50 text-black"
                  } focus:outline-none focus:border-black focus:ring-4 focus:ring-black/20`}
                  maxLength={1}
                />
              ))}
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={goToPrevStep}
                  className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600 shadow-gray-700/25"
                      : "bg-gray-200 text-black hover:bg-gray-300 shadow-gray-200/25"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={otp.some((digit) => !digit)}
                  className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-white text-black hover:bg-gray-100 shadow-white/25"
                      : "bg-black text-white hover:bg-gray-800 shadow-black/25"
                  }`}
                >
                  تأكيد وإنشاء الحساب
                  <Check className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  setOtp(["", "", "", "", "", ""]);
                  alert("تم إرسال رمز جديد");
                }}
                className={`w-full py-2 md:py-3 rounded-xl md:rounded-2xl border-2 border-dashed font-medium transition-all duration-300 ${
                  darkMode
                    ? "border-gray-600 text-gray-400 hover:text-gray-300 hover:border-gray-500 hover:bg-gray-800/50"
                    : "border-gray-400 text-gray-600 hover:text-gray-700 hover:border-gray-500 hover:bg-gray-50"
                }`}
              >
                إعادة إرسال الرمز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = (): JSX.Element => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep();
      case 1:
        return renderUserTypeStep();
      case 2:
        return renderInterestsStep();
      case 3:
        return renderOtpStep();
      default:
        return renderPersonalInfoStep();
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row" dir="rtl">
      {renderMobileHeader()}

      <div className="w-80 hidden md:block h-full">{renderSidebar()}</div>

      <div className="flex-1 h-full md:h-auto">{renderCurrentStep()}</div>

      <div className="w-96 hidden lg:block h-full ">
        {renderStepsProgress()}
      </div>
    </div>
  );
};

export default SignupFlow;
