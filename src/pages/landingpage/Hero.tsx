import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
  Sparkles,
  Code,
  Target,
  Award,
  BookOpen,
  Play,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Video,
  Monitor,
  Database,
} from "lucide-react";
import { ModernButton } from "@/components/ModernButton";

interface CourseFloatingCardProps {
  delay?: number;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

interface FloatingTechIconProps {
  Icon: React.ComponentType<{ className?: string }>;
  delay?: number;
  className?: string;
}

interface TypingAnimationProps {
  texts: string[];
  delay?: number;
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  desc: string;
}

const CourseFloatingCard: React.FC<CourseFloatingCardProps> = ({
  delay = 0,
  className = "",
  children,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 32,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay / 1000,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [delay]);

  return (
    <div ref={cardRef} className={`absolute ${className}`} {...props}>
      <div className="group bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
        {children}
      </div>
    </div>
  );
};

const FloatingTechIcon: React.FC<FloatingTechIconProps> = ({
  Icon,
  delay = 0,
  className = "",
}) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        {
          opacity: 0,
          scale: 0,
          y: 48,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 1,
          delay: delay / 1000,
          ease: "elastic.out(1, 0.5)",
        }
      );

      gsap.to(iconRef.current, {
        y: -10,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay / 1000 + 1,
      });
    }
  }, [delay]);

  return (
    <div ref={iconRef} className={`absolute ${className}`}>
      <div className="group w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-800/20 dark:to-indigo-900/10 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-6">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300" />
      </div>
    </div>
  );
};

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  delay = 100,
}) => {
  const [currentText, setCurrentText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const current = texts[textIndex];

        if (isDeleting) {
          setCurrentText(current.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);

          if (currentIndex === 0) {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        } else {
          setCurrentText(current.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);

          if (currentIndex === current.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        }
      },
      isDeleting ? 50 : delay
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, texts, delay]);

  return (
    <span className="text-black dark:text-white">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const CoursesHero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  const courseTexts: string[] = ["البرمجة", "التصميم", "البيانات", "الويب"];

  const features: FeatureItem[] = [
    { icon: Video, text: "دروس تفاعلية", desc: "محتوى مرئي عالي الجودة" },
    { icon: Monitor, text: "مشاريع عملية", desc: "طبق ما تتعلمه فوراً" },
    { icon: Target, text: "مسار واضح", desc: "خطة تعلم منظمة" },
    { icon: CheckCircle, text: "شهادة معتمدة", desc: "اعتراف مهني موثق" },
  ];

  useEffect(() => {
    if (heroRef.current) {
      timelineRef.current = gsap.timeline();

      const elements = heroRef.current.querySelectorAll(".animate-on-load");

      timelineRef.current.fromTo(
        elements,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );

      const blurElements = heroRef.current.querySelectorAll(".blur-bg");
      gsap.fromTo(
        blurElements,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          stagger: 0.3,
          ease: "power2.out",
        }
      );

      const statElements = heroRef.current.querySelectorAll(".stat-item");
      gsap.fromTo(
        statElements,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.8,
        }
      );
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blur-bg absolute top-20 left-20 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-gray-200/30 to-gray-400/20 dark:from-gray-600/20 dark:to-gray-800/30 rounded-full blur-3xl"></div>
        <div className="blur-bg absolute bottom-20 right-20 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-tr from-gray-300/25 to-gray-500/15 dark:from-gray-500/15 dark:to-gray-700/25 rounded-full blur-3xl"></div>
        <div className="blur-bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-r from-gray-400/20 to-gray-600/20 dark:from-gray-400/10 dark:to-gray-600/20 rounded-full blur-2xl"></div>
        <div className="blur-bg absolute top-10 right-10 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-bl from-gray-300/30 to-gray-500/20 dark:from-gray-500/20 dark:to-gray-700/30 rounded-full blur-2xl"></div>
        <div className="blur-bg absolute bottom-10 left-10 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-tr from-gray-200/25 to-gray-400/25 dark:from-gray-600/15 dark:to-gray-800/25 rounded-full blur-3xl"></div>
      </div>

      <div className="hidden md:block">
        <FloatingTechIcon
          Icon={Code}
          delay={300}
          className="top-16 sm:top-24 left-8 sm:left-16"
        />
        <FloatingTechIcon
          Icon={Database}
          delay={500}
          className="top-32 sm:top-48 left-16 sm:left-32"
        />
        <FloatingTechIcon
          Icon={Monitor}
          delay={700}
          className="top-20 sm:top-32 right-12 sm:right-24"
        />
        <FloatingTechIcon
          Icon={BookOpen}
          delay={900}
          className="bottom-20 sm:bottom-32 left-8 sm:left-20"
        />
        <FloatingTechIcon
          Icon={Video}
          delay={1100}
          className="bottom-32 sm:bottom-48 right-16 sm:right-32"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center min-h-[85vh]">
          <div className="space-y-6 sm:space-y-8 text-right ">
            <div className="animate-on-load mt-10">
              <span
                className="inline-flex items-center gap-2 sm:gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/60
               dark:border-gray-700/60 rounded-full px-4 sm:px-6 py-2 sm:py-3 font-bold text-xs sm:text-sm shadow-lg"
              >
                <div className="relative">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black dark:bg-white rounded-full animate-ping"></div>
                </div>
                <span className="text-gray-800 dark:text-gray-200">
                  تعلم • طور • احترف{" "}
                </span>
              </span>
            </div>

            <div className="animate-on-load space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] text-gray-900 dark:text-white">
                <span className="block">تعلم</span>
                <span className="block">
                  <TypingAnimation texts={courseTexts} delay={150} />
                </span>
                <span className="block text-gray-700 dark:text-gray-300">
                  مع خبراء المجال
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                منصة تعليمية متطورة تقدم أحدث الدورات التدريبية في التكنولوجيا
                والبرمجة
                <br />
                <span className="font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 block">
                  من المبتدئ إلى المحترف • محتوى عربي أصيل • شهادات معتمدة
                </span>
              </p>
            </div>

            <div className="animate-on-load flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <ModernButton
                to="/signup"
                className="w-full sm:w-auto bg-gradient-to-br from-indigo-600 to-sky-600 !text-white"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                ابدأ رحلتك مجاناً
              </ModernButton>
              <ModernButton
                to="/signup"
                variant="secondary"
                className="w-full bg-white/95 dark:bg-gray-900/95 sm:w-auto"
              >
                استكشف الدورات
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </ModernButton>
            </div>

            {/* Trust Indicators */}
            <div className="animate-on-load flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>تجربة مجانية</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>شهادات معتمدة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>دعم مستمر</span>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="animate-on-load grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {features.map((feature, index) => {
                const IconCmp = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                      <IconCmp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-right min-w-0">
                      <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                        {feature.text}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center order-1 lg:order-2">
            {/* Main Course Interface */}
            <div className="animate-on-load relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
              {/* Course Header */}
              <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    تطوير مواقع الويب
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    HTML, CSS, JavaScript
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                </div>
              </div>

              {/* Course Progress */}
              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    التقدم في الدورة
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    65%
                  </span>
                </div>
                <div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full transition-all duration-1000"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              {/* Course Lessons */}
              <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                <div className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      مقدمة في HTML
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      45 دقيقة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      أساسيات CSS
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      60 دقيقة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl border-2 border-black dark:border-white">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-black dark:border-white animate-pulse flex-shrink-0"></div>
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      JavaScript للمبتدئين
                      <span className="text-orange-500">◀</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      80 دقيقة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 sm:p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg sm:rounded-xl opacity-60">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"></div>
                  <div className="text-right flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-400">
                      مشروع عملي
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      120 دقيقة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Course Cards - Hidden on mobile for better UX */}
            <CourseFloatingCard
              delay={800}
              className="hidden sm:block -top-6 sm:-top-8 -right-6 sm:-right-8 lg:-right-12"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    معدل إكمال عالي
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="w-[98%] h-full bg-gradient-to-r from-green-700 to-green-400  rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      98%
                    </span>
                  </div>
                </div>
              </div>
            </CourseFloatingCard>

            <CourseFloatingCard
              delay={1200}
              className="hidden sm:block -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 lg:-left-12"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg relative">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white " />
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    شهادة جديدة!
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    مطور ويب مبتدئ 🎉
                  </p>
                </div>
              </div>
            </CourseFloatingCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesHero;
