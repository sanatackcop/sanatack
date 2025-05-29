import { useState } from "react";
import { Award, BookOpen, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContexts";

const FAQs = () => {
  const [openItems, setOpenItems] = useState([0]);
  const { darkMode } = useSettings();

  const faqData = [
    {
      question: "هل يمكنني تعلم البرمجة بدون خبرة سابقة؟",
      answer:
        "نعم بالطبع! تم تصميم دوراتنا خصيصاً للمبتدئين. نبدأ معك من الأساسيات ونتدرج بك خطوة بخطوة حتى تصل إلى مستوى متقدم. لا نفترض أي معرفة مسبقة، ونوفر الدعم والإرشاد المستمر طوال رحلتك التعليمية. ستتعلم البرمجة من خلال مشاريع عملية وتطبيقات حقيقية.",
    },
    {
      question: "متى سأحصل على طلبي؟",
      answer:
        "بمجرد التسجيل في الدورة، ستحصل على الوصول الفوري لجميع المواد التعليمية. يمكنك البدء في التعلم على الفور والوصول للمحتوى في أي وقت ومن أي مكان.",
    },
    {
      question: "هل يمكنني طلب التوصيل؟",
      answer:
        "منصتنا رقمية بالكامل، مما يعني عدم الحاجة للتوصيل التقليدي. جميع المواد والدروس متاحة أونلاين ويمكنك الوصول إليها فوراً.",
    },
    {
      question: "هل يمكنني إضافة العناصر إلى طلبي؟",
      answer:
        "يمكنك ترقية خطتك التعليمية في أي وقت لتشمل دورات إضافية أو خدمات متقدمة. ندعم المرونة الكاملة في اختيار المسار التعليمي المناسب لك.",
    },
    {
      question: "متى سأحصل على طلبي؟",
      answer:
        "الوصول فوري! بعد التسجيل مباشرة، ستتلقى بيانات الدخول عبر البريد الإلكتروني ويمكنك البدء في التعلم خلال دقائق.",
    },
    {
      question: "هل يمكنني طلب التوصيل؟",
      answer:
        "التعلم متاح 24/7 من خلال منصتنا الرقمية. نوفر أيضاً تطبيق محمول لتتمكن من التعلم أثناء التنقل.",
    },
    {
      question: "هل يمكنني إضافة العناصر إلى طلبي؟",
      answer:
        "نعم، يمكنك تخصيص مسارك التعليمي بإضافة دورات متخصصة، ورش عمل عملية، أو جلسات إرشاد فردية.",
    },
  ];

  const toggleItem = (index: any) => {
    setOpenItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-8 py-20">
        {/* Header */}
        <div className="text-left mb-16">
          <h1 className="text-4xl md:text-6xl text-right font-bold mb-4">
            الأسئلة الشائعة
          </h1>
        </div>

        {/* FAQ List */}
        <div className="max-w-6xl mx-auto">
          {faqData.map((item, index) => {
            const isOpen = openItems.includes(index);

            return (
              <div
                key={index}
                className={`border-b transition-all duration-300 ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {/* Question */}
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full py-6 flex items-center justify-between text-right hover:${
                    darkMode ? "bg-gray-900/20" : "bg-gray-50"
                  } transition-all duration-300 group`}
                >
                  <h3 className="text-xl md:text-2xl font-medium text-right flex-1 pr-4">
                    {item.question}
                  </h3>

                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pr-0">
                    <p
                      className={`text-lg leading-relaxed ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: "50K+", label: "طالب نشط", icon: Users },
            { number: "500+", label: "درس تفاعلي", icon: BookOpen },
            { number: "95%", label: "معدل النجاح", icon: Award },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  } group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent
                    className={`w-8 h-8 ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  />
                </div>
                <div className="text-4xl lg:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ رحلتك التعليمية اليوم
          </h2>
          <p
            className={`text-lg mb-8 max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            انضم إلى آلاف الطلاب الذين غيروا مسارهم المهني من خلال منصتنا
            التعليمية المتقدمة
          </p>
          <Button
            size="lg"
            className={`${
              darkMode
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            } font-bold px-12 py-6 rounded-full text-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl`}
          >
            ابدأ مجاناً الآن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
