import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

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
      gsap.fromTo(
        laptopRef.current,
        {
          opacity: 0,
          y: 100,
          scale: 0.85,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.8,
          delay: 0.8,
          ease: "power4.out",
        }
      );
    }
  }, []);

  return (
    <div className="relative w-full flex justify-center items-center py-16 pt-0">
      <div
        className="relative w-full max-w-7xl"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={laptopRef}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Laptop Frame */}
          <div
            className="relative rounded-[2rem] p-3 shadow-[0_50px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-gradient-to-b
           from-zinc-800 via-zinc-850 to-zinc-900"
          >
            <div className="relative bg-white dark:bg-zinc-50 rounded-[1.5rem] overflow-hidden">
              {/* Browser Window */}
              <div className="relative">
                {/* Browser Toolbar */}
                <div className="relative z-20 bg-white dark:bg-zinc-50 border-b border-zinc-200 dark:border-zinc-300">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Traffic Lights (macOS style) */}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-200 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-200 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-200 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600"
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

                    <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-200 rounded-lg px-4 py-2">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-800 font-medium">
                        sanatack.com
                      </span>
                    </div>

                    {/* Extension Icons */}
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-200 rounded-md transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-600"
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
                </div>

                <div className="aspect-[16/10] overflow-hidden relative bg-white dark:bg-gray-50">
                  {/* <img
                    src={String(DemoScreenShot)}
                    alt="Demo Screenshot"
                    className="w-full h-full object-cover object-top"
                  /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[85%] h-14 bg-black/20 dark:bg-black/40 blur-[50px] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const CoursesHero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();
  const { isRTL, direction } = useLocaleDirection();

  const courseTexts: string[] = isRTL
    ? ["البرمجة", "التصميم", "البيانات", "الذكاء الاصطناعي"]
    : ["Programming", "Design", "Data Science", "AI"];

  useEffect(() => {
    if (heroRef.current) {
      timelineRef.current = gsap.timeline();

      const textElements = heroRef.current.querySelectorAll(".blur-text");
      gsap.fromTo(
        textElements,
        {
          opacity: 0,
          filter: "blur(20px)",
          y: 30,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

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
      className="relative min-h-screen overflow-hidden bg-white pb-20 dark:bg-[#09090b]"
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]"></div>
      </div>

      <div
        className={`relative z-10 container mx-[25rem] mt-20 max-w-7xl px-4`}
        dir={direction}
      >
        <div
          className={`space-y-6 sm:space-y-8 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div className="animate-on-load space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-zinc-900 dark:text-white">
              <span className="block blur-text">
                {isRTL ? (
                  <>
                    تعلم <TypingAnimation texts={courseTexts} delay={150} /> مع
                    AI{" "}
                  </>
                ) : (
                  <>
                    Learn <TypingAnimation texts={courseTexts} delay={150} />{" "}
                    with AI Tutors
                  </>
                )}
              </span>
              <span className="block blur-text mt-2">
                {isRTL ? "ليس مجرد مكان للتعلم" : "Not only a place to learn"}{" "}
                ✍🏻
              </span>
            </h1>

            <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed blur-text">
              {isRTL
                ? "النظام الحديث لتطوير البرمجيات. تبسيط المشكلات والمشاريع وخرائط طريق المنتج."
                : "Meet the system for modern software development. Streamline issues, projects, and product roadmaps."}
            </p>
          </div>
          <div className="space-x-2">
            <Button className="rounded-xl  opacity-80 hover:opacity-100 duration-100  transition-all ease-linear">
              Start Learning
            </Button>
            <Button
              variant={"secondary"}
              className="rounded-xl !bg-transparent  opacity-55 hover:opacity-100 duration-100  transition-all ease-linear"
            >
              See Features
            </Button>
          </div>
          <div
            className={`animate-on-load flex items-center gap-4 ${
              isRTL ? "flex-row-reverse  justify-end" : " justify-start"
            } `}
          >
            <div className="flex" style={{ direction: "ltr" }}>
              <div className="flex -space-x-3">
                {[
                  { title: "OS", gradient: "from-blue-500 to-cyan-500" },
                  { title: "ES", gradient: "from-purple-500 to-pink-500" },
                  { title: "AD", gradient: "from-orange-500 to-red-500" },
                  { title: "EM", gradient: "from-green-500 to-emerald-500" },
                  { title: "ZK", gradient: "from-blue-500 to-cyan-500" },
                  { title: "LM", gradient: "from-purple-500 to-pink-500" },
                  { title: "RJ", gradient: "from-orange-500 to-red-500" },
                  { title: "NK", gradient: "from-green-500 to-emerald-500" },
                ].map((avatar, index) => {
                  const gradients = [
                    "rgb(59, 130, 246), rgb(6, 182, 212)",
                    "rgb(168, 85, 247), rgb(236, 72, 153)",
                    "rgb(249, 115, 22), rgb(239, 68, 68)",
                    "rgb(34, 197, 94), rgb(16, 185, 129)",
                    "rgb(59, 130, 246), rgb(6, 182, 212)",
                    "rgb(168, 85, 247), rgb(236, 72, 153)",
                    "rgb(249, 115, 22), rgb(239, 68, 68)",
                    "rgb(34, 197, 94), rgb(16, 185, 129)",
                  ];

                  return (
                    <div
                      key={index}
                      className="relative w-10 h-10 rounded-full bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer group"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${gradients[index]})`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="relative w-full h-full rounded-full border-2 border-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-sm font-bold tracking-tight drop-shadow-md">
                          {avatar.title}
                        </span>
                      </div>
                      <div
                        className="absolute -inset-0.5 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${
                            gradients[index % 4]
                          })`,
                        }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  4.9/5
                </span>{" "}
                {isRTL ? "من 2,000+ متعلم" : "from 2,000+ learners"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full mt-16">
        <LaptopDemo />
      </div>
    </section>
  );
};

export default CoursesHero;
