import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, BookOpen, Bot, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  GitBranch,
  Cpu,
  Database,
  Brain,
  Code,
  Zap,
  Target,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import FAQs from "./FAQs";
import HowToLearn from "./HowToLearn";
import WhyUs from "./Why";
import StarBorder from "@/components/blocks/Animations/StarBorder/StarBorder";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <LogoSlider />
      <CourseFeature />
      <HowToLearn />
      <WhyUs />
      <FAQs />
    </div>
  );
}

export const LogoSlider = () => {
  const logos = [
    { name: "JavaScript", icon: "JS" },
    { name: "Python", icon: "PY" },
    { name: "React", icon: "⚛" },
    { name: "Node.js", icon: "⬢" },
    { name: "MySQL", icon: "DB" },
    { name: "Git", icon: "⚡" },
    { name: "CSS3", icon: "CSS" },
    { name: "HTML5", icon: "HTML" },
  ];

  return (
    <div className="w-full py-16 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-4">
            تعلم التقنيات الرائدة في السوق
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            من أحدث الأدوات والتقنيات المطلوبة في سوق العمل
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 max-w-6xl mx-auto">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-6 transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex flex-col items-center space-y-2 md:space-y-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-black dark:bg-white rounded-lg md:rounded-xl flex items-center justify-center text-white dark:text-black font-black text-sm md:text-lg group-hover:scale-110 transition-transform duration-300">
                  {logo.icon}
                </div>
                <div className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 text-center group-hover:text-black dark:group-hover:text-white transition-colors">
                  {logo.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FloatingIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  className?: string;
}

const FloatingIcon = ({
  Icon,
  delay = 0,
  className = "",
}: FloatingIconProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      <div className="group w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-black rounded-lg md:rounded-xl flex items-center justify-center border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

const Hero = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Target, text: "تعلم عملي وتطبيقي" },
    { icon: Zap, text: "تفاعل مباشر ومستمر" },
    { icon: Award, text: "شهادات معتمدة عالمياً" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div
      className="relative min-h-screen 
      bg-white dark:bg-black overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div
        className="relative z-10 container mx-auto px-4 md:px-6
       lg:px-8 py-8 md:py-16"
      >
        <div className="hidden lg:block">
          <FloatingIcon
            Icon={GitBranch}
            delay={200}
            className="top-32 left-8 xl:left-16"
          />
          <FloatingIcon
            Icon={Cpu}
            delay={400}
            className="top-[10rem] left-48 xl:left-40"
          />
          <FloatingIcon
            Icon={Database}
            delay={600}
            className="top-48 left-[20rem] xl:left-8"
          />
          <FloatingIcon
            Icon={Brain}
            delay={800}
            className="top-48 left-20 xl:left-28"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          <div className="order-2 lg:order-1 space-y-6 md:space-y-10 text-right">
            <div className="inline-flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm font-bold text-black dark:text-white">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span>تعلم • طور • احترف</span>
              <div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
            </div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-tight">
                <div className="text-black dark:text-white mb-2 md:mb-4">
                  ارتقِ بمسيرتك
                </div>
                <div className="text-black dark:text-white mb-2 md:mb-4">
                  المهنية إلى
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  آفاق جديدة
                </div>
              </h1>

              <div className="space-y-3 md:space-y-4 text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>عبر التطبيق العملي والتعليم التفاعلي</p>
                <p className="text-black dark:text-white font-semibold">
                  احصل على جودة تضاهي معسكرات التدريب المكثّفة
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row items-center justify-start
            gap-4 md:gap-6"
            >
              <div className="flex items-center gap-2 md:gap-4 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-full px-4 md:px-8 py-3 md:py-4 w-full md:w-auto justify-center md:justify-start">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 md:gap-3 transition-all duration-500 ${
                        currentFeature === index
                          ? "opacity-100 scale-100 text-black dark:text-white"
                          : "opacity-40 scale-90 text-gray-500 dark:text-gray-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="text-xs md:text-sm font-bold whitespace-nowrap hidden sm:inline">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
                {/* <div className="flex gap-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentFeature === index
                        ? "bg-black dark:bg-white w-8"
                        : "bg-gray-300 dark:bg-gray-600 w-2"
                    }`}
                  />
                ))}
              </div> */}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 md:gap-6">
              <Button className=" font-bold text-base p-7 rounded-[20px]">
                تصفّح البرامج
              </Button>
              <StarBorder
                as="button"
                className="font-bold hover:opacity-45 transition-all duration-1000"
                color="white"
                speed="5s"
              >
                انضم مجانا
              </StarBorder>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl shadow-2xl p-4 md:p-8">
              <div className="flex items-center gap-3 pb-4 md:pb-6 border-b-2 border-gray-300 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono">
                  learning-platform.sql
                </div>
              </div>

              <div
                className="space-y-3 md:space-y-4 font-mono text-xs md:text-sm pt-4 md:pt-6"
                dir="ltr"
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-gray-400 w-4 md:w-6 text-left">1</span>
                  <span className="text-black dark:text-white font-bold">
                    SELECT
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    * FROM
                  </span>
                  <span className="text-black dark:text-white font-bold">
                    students
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-gray-400 w-4 md:w-6 text-left">2</span>
                  <span className="text-black dark:text-white font-bold">
                    WHERE
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    progress =
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-bold">
                    'excellent'
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-gray-400 w-4 md:w-6 text-left">3</span>
                  <span className="text-black dark:text-white animate-pulse">
                    █
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="absolute -top-2 md:-top-4 -left-2 md:-left-4 bg-black dark:bg-white text-white dark:text-black px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold shadow-lg">
                ✓ مكتمل
              </div>

              <div className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 bg-gray-600 dark:bg-gray-400 text-white dark:text-black px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold shadow-lg">
                🔥 +50 XP
              </div>
            </div>

            {/* Floating Notification Cards */}
            <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-3 md:p-4 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Code className="w-4 h-4 md:w-5 md:h-5 text-white dark:text-black" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-xs md:text-sm font-bold text-black dark:text-white truncate">
                    درس جديد
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    قواعد البيانات المتقدمة
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-3 md:p-4 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 dark:bg-gray-300 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white dark:text-black" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-xs md:text-sm font-bold text-black dark:text-white truncate">
                    تقدم ممتاز
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    85% مكتمل
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CourseFeature() {
  const features = [
    {
      id: 1,
      title: "دورة نصية",
      body: "دروس تفاعلية تعتمد على النصوص مع تمارين فورية لاختبار فهمك وتطبيق المفاهيم عمليًا.",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "تحديات عملية",
      body: "مشاريع مصغرة واقعية لتعزيز مهاراتك وتطبيق المفاهيم عمليًا مع حلول تفصيلية.",
      icon: Target,
    },
    {
      id: 3,
      title: "بنك ترميز",
      body: "مئات الأسئلة البرمجية مصنفة حسب الصعوبة مع حلول مشروحة وتفسيرات مفصلة.",
      icon: Code,
    },
    {
      id: 4,
      title: "مدرب بالذكاء الاصطناعي",
      body: "مدرب شخصي بالذكاء الاصطناعي يجيب على أسئلتك ويعطي ملاحظات فورية ومخصصة.",
      icon: Bot,
    },
    {
      id: 5,
      title: "تدوين الملاحظات",
      body: "دوّن أفكارك مباشرة أثناء الدرس واحفظها للرجوع إليها لاحقًا مع إمكانية التصدير.",
      icon: PenTool,
    },
    {
      id: 6,
      title: "شهادة إتمام",
      body: "احصل على شهادة رقمية موثوقة عند إنهاء جميع التحديات والمشاريع مع إمكانية المشاركة.",
      icon: Award,
    },
  ];

  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="course-feature"
      dir="rtl"
      className="relative w-full py-16 md:py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-800"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-gray-600/5 dark:bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header section */}
      <div className="mx-auto max-w-6xl text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-4 md:px-6 py-2 text-sm font-medium text-black dark:text-white backdrop-blur-sm">
          <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
          طور مهاراتك
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-black dark:text-white leading-tight">
          ليست دورتك المعتادة
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed font-light">
          تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص ومليئة بالتحديات
          العملية مما يجعل
          <span className="text-black dark:text-white font-semibold">
            {" "}
            مسار SQL{" "}
          </span>
          التدريسي هذا يتميز بخصائص فريدة تجعله استثنائيًا.
        </p>
      </div>

      {/* Features grid */}
      <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isOpen = openId === feature.id;

          return (
            <div
              key={feature.id}
              className={`group relative rounded-2xl md:rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                isOpen
                  ? "border-black dark:border-white bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-2xl scale-105"
                  : "border-gray-300 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 hover:border-black dark:hover:border-white hover:shadow-xl hover:bg-gradient-to-br hover:from-gray-50 hover:via-white hover:to-gray-100 dark:hover:from-gray-800 dark:hover:via-gray-900 dark:hover:to-black"
              } backdrop-blur-md`}
            >
              {/* Header button */}
              <button
                onClick={() => toggle(feature.id)}
                className="w-full text-start relative z-10 group/btn"
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="flex items-center gap-3 md:gap-4 py-6 md:py-8 px-4 md:px-8">
                    {/* Icon */}
                    <div
                      className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${
                        isOpen
                          ? "border-black dark:border-white bg-black/10 dark:bg-white/10 shadow-lg"
                          : "border-gray-400 dark:border-gray-600 bg-gray-200/50 dark:bg-gray-700/30 group-hover/btn:border-black dark:group-hover/btn:border-white group-hover/btn:bg-black/5 dark:group-hover/btn:bg-white/5"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 md:h-7 md:w-7 transition-all duration-300 ${
                          isOpen
                            ? "text-black dark:text-white scale-110"
                            : "text-gray-600 dark:text-gray-400 group-hover/btn:text-black dark:group-hover/btn:text-white group-hover/btn:scale-110"
                        }`}
                      />
                    </div>

                    {/* Title and toggle icon */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span
                        className={`text-lg md:text-xl font-bold transition-colors duration-300 truncate ${
                          isOpen
                            ? "text-black dark:text-white"
                            : "text-gray-800 dark:text-gray-100 group-hover/btn:text-black dark:group-hover/btn:text-white"
                        }`}
                      >
                        {feature.title}
                      </span>

                      <div
                        className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ml-2 ${
                          isOpen
                            ? "border-black dark:border-white bg-black/10 dark:bg-white/10 rotate-45"
                            : "border-gray-400 dark:border-gray-600 group-hover/btn:border-black dark:group-hover/btn:border-white group-hover/btn:bg-black/5 dark:group-hover/btn:bg-white/5"
                        }`}
                      >
                        {isOpen ? (
                          <X className="h-4 w-4 md:h-5 md:w-5 text-black dark:text-white" />
                        ) : (
                          <Plus className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-400 group-hover/btn:text-black dark:group-hover/btn:text-white transition-colors duration-300" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>

              {/* Expandable body */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 md:px-8 pb-6 md:pb-8 pt-0 border-t-2 border-gray-300 dark:border-gray-700">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-4 md:mb-6">
                      {feature.body}
                    </p>

                    {/* Call-to-action buttons */}
                    <div className="flex flex-col sm:flex-row justify-start gap-3">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold px-4 md:px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add your action here
                        }}
                      >
                        ابدأ الآن
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white px-4 md:px-6 py-2 rounded-full transition-all duration-300 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(feature.id);
                        }}
                      >
                        إغلاق
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer section */}
      <div className="mt-16 md:mt-20 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-gray-300 dark:border-gray-700 backdrop-blur-sm">
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed mb-6">
            تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص ومليئة
            <span className="text-black dark:text-white font-bold">
              {" "}
              بالتحديات العملية{" "}
            </span>
            مما يجعل مسار SQL التدريسي هذا يتميز بخصائص فريدة تجعله
            <span className="text-gray-600 dark:text-gray-400 font-bold">
              {" "}
              استثنائيًا!
            </span>
          </p>

          <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-6 md:px-8 py-3 rounded-full text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            ابدأ رحلتك الآن
          </Button>
        </div>
      </div>
    </section>
  );
}
