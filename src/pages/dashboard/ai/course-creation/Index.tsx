import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Book,
  Code,
  FileText,
  HelpCircle,
  Globe,
  CheckCircle,
  Lightbulb,
  Users,
} from "lucide-react";
import AppLayout from "@/components/layout/Applayout";

interface GeneratedCourse {
  title: string;
  description: string;
  modules: {
    title: string;
    lessons: string[];
  }[];
}

export default function AiCourseGeneration() {
  const [prompt, setPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    level: "BEGINNER",
    topic: "Artificial_Intelligence",
    duration_hours: 10,
    include_code_lessons: true,
    include_quizzes: true,
    include_articles: true,
    language: "ar",
    max_modules: 5,
    max_lessons_per_module: 8,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] =
    useState<GeneratedCourse | null>(null);

  const topicLabels: Record<string, string> = {
    Artificial_Intelligence: "الذكاء الاصطناعي",
    MACHINE_LEARNING: "التعلم الآلي",
    BACKEND: "تطوير الخادم",
    FRONTEND: "تطوير واجهة المستخدم",
  };

  const levelLabels: Record<string, string> = {
    BEGINNER: "مبتدئ",
    INTERMEDIATE: "متوسط",
    ADVANCED: "متقدم",
  };

  const handleShowSettings = () => {
    if (!prompt.trim()) return;
    setShowSettings(true);
  };

  const handleCreateCourse = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCourse({
        title: "دورة الذكاء الاصطناعي الشاملة",
        description:
          "دورة متكاملة تغطي أساسيات الذكاء الاصطناعي والتعلم الآلي مع تطبيقات عملية",
        modules: [
          {
            title: "مقدمة في الذكاء الاصطناعي",
            lessons: [
              "تاريخ الذكاء الاصطناعي",
              "المفاهيم الأساسية",
              "التطبيقات العملية",
              "أخلاقيات الذكاء الاصطناعي",
            ],
          },
          {
            title: "التعلم الآلي",
            lessons: [
              "أنواع التعلم",
              "خوارزميات التعلم",
              "التدريب والاختبار",
              "تقييم النماذج",
            ],
          },
          {
            title: "التعلم العميق",
            lessons: [
              "الشبكات العصبية",
              "TensorFlow و PyTorch",
              "معالجة الصور",
              "معالجة اللغة الطبيعية",
            ],
          },
        ],
      });
      setIsGenerating(false);
    }, 3000);
  };

  // Reset to create new course
  const handleReset = () => {
    setPrompt("");
    setShowSettings(false);
    setGeneratedCourse(null);
    setIsGenerating(false);
  };

  return (
    <AppLayout>
    <div className="min-h-screen  flex flex-col items-center justify-center  px-2 transition-all duration-300">
      <div className="w-full max-w-2xl mx-auto">
        {/* Prompt Card */}
        {!showSettings && !generatedCourse && (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-neutral-100 dark:border-neutral-700 p-8 flex flex-col gap-6 animate-fade-in">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-500" /> وصف الدورة
              المطلوبة
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب وصفاً مفصلاً للدورة التي تريد إنشاؤها..."
              className="w-full h-32 p-5 text-lg bg-neutral-50 dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 resize-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200 transition-all duration-200 shadow-sm"
              style={{ outline: "none" }}
              maxLength={1000}
            />
            <div className="flex justify-between mt-1 text-sm text-gray-400 dark:text-gray-500">
              <span>{prompt.length}/1000</span>
            </div>
          
            <button
              onClick={handleShowSettings}
              disabled={!prompt.trim()}
              className="w-full mt-6 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              <span>إنشاء الدورة</span>
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Settings Section (Revealed after prompt) */}
        {showSettings && !generatedCourse && (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-700 p-8 mt-8 animate-fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                تخصيص إعدادات الدورة
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                يمكنك تخصيص تفاصيل الدورة أدناه قبل الإنشاء النهائي
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <Users className="w-5 h-5 text-blue-500" /> مستوى الدورة
                  </label>
                  <select
                    value={settings.level}
                    onChange={(e) =>
                      setSettings({ ...settings, level: e.target.value })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    {Object.entries(levelLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <Book className="w-5 h-5 text-blue-500" /> مجال الدورة
                  </label>
                  <select
                    value={settings.topic}
                    onChange={(e) =>
                      setSettings({ ...settings, topic: e.target.value })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    {Object.entries(topicLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" /> مدة الدورة
                    (ساعات)
                  </label>
                  <input
                    type="number"
                    value={settings.duration_hours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        duration_hours: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                    min="1"
                    max="200"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <Globe className="w-5 h-5 text-blue-500" /> عدد الوحدات
                  </label>
                  <input
                    type="number"
                    value={settings.max_modules}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        max_modules: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <FileText className="w-5 h-5 text-blue-500" /> دروس لكل وحدة
                  </label>
                  <input
                    type="number"
                    value={settings.max_lessons_per_module}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        max_lessons_per_module: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                    min="1"
                    max="15"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    <Globe className="w-5 h-5 text-blue-500" /> لغة الدورة
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings({ ...settings, language: e.target.value })
                    }
                    className="w-full p-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 text-base text-gray-800 dark:text-gray-200 transition-all duration-200"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Extra Content */}
            <div className="mt-8">
              <label className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-200 mb-4">
                <Sparkles className="w-5 h-5 text-blue-500" /> محتوى إضافي
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={settings.include_code_lessons}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        include_code_lessons: e.target.checked,
                      })
                    }
                    className="accent-blue-500"
                  />
                  <Code className="w-5 h-5 text-blue-500" /> دروس البرمجة
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={settings.include_quizzes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        include_quizzes: e.target.checked,
                      })
                    }
                    className="accent-blue-500"
                  />
                  <HelpCircle className="w-5 h-5 text-blue-500" /> اختبارات
                  تفاعلية
                </label>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={settings.include_articles}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        include_articles: e.target.checked,
                      })
                    }
                    className="accent-blue-500"
                  />
                  <FileText className="w-5 h-5 text-blue-500" /> مقالات مرجعية
                </label>
              </div>
            </div>
            <button
              onClick={handleCreateCourse}
              disabled={isGenerating}
              className="w-full mt-8 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-6 h-6 animate-spin" /> جاري إنشاء
                  الدورة...
                </>
              ) : (
                <>
                  <span>إنشاء الدورة</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Section */}
        {generatedCourse && !isGenerating && (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-700 p-8 mt-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
                تم إنشاء دورتك بنجاح!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                دورة تعليمية شاملة مصممة خصيصاً لاحتياجاتك
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white rounded-2xl mb-8 shadow">
              <h2 className="text-2xl font-bold mb-2">
                {generatedCourse.title}
              </h2>
              <p className="text-lg opacity-90 mb-4">
                {generatedCourse.description}
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex flex-col items-center">
                  <Clock className="w-6 h-6 mb-1" />
                  <span className="font-semibold">المدة</span>
                  <span className="text-lg font-bold mt-1">
                    {settings.duration_hours} ساعة
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Book className="w-6 h-6 mb-1" />
                  <span className="font-semibold">الوحدات</span>
                  <span className="text-lg font-bold mt-1">
                    {generatedCourse.modules.length} وحدات
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 mb-1" />
                  <span className="font-semibold">المستوى</span>
                  <span className="text-lg font-bold mt-1">
                    {levelLabels[settings.level]}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                <Book className="w-6 h-6 text-blue-500" /> محتوى الدورة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedCourse.modules.map((module, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-200"
                  >
                    <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <Book className="w-5 h-5 text-indigo-500" />
                      {module.title}
                    </h4>
                    <ul className="list-disc pr-5 text-gray-700 dark:text-gray-300 space-y-2">
                      {module.lessons.map((lesson, lidx) => (
                        <li key={lidx} className="pl-2">
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-10">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" /> إنشاء دورة جديدة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AppLayout>

  );
}
