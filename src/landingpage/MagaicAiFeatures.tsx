import PixelCard from "@/components/PixelCard";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

export function MagicAiFeatures() {
  const { t } = useTranslation();
  const { isRTL: isRtl } = useLocaleDirection();

  const features = [
    {
      image: "/assets/features/ask-Sanatack.png",
      titleEn: "Ask Sanatack Anything",
      titleAr: "اسأل صنعتك",
      descriptionEn:
        "Have a simple question, a detailed question, or an audio question? Sanatack helps you with it simply and accurately.",
      descriptionAr:
        "عندك سؤال بسيط أو صعبة؟ أسأل صنعتك بنص أو صوت. صنعتك بيساعدك بسهولة ودقة.",
      variant: "pink",
    },
    {
      image: "/assets/features/concepts.png",
      titleEn: "Explains Difficult Concepts",
      titleAr: "يشرح لك المفاهيم الصعبة بتأنية",
      descriptionEn:
        "Sanatack explains difficult concepts in a way that suits you through graphics, examples, and personalized illustrations.",
      descriptionAr:
        "صنعتك يشرح لك المفاهيم الصعبة بطريقة تناسبك من خلال الرسومات والأمثلة والتوضيحات.",
      variant: "blue",
    },
    {
      image: "/assets/features/translation.png",
      titleEn: "Contextual Translation",
      titleAr: "يترجم لك بالمعنى",
      descriptionEn:
        "Sanatack translates questions, explanations and answers with accurate meaning in context.",
      descriptionAr:
        "يترجم الأسئلة والإجابات والشروحات بالمعنى ومش بالترجمة الحرفية.",
      variant: "purple",
    },
    {
      image: "/assets/features/suggestions.png",
      titleEn: "Suggests Difficult Topics",
      titleAr: "يقترح لك المواضيع الصعبة",
      descriptionEn:
        "Sanatack identifies and breaks down complex concepts through personalized learning paths.",
      descriptionAr:
        "صنعتك يحدد الأفكار المعقدة ويشرحها من خلال مسارات تعليمية شخصية.",
      variant: "green",
    },
    {
      image: "/assets/features/mnemonics.png",
      titleEn: "Breakdown Using Mnemonics",
      titleAr: "يرتب لك المعلومات (Mnemonics)",
      descriptionEn:
        "Sanatack builds engaging memory techniques with interactive flashcards to help you retain better.",
      descriptionAr:
        "صنعتك بيبني تقنيات ذاكرة تفاعلية مع البطاقات التعليمية عشان تحفظ أفضل.",
      variant: "orange",
    },
    {
      image: "/assets/features/feedback.png",
      titleEn: "Personalized Hints",
      titleAr: "يقترح للإجابة الصحيحة ويلمح لك!",
      descriptionEn:
        "Having difficulty answering? Sanatack offers correct guidance with hints and tips, not full answers.",
      descriptionAr:
        "صعب عليك تجاوب؟ صنعتك يقترح الإجابة الصحيحة ويلمح لك مش يديك الحل كامل!",
      variant: "pink",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="magic-ai-features"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-6xl text-center space-y-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl tracking-tight text-gray-900 dark:text-white leading-tight mt-6">
            {isRtl
              ? "مزايا صنعتك... تفتح لك أبواب الإبداع بلا حدود"
              : "Features Built for You... Unlocking Limitless Creativity"}
          </h2>

          <p className="text-md text-gray-600 dark:text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed">
            {t("aiTutor.subtitle")}
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="min-h-[400px]"
          >
            <PixelCard variant={feature.variant as any} className="!w-full">
              <div className="absolute inset-0 flex flex-col p-6">
                {/* Image Container */}
                <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden bg-black/10 backdrop-blur-sm">
                  <img
                    src={feature.image}
                    alt={isRtl ? feature.titleAr : feature.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    {isRtl ? feature.titleAr : feature.titleEn}
                  </h3>

                  <p className="text-white/90 text-sm leading-relaxed">
                    {isRtl ? feature.descriptionAr : feature.descriptionEn}
                  </p>
                </div>
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
