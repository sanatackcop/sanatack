import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
} from "lucide-react";
import { aiCourseGenerator } from "@/utils/_apis/courses-apis";
import CircularProgress from "@mui/material/CircularProgress";
import {
  createNewWorkSpace,
  youtubeUrlPastApi,
} from "@/utils/_apis/learnPlayground-api";

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

export default function AiCardActions() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

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

  // Course builder state
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
    language: i18n.language as "ar" | "en",
  });

  // Dynamic labels based on current language
  const LEVEL_LABELS: Record<Level, string> = useMemo(
    () => ({
      BEGINNER: t("aiActions.levels.beginner"),
      INTERMEDIATE: t("aiActions.levels.intermediate"),
      ADVANCED: t("aiActions.levels.advanced"),
    }),
    [t]
  );

  const TOPIC_LABELS: Record<Topic, string> = useMemo(
    () => ({
      Artificial_Intelligence: t("aiActions.topics.ai"),
      MACHINE_LEARNING: t("aiActions.topics.ml"),
      BACKEND: t("aiActions.topics.backend"),
      FRONTEND: t("aiActions.topics.frontend"),
    }),
    [t]
  );

  const STYLE_LABELS: Record<AssessmentStyle, string> = useMemo(
    () => ({
      QUIZZES: t("aiActions.assessmentStyles.quizzes"),
      PROJECTS: t("aiActions.assessmentStyles.projects"),
      MIXED: t("aiActions.assessmentStyles.mixed"),
      LIGHT: t("aiActions.assessmentStyles.light"),
    }),
    [t]
  );

  // Helper functions for alignment
  const getTextAlignment = () => (isRTL ? "text-right" : "text-left");
  const getFlexDirection = () => (isRTL ? "flex-row-reverse" : "flex-row");

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
        error: error.message || t("aiActions.errors.uploadFailed"),
        isUploading: false,
      }));
    }
  }

  async function handlePasteSubmit() {
    if (!pasteState.url && !pasteState.text) return;

    setPasteState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      // We take the input and see if we can process it or not
      const getYoutubeVIdeo: any = await youtubeUrlPastApi({
        url: pasteState.url,
      });

      console.log({ getYoutubeVIdeo });

      // we create a new workspace for the new content learn
      const workSpace: any = await createNewWorkSpace({
        youtubeVideoId: getYoutubeVIdeo.id,
        workspaceName: getYoutubeVIdeo.info.title,
      });
      navigate(`/dashboard/learn/workspace/${workSpace.workspace.id}`);
    } catch (error: any) {
      setPasteState((prev) => ({
        ...prev,
        error: error.message || t("aiActions.errors.processingFailed"),
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
        error: t("aiActions.errors.microphoneAccess"),
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
        error: error.message || t("aiActions.errors.recordingUploadFailed"),
      }));
    }
  }

  // Course builder handlers
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
      setErrorMsg(err?.message || t("aiActions.errors.connectionFailed"));
    } finally {
      clearInterval(tick);
      setIsGenerating(false);
    }
  }

  function closeModal() {
    setActiveModal(null);
    setBuilderActive(false);
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

  return (
    <div className="px-14 mt-10 transition-colors">
      <CardContent
        className={
          "p-6 px-24 py-10 " +
          (builderActive
            ? "border-2 border-zinc-200 bg-[#fbfbfa] dark:border-zinc-800 rounded-3xl"
            : "")
        }
      >
        {(builderActive || isGenerating) && (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm">
            <Step
              active={!isGenerating}
              label={t("aiActions.steps.settings")}
            />
            <span className="opacity-40">—</span>
            <Step
              active={isGenerating}
              label={t("aiActions.steps.generation")}
            />
          </div>
        )}

        {!builderActive && !isGenerating && (
          <>
            <div
              className={[
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 mb-2",
                getTextAlignment(),
              ].join(" ")}
            >
              <ActionTile
                title={t("aiActions.upload.title")}
                subtitle={t("aiActions.upload.subtitle")}
                onClick={() => setActiveModal("upload")}
                Icon={UploadCloud}
              />

              <ActionTile
                title={t("aiActions.paste.title")}
                subtitle={t("aiActions.paste.subtitle")}
                onClick={() => setActiveModal("paste")}
                Icon={Link2}
              />

              <ActionTile
                title={t("aiActions.createCourse.title")}
                subtitle={t("aiActions.createCourse.subtitle")}
                Icon={BookOpen}
              />
            </div>
          </>
        )}

        {/* Upload Dialog */}
        <Dialog
          open={activeModal === "upload"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent
            className="sm:max-w-[600px]"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <DialogHeader className={getTextAlignment()}>
              <DialogTitle>{t("aiActions.dialogs.upload.title")}</DialogTitle>
              <DialogDescription>
                {t("aiActions.dialogs.upload.description")}
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
                  {t("aiActions.dialogs.upload.dragDrop")}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {t("aiActions.dialogs.upload.orChoose")}
                </div>
                <Button
                  onClick={() => uploadRef.current?.click()}
                  variant="outline"
                  className="mb-2"
                >
                  {t("aiActions.dialogs.upload.chooseFiles")}
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
                  {t("aiActions.dialogs.upload.allowedTypes")}
                </div>
              </div>

              {uploadState.files.length > 0 && (
                <div className="space-y-2">
                  <div className={`font-medium ${getTextAlignment()}`}>
                    {t("aiActions.dialogs.upload.selectedFiles")}:
                  </div>
                  {uploadState.files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded ${getFlexDirection()}`}
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
                  <div
                    className={`flex justify-between text-sm ${getTextAlignment()}`}
                  >
                    <span>{t("aiActions.dialogs.upload.uploading")}</span>
                    <span>{uploadState.uploadProgress}%</span>
                  </div>
                  <Progress
                    value={uploadState.uploadProgress}
                    className="h-2"
                  />
                </div>
              )}

              {uploadState.error && (
                <div
                  className={`text-red-600 text-sm text-center ${getTextAlignment()}`}
                >
                  {uploadState.error}
                </div>
              )}
            </div>

            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button variant="outline" onClick={closeModal}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={
                  uploadState.files.length === 0 || uploadState.isUploading
                }
              >
                {uploadState.isUploading
                  ? t("aiActions.dialogs.upload.uploading")
                  : t("aiActions.dialogs.upload.uploadFiles")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Paste Dialog */}
        <Dialog
          open={activeModal === "paste"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent
            className="sm:max-w-[600px]"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <DialogHeader className={getTextAlignment()}>
              <DialogTitle>{t("aiActions.dialogs.paste.title")}</DialogTitle>
              <DialogDescription>
                {t("aiActions.dialogs.paste.description")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="url"
                  className={`block mb-2 ${getTextAlignment()}`}
                >
                  {t("aiActions.dialogs.paste.urlLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="url"
                    placeholder={t("aiActions.dialogs.paste.urlPlaceholder")}
                    value={pasteState.url}
                    onChange={(e) =>
                      setPasteState((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    className={getTextAlignment()}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${
                      isRTL ? "right-3" : "left-3"
                    }`}
                  ></div>
                </div>
              </div>

              {pasteState.error && (
                <div
                  className={`text-red-600 text-sm text-center ${getTextAlignment()}`}
                >
                  {pasteState.error}
                </div>
              )}
            </div>

            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button variant="outline" onClick={closeModal}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handlePasteSubmit}
                disabled={
                  (!pasteState.url && !pasteState.text) ||
                  pasteState.isProcessing
                }
              >
                {pasteState.isProcessing && (
                  <div>
                    <CircularProgress />
                  </div>
                )}
                {pasteState.isProcessing
                  ? t("aiActions.dialogs.paste.processing")
                  : t("aiActions.dialogs.paste.processContent")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Record Dialog */}
        <Dialog
          open={activeModal === "record"}
          onOpenChange={(open) => !open && closeModal()}
        >
          <DialogContent
            className="sm:max-w-[500px]"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <DialogHeader className={getTextAlignment()}>
              <DialogTitle>{t("aiActions.dialogs.record.title")}</DialogTitle>
              <DialogDescription>
                {t("aiActions.dialogs.record.description")}
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
                  <Play className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("aiActions.dialogs.record.startRecording")}
                </Button>
              )}

              {recordState.isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="rounded-full px-8"
                >
                  <Square className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("aiActions.dialogs.record.stopRecording")}
                </Button>
              )}

              {recordState.recordedBlob && !recordState.isRecording && (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="text-lg font-medium">
                    {t("aiActions.dialogs.record.recordingSuccess")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("aiActions.dialogs.record.duration")}:{" "}
                    {Math.floor(recordState.recordingTime / 60)}:
                    {(recordState.recordingTime % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                </div>
              )}

              {recordState.error && (
                <div className={`text-red-600 text-sm ${getTextAlignment()}`}>
                  {recordState.error}
                </div>
              )}
            </div>

            <DialogFooter
              className={`flex gap-2 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button variant="outline" onClick={closeModal}>
                {t("common.cancel")}
              </Button>
              {recordState.recordedBlob && (
                <Button onClick={handleRecordingSubmit}>
                  {t("aiActions.dialogs.record.processRecording")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Builder UI */}
        {builderActive && !isGenerating && (
          <div>
            <div className="mb-5">
              <div className={getTextAlignment()}>
                <div className="text-lg font-semibold mb-2">
                  {t("aiActions.courseBuilder.courseDescription")}
                </div>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t(
                      "aiActions.courseBuilder.descriptionPlaceholder"
                    )}
                    className={`w-full p-4 text-base border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl focus:border-zinc-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400 ${getTextAlignment()}`}
                    maxLength={1000}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 mb-2 ${getFlexDirection()}`}
            >
              <span className="font-semibold">
                {t("aiActions.courseBuilder.settings")}
              </span>
            </div>
            <div className="rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-gray-900 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.level")}
                  </Label>
                  <Select
                    value={settings.level}
                    onValueChange={(v: Level) => updateSetting("level", v)}
                  >
                    <SelectTrigger className={getTextAlignment()}>
                      <SelectValue
                        placeholder={t("aiActions.courseBuilder.selectLevel")}
                      />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"}>
                      {(Object.keys(LEVEL_LABELS) as Level[]).map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>
                          {LEVEL_LABELS[lvl]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.topic")}
                  </Label>
                  <Select
                    value={settings.topic}
                    onValueChange={(v: Topic) => updateSetting("topic", v)}
                  >
                    <SelectTrigger className={getTextAlignment()}>
                      <SelectValue
                        placeholder={t("aiActions.courseBuilder.selectTopic")}
                      />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"}>
                      {(Object.keys(TOPIC_LABELS) as Topic[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {TOPIC_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.language")}
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(v: any) => updateSetting("language", v)}
                  >
                    <SelectTrigger className={getTextAlignment()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"}>
                      <SelectItem value="ar">{t("languages.ar")}</SelectItem>
                      <SelectItem value="en">{t("languages.en")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.pace")}
                  </Label>
                  <Select
                    value={settings.pace}
                    onValueChange={(v: Pace) => updateSetting("pace", v)}
                  >
                    <SelectTrigger className={getTextAlignment()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"}>
                      <SelectItem value="EASY">
                        {t("aiActions.pace.easy")}
                      </SelectItem>
                      <SelectItem value="BALANCED">
                        {t("aiActions.pace.balanced")}
                      </SelectItem>
                      <SelectItem value="INTENSE">
                        {t("aiActions.pace.intense")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.totalHours", {
                      hours: settings.duration_hours,
                    })}
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
                    <div
                      className={`flex justify-between text-xs text-gray-500 mt-2 ${getTextAlignment()}`}
                    >
                      <span>1</span>
                      <span>
                        {t("aiActions.courseBuilder.hoursLabel", {
                          hours: settings.duration_hours,
                        })}
                      </span>
                      <span>200</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label className={`mb-2 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.moduleCount", {
                      count: settings.max_modules,
                    })}
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
                    <div
                      className={`flex justify-between text-xs text-gray-500 mt-2 ${getTextAlignment()}`}
                    >
                      <span>1</span>
                      <span>
                        {t("aiActions.courseBuilder.modulesLabel", {
                          count: settings.max_modules,
                        })}
                      </span>
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
                  label={t("aiActions.features.codeLessons.label")}
                  hint={t("aiActions.features.codeLessons.hint")}
                />
                <FeatureToggle
                  checked={settings.include_quizzes}
                  onCheckedChange={(v) => updateSetting("include_quizzes", v)}
                  label={t("aiActions.features.quizzes.label")}
                  hint={t("aiActions.features.quizzes.hint")}
                />
                <FeatureToggle
                  checked={settings.include_articles}
                  onCheckedChange={(v) => updateSetting("include_articles", v)}
                  label={t("aiActions.features.articles.label")}
                  hint={t("aiActions.features.articles.hint")}
                />
                <FeatureToggle
                  checked={settings.include_flashcards}
                  onCheckedChange={(v) =>
                    updateSetting("include_flashcards", v)
                  }
                  label={t("aiActions.features.flashcards.label")}
                  hint={t("aiActions.features.flashcards.hint")}
                />
                <FeatureToggle
                  checked={settings.include_projects}
                  onCheckedChange={(v) => updateSetting("include_projects", v)}
                  label={t("aiActions.features.projects.label")}
                  hint={t("aiActions.features.projects.hint")}
                />
                <div>
                  <Label className={`mb-1 block ${getTextAlignment()}`}>
                    {t("aiActions.courseBuilder.assessmentStyle")}
                  </Label>
                  <Select
                    value={settings.assessment_style}
                    onValueChange={(v: AssessmentStyle) =>
                      updateSetting("assessment_style", v)
                    }
                  >
                    <SelectTrigger className={getTextAlignment()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align={isRTL ? "start" : "end"}>
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

              <div
                className={`mt-5 p-4 rounded-xl border bg-zinc-50 dark:bg-zinc-900 ${getTextAlignment()}`}
              >
                <div
                  className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 ${getFlexDirection()}`}
                >
                  <Info className="w-4 h-4" />
                  <span>
                    {t("aiActions.courseBuilder.estimation", {
                      modules: settings.max_modules,
                      lessonsPerModule,
                      totalLessons: totalEstimatedLessons,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 mt-4 ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <Button
                variant="outline"
                onClick={closeModal}
                className="rounded-xl"
              >
                {t("common.cancel")}
              </Button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleCreateCourse}
                      disabled={!prompt.trim() || isGenerating}
                      className="rounded-xl"
                    >
                      <Send className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {t("aiActions.courseBuilder.createCourse")}
                    </Button>
                  </TooltipTrigger>
                  {!prompt.trim() && (
                    <TooltipContent side="top" align="end">
                      <p>
                        {t("aiActions.courseBuilder.writeDescriptionFirst")}
                      </p>
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

        {/* Generation Progress */}
        {isGenerating && (
          <div className="py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-2xl">
              <Bot className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t("aiActions.generation.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("aiActions.generation.description")}
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div
                className={`flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 ${getTextAlignment()}`}
              >
                <span>{t("aiActions.generation.progress")}</span>
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
                  label: t("aiActions.generation.steps.analyzing"),
                  completed: generationProgress > 30,
                },
                {
                  icon: Wand2,
                  label: t("aiActions.generation.steps.generating"),
                  completed: generationProgress > 60,
                },
                {
                  icon: CheckCircle,
                  label: t("aiActions.generation.steps.reviewing"),
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
  Icon,
}: {
  title: string;
  subtitle: string;
  onClick?: () => void;
  Icon: any;
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      <div>
        <div
          onClick={onClick}
          className={`group relative px-5 p-4 w-full sm:h-[112px] flex flex-col sm:flex-col items-start justify-center gap-y-1 rounded-2xl border shadow-sm 
            cursor-pointer transition-all dark:bg-gray-900 dark:border-gray-800 bg-white border-gray-200
            hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isRTL ? "justify-end text-right" : "justify-start text-left"
            }`}
        >
          <div
            className={`flex items-center gap-x-3 sm:block space-y-2 ${
              isRTL ? "items-end" : "items-start"
            }`}
          >
            <Icon
              className={`h-[24px] w-[24px] text-gray-500 opacity-85 group-hover:text-gray-800 group-hover:opacity-100 dark:text-gray-400 dark:group-hover:text-gray-200 transition-all duration-200 ${
                isRTL ? "ml-2" : "mr-2"
              }`}
            />
            <h3 className="font-medium text-sm sm:text-base text-left text-gray-600 opacity-90 group-hover:text-gray-900 group-hover:opacity-100 dark:text-gray-300 dark:group-hover:text-gray-100 transition-all duration-200">
              {title}
            </h3>
            <div className="text-sm text-gray-500 opacity-85 group-hover:text-gray-800 group-hover:opacity-100 dark:text-gray-400 dark:group-hover:text-gray-200 transition-all duration-200">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </>
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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 ${
        isRTL ? "justify-between flex-row-reverse" : "justify-between"
      }`}
    >
      <div className={isRTL ? "text-right" : "text-left"}>
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
