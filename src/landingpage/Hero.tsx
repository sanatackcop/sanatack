import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";
import StarBorder from "@/components/blocks/Animations/StarBorder/StarBorder";
import { Link } from "react-router-dom";
import { CircleArrowLeft } from "lucide-react";
import HomePageDemo from "@/assets/demo/home.png";

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
    <div className="relative w-full flex justify-center items-center py-16 px-4">
      <div
        className="relative w-full max-w-6xl"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={laptopRef}
          className="opacity-0"
          style={{
            transform: "rotateX(5deg)",
            willChange: "transform, opacity",
          }}
        >
          <div className="relative rounded-[2rem] border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="relative w-full">
              <img
                src={HomePageDemo}
                alt="Homepage Preview"
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-5">
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
                <span className="block mt-2 leading-2 bg-yellow-200 text-black  rounded-lg w-fit">
                  {isRTL
                    ? "مع معلم الAI تتعلّم أسرع بـ10 مرات."
                    : "AI Tutor For 10x Learning"}
                </span>
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxe break-words">
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
