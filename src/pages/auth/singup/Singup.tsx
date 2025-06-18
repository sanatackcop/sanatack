import React, { useState, HTMLInputTypeAttribute, useContext } from "react";
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
  Shield,
  Target,
  BookOpen,
  Rocket,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  LoginResult,
  sendEmailOtpApi,
  signupApi,
  verifyOtpApi,
} from "@/utils/_apis/auth-apis";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import UserContext, { ContextType } from "@/context/UserContext";

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

interface ApiError {
  message: string;
  field?: string;
}

const phoneRegex = /^05\d{8}$/;

const SignupFormSchema = z
  .object({
    firstName: z.string().min(3, "الاسم الأول مطلوب"),
    lastName: z.string().min(3, "اسم العائلة مطلوب"),
    phone: z
      .string()
      .regex(phoneRegex, "يجب الرقم ان يكون من هذا النوع: 966555555555+")
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
    email: z.string().email("بريد إلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "يجب تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof SignupFormSchema>;

const SignupFlow: React.FC = () => {
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userType, setUserType] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [otp, setOtp] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormData | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showMobileSteps, setShowMobileSteps] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent] = useState<boolean>(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    {
      title: "تأكيد الهوية",
      description: "تحقق من البريد الإلكتروني ",
      icon: Shield,
    },
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

  const interests = [
    "البرمجة",
    "التصميم",
    "التسويق",
    "الأعمال",
    "اللغات",
    "العلوم",
    "الطب",
    "الهندسة",
    "الفنون",
    "الموسيقى",
    "الرياضة",
    "الطبخ",
    "التصوير",
    "الكتابة",
    "المحاسبة",
    "القانون",
  ];

  const handleFormSubmit = async (values: SignupFormData): Promise<void> => {
    // const success = await registerUser(values);
    // if (success) {
    setFormData(values);
    setCurrentStep(1);
    // }
  };

  const handleUserTypeNext = (): void => {
    if (userType) {
      setErrors([]);
      setCurrentStep(2);
    } else {
      setErrors([{ message: "يرجى اختيار نوع المستخدم" }]);
    }
  };

  const handleInterestsNext = async (): Promise<void> => {
    if (selectedInterests.length >= 3) {
      setErrors([]);
      setLoading(true);
      if (formData) {
        const success = await sendEmailOtpApi(formData?.email);
        console.log({ success });
        if (success) {
          setCurrentStep(3);
        } else console.error("Error Occurred");
      }
    } else {
      setErrors([{ message: "يرجى اختيار 3 مجالات على الأقل" }]);
    }
    setLoading(false);
  };

  const toggleInterest = (interest: string): void => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 10
        ? [...prev, interest]
        : prev
    );
  };
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const login = userContext?.login;
  const ErrorDisplay = (): JSX.Element | null => {
    if (errors.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        {errors.map((error, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error.message}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleFinalSubmit = async (): Promise<void> => {
    try {
      if (!formData) {
        console.log("Error Occurred @DE");
        return;
      }

      const success = await verifyOtpApi(otp, formData.email);

      console.log("بيانات التسجيل:", {
        personalInfo: formData,
        userType,
        interests: selectedInterests,
        otp: otp,
      });

      if (!success) {
        setErrors([{ message: "رمز التحقق غير صحيح. حاول مرة أخرى" }]);
        return;
      }
      setErrors([]);
      setLoading(true);

      const result = (await signupApi({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        interests: interests,
        userType: userType,
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
        console.error("Signup failed: Missing role or login context");
      }
    } catch (err: any) {
      console.error("تفاصيل الخطأ:", err);

      const message =
        err?.error?.body ||
        err?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ غير متوقع";

      setErrors([{ message }]);
    }
    setLoading(false);
  };

  const renderMobileHeader = (): JSX.Element => (
    <div className="md:hidden sticky top-16 z-40 bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-600 to-sky-600 text-white  ">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-black dark:text-white">
              إنشاء حساب
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              الخطوة {currentStep + 1} من {steps.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileSteps(!showMobileSteps)}
            className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-600 text-white"
          >
            <Target className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-700 to-sky-400"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {showMobileSteps && (
        <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
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
                        ? "bg-gradient-to-br from-indigo-600 to-sky-600 text-white"
                        : isCurrent
                        ? "bg-gradient-to-br from-indigo-600 to-sky-600 text-white"
                        : "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-400"
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
                          ? "text-black dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
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
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 border-l border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 shrink-0 mt-2">
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">
          خطوات التسجيل
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
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
                        ? " text-white shadow-lg shadow-black/30 bg-gradient-to-br from-indigo-600 to-sky-600 dark:shadow-white/30"
                        : isCurrent
                        ? "text-white shadow-lg shadow-black/30 bg-gradient-to-br from-indigo-600 to-sky-600 dark:shadow-white/30"
                        : "bg-white text-gray-400 border-2 border-gray-300 shadow-sm dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
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
                          ? "bg-gradient-to-r from-blue-700 to-sky-400"
                          : "bg-gray-300 dark:bg-gray-800"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-3 min-w-0">
                  <h4
                    className={`font-bold text-base transition-all duration-300 ${
                      isCurrent || isCompleted
                        ? "text-black dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm mt-1 leading-relaxed text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  {isCurrent && (
                    <div className="mt-3 text-xs px-3 py-1.5 rounded-full inline-block font-medium bg-black/10 text-black border border-gray-300 dark:bg-white/10 dark:text-white dark:border-gray-700">
                      الخطوة الحالية
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-6 shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              التقدم العام
            </span>
            <span className="text-sm font-bold text-black dark:text-white">
              {Math.round((currentStep / (steps.length - 1)) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-700 to-sky-400"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderInput = (
    name: keyof SignupFormData,
    label: string,
    placeholder: string,
    type: HTMLInputTypeAttribute = "text"
  ): JSX.Element => (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
        {label}
      </label>
      <div className="relative">
        <Input
          {...form.register(name)}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          onFocus={() => setFocusedInput(name)}
          onBlur={() => setFocusedInput(null)}
          className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-base text-right ${
            focusedInput === name
              ? "border-black ring-4 ring-black/20 bg-white text-black dark:border-white dark:ring-white/20 dark:bg-gray-800 dark:text-white"
              : form.formState.errors[name]
              ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
              : "border-gray-300 bg-gray-50/50 text-black hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500"
          } focus:outline-none placeholder:text-gray-400`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white ">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white">
              إنشاء حساب جديد
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              أدخل بياناتك الشخصية للبدء في رحلة التعلم
            </p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 space-y-4 border-2 backdrop-blur-sm">
            <ErrorDisplay />
            {renderInput("firstName", "الاسم الأول", "أدخل اسمك الأول")}
            {renderInput("lastName", "اسم العائلة", "أدخل اسم العائلة")}
            {renderInput("phone", "رقم الهاتف", "0555555555", "tel")}
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
            {renderInput(
              "confirmPassword",
              "تأكيد كلمة المرور",
              "أعد كتابة كلمة المرور",
              "password"
            )}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={form.handleSubmit(handleFormSubmit)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-sky-600 !text-white hover:bg-gray-800 shadow-black/25 dark:hover:bg-gray-100 dark:shadow-white/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    التالي
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserTypeStep = (): JSX.Element => (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white">
              ما الذي يصفك بشكل أفضل؟
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              سيساعدنا هذا في تخصيص تجربتك التعليمية
            </p>
          </div>
          <ErrorDisplay />
          <div className="space-y-3 mb-6">
            {userOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = userType === option.key;
              return (
                <div
                  key={option.key}
                  onClick={() => setUserType(option.key)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform active:scale-95 hover:scale-105 ${
                    isSelected
                      ? "border-black bg-black/5 shadow-2xl shadow-black/25 dark:border-white dark:bg-white/10 dark:shadow-white/25"
                      : "border-gray-300 bg-white/80 hover:border-gray-400 hover:shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-lg "
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <OptionIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-black dark:text-white">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {option.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mr-auto">
                        <Check className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUserTypeNext}
              disabled={!userType || loading}
              className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-sky-600 text-white hover:bg-gray-800 shadow-black/25 dark:hover:bg-gray-100 dark:shadow-white/25"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterestsStep = (): JSX.Element => (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 overflow-hidden">
      <div className="p-4 sm:p-6 shrink-0">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white ">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white">
            اختر مجالات اهتمامك
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
            اختر على الأقل 3 مجالات من اهتماماتك (الحد الأقصى 10)
          </p>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              selectedInterests.length >= 3
                ? "bg-green-100 text-green-700 border-2 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                : "bg-gray-200 text-gray-700 border-2 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            }`}
          >
            {selectedInterests.length > 0 && (
              <div className="flex items-center gap-1">
                تم اختيار {selectedInterests.length} مجالات
                {selectedInterests.length >= 3 && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-hidden flex flex-col">
        <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
          <ErrorDisplay />

          <div className=" p-4  md:p-6 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  const isDisabled =
                    !isSelected && selectedInterests.length >= 10;
                  return (
                    <button
                      key={interest}
                      onClick={() => !isDisabled && toggleInterest(interest)}
                      disabled={isDisabled}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none whitespace-nowrap ${
                        isSelected
                          ? "bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-lg"
                          : isDisabled
                          ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      <span className="text-lg font-bold">+</span>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 -translate-y-4 shrink-0">
            <button
              onClick={handleInterestsNext}
              disabled={selectedInterests.length < 3 || loading}
              className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-sky-600 text-white hover:bg-gray-800 shadow-black/25 dark:hover:bg-gray-100 dark:shadow-white/25"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  التالي ({selectedInterests.length}/3)
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOtpStep = (): JSX.Element => (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 overflow-y-auto">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white ">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white">
              تأكيد البريد الإلكتروني
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              أدخل الرمز المرسل إلى بريدك الإلكتروني
            </p>
            {formData && (
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-black/10 text-black border border-black dark:bg-white/20 dark:text-white dark:border-white">
                {formData.email}
              </div>
            )}
            {otpSent && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                تم إرسال الرمز بنجاح! (استخدم 123456 للتجربة)
              </div>
            )}
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 border-2 backdrop-blur-sm">
            <ErrorDisplay />
            <div className="flex justify-center gap-2 mb-6 direction-ltr">
              {/* {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-12 h-12 border-2 rounded-lg text-center text-lg font-bold transition-all duration-300 ${
                    digit
                      ? "border-black bg-black/5 text-black shadow-lg shadow-black/20 dark:border-white dark:bg-white/20 dark:text-white dark:shadow-white/20"
                      : "border-gray-300 bg-gray-50 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  } focus:outline-none focus:border-black focus:ring-4 focus:ring-black/20 dark:focus:border-white dark:focus:ring-white/20`}
                  maxLength={1}
                />
              ))} */}
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSeparator />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTP>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleFinalSubmit}
                  disabled={otp.length != 6}
                  className="flex-1 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-sky-600 text-white hover:bg-gray-800 shadow-black/25  dark:hover:bg-gray-100 dark:shadow-white/25"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <Button
                className="w-full py-5 rounded-xl border-2 border-dashed font-medium transition-all duration-300 border-gray-400 bg-transparent text-gray-600 hover:text-gray-700 hover:border-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  if (formData) {
                    await sendEmailOtpApi(formData.email);
                    setErrors([]);
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  "إعادة إرسال الرمز"
                )}
              </Button>
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
    <div className="min-h-screen" dir="rtl">
      {/* Full width navbar */}
      <Navbar />

      <div className="h-screen flex flex-col md:flex-row pt-16">
        {renderMobileHeader()}

        <div className="flex-1 h-full md:h-auto">{renderCurrentStep()}</div>

        <div className="w-96 hidden lg:block h-full">
          {renderStepsProgress()}
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
