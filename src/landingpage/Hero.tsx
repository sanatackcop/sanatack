import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";
import StarBorder from "@/components/blocks/Animations/StarBorder/StarBorder";
import { Link } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";

const TypingAnimation: React.FC<any> = ({
  texts,
  delay = 100,
  pauseTime = 1000,
  className = "",
}) => {
  const [currentText, setCurrentText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [textIndex, setTextIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isArabic = /[\u0600-\u06FF]/.test(currentText);
  const direction = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "text-right" : "text-left";

  useEffect(() => {
    const current = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setCurrentText(current.substring(0, currentIndex - 1));
          setCurrentIndex((prev) => prev - 1);

          if (currentIndex === 0) {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        } else {
          setCurrentText(current.substring(0, currentIndex + 1));
          setCurrentIndex((prev) => prev + 1);

          if (currentIndex === current.length) {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        }
      },
      isDeleting ? delay / 4 : delay
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, texts, delay, pauseTime]);

  return (
    <span
      className={`text-black dark:text-white ${textAlign} ${className}`}
      dir={direction}
    >
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const LaptopDemo: React.FC = () => {
  const laptopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (laptopRef.current) {
      // Simple fade-in animation only
      gsap.fromTo(
        laptopRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full flex justify-center items-center py-16">
      <div
        className="relative w-full max-w-6xl"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={laptopRef}
          className="opacity-0"
          style={{
            transform: "rotateX(8deg)",
            willChange: "transform, opacity",
          }}
        >
          {/* Laptop Frame */}
          <div className="relative rounded-[2rem] p-3 bg-gradient-to-b from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-black shadow-2xl border border-zinc-700 dark:border-zinc-800">
            <div className="relative bg-white dark:bg-zinc-50 rounded-[1.5rem] overflow-hidden">
              {/* Browser Window */}
              <div className="relative">
                {/* Browser Toolbar */}
                <div className="relative z-20 bg-zinc-100 dark:bg-zinc-200">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-zinc-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1 flex items-center gap-2 bg-white dark:bg-zinc-50 rounded-lg px-4 py-2">
                      <svg
                        className="w-4 h-4 text-zinc-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-zinc-700 dark:text-zinc-800">
                        sanatack.com
                      </span>
                    </div>

                    <button className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-300 rounded-md transition-colors">
                      <svg
                        className="w-4 h-4 text-zinc-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="aspect-[16/10] overflow-hidden relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-100 dark:via-zinc-50 dark:to-zinc-100"></div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[85%] h-14 bg-black/20 dark:bg-black/40 blur-[50px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { isRTL, direction } = useLocaleDirection();

  const courseTexts: string[] = isRTL
    ? ["البرمجة", "التصميم", "البيانات", "طب"]
    : ["Programming", "Design", "Data Science", "AI"];

  useEffect(() => {
    if (heroRef.current) {
      // Single simplified animation
      const elements = heroRef.current.querySelectorAll(".fade-in");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-white dark:bg-[#09090b]"
      dir={direction}
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-5">
        <div className="mx-auto max-w-6xl">
          <div className={`space-y-8 ${isRTL ? "text-right" : "text-left"}`}>
            {/* Heading */}
            <div className="fade-in space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] text-zinc-900 dark:text-white">
                <span className="block">
                  {isRTL ? (
                    <>
                      تعلم <TypingAnimation texts={courseTexts} delay={150} />{" "}
                      مع AI
                    </>
                  ) : (
                    <>
                      Learn <TypingAnimation texts={courseTexts} delay={150} />{" "}
                      with AI
                    </>
                  )}
                </span>
                <span className="block mt-2 text-zinc-600 dark:text-zinc-400">
                  {isRTL ? "ليس مجرد مكان للتعلم" : "Not just a place to learn"}
                </span>
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {isRTL
                  ? "منصتك الذكية للتعلم. احصل على شروحات واضحة، حلول خطوة بخطوة، وأسئلة تفاعلية تساعدك على الفهم والنمو."
                  : "Your smart learning companion. Get clear explanations, step-by-step guidance, and interactive questions to help you understand and grow."}
              </p>
            </div>

            {/* Actions Row */}
            <div className="fade-in flex flex-wrap items-center gap-6">
              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <StarBorder
                  className="group"
                  inputClassName="bg-gradient-to-b from-[#09080b] to-[#09080b]  border 
                  border-zinc-800 dark:border-zinc-700 rounded-lg 
                  duration-300 transition-all ease-linear"
                  size="md"
                >
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 relative z-10"
                  >
                    <span className="text-sm text-white transition-all duration-300 ease-linear">
                      {isRTL ? "ابدأ التعلم" : "Start Learning"}
                    </span>
                    <CircleArrowLeft className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-45 group-hover:-translate-x-1" />
                  </Link>
                </StarBorder>
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100
                   transition-all duration-200 hover:!bg-transparent"
                >
                  {" "}
                  <Link
                    to="/#ai-tutor-features"
                    className="flex items-center gap-2 relative z-10"
                  >
                    <span className="flex items-center gap-2">
                      {isRTL ? "شاهد المميزات" : "See Features"}
                    </span>
                  </Link>
                </Button>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-12 bg-zinc-200 dark:bg-zinc-800"></div>

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                {/* User Avatars */}
                <div className="flex">
                  <div className="flex -space-x-2" style={{ direction: "ltr" }}>
                    {[
                      "from-blue-500 to-cyan-500",
                      "from-purple-500 to-pink-500",
                      "from-orange-500 to-red-500",
                      "from-green-500 to-emerald-500",
                    ].map((gradient, index) => (
                      <div
                        key={index}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-white dark:border-zinc-900 flex items-center justify-center shadow-md transition-transform duration-200 hover:-translate-y-1 cursor-pointer`}
                        style={{ willChange: "transform" }}
                      >
                        <span className="text-white text-xs">
                          {["OS", "ES", "AD", "EM"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-yellow-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="text-zinc-900 dark:text-white">4.9</span>{" "}
                    {isRTL ? "من 2,000+ متعلم" : "from 2,000+ learners"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop Demo */}
      <div className="relative z-0 w-full px-4 sm:px-6 lg:px-8">
        <LaptopDemo />
      </div>
    </section>
  );
};

export default Hero;
