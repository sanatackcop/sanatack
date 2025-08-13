import { useEffect, useState } from "react";

import {
  getAllCoursesApi,
  getCourseReportApi,
} from "@/utils/_apis/courses-apis";
import { CoursesReport } from "@/types/courses";
import { CoursesContext } from "@/utils/types";
import {
  AnimatedBackground,
  EmptyState,
  ModernSectionHeader,
  ProfessionalCourseCard,
  StatsCards,
} from "./components/course.helpers";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Brain,
  Send,
  Sparkles,
  ArrowRight,
  Settings,
  ChevronRight,
  Check,
  Bot,
  Wand2,
  CheckCircle,
  Play,
  Plus,
  Trophy,
  Code,
  Cpu,
  CreditCard,
  FileText,
  FlaskConical,
  Gauge,
  Globe,
  HelpCircle,
  Palette,
  Rocket,
  Shield,
  Target,
} from "lucide-react";

interface Module {
  title: string;
  lessons: string[];
}

interface GeneratedCourse {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  isEnrolled: boolean;
  level: string;
  duration: string;
  modules: Module[];
  modulesCount: number;
}

interface Settings {
  level: keyof typeof LEVEL_OPTIONS;
  topic: keyof typeof TOPIC_OPTIONS;
  duration_hours: number;
  max_modules: number;
  max_lessons_per_module: number;
  include_code_lessons: boolean;
  include_quizzes: boolean;
  include_articles: boolean;
  include_flashcards: boolean;
}

interface SuggestedPrompt {
  title: string;
  description: string;
  icon: typeof Brain;
  color: string;
  prompt: string;
}

interface Feature {
  key: keyof Pick<
    Settings,
    | "include_code_lessons"
    | "include_quizzes"
    | "include_articles"
    | "include_flashcards"
  >;
  label: string;
  icon: typeof Code;
}

const TOPIC_OPTIONS = {
  AI: { label: "الذكاء الاصطناعي", icon: Brain },
  ML: { label: "التعلم الآلي", icon: Cpu },
  BACKEND: { label: "تطوير الخادم", icon: Shield },
  FRONTEND: { label: "واجهة المستخدم", icon: Palette },
  MOBILE: { label: "تطبيقات الجوال", icon: Globe },
  DATA: { label: "علوم البيانات", icon: FlaskConical },
} as const;

const LEVEL_OPTIONS = {
  BEGINNER: { label: "مبتدئ", icon: Target },
  INTERMEDIATE: { label: "متوسط", icon: Gauge },
  ADVANCED: { label: "متقدم", icon: Rocket },
  EXPERT: { label: "خبير", icon: Trophy },
} as const;

const CONTENT_FEATURES: Feature[] = [
  { key: "include_code_lessons", label: "دروس برمجية", icon: Code },
  { key: "include_quizzes", label: "اختبارات", icon: HelpCircle },
  { key: "include_articles", label: "مقالات", icon: FileText },
  { key: "include_flashcards", label: "بطاقات تعليمية", icon: CreditCard },
];

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    title: "دورة React المتقدمة",
    description: "تعلم React و TypeScript مع مشاريع عملية",
    icon: Code,
    color: "from-blue-500 to-cyan-600",
    prompt:
      "أريد دورة شاملة في React و TypeScript للمستوى المتقدم مع مشاريع عملية",
  },
  {
    title: "الذكاء الاصطناعي للمبتدئين",
    description: "أساسيات AI والتعلم الآلي",
    icon: Brain,
    color: "from-purple-500 to-pink-600",
    prompt: "دورة في أساسيات الذكاء الاصطناعي والتعلم الآلي للمبتدئين",
  },
  {
    title: "تطوير تطبيقات الجوال",
    description: "Flutter و React Native",
    icon: Globe,
    color: "from-green-500 to-emerald-600",
    prompt: "تعلم تطوير تطبيقات الجوال باستخدام Flutter و React Native",
  },
  {
    title: "علوم البيانات",
    description: "Python وتحليل البيانات",
    icon: FlaskConical,
    color: "from-orange-500 to-red-600",
    prompt: "دورة شاملة في علوم البيانات باستخدام Python",
  },
];

export default function DashboardHome() {
  const [courses, setCourses] = useState<CoursesContext[]>([]);
  const [stats, setStats] = useState<CoursesReport>({
    completedCourses: 0,
    totalHours: 0,
    streakDays: 0,
    certifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] =
    useState<GeneratedCourse | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    level: "BEGINNER",
    topic: "AI",
    duration_hours: 10,
    max_modules: 5,
    max_lessons_per_module: 6,
    include_code_lessons: true,
    include_quizzes: true,
    include_articles: true,
    include_flashcards: false,
  });

  const fetchAllCourses = async () => {
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الدورات. الرجاء المحاولة لاحقاً.");
      console.error("Error fetching courses:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getCourseReportApi();
      setStats(res);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllCourses(), fetchStats()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);

      const course: GeneratedCourse = {
        id: Date.now(),
        title: "دورة الذكاء الاصطناعي المتقدمة",
        description:
          "دورة شاملة في الذكاء الاصطناعي مع تطبيقات عملية ومشاريع حقيقية",
        thumbnail: "🤖",
        progress: 0,
        isEnrolled: false,
        level: LEVEL_OPTIONS[settings.level].label,
        duration: `${settings.duration_hours} ساعة`,
        modulesCount: settings.max_modules,
        modules: [
          {
            title: "أساسيات الذكاء الاصطناعي",
            lessons: [
              "المفاهيم الأساسية",
              "تاريخ AI",
              "التطبيقات الحديثة",
              "الأخلاقيات",
            ],
          },
          {
            title: "التعلم الآلي",
            lessons: [
              "الخوارزميات الأساسية",
              "التدريب والاختبار",
              "التقييم",
              "التطبيقات",
            ],
          },
          {
            title: "التعلم العميق",
            lessons: [
              "الشبكات العصبية",
              "CNN للرؤية",
              "RNN للنصوص",
              "Transformers",
            ],
          },
          {
            title: "مشاريع عملية",
            lessons: ["تصنيف الصور", "معالجة اللغة", "التنبؤ", "نموذج متكامل"],
          },
        ],
      };

      setGeneratedCourse(course);
      setIsGenerating(false);
    }, 2500);
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const toggleFeature = (key: Feature["key"]) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartCourse = (course: CoursesContext | GeneratedCourse) => {
    console.log("Starting course:", course);
  };

  const handleStartGeneratedCourse = () => {
    if (generatedCourse) {
      const newCourse: CoursesContext = {
        ...generatedCourse,
        isEnrolled: true,
      } as unknown as CoursesContext;

      setCourses((prev) => [...prev, newCourse]);
      handleStartCourse(generatedCourse);
      setGeneratedCourse(null);
      setPrompt("");
    }
  };

  const resetGenerator = () => {
    setGeneratedCourse(null);
    setPrompt("");
    setGenerationProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 transition-colors duration-500">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-16">
        <StatsCards stats={stats} />

        <div>
          <ModernSectionHeader title="اصنع كورساتك" />
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              {!isGenerating && !generatedCourse ? (
                // Input Section
                <div className="space-y-6">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      ماذا تريد أن تتعلم؟
                    </label>
                    <div className="relative">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="اكتب وصفاً للدورة التي تريد إنشاءها... مثال: أريد دورة شاملة في تطوير تطبيقات الويب باستخدام React"
                        className="w-full p-4 pr-12 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400"
                        rows={3}
                        maxLength={1000}
                      />
                      <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="absolute left-3 bottom-3 p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        مدعوم بالذكاء الاصطناعي
                      </span>
                      <span className="text-xs text-gray-500">
                        {prompt.length}/1000
                      </span>
                    </div>
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      اقتراحات سريعة
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SUGGESTED_PROMPTS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleSuggestedPrompt(suggestion.prompt)
                          }
                          className="group p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition-all text-right"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${suggestion.color} shadow`}
                            >
                              <suggestion.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {suggestion.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                {suggestion.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="w-full flex items-center justify-between mb-4"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-500" />
                        إعدادات متقدمة
                      </h3>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          showSettings ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {showSettings && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            مستوى الدورة
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(LEVEL_OPTIONS).map(
                              ([key, level]) => (
                                <button
                                  key={key}
                                  onClick={() =>
                                    setSettings({
                                      ...settings,
                                      level: key as keyof typeof LEVEL_OPTIONS,
                                    })
                                  }
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    settings.level === key
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                      : "border-gray-200 dark:border-gray-700"
                                  }`}
                                >
                                  <level.icon className="w-5 h-5 mx-auto mb-1" />
                                  <span className="text-xs">{level.label}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            المحتوى التفاعلي
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {CONTENT_FEATURES.map((feature) => (
                              <button
                                key={feature.key}
                                onClick={() => toggleFeature(feature.key)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  settings[feature.key]
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                                }`}
                              >
                                <feature.icon className="w-4 h-4 mx-auto mb-1" />
                                <span className="text-xs">{feature.label}</span>
                                {settings[feature.key] && (
                                  <Check className="w-3 h-3 mx-auto mt-1 text-green-500" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              المدة (ساعات)
                            </label>
                            <input
                              type="number"
                              value={settings.duration_hours}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  duration_hours: parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full p-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                              min="1"
                              max="200"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                              عدد الوحدات
                            </label>
                            <input
                              type="number"
                              value={settings.max_modules}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  max_modules: parseInt(e.target.value) || 1,
                                })
                              }
                              className="w-full p-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                              min="1"
                              max="20"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : isGenerating ? (
                // Generation Progress
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
                    <Bot className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      جاري إنشاء دورتك المخصصة
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      يعمل الذكاء الاصطناعي على تصميم محتوى تعليمي متخصص
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <span>التقدم</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {[
                      {
                        icon: Brain,
                        label: "تحليل المتطلبات",
                        completed: generationProgress > 30,
                      },
                      {
                        icon: Wand2,
                        label: "توليد المحتوى",
                        completed: generationProgress > 60,
                      },
                      {
                        icon: CheckCircle,
                        label: "مراجعة النتائج",
                        completed: generationProgress >= 100,
                      },
                    ].map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                          step.completed
                            ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600"
                            : "border-gray-200 dark:border-gray-700 text-gray-400"
                        }`}
                      >
                        <step.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-xs font-medium block">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : generatedCourse ? (
                // Generated Course Result
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-xl mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      تم إنشاء دورتك بنجاح!
                    </h3>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-2xl font-bold mb-2">
                          {generatedCourse.title}
                        </h4>
                        <p className="text-blue-100 mb-4">
                          {generatedCourse.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="bg-white/20 px-3 py-1 rounded-lg">
                            {generatedCourse.duration}
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-lg">
                            {generatedCourse.modules.length} وحدات
                          </span>
                          <span className="bg-white/20 px-3 py-1 rounded-lg">
                            {generatedCourse.level}
                          </span>
                        </div>
                      </div>
                      <div className="text-5xl">
                        {generatedCourse.thumbnail}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {generatedCourse.modules.map((module, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {module.title}
                          </h5>
                          <span className="ml-auto text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                            {module.lessons.length} دروس
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleStartGeneratedCourse}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 font-medium shadow-lg"
                    >
                      <Play className="w-5 h-5" />
                      ابدأ الدورة الآن
                    </button>
                    <button
                      onClick={resetGenerator}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      إنشاء دورة أخرى
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : courses.filter((course) => course.isEnrolled == true).length > 0 ? (
          <section className="space-y-8">
            <ModernSectionHeader
              title="تابع دوراتك الحالية"
              description="أكمل ما بدأته وارتقِ بمهاراتك إلى المستوى التالي"
            />
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => course.isEnrolled == true)
                .map((course: any) => (
                  <ProfessionalCourseCard key={course.id} course={course} />
                ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="لا توجد دورات حالية"
            description="ابدأ رحلتك التعليمية بإنشاء دورة مخصصة باستخدام الذكاء الاصطناعي أو اختر من مكتبة الدورات"
            actionText="ابدأ التعلم الآن"
          />
        )}
      </div>
    </div>
  );
}
