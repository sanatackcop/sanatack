import React from "react";
import {
  Bell,
  Users,
  Award,
  Clock,
  LucideIcon,
  Play,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { LoginForm } from "@/components/auth/login-form";

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

const LoginPage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Play,
      title: "دروس فيديو تفاعلية",
      description:
        "تفاعل مع محتوى فيديو عالي الجودة يتضمن اختبارات وملاحظات وتحكم في سرعة التشغيل لتجربة تعلم شخصية.",
    },
    {
      icon: BarChart3,
      title: "تتبع التقدم والتحليلات",
      description:
        "راقب رحلتك التعليمية من خلال تقارير التقدم المفصلة ومعدلات الإكمال ورؤى الأداء عبر جميع الدورات.",
    },
    {
      icon: Users,
      title: "فصول دراسية افتراضية مباشرة",
      description:
        "انضم إلى جلسات تفاعلية في الوقت الفعلي مع المدربين والأقران من خلال مؤتمرات الفيديو المدمجة والأدوات التعاونية.",
    },
    {
      icon: Award,
      title: "الشهادات والإنجازات",
      description:
        "احصل على شهادات موثقة عند إكمال الدورة واكسب شارات للإنجازات لإظهار مهاراتك ومعرفتك.",
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

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <Navbar />
      </div>

      <div className="pt-16 min-h-screen bg-white dark:bg-gray-900">
        <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
          <div className="flex flex-col justify-center items-center p-6 lg:p-8 bg-white dark:bg-gray-900">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <LoginForm />
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium">© 2024 صنعتك. جميع الحقوق محفوظة.</p>
              <p className="mt-1 text-xs">
                صُنع بـ ❤️ في المملكة العربية السعودية
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col bg-gray-50 dark:bg-gray-800 relative">
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            <div className="relative flex flex-col justify-center h-full p-8 lg:p-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <svg
                    className="w-10 h-10 text-white "
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
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  أهلاً بك في صنعتك
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  منصة التعلم الرقمي المتقدمة
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <feature.icon className="w-7 h-7 text-gray-900 dark:text-white mb-3" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-900 dark:text-white mb-5">
                  <Bell className="w-5 h-5 ml-3 text-gray-600 dark:text-gray-300" />
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    آخر التحديثات والإشعارات
                  </span>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <notification.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                            {notification.description}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-20 left-20 w-32 h-32 bg-gray-300/20 dark:bg-gray-600/20 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-24 h-24 bg-gray-400/30 dark:bg-gray-500/30 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 right-10 w-20 h-20 bg-gray-200/20 dark:bg-gray-700/20 rounded-full blur-lg animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
