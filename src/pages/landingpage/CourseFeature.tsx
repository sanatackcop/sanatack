import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, BookOpen, Target, Code, Bot, PenTool, Award } from "lucide-react";

export default function CourseFeature() {
  const features = [
    { 
      id: 1, 
      title: "دورة نصية", 
      body: "دروس تفاعلية تعتمد على النصوص مع تمارين فورية لاختبار فهمك وتطبيق المفاهيم عمليًا.",
      icon: BookOpen
    },
    { 
      id: 2, 
      title: "تحديات عملية", 
      body: "مشاريع مصغرة واقعية لتعزيز مهاراتك وتطبيق المفاهيم عمليًا مع حلول تفصيلية.",
      icon: Target
    },
    { 
      id: 3, 
      title: "بنك ترميز", 
      body: "مئات الأسئلة البرمجية مصنفة حسب الصعوبة مع حلول مشروحة وتفسيرات مفصلة.",
      icon: Code
    },
    { 
      id: 4, 
      title: "مدرب بالذكاء الاصطناعي", 
      body: "مدرب شخصي بالذكاء الاصطناعي يجيب على أسئلتك ويعطي ملاحظات فورية ومخصصة.",
      icon: Bot
    },
    { 
      id: 5, 
      title: "تدوين الملاحظات", 
      body: "دوّن أفكارك مباشرة أثناء الدرس واحفظها للرجوع إليها لاحقًا مع إمكانية التصدير.",
      icon: PenTool
    },
    { 
      id: 6, 
      title: "شهادة إتمام", 
      body: "احصل على شهادة رقمية موثوقة عند إنهاء جميع التحديات والمشاريع مع إمكانية المشاركة.",
      icon: Award
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
      className="relative isolate w-full py-20 px-4 md:px-8 lg:px-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-black"
    >
      {/* Enhanced decorative backgrounds */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />
      </div>



      {/* Enhanced heading section */}
      <div className="mx-auto max-w-6xl text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-2 text-sm font-medium text-amber-600 dark:text-amber-400 backdrop-blur-sm">
          <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse" />
          طور مهاراتك
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent leading-tight">
          ليست دورتك المعتادة
        </h2>
        
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed font-light">
          تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص ومليئة بالتحديات العملية مما يجعل 
          <span className="text-amber-600 dark:text-amber-400 font-semibold"> مسار SQL </span>
          التدريسي هذا يتميز بخصائص فريدة تجعله استثنائيًا.
        </p>
      </div>

      {/* Enhanced grid of feature cards */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isOpen = openId === feature.id;
          
          return (
            <div
              key={feature.id}
              className={`group relative rounded-3xl border transition-all duration-500 overflow-hidden ${
                isOpen 
                  ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-white/90 to-gray-50/80 dark:from-amber-500/10 dark:via-gray-800/50 dark:to-gray-900/80 shadow-2xl shadow-amber-500/20 scale-105' 
                  : 'border-gray-300/50 dark:border-gray-700/50 bg-gradient-to-br from-white/80 via-gray-50/60 to-white/40 dark:from-gray-800/40 dark:via-gray-900/60 dark:to-black/40 hover:border-amber-500/30 hover:bg-gradient-to-br hover:from-amber-500/5 hover:via-white/80 hover:to-gray-50/80 dark:hover:from-amber-500/5 dark:hover:via-gray-800/60 dark:hover:to-gray-900/80 hover:shadow-xl hover:shadow-amber-500/10'
              } backdrop-blur-md`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isOpen ? 'opacity-100' : ''
              } bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5`} />
              
              {/* Header button */}
              <button
                onClick={() => toggle(feature.id)}
                className="w-full text-start relative z-10 group/btn"
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="flex items-center gap-4 py-8 px-8">
                    {/* Icon */}
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      isOpen
                        ? "border-amber-500 dark:border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30"
                        : "border-gray-400 dark:border-gray-600 bg-gray-200/50 dark:bg-gray-700/30 group-hover/btn:border-amber-500 dark:group-hover/btn:border-amber-400 group-hover/btn:bg-amber-500/10"
                    }`}>
                      <IconComponent
                        className={`h-7 w-7 transition-all duration-300 ${
                          isOpen ? "text-amber-600 dark:text-amber-400 scale-110" : "text-gray-600 dark:text-gray-400 group-hover/btn:text-amber-600 dark:group-hover/btn:text-amber-400 group-hover/btn:scale-110"
                        }`}
                      />
                    </div>
                    
                    {/* Title and toggle icon */}
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={`text-xl font-bold transition-colors duration-300 ${
                          isOpen ? "text-amber-700 dark:text-amber-300" : "text-gray-800 dark:text-gray-100 group-hover/btn:text-amber-700 dark:group-hover/btn:text-amber-300"
                        }`}
                      >
                        {feature.title}
                      </span>
                      
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          isOpen
                            ? "border-amber-500 dark:border-amber-400 bg-amber-500/20 rotate-45"
                            : "border-gray-400 dark:border-gray-600 group-hover/btn:border-amber-500 dark:group-hover/btn:border-amber-400 group-hover/btn:bg-amber-500/10"
                        }`}
                      >
                        {isOpen ? (
                          <X className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Plus
                            className={`h-5 w-5 transition-colors duration-300 ${
                              "text-gray-600 dark:text-gray-400 group-hover/btn:text-amber-600 dark:group-hover/btn:text-amber-400"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>

              {/* Expandable body with smooth animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-8 pt-0 border-t border-amber-500/20">
                  <div className="bg-gradient-to-r from-gray-100/80 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-300/30 dark:border-gray-700/30">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-6">
                      {feature.body}
                    </p>
                    
                    {/* Enhanced call-to-action */}
                    <div className="flex justify-start gap-3">
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-400 text-white dark:text-black font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
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
                        className="border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 px-6 py-2 rounded-full transition-all duration-300"
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

      {/* Enhanced footer section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-gray-100/60 via-white/80 to-gray-100/60 dark:from-gray-800/30 dark:via-gray-900/50 dark:to-gray-800/30 rounded-3xl p-8 border border-gray-300/30 dark:border-gray-700/30 backdrop-blur-sm">
          <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
            تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص ومليئة 
            <span className="text-amber-600 dark:text-amber-400 font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent"> بالتحديات العملية </span>
            مما يجعل مسار SQL التدريسي هذا يتميز بخصائص فريدة تجعله 
            <span className="text-purple-600 dark:text-purple-400 font-bold"> استثنائيًا!</span>
          </p>
          
          <div className="mt-6 flex justify-center">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white dark:text-black font-bold px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-amber-500/30">
              ابدأ رحلتك الآن
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}