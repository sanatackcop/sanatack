import {
  Code,
  BookOpen,
  Zap,
  Brain,
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  BookMarked,
  GraduationCap,
  Layers,
  Timer,
  Trophy,
  Rocket,
  ShieldCheck,
  Compass,
  CircleArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLocaleDirection } from "@/hooks/useLocaleDirection";

// Import Videos
import quizVideo from "@/assets/demo/gifs/quiz.mp4";
import flashcardVideo from "@/assets/demo/gifs/flashcard.mp4";
import summaryVideo from "@/assets/demo/gifs/summry.mp4";
import deepVideo from "@/assets/demo/gifs/deep.mp4";

export function AITutorFeatures() {
  const { t } = useTranslation();
  const { isRTL, direction } = useLocaleDirection();

  const tutorFeatures = [
    {
      id: 1,
      titleKey: "aiTutor.chat.title",
      descriptionKey: "aiTutor.chat.description",
      ctaKey: "aiTutor.chat.cta",
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      glowColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "#3b82f6",
      image: deepVideo,
      position: "left" as const,
      miniFeatures: [
        {
          iconKey: Brain,
          labelKey: "aiTutor.chat.features.intelligent",
        },
        {
          iconKey: Zap,
          labelKey: "aiTutor.chat.features.instant",
        },
        {
          iconKey: Users,
          labelKey: "aiTutor.chat.features.personalized",
        },
        {
          iconKey: Target,
          labelKey: "aiTutor.chat.features.focused",
        },
      ],
    },
    {
      id: 2,
      titleKey: "aiTutor.quiz.title",
      descriptionKey: "aiTutor.quiz.description",
      ctaKey: "aiTutor.quiz.cta",
      borderColor: "#a855f7",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      glowColor: "rgba(168, 85, 247, 0.5)",
      image: quizVideo,
      position: "right" as const,
      miniFeatures: [
        {
          iconKey: Target,
          labelKey: "aiTutor.quiz.features.adaptive",
        },
        {
          iconKey: Trophy,
          labelKey: "aiTutor.quiz.features.gamified",
        },
        {
          iconKey: TrendingUp,
          labelKey: "aiTutor.quiz.features.progress",
        },
        {
          iconKey: Timer,
          labelKey: "aiTutor.quiz.features.timed",
        },
      ],
    },
    {
      id: 3,
      titleKey: "aiTutor.flashcards.title",
      descriptionKey: "aiTutor.flashcards.description",
      ctaKey: "aiTutor.flashcards.cta",
      borderColor: "#10b981",
      gradient: "from-green-500 via-emerald-500 to-green-600",
      glowColor: "rgba(34, 197, 94, 0.5)",
      image: flashcardVideo,
      position: "left" as const,
      miniFeatures: [
        {
          iconKey: Brain,
          labelKey: "aiTutor.flashcards.features.memory",
        },
        {
          iconKey: Target,
          labelKey: "aiTutor.flashcards.features.easy",
        },
        {
          iconKey: Lightbulb,
          labelKey: "aiTutor.flashcards.features.smart",
        },
        {
          iconKey: BookMarked,
          labelKey: "aiTutor.flashcards.features.organized",
        },
      ],
    },
    {
      id: 4,
      titleKey: "aiTutor.summary.title",
      descriptionKey: "aiTutor.summary.description",
      ctaKey: "aiTutor.summary.cta",
      borderColor: "#f97316",
      gradient: "from-orange-500 via-red-500 to-orange-600",
      glowColor: "rgba(249, 115, 22, 0.5)",
      image: summaryVideo,
      position: "right" as const,
      miniFeatures: [
        {
          iconKey: Zap,
          labelKey: "aiTutor.summary.features.quick",
        },
        {
          iconKey: CheckCircle,
          labelKey: "aiTutor.summary.features.accurate",
        },
        {
          iconKey: Layers,
          labelKey: "aiTutor.summary.features.structured",
        },
        {
          iconKey: Sparkles,
          labelKey: "aiTutor.summary.features.keypoints",
        },
      ],
    },
    {
      id: 5,
      titleKey: "aiTutor.code.title",
      descriptionKey: "aiTutor.code.description",
      ctaKey: "aiTutor.code.cta",
      gradient: "from-indigo-500 via-blue-500 to-indigo-600",
      glowColor: "rgba(99, 102, 241, 0.5)",
      image: deepVideo,
      position: "left" as const,
      borderColor: "#6366f1",
      hidden: true,
      miniFeatures: [
        {
          iconKey: Code,
          labelKey: "aiTutor.code.features.syntax",
        },
        {
          iconKey: ShieldCheck,
          labelKey: "aiTutor.code.features.debug",
        },
        {
          iconKey: Rocket,
          labelKey: "aiTutor.code.features.optimize",
        },
        {
          iconKey: GraduationCap,
          labelKey: "aiTutor.code.features.learn",
        },
      ],
    },
    {
      id: 6,
      titleKey: "aiTutor.deepExplanation.title",
      descriptionKey: "aiTutor.deepExplanation.description",
      ctaKey: "aiTutor.deepExplanation.cta",
      gradient: "from-pink-500 via-rose-500 to-pink-600",
      glowColor: "rgba(236, 72, 153, 0.5)",
      image: deepVideo,
      borderColor: "#ec4899",
      position: "left" as const,
      miniFeatures: [
        {
          iconKey: Brain,
          labelKey: "aiTutor.deepExplanation.features.detailed",
        },
        {
          iconKey: Compass,
          labelKey: "aiTutor.deepExplanation.features.guided",
        },
        {
          iconKey: Lightbulb,
          labelKey: "aiTutor.deepExplanation.features.examples",
        },
        {
          iconKey: BookOpen,
          labelKey: "aiTutor.deepExplanation.features.comprehensive",
        },
      ],
    },
  ];

  return (
    <section
      id="ai-tutor-features"
      dir={direction}
      className="relative w-full py-20 md:py-32 px-4 md:px-8 lg:px-16 overflow-hidden bg-white dark:bg-[#0a0a0b] transition-colors duration-300"
    >
      <div className="relative mx-auto max-w-6xl text-center space-y-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl tracking-tight text-gray-900 dark:text-white leading-tight mt-6">
            {t("aiTutor.title")}
          </h2>

          <p className="text-md text-gray-600 dark:text-gray-400 mt-3 max-w-3xl mx-auto leading-relaxed">
            {t("aiTutor.subtitle")}
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl space-y-24 md:space-y-32">
        {tutorFeatures
          .filter(feature => !feature.hidden)
          .map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={index}
            isRTL={isRTL}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    id: number;
    titleKey: string;
    borderColor: string;
    descriptionKey: string;
    ctaKey: string;
    gradient: string;
    glowColor: string;
    image: string;
    position: "left" | "right";
    hidden?: boolean;
    miniFeatures?: Array<{
      iconKey: any;
      labelKey: string;
    }>;
  };
  index: number;
  isRTL: boolean;
  t: any;
}

function FeatureCard({ feature, index, isRTL, t }: FeatureCardProps) {
  const isLeft = isRTL
    ? feature.position === "right"
    : feature.position === "left";

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: index * 0.15 }}
        viewport={{ once: true, margin: "-100px" }}
        className={`flex flex-col ${
          isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        } items-center gap-8 lg:gap-16`}
      >
        <motion.div
          whileHover={{ scale: 1.02, rotateY: isLeft ? 5 : -5 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex-1 w-full max-w-xl"
        >
          <div className="relative group">
            {/* Glass Container */}
            <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden">
              {/* Gradient Overlay on Glass */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}
              />

              {/* Video */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <video
                  src={feature.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </motion.div>

        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <h3
                className={`text-3xl ${
                  isRTL ? "text-right" : "text-left"
                } w-full font-medium text-gray-900 dark:text-white`}
              >
                {t(feature.titleKey)}
              </h3>
            </div>

            <p
              className={`text-gray-600 dark:text-gray-400 text-md leading-relaxed mb-8 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t(feature.descriptionKey)}
            </p>

            {feature.miniFeatures && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                {feature.miniFeatures.map((miniFeature, idx) => {
                  const MiniIcon = miniFeature.iconKey;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15 + 0.3 + idx * 0.1,
                      }}
                      viewport={{ once: true }}
                      className="relative group cursor-pointer"
                    >
                      <div
                        className={`flex items-center justify-end gap-3 ${
                          isRTL ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t(miniFeature.labelKey)}
                        </span>
                        <div
                          className="size-10 rounded-lg border-2 flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: feature.borderColor,
                          }}
                        >
                          <MiniIcon className="size-5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <motion.button
              className="inline-flex items-center gap-3 px-6 py-3 group border-2 
              text-gray-900 dark:text-white rounded-2xl font-bold text-sm transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: feature.borderColor,
              }}
            >
              <span>{t(feature.ctaKey)}</span>
              <CircleArrowLeft
                className={`size-5 group-hover:translate-x-1 group-hover:rotate-${
                  isRTL ? "45" : "90"
                } transition-transform duration-200 ${
                  isRTL ? "" : "rotate-180"
                }`}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
