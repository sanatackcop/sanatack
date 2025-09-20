import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@radix-ui/react-separator";
import * as React from "react";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import {
  UploadCloud,
  Link2,
  Mic,
  BookOpen,
  CheckCircle,
  Bot,
  Wand2,
  Info,
  Send,
  FileText,
  Image,
  Video,
  Music,
  Play,
  Square,
  Youtube,
  Globe,
} from "lucide-react";
import { aiCourseGenerator } from "@/utils/_apis/courses-apis";
import ChatInput from "./chatInput";

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

// Modal state types
type ModalType = "upload" | "paste" | "record" | "course" | null;

interface UploadState {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

interface PasteState {
  url: string;
  text: string;
  isProcessing: boolean;
  error: string | null;
}

interface RecordState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordingTime: number;
  error: string | null;
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
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<any>(null);

  // Modal state
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Upload state
  const [uploadState, setUploadState] = useState<UploadState>({
    files: [],
    isUploading: false,
    uploadProgress: 0,
    error: null,
  });

  // Paste state
  const [pasteState, setPasteState] = useState<PasteState>({
    url: "",
    text: "",
    isProcessing: false,
    error: null,
  });

  // Record state
  const [recordState, setRecordState] = useState<RecordState>({
    isRecording: false,
    recordedBlob: null,
    recordingTime: 0,
    error: null,
  });

  // Course builder state (keep existing)
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

  // File upload handlers
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    setUploadState((prev) => ({
      ...prev,
      files: selectedFiles,
      error: null,
    }));
  }

  function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setUploadState((prev) => ({
      ...prev,
      files: droppedFiles,
      error: null,
    }));
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  async function handleFileUpload() {
    if (uploadState.files.length === 0) return;

    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
    }));

    try {
      const formData = new FormData();
      uploadState.files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90),
        }));
      }, 200);

      // Replace with actual upload API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(uploadInterval);
      setUploadState((prev) => ({ ...prev, uploadProgress: 100 }));

      // Navigate to learning playground after success
      setTimeout(() => {
        navigate("/learning-playground");
      }, 1000);
    } catch (error: any) {
      setUploadState((prev) => ({
        ...prev,
        error: error.message || "فشل في رفع الملف",
        isUploading: false,
      }));
    }
  }

  // Paste handlers
  async function handlePasteSubmit() {
    if (!pasteState.url && !pasteState.text) return;

    setPasteState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Replace with actual processing API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to learning playground after success
      navigate("/learning-playground");
    } catch (error: any) {
      setPasteState((prev) => ({
        ...prev,
        error: error.message || "فشل في معالجة المحتوى",
        isProcessing: false,
      }));
    }
  }

  // Recording handlers
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordState((prev) => ({ ...prev, recordedBlob: blob }));
      };

      mediaRecorder.start();
      setRecordState((prev) => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
      }));

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordState((prev) => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);
    } catch (error: any) {
      setRecordState((prev) => ({
        ...prev,
        error: "فشل في الوصول للميكروفون",
      }));
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recordState.isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecordState((prev) => ({ ...prev, isRecording: false }));
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  }

  async function handleRecordingSubmit() {
    if (!recordState.recordedBlob) return;

    try {
      // Upload recorded audio
      const formData = new FormData();
      formData.append("audio", recordState.recordedBlob, "recording.webm");

      // Replace with actual upload API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to learning playground after success
      navigate("/learning-playground");
    } catch (error: any) {
      setRecordState((prev) => ({
        ...prev,
        error: error.message || "فشل في رفع التسجيل",
      }));
    }
  }

  // Chat input handler

  // Course builder handlers (keep existing logic)

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

      // Navigate to learning playground after generation
      setTimeout(() => {
        navigate("/learning-playground");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || "تعذر الاتصال بالخادم");
    } finally {
      clearInterval(tick);
      setIsGenerating(false);
    }
  }

  function closeModal() {
    setActiveModal(null);
    setBuilderActive(false);
    // Reset all states
    setUploadState({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,
    });
    setPasteState({
      url: "",
      text: "",
      isProcessing: false,
      error: null,
    });
    setRecordState({
      isRecording: false,
      recordedBlob: null,
      recordingTime: 0,
      error: null,
    });
  }

  const soonFeaturesActive = true;

  const [, setCurrentModel] = useState(null);

  const models = [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isActive: true },
    { id: "gpt-4o", name: "GPT-4o", isActive: false },
    { id: "claude-3.5", name: "Claude 3.5 Sonnet", isActive: false },
  ];

  const handleSubmit = () => {
    navigate("/dashboard/learn/conent/23");
  };

  const handleModelChange = (model: any) => {
    setCurrentModel(model);
    console.log("Model changed to:", model);
  };

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
        <header className="mb-2">
          {soonFeaturesActive && (
            <div className="flex justify-center mb-8">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-sm"
              >
                بعض الميزات قيد التطوير — قريبًا ✨
              </Badge>
            </div>
          )}
          <h1 className="text-center text-3xl md:text-[44px] font-extrabold mb-2">
            ماذا تريد أن تتعلم؟
          </h1>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            ارفع المحتوى أو ألصق رابطًا أو سجّل درسًا — وسيبني لك النظام تجربة
            تعلم ذكية.
          </p>
        </header>

        {(builderActive || isGenerating) && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <Step active={!isGenerating} label="وصف + إعدادات" />
            <span className="opacity-40">—</span>
            <Step active={isGenerating} label="التوليد" />
          </div>
        )}

        {!builderActive && !isGenerating && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 text-center mt-10">
              <ActionTile
                title="رفع"
                subtitle="ملف، صوت، فيديو"
                onClick={() => setActiveModal("upload")}
                icon={<UploadCloud className="h-6 w-6 ml-2" />}
              />

              <ActionTile
                title="لصق"
                subtitle="يوتيوب، موقع، نص"
                onClick={() => setActiveModal("paste")}
                icon={<Link2 className="h-6 w-6 ml-2" />}
              />

              <SoonTile
                title="تسجيل"
                subtitle="تسجيل درس أو مكالمة فيديو"
                tooltip={""}
                icon={<Mic className="h-6 w-6 ml-2" />}
              />

              <SoonTile
                title="صناعة كورس"
                subtitle="بناء دورة تعليمية"
                tooltip={""}
                icon={<BookOpen className="h-6 w-6 ml-2" />}
              />
            </div>

            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              onModelChange={handleModelChange}
              placeholder="تعلم أي شيء"
              models={models}
            />
          </>
        )}

        <Dialog
          open={activeModal === "upload"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-right">رفع الملفات</DialogTitle>
              <DialogDescription className="text-right">
                اختر الملفات التي تريد تحويلها إلى محتوى تعليمي
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-lg font-medium mb-2">
                  اسحب وأفلت الملفات هنا
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  أو اختر الملفات يدويًا
                </div>
                <Button
                  onClick={() => uploadRef.current?.click()}
                  variant="outline"
                  className="mb-2"
                >
                  اختيار الملفات
                </Button>
                <input
                  ref={uploadRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,.avi,.mov,.jpg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-xs text-gray-400 mt-2">
                  المسموح: PDF, Word, النصوص, الصوت, الفيديو, الصور
                </div>
              </div>

              {uploadState.files.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium">الملفات المحددة:</div>
                  {uploadState.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <FileTypeIcon file={file} />
                      <span className="flex-1 text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {uploadState.isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>جاري الرفع...</span>
                    <span>{uploadState.uploadProgress}%</span>
                  </div>
                  <Progress
                    value={uploadState.uploadProgress}
                    className="h-2"
                  />
                </div>
              )}

              {uploadState.error && (
                <div className="text-red-600 text-sm text-center">
                  {uploadState.error}
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-start gap-2">
              <Button variant="outline" onClick={closeModal}>
                إلغاء
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={
                  uploadState.files.length === 0 || uploadState.isUploading
                }
              >
                {uploadState.isUploading ? "جاري الرفع..." : "رفع الملفات"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={activeModal === "paste"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-right">لصق المحتوى</DialogTitle>
              <DialogDescription className="text-right">
                الصق رابط أو نص للمحتوى الذي تريد تعلمه
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="url" className="text-right block mb-2">
                  رابط (YouTube, موقع ويب)
                </Label>
                <div className="relative">
                  <Input
                    id="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={pasteState.url}
                    onChange={(e) =>
                      setPasteState((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    className="text-right"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <Youtube className="h-4 w-4 text-gray-400" />
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-500">أو</div>

              <div>
                <Label htmlFor="text" className="text-right block mb-2">
                  نص مباشر
                </Label>
                <Textarea
                  id="text"
                  placeholder="الصق النص هنا..."
                  value={pasteState.text}
                  onChange={(e) =>
                    setPasteState((prev) => ({ ...prev, text: e.target.value }))
                  }
                  className="text-right min-h-[120px]"
                />
              </div>

              {pasteState.error && (
                <div className="text-red-600 text-sm text-center">
                  {pasteState.error}
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-start gap-2">
              <Button variant="outline" onClick={closeModal}>
                إلغاء
              </Button>
              <Button
                onClick={handlePasteSubmit}
                disabled={
                  (!pasteState.url && !pasteState.text) ||
                  pasteState.isProcessing
                }
              >
                {pasteState.isProcessing
                  ? "جاري المعالجة..."
                  : "معالجة المحتوى"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={activeModal === "record"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-right">تسجيل صوتي</DialogTitle>
              <DialogDescription className="text-right">
                سجل درسًا أو اشرح موضوعًا بصوتك
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-center py-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-12 w-12 text-white" />
                  {recordState.isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
                  )}
                </div>

                {recordState.isRecording && (
                  <div className="text-2xl font-mono font-bold text-red-600">
                    {Math.floor(recordState.recordingTime / 60)}:
                    {(recordState.recordingTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                )}
              </div>

              {!recordState.isRecording && !recordState.recordedBlob && (
                <Button onClick={startRecording} className="rounded-full px-8">
                  <Play className="h-4 w-4 ml-2" />
                  بدء التسجيل
                </Button>
              )}

              {recordState.isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="rounded-full px-8"
                >
                  <Square className="h-4 w-4 ml-2" />
                  إيقاف التسجيل
                </Button>
              )}

              {recordState.recordedBlob && !recordState.isRecording && (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="text-lg font-medium">تم التسجيل بنجاح!</div>
                  <div className="text-sm text-gray-600">
                    المدة: {Math.floor(recordState.recordingTime / 60)}:
                    {(recordState.recordingTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>
              )}

              {recordState.error && (
                <div className="text-red-600 text-sm">{recordState.error}</div>
              )}
            </div>

            <DialogFooter className="flex justify-start gap-2">
              <Button variant="outline" onClick={closeModal}>
                إلغاء
              </Button>
              {recordState.recordedBlob && (
                <Button onClick={handleRecordingSubmit}>معالجة التسجيل</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                    className="w-full p-4 text-base border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-zinc-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400 text-right"
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
                onClick={closeModal}
                className="rounded-xl"
              >
                إلغاء
              </Button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCreateCourse}
                      disabled={!prompt.trim() || isGenerating}
                      className="rounded-xl"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      إنشاء الدورة
                    </Button>
                  </TooltipTrigger>
                  {!prompt.trim() && (
                    <TooltipContent side="top" align="end">
                      <p>اكتب وصفًا مختصرًا أولاً</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
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
  title,
  subtitle,
  onClick,
  icon,
}: {
  title: string;
  subtitle: string;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[88px] w-full rounded-2xl border text-right shadow-sm flex items-center justify-end gap-3 px-6 transition-all dark:bg-gray-900 dark:border-gray-800 bg-white border-gray-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <div className="flex flex-col items-end">
        <div className="text-base font-semibold">{title}</div>
        <div className={`text-sm text-gray-500`}>{subtitle}</div>
      </div>
      {icon}
    </button>
  );
}

function SoonTile({
  title,
  subtitle,
  tooltip,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  tooltip: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <button
              type="button"
              disabled
              aria-disabled
              className={`h-[88px] w-full rounded-2xl border text-right shadow-sm flex items-center justify-end gap-3 px-6 transition-all bg-gray-50 dark:bg-gray-800 border-dashed border-gray-300 dark:border-gray-700  select-none`}
            >
              <div className="flex flex-col items-end opacity-70">
                <div className="text-base font-semibold">{title}</div>
                <div className="text-sm text-gray-500">{subtitle}</div>
              </div>
              {icon}
              <Badge className="absolute -top-2 -left-2 rounded-full">
                قريبًا
              </Badge>
            </button>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

// Helper function for file type icons
function FileTypeIcon({ file }: { file: File }) {
  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return getIcon(file.type);
}

// Helper function for file size formatting
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
