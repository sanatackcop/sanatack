import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Database,
  Users,
  CheckCircle,
  Brain,
  Map,
  Sparkles,
  Clock,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import { useNavigate } from "react-router-dom";

const WhyUs = () => {
  const { darkMode } = useSettings();
  const navigate = useNavigate();
  const features = [
    {
      icon: Code,
      title: "تعلم عملي وتطبيقي",
      description:
        "تم تصميم الدورة بطريقة تفاعلية تعتمد على التطبيق العملي والتحديات الحقيقية مما يجعل التعلم أكثر فعالية وإثارة.",
      highlights: ["مشاريع حقيقية", "تحديات عملية", "تطبيق فوري"],
    },
    {
      icon: Database,
      title: "منهج شامل ومتطور",
      description:
        "منهج يغطي أحدث التقنيات والأدوات المطلوبة في سوق العمل مع تحديث مستمر للمحتوى ليواكب التطورات التكنولوجية.",
      highlights: ["تقنيات حديثة", "محتوى محدث", "معايير السوق"],
    },
    {
      icon: Users,
      title: "مجتمع داعم ومتفاعل",
      description:
        "انضم إلى مجتمع من المتعلمين والخبراء الذين يساعدونك في رحلتك التعليمية ويقدمون الدعم والإرشاد المستمر.",
      highlights: ["دعم مستمر", "خبراء متخصصون", "تفاعل مجتمعي"],
    },
    {
      icon: Brain,
      title: "مساعد ذكي بالذكاء الاصطناعي",
      description:
        "مساعد ذكي متطور يفهم أسلوبك في التعلم ويقدم إرشادات شخصية ويجيب على أسئلتك على مدار الساعة لتحسين تجربة التعلم.",
      highlights: ["إرشاد شخصي", "متاح 24/7", "تحليل ذكي"],
      isSoon: true,
    },
    {
      icon: Sparkles,
      title: "تجربة تعلم تفاعلية ومخصصة",
      description:
        "تجربة تعلم فريدة تتكيف مع مستواك ووتيرة تعلمك، مع محتوى تفاعلي ومسارات تعليمية مخصصة حسب اهتمامك وهدفك المهني.",
      highlights: ["محتوى مخصص", "مسارات ذكية", "تقييم مستمر"],
      isSoon: true,
    },
    {
      icon: Map,
      title: "خريطة المهارات الذكية",
      description:
        "نظام خرائط ذهنية تفاعلي يتتبع تقدمك ويرسم لك طريق واضح نحو إتقان المهارات المطلوبة في مجالك مع توصيات ذكية للخطوات التالية.",
      highlights: ["تتبع تقدم ذكي", "خرائط ذهنية", "توصيات مخصصة"],
      isSoon: true,
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 mt-10  }`}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
          <div className="flex-1 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black">
              لماذا صنعتك
            </h1>
          </div>

          <div className="flex-shrink-0">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className={`bg-black dark:bg-white text-white dark:text-black font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              تصفح البرامج
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-105 group relative overflow-hidden`}
              >
                {feature.isSoon && (
                  <div className="absolute top-4 left-4 z-10">
                    <div
                      className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-lg`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>قريباً</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-8 h-full flex flex-col relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className={`w-8 h-8 text-white `} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                    {feature.title}
                  </h3>

                  <p
                    className={`text-base leading-relaxed mb-6 flex-grow ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    {feature.highlights.map((highlight, highlightIndex) => (
                      <div
                        key={highlightIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle
                          className={`w-4 h-4 flex-shrink-0 ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`h-1 rounded-full mt-6 ${
                      darkMode ? "bg-gray-800" : "bg-gray-200"
                    } group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300`}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
