import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import { ModernButton } from "@/components/ModernButton";

const FAQs = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { darkMode } = useSettings();

  const faqData = [
    {
      question: "هل يمكنني تعلم البرمجة بدون خبرة سابقة؟",
      answer:
        "نعم بالطبع! تم تصميم دوراتنا خصيصاً للمبتدئين. نبدأ معك من الأساسيات ونتدرج بك خطوة بخطوة حتى تصل إلى مستوى متقدم. لا نفترض أي معرفة مسبقة، ونوفر الدعم والإرشاد المستمر طوال رحلتك التعليمية. ستتعلم البرمجة من خلال مشاريع عملية وتطبيقات حقيقية.",
    },
    {
      question: "كيف يتم تنظيم الدورات والمسارات التعليمية؟",
      answer:
        'يتم تنظيم دوراتنا في وحدات ودروس متسلسلة، كل درس يركز على مفهوم معين ويتضمن شروحات وتمارين عملية. المسارات التعليمية تجمع عدة دورات لتحقيق هدف تعليمي أكبر (مثل: "تطوير تطبيقات الويب").',
    },
    {
      question: "هل يمكنني التعلم بالسرعة التي تناسبني؟",
      answer:
        "نعم، جميع الدورات متاحة للتعلم الذاتي، ويمكنك التقدم فيها بالسرعة التي تجدها مناسبة لجدولك الزمني ومستوى استيعابك.",
    },
    {
      question: "هل سأحصل على شهادة عند إكمال دورة أو مسار تعليمي؟",
      answer:
        "نعم، عند إكمال جميع متطلبات الدورة بنجاح، ستحصل على شهادة إتمام معتمدة يمكنك مشاركتها على منصات التوظيف مثل LinkedIn أو إضافتها إلى سيرتك الذاتية.",
    },
    {
      question: "كيف يمكنني تتبع تقدمي في التعلم؟",
      answer:
        "يمكنك تتبع تقدمك من خلال لوحة التحكم الخاصة بك، والتي تعرض الدروس التي أكملتها، والتمارين التي قمت بحلها، وأداءك العام في الدورات.",
    },
    {
      question: "هل هناك مشاريع عملية يمكنني إضافتها إلى معرض أعمالي؟",
      answer:
        "نعم، تتضمن العديد من دوراتنا ومساراتنا التعليمية مشاريع تطبيقية يمكنك العمل عليها واستخدامها كجزء من معرض أعمالك (portfolio) لإظهار مهاراتك.",
    },
    {
      question: "كيف تعمل تمارين البرمجة التفاعلية؟",
      answer:
        "توفر لك تماريننا بيئة كود مدمجة حيث يمكنك كتابة الكود الخاص بك مباشرة وتشغيله لرؤية النتائج. يتم غالباً تقديم إرشادات واختبارات آلية للتحقق من صحة حلك.",
    },
    {
      question: "ماذا لو واجهت صعوبة في حل تمرين ما؟ هل هناك مساعدة متاحة؟",
      answer:
        "نعم، نقدم عدة طرق للمساعدة. تحتوي بعض التمارين على تلميحات. يمكنك أيضاً طرح سؤال في منتدى المجتمع الخاص بالدورة، مراجعة الدروس السابقة، أو الاطلاع على الحلول (متاحة بعد عدة محاولات).",
    },
    {
      question: "هل يمكنني حفظ الكود الخاص بي والعودة إليه لاحقاً؟",
      answer:
        "نعم، يتم حفظ تقدمك في التمارين تلقائياً، ويمكنك العودة لإكمالها في أي وقت.",
    },
    {
      question:
        "ماذا يحدث إذا كان الكود الخاص بي غير صحيح؟ كيف أحصل على ملاحظات؟",
      answer:
        "عند تشغيل الكود، سيوفر لك المحرر التفاعلي ملاحظات حول الأخطاء (إذا وجدت) أو نتائج الاختبارات التي لم يتم اجتيازها، مما يساعدك على تحديد المشكلة وتصحيحها.",
    },
  ];

  const toggleItem = useCallback((index: number) => {
    setOpenItems((prev) => {
      const updated = new Set(prev);
      updated.has(index) ? updated.delete(index) : updated.add(index);
      return updated;
    });
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-300`} dir="rtl">
      <div className="container mx-auto px-8 py-20">
        <div className="text-left mb-16">
          <h1 className="text-4xl md:text-6xl text-right font-bold mb-4">
            الأسئلة الشائعة
          </h1>
        </div>

        <div className="max-w-6xl mx-auto">
          {faqData.map((item, index) => {
            const isOpen = openItems.has(index);

            return (
              <div
                key={index}
                className={`border-b transition-all duration-300 ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
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
          <ModernButton
            to="/signup"
            className="w-full sm:w-auto bg-gradient-to-br from-indigo-600 to-sky-600 !text-white"
          >
            ابدأ مجاناً الآن
          </ModernButton>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
