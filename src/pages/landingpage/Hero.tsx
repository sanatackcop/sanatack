import { useEffect, useState } from "react";
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

const logos = [
  { name: "JavaScript", icon: "JS", color: "from-yellow-400 to-yellow-600" },
  { name: "Python", icon: "PY", color: "from-blue-400 to-blue-600" },
  { name: "React", icon: "⚛", color: "from-cyan-400 to-cyan-600" },
  { name: "Node.js", icon: "⬢", color: "from-green-400 to-green-600" },
  { name: "MySQL", icon: "DB", color: "from-orange-400 to-orange-600" },
  { name: "Git", icon: "⚡", color: "from-red-400 to-red-600" },
  { name: "CSS3", icon: "CSS", color: "from-purple-400 to-purple-600" },
  { name: "HTML5", icon: "HTML", color: "from-pink-400 to-pink-600" },
];

export const LogoSlider = () => {
  const scrollingLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="flex animate-scroll">
        {scrollingLogos.map((logo, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center mx-4 sm:mx-6 md:mx-8 space-y-2 sm:space-y-3 group min-w-0 flex-shrink-0"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-br ${logo.color} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
            >
              {logo.icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors whitespace-nowrap">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StarBorder = ({ children, className = "", ...props }: any) => {
  return (
    <button
      className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white transition-all duration-300 overflow-hidden group text-sm sm:text-base ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </button>
  );
};

const FloatingIcon = ({ Icon, delay = 0, className = "" }: any) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`absolute transition-all duration-1000 ${
        ready ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      } ${className}`}
    >
      <div className="group w-12 h-12 lg:w-16 lg:h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 hover:rotate-3">
        <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all" />
      </div>
    </div>
  );
};

const Hero = () => {
  const [activeFeat, setActiveFeat] = useState(0);
  const features = [
    { icon: Target, text: "تعلم عملي وتطبيقي" },
    { icon: Zap, text: "تفاعل مباشر ومستمر" },
    { icon: Award, text: "شهادات معتمدة عالمياً" },
  ];

  useEffect(() => {
    const int = setInterval(
      () => setActiveFeat((p) => (p + 1) % features.length),
      3000
    );
    return () => clearInterval(int);
  }, []);

  return (
    <section
      className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] sm:opacity-[0.03] dark:opacity-[0.04] dark:sm:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] sm:bg-[size:8rem_8rem] opacity-50" />
      </div>

      <div className="hidden lg:block">
        <FloatingIcon Icon={GitBranch} delay={200} className="top-24 left-8" />
        {/* <FloatingIcon Icon={Cpu} delay={400} className="top-40 left-52" /> */}
        <FloatingIcon Icon={Database} delay={600} className="top-28 left-80" />
        <FloatingIcon Icon={Brain} delay={800} className="top-64 left-12" />
        <FloatingIcon Icon={Code} delay={1000} className="bottom-44 left-64" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-5 ">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center min-h-[90vh] lg:min-h-[85vh]">
          <div className="order-1 lg:order-1 space-y-6 sm:space-y-8 text-right flex flex-col justify-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-full px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  تعلم • طور • احترف
                </span>
              </span>

              <h1 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] text-gray-900 dark:text-white">
                <span className="block ">ارتقِ بمسيرتك</span>
                <span className="block bg-gradient-to-l from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text">
                  المهنية إلى
                </span>
                <span className="block text-black dark:text-white">
                  آفاق جديدة
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                عبر التطبيق العملي والتعليم التفاعلي
                <br />
                <span className="font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 block">
                  احصل على جودة تضاهي معسكرات التدريب المكثّفة
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              {features.map((f, i) => {
                const IconCmp = f.icon;
                const live = i === activeFeat;
                return (
                  <span
                    key={i}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all duration-500 cursor-pointer ${
                      live
                        ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white shadow-lg scale-105"
                        : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <IconCmp className="w-4 h-4 sm:w-5 sm:h-5" /> {f.text}
                  </span>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
              <button className="w-full sm:w-auto text-sm sm:text-base font-bold  px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                تصفّح البرامج
              </button>
              <StarBorder className="w-full sm:w-auto font-bold">
                انضم مجانا
              </StarBorder>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex flex-col items-center justify-center">
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 mb-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5 sm:gap-2">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer transition-colors" />
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer transition-colors" />
                  <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-400 hover:bg-green-500 cursor-pointer transition-colors" />
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg">
                  sanatack.sql
                </span>
              </div>

              <div
                className="space-y-3 sm:space-y-4 font-mono text-sm sm:text-base pt-4 sm:pt-6"
                dir="ltr"
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-gray-400 w-4 sm:w-6 text-right font-bold text-xs sm:text-base">
                    1
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-base">
                    SELECT
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-xs sm:text-base">
                    * FROM
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-base">
                    students
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-gray-400 w-4 sm:w-6 text-right font-bold text-xs sm:text-base">
                    2
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs sm:text-base">
                    WHERE
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-xs sm:text-base">
                    progress =
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-xs sm:text-base">
                    'excellent'
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 animate-pulse">
                  <span className="text-gray-400 w-4 sm:w-6 text-right font-bold text-xs sm:text-base">
                    3
                  </span>
                  <span className="text-black dark:text-white text-lg sm:text-xl">
                    █
                  </span>
                </div>
              </div>

              <span className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce">
                ✓ مكتمل
              </span>
              <span className="absolute -bottom-3 sm:-bottom-4 -right-3 sm:-right-4 bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                🔥 +50 XP
              </span>
            </div>

            <div className="hidden lg:block absolute -top-12 sm:-top-16 lg:-top-20 -right-6 sm:-right-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl max-w-[180px] sm:max-w-[240px] animate-float">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    درس جديد
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    قواعد البيانات المتقدمة
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute -bottom-12 sm:-bottom-16 lg:-bottom-20 -left-6 sm:-left-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl max-w-[180px] sm:max-w-[240px] animate-float-delayed">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg relative">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-right min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    تقدم ممتاز
                    <span className="text-green-500 text-xs">↗</span>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <span className="inline-block w-16 sm:w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <span className="block w-[85%] h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></span>
                    </span>
                    85%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
