import { useMemo, useRef, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UploadCloud,
  Link2,
  Mic,
  ArrowUp,
  FileText,
  BookOpen,
  CheckCircle,
  Bot,
  Wand2,
  Info,
  Send,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-separator";
import * as React from "react";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import { aiCourseGenerator } from "@/utils/_apis/courses-apis";

type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type Pace = "EASY" | "BALANCED" | "INTENSE";
type AssessmentStyle = "QUIZZES" | "PROJECTS" | "MIXED" | "LIGHT";

type Topic =
  | "Artificial_Intelligence"
  | "MACHINE_LEARNING"
  | "BACKEND"
  | "FRONTEND";

interface SettingsState {
  level: Level;
  topic: Topic;
  duration_hours: number;
  max_modules: number;
  include_code_lessons: boolean;
  include_quizzes: boolean;
  include_articles: boolean;
  include_flashcards: boolean;
  include_projects: boolean;
  assessment_style: AssessmentStyle;
  pace: Pace;
  language: "ar" | "en";
}

const LEVEL_LABELS: Record<Level, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
};

const TOPIC_LABELS: Record<Topic, string> = {
  Artificial_Intelligence: "الذكاء الاصطناعي",
  MACHINE_LEARNING: "التعلم الآلي",
  BACKEND: "تطوير الخادم",
  FRONTEND: "واجهة المستخدم",
};

const STYLE_LABELS: Record<AssessmentStyle, string> = {
  QUIZZES: "اختبارات قصيرة",
  PROJECTS: "مشاريع تطبيقية",
  MIXED: "مزيج",
  LIGHT: "خفيف جدًا",
};

export default function AiCardActions() {
  // const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [uploadName, setUploadName] = useState<string>("");
  const uploadRef = useRef<HTMLInputElement | null>(null);

  const [builderActive, setBuilderActive] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [settings, setSettings] = useState<SettingsState>({
    level: "BEGINNER",
    topic: "Artificial_Intelligence",
    duration_hours: 10,
    max_modules: 6,
    include_code_lessons: true,
    include_quizzes: true,
    include_articles: true,
    include_flashcards: false,
    include_projects: true,
    assessment_style: "MIXED",
    pace: "BALANCED",
    language: "ar",
  });

  function handleUploadClick() {
    uploadRef.current?.click();
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setUploadName(file.name);
  }

  function handleStartBuilder() {
    setBuilderActive(true);
    setIsGenerating(false);
    setGenerationProgress(0);
  }

  function updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const lessonsPerModule = useMemo(() => {
    const density =
      settings.pace === "INTENSE" ? 6 : settings.pace === "BALANCED" ? 4 : 3;
    return Math.max(
      2,
      Math.min(
        12,
        Math.round(settings.duration_hours / settings.max_modules / 1.5) +
          density -
          3
      )
    );
  }, [settings.duration_hours, settings.max_modules, settings.pace]);

  const totalEstimatedLessons = useMemo(
    () => settings.max_modules * lessonsPerModule,
    [settings.max_modules, lessonsPerModule]
  );

  async function handleCreateCourse() {
    if (!prompt.trim()) return;
    setErrorMsg(null);
    setIsGenerating(true);
    setGenerationProgress(0);

    const tick = setInterval(() => {
      setGenerationProgress((p) => (p < 90 ? p + 5 : 90));
    }, 200);

    try {
      const payload = {
        prompt,
        settings: {
          level: settings.level,
          topic: settings.topic,
          duration_hours: settings.duration_hours,
          include_code_lessons: settings.include_code_lessons,
          include_quizzes: settings.include_quizzes,
          include_articles: settings.include_articles,
          language: settings.language,
          max_modules: settings.max_modules,
          max_lessons_per_module: lessonsPerModule,
        },
      } as const;

      const res = await aiCourseGenerator(payload);
      console.log({ res });
      setGenerationProgress(100);
      // if (res.courseId) {
      //   try {
      //     navigate(`/dashboard/courses/${data.courseId}`);
      //   } catch {}
      // }
    } catch (err: any) {
      setErrorMsg(err?.message || "تعذر الاتصال بالخادم");
    } finally {
      clearInterval(tick);
      setIsGenerating(false);
    }
  }

  return (
    <div className={"px-24 mt-10 mb-20 transition-colors"}>
      <CardContent
        className={
          "p-6 md:p-10 " +
          (builderActive
            ? "border-2 border-zinc-200 bg-[#fbfbfa] dark:border-zinc-800 rounded-3xl"
            : "")
        }
      >
        <h1 className="text-center text-3xl md:text-[44px] font-extrabold mb-2">
          ماذا تريد أن تتعلم؟
        </h1>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          ارفع المحتوى أو ألصق رابطًا أو سجّل درسًا — وسيبني لك النظام تجربة
          تعلم ذكية.
        </p>

        {(builderActive || isGenerating) && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <Step active={!isGenerating} label="وصف + إعدادات" />
            <span className="opacity-40">—</span>
            <Step active={isGenerating} label="التوليد" />
          </div>
        )}

        {/* Tiles (shown only before creation mode) */}
        {!builderActive && !isGenerating && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-center mt-10">
            <ActionTile
              title="صناعة كورس"
              subtitle="بناء دورة تعليمية"
              onClick={handleStartBuilder}
              active={builderActive}
            >
              <BookOpen className="h-6 w-6 ml-2" />
            </ActionTile>
            <ActionTile
              title="رفع"
              subtitle="ملف، صوت، فيديو"
              onClick={handleUploadClick}
            >
              <UploadCloud className="h-6 w-6 ml-2" />
              <input
                ref={uploadRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </ActionTile>
            <ActionTile title="لصق" subtitle="يوتيوب، موقع، نص">
              <Link2 className="h-6 w-6 ml-2" />
            </ActionTile>
            <ActionTile title="تسجيل" subtitle="تسجيل درس أو مكالمة فيديو">
              <Mic className="h-6 w-6 ml-2" />
            </ActionTile>
          </div>
        )}

        {uploadName && !builderActive && !isGenerating && (
          <div className="-mt-1 mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>تم اختيار: {uploadName}</span>
          </div>
        )}

        {!builderActive && !isGenerating && (
          <div className="relative group">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="تعلم أي شيء"
              className="peer h-[58px] rounded-full border-gray-200 bg-white pr-6 pl-16 text-[17px] text-right"
            />
            <Button
              type="button"
              aria-label="إرسال"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-[44px] w-[44px] rounded-full shadow"
              size="icon"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        )}

        {builderActive && !isGenerating && (
          <div>
            <div className="mb-5">
              <div className="text-right">
                <div className="text-lg font-semibold mb-2">وصف الدورة</div>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب وصفًا موجزًا لما تريد تعلمه، وسيتم إنشاء خطة مخصصة."
                    className="w-full p-4 text-base border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl  focus:border-zinc-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400 text-right"
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">الإعدادات</span>
            </div>
            <div className="rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gray-900 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="mb-2 block">المستوى</Label>
                  <Select
                    value={settings.level}
                    onValueChange={(v: Level) => updateSetting("level", v)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {(Object.keys(LEVEL_LABELS) as Level[]).map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {LEVEL_LABELS[lvl]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">المجال</Label>
                  <Select
                    value={settings.topic}
                    onValueChange={(v: Topic) => updateSetting("topic", v)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر المجال" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {TOPIC_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">اللغة</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(v: any) => updateSetting("language", v)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">الإيقاع</Label>
                  <Select
                    value={settings.pace}
                    onValueChange={(v: Pace) => updateSetting("pace", v)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="EASY">خفيف</SelectItem>
                      <SelectItem value="BALANCED">متوازن</SelectItem>
                      <SelectItem value="INTENSE">مكثف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2 block">
                    المدة الإجمالية (ساعات) — {settings.duration_hours}
                  </Label>
                  <div className="rounded-xl border p-3">
                    <Slider
                      value={settings.duration_hours}
                      onChange={(_, v) =>
                        updateSetting(
                          "duration_hours",
                          Array.isArray(v) ? v[0] : Number(v)
                        )
                      }
                      min={1}
                      max={200}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>{settings.duration_hours} ساعة</span>
                      <span>200</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2 block">
                    عدد الوحدات — {settings.max_modules}
                  </Label>
                  <div className="rounded-xl border p-3">
                    <Slider
                      value={settings.max_modules}
                      onChange={(_, v) =>
                        updateSetting(
                          "max_modules",
                          Array.isArray(v) ? v[0] : Number(v)
                        )
                      }
                      min={1}
                      max={20}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>{settings.max_modules} وحدة</span>
                      <span>20</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureToggle
                  checked={settings.include_code_lessons}
                  onCheckedChange={(v) =>
                    updateSetting("include_code_lessons", v)
                  }
                  label="دروس برمجية"
                  hint="أمثلة عملية وشفرات قابلة للتنفيذ"
                />
                <FeatureToggle
                  checked={settings.include_quizzes}
                  onCheckedChange={(v) => updateSetting("include_quizzes", v)}
                  label="اختبارات قصيرة"
                  hint="أسئلة تقييم فورية مع شرح"
                />
                <FeatureToggle
                  checked={settings.include_articles}
                  onCheckedChange={(v) => updateSetting("include_articles", v)}
                  label="مقالات"
                  hint="قراءات نظرية مكثفة"
                />
                <FeatureToggle
                  checked={settings.include_flashcards}
                  onCheckedChange={(v) =>
                    updateSetting("include_flashcards", v)
                  }
                  label="بطاقات مراجعة"
                  hint="تكرار متباعد للمفاهيم"
                />
                <FeatureToggle
                  checked={settings.include_projects}
                  onCheckedChange={(v) => updateSetting("include_projects", v)}
                  label="مشاريع تطبيقية"
                  hint="مهام عملية بناتج نهائي"
                />
                <div>
                  <Label className="mb-1 block">أسلوب التقييم</Label>
                  <Select
                    value={settings.assessment_style}
                    onValueChange={(v: AssessmentStyle) =>
                      updateSetting("assessment_style", v)
                    }
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {(Object.keys(STYLE_LABELS) as AssessmentStyle[]).map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {STYLE_LABELS[s]}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Info className="w-4 h-4" />
                  <span>
                    تقدير مبدئي: {settings.max_modules} وحدات ×{" "}
                    {lessonsPerModule} درس ≈ {totalEstimatedLessons} درس
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setBuilderActive(false)}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCreateCourse}
                disabled={!prompt.trim() || isGenerating}
                className="rounded-xl"
              >
                <Send className="w-4 h-4 ml-2" />
                إنشاء الدورة
              </Button>
              {errorMsg && (
                <span className="text-sm text-red-600">{errorMsg}</span>
              )}
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-2xl">
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
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: BookOpen,
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
              ].map((step, idx) => (
                <div
                  key={idx}
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
        )}
      </CardContent>
    </div>
  );
}

function Step({ active, label }: { active: boolean; label: string }) {
  return (
    <div
      className={`px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-blue-600 text-white border-zinc-600"
          : "bg-white text-gray-600 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
      }`}
    >
      {label}
    </div>
  );
}

function ActionTile({
  children,
  title,
  subtitle,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[88px] w-full rounded-2xl border text-right shadow-sm flex items-center justify-end gap-3 px-6 transition-all dark:bg-gray-900 dark:border-gray-800 ${
        active
          ? "bg-blue-600 text-white border-zinc-600 hover:shadow-md"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col items-end">
        <div className="text-base font-semibold">{title}</div>
        <div
          className={`text-sm ${active ? "text-blue-100" : "text-gray-500"}`}
        >
          {subtitle}
        </div>
      </div>
      {children}
    </button>
  );
}

function FeatureToggle({
  checked,
  onCheckedChange,
  label,
  hint,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-3">
      <div className="text-right">
        <div className="font-medium">{label}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>
      <Switch
        checked={checked}
        onChange={(_, v) => onCheckedChange(Boolean(v))}
        inputProps={{ "aria-label": label }}
      />
    </div>
  );
}
