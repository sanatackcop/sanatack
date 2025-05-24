import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  GitBranch,
  Cpu,
  Database,
  Brain,
  Code,
  Play,
  ArrowLeft,
  Zap,
  Target,
  Award,
} from "lucide-react";

export const LogoSlider = () => {
  const logos = [
    { name: "JavaScript", icon: "JS", bg: "bg-yellow-400" },
    { name: "Python", icon: "PY", bg: "bg-blue-500" },
    { name: "React", icon: "⚛", bg: "bg-cyan-400" },
    { name: "Node.js", icon: "⬢", bg: "bg-green-500" },
    { name: "MySQL", icon: "DB", bg: "bg-orange-500" },
    { name: "Git", icon: "⚡", bg: "bg-red-500" },
    { name: "CSS3", icon: "CSS", bg: "bg-blue-600" },
    { name: "HTML5", icon: "HTML", bg: "bg-orange-600" },
  ];

  return (
    <div className="w-full py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            تعلم التقنيات الرائدة في السوق
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            من أحدث الأدوات والتقنيات المطلوبة في سوق العمل
          </p>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:border-gray-900 dark:hover:border-white hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-gray-900 font-black text-lg group-hover:scale-110 transition-transform duration-300">
                  {logo.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                  {logo.name}
                </div>
              </div>

              {/* Hover Accent */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-900 dark:group-hover:border-white transition-all duration-300 pointer-events-none" />
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
  position?: "top-right" | "top-center" | "middle-right" | "bottom-right";
}

const FloatingIcon = ({
  Icon,
  delay = 0,
  position = "top-right",
}: FloatingIconProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const positionClasses: Record<string, string> = {
    "top-right": "top-20 left-8",
    "top-center": "top-16 left-24",
    "middle-right": "top-32 left-4",
    "bottom-right": "top-48 left-12",
  };

  return (
    <div
      className={`absolute ${
        positionClasses[position]
      } transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="group w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md">
        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
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
      className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <FloatingIcon Icon={GitBranch} delay={200} position="top-right" />
        <FloatingIcon Icon={Cpu} delay={400} position="top-center" />
        <FloatingIcon Icon={Database} delay={600} position="middle-right" />
        <FloatingIcon Icon={Brain} delay={800} position="bottom-right" />

        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">
          <div className="order-1 space-y-10 text-right">
            <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span>تعلم • طور • احترف</span>
              <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full" />
            </div>

            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-none">
                <div className="text-gray-900 dark:text-white mb-4">
                  ارتقِ بمسيرتك
                </div>
                <div className="text-gray-900 dark:text-white mb-4">
                  المهنية إلى
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  آفاق جديدة
                </div>
              </h1>

              <div className="space-y-4 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>عبر التطبيق العملي والتعليم التفاعلي</p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  احصل على جودة تضاهي معسكرات التدريب المكثّفة
                </p>
              </div>
            </div>

            {/* Rotating Features */}
            <div className="flex items-center justify-end gap-6">
              <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full px-8 py-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        currentFeature === index
                          ? "opacity-100 scale-100 text-gray-900 dark:text-white"
                          : "opacity-40 scale-90 text-gray-500 dark:text-gray-600"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="text-sm font-bold whitespace-nowrap">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentFeature === index
                        ? "bg-gray-900 dark:bg-white w-8"
                        : "bg-gray-300 dark:bg-gray-600 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-6">
              <Button
                size="lg"
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <ArrowLeft className="w-6 h-6 ml-3 group-hover:-translate-x-1 transition-transform" />
                <span>تصفّح البرامج</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 hover:scale-105 group"
              >
                <Play className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
                <span>ابدأ مجاناً</span>
              </Button>
            </div>
          </div>

          {/* Visual Content - Left Side for RTL */}
          <div className="order-2 relative">
            {/* Main Code Card */}
            <div className="relative bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
              {/* Terminal Header */}
              <div className="flex items-center gap-3 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  learning-platform.sql
                </div>
              </div>

              {/* Code Content */}
              <div className="space-y-4 font-mono text-sm pt-6" dir="ltr">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-6 text-left">1</span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    SELECT
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    * FROM
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    students
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-6 text-left">2</span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    WHERE
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    progress =
                  </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    'excellent'
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-6 text-left">3</span>
                  <span className="text-gray-900 dark:text-white animate-pulse">
                    █
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="absolute -top-4 -left-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                ✓ مكتمل
              </div>

              <div className="absolute -bottom-4 -right-4 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                🔥 +50 XP
              </div>
            </div>

            {/* Floating Notification Cards */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  <Code className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    درس جديد
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    قواعد البيانات المتقدمة
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    تقدم ممتاز
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
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

export default Hero;
