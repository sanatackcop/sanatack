import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, BookOpen, Bot, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Code, Target, Award } from "lucide-react";

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
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-black/5 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-gray-600/5 dark:bg-gray-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

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
              <button
                onClick={() => toggle(feature.id)}
                className="w-full text-start relative z-10 group/btn"
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="flex items-center gap-3 md:gap-4 py-6 md:py-8 px-4 md:px-8">
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

                    <div className="flex flex-col sm:flex-row justify-start gap-3">
                      <Button
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold px-4 md:px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
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
