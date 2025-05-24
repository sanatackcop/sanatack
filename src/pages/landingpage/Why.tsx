import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Users, CheckCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";

const WhyUs = () => {
  const { darkMode } = useSettings();

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
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
          {/* Title and Description */}
          <div className="flex-1 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
              لماذا صنعتك
            </h1>
            <div
              className={`space-y-4 text-lg md:text-xl leading-relaxed max-w-4xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p>
                تم تصميم هذه الدورة بطريقة تفاعلية تعتمد على النصوص ومليئة
                بالتحديات العملية، مما يجعل مبكس SQL الحديثي هذا يتميز
              </p>
              <p>بخصائص فريدة تجعله استثنائياً</p>
            </div>
          </div>

          {/* Browse Programs Button */}
          <div className="flex-shrink-0">
            <Button
              size="lg"
              className={`${
                darkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              } font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              تصفح البرامج
            </Button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className={`${
                  darkMode
                    ? "bg-gray-900 border-gray-800 hover:border-gray-700"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                } transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
              >
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-base leading-relaxed mb-6 flex-grow ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>

                  {/* Highlights */}
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

                  {/* Bottom Accent Line */}
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
