import {
  Play,
  Copy,
  Check,
  BookOpen,
  Code,
  Image,
  Video,
  Puzzle,
  Lightbulb,
  Clock,
  CheckSquare,
  Square,
} from "lucide-react";
import { useState } from "react";

interface ListItem {
  id: number;
  text: string;
  bold: boolean;
}

interface TextData {
  title?: string;
  content?: string;
  textType?: "paragraph" | "heading" | "bullet-list" | "numbered-list";
  listItems?: ListItem[];
}

interface CodeData {
  title?: string;
  language?: string;
  code?: string;
  hint?: string;
}

interface ImageData {
  title?: string;
  url?: string;
  alt?: string;
  caption?: string;
}

interface VideoData {
  title?: string;
  url?: string;
}

interface ExerciseData {
  title?: string;
  difficulty?: "easy" | "medium" | "hard";
  description?: string;
  initialCode?: string;
}

interface HintData {
  hint?: string;
}

interface ChecklistData {
  title: string;
  items?: {
    id: number;
    task_text: string;
    completed: boolean;
  }[];
}

type ComponentData =
  | TextData
  | CodeData
  | ImageData
  | VideoData
  | ExerciseData
  | HintData
  | ChecklistData;

interface Component {
  id: number;
  type: "text" | "code" | "image" | "video" | "exercise" | "hint" | "checklist";
  data: ComponentData;
}

export default function InstructionsPanel({
  material,
  isArabic = true,
}: {
  material: any;
  currentContainerIndex: any;
  setCurrentContainerIndex: any;
  isArabic?: boolean;
}) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState<Set<number>>(new Set());
  const [checklistItems, ,] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});

  const copyToClipboard = async (code: string, componentId: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(componentId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const toggleCodeExpansion = (componentId: number) => {
    const newExpanded = new Set(expandedCode);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedCode(newExpanded);
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "text":
        return <BookOpen className="w-5 h-5" />;
      case "code":
        return <Code className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "exercise":
        return <Puzzle className="w-5 h-5" />;
      case "hint":
        return <Lightbulb className="w-5 h-5" />;
      case "checklist":
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyConfig = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return {
          color:
            "text-emerald-500 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
          icon: "🟢",
          label: isArabic ? "سهل" : "Easy",
        };
      case "medium":
        return {
          color:
            "text-amber-500 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
          icon: "🟡",
          label: isArabic ? "متوسط" : "Medium",
        };
      case "hard":
        return {
          color: "text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
          icon: "🔴",
          label: isArabic ? "صعب" : "Hard",
        };
      default:
        return {
          color:
            "text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800",
          icon: "⚪",
          label: "Unknown",
        };
    }
  };

  const renderTextComponent = (component: Component) => {
    const textData = component.data as TextData;

    return (
      <section key={component.id} className="mb-12">
        {textData.title && (
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              {getComponentIcon("text")}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
              {textData.title}
            </h3>
          </div>
        )}

        <div className="space-y-6">
          {textData.textType === "heading" && textData.content && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {textData.content}
            </h2>
          )}

          {textData.textType === "paragraph" && textData.content && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {textData.content}
            </p>
          )}

          {textData.textType === "bullet-list" && textData.listItems && (
            <ul className="space-y-4">
              {textData.listItems.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className="flex items-start gap-4 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-3 flex-shrink-0"></span>
                  <span
                    className={`${
                      item.bold ? "font-semibold" : ""
                    } leading-relaxed text-base`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {textData.textType === "numbered-list" && textData.listItems && (
            <ol className="space-y-4">
              {textData.listItems.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className="flex items-start gap-4 text-gray-700 dark:text-gray-300"
                >
                  <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium flex items-center justify-center flex-shrink-0 mt-1">
                    {itemIndex + 1}
                  </span>
                  <span
                    className={`${
                      item.bold ? "font-semibold" : ""
                    } leading-relaxed flex-1 text-base`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {!textData.textType && textData.content && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {textData.content}
            </p>
          )}
        </div>
      </section>
    );
  };

  const renderCodeComponent = (component: Component) => {
    const codeData = component.data as CodeData;
    const isExpanded = expandedCode.has(component.id);
    const shouldTruncate =
      !!codeData.code && codeData.code.split("\n").length > 15;
    const displayCode =
      shouldTruncate && !isExpanded
        ? codeData.code!.split("\n").slice(0, 15).join("\n") + "\n..."
        : codeData.code;

    return (
      <section key={component.id} className="mb-12">
        {codeData.title && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                {getComponentIcon("code")}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                {codeData.title}
              </h3>
            </div>
            {codeData.language && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                {codeData.language}
              </span>
            )}
          </div>
        )}

        {codeData.code && (
          <div className="relative mb-6">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => copyToClipboard(codeData.code!, component.id)}
                className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors backdrop-blur-sm"
                title={isArabic ? "نسخ الكود" : "Copy code"}
              >
                {copiedCode === component.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
              <pre className="text-sm leading-relaxed p-6 overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  {displayCode || ""}
                </code>
              </pre>
            </div>

            {shouldTruncate && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => toggleCodeExpansion(component.id)}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isExpanded
                    ? isArabic
                      ? "إخفاء"
                      : "Show Less"
                    : isArabic
                    ? "إظهار المزيد"
                    : "Show More"}
                </button>
              </div>
            )}
          </div>
        )}

        {codeData.hint && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  {isArabic ? "تلميح" : "Hint"}
                </p>
                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                  {codeData.hint}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderImageComponent = (component: Component) => {
    const imageData = component.data as ImageData;

    return (
      <section key={component.id} className="mb-12">
        {imageData.title && (
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              {getComponentIcon("image")}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
              {imageData.title}
            </h3>
          </div>
        )}

        {imageData.url && (
          <div className="space-y-4">
            <img
              src={imageData.url}
              alt={imageData.alt || imageData.title || "Image"}
              className="w-full rounded-xl"
              loading="lazy"
            />
            {imageData.caption && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
                {imageData.caption}
              </p>
            )}
          </div>
        )}
      </section>
    );
  };

  const renderVideoComponent = (component: Component) => {
    const videoData = component.data as VideoData;

    return (
      <section key={component.id} className="mb-12">
        {videoData.title && (
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              {getComponentIcon("video")}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
              {videoData.title}
            </h3>
          </div>
        )}

        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center rounded-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {isArabic ? "انقر لتشغيل الفيديو" : "Click to play video"}
              </p>
              {videoData.url && (
                <a
                  href={videoData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isArabic ? "فتح في نافذة جديدة" : "Open in new tab"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderExerciseComponent = (component: Component) => {
    const exerciseData = component.data as ExerciseData;
    const difficultyConfig = getDifficultyConfig(exerciseData.difficulty);

    return (
      <section key={component.id} className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            {getComponentIcon("exercise")}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide text-sm">
              {isArabic ? "تمرين" : "Exercise"}
            </span>
            {exerciseData.title && (
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
                {exerciseData.title}
              </h3>
            )}
            {exerciseData.difficulty && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyConfig.color}`}
              >
                <span className="mr-1">{difficultyConfig.icon}</span>
                {difficultyConfig.label}
              </span>
            )}
          </div>
        </div>

        {exerciseData.description && (
          <div className="mb-8">
            <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {isArabic ? "الشرح:" : "Description:"}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              {exerciseData.description}
            </p>
          </div>
        )}

        {exerciseData.initialCode && (
          <div>
            <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              {isArabic ? "الكود المبدئي:" : "Initial Code:"}
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
              <pre className="text-sm leading-relaxed p-6 overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200 font-mono">
                  {exerciseData.initialCode}
                </code>
              </pre>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderHintComponent = (component: Component) => {
    const hintData = component.data as HintData;

    return (
      <section key={component.id} className="mb-12">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
                {isArabic ? "تلميح" : "Hint"}
              </h4>
              <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                {hintData.hint}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderChecklistComponent = (component: Component) => {
    const checklistData = component.data as ChecklistData;

    return (
      <section key={component.id} className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            {getComponentIcon("checklist")}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-xl">
            {checklistData?.title || (isArabic ? "التعليمات" : "Instructions")}
          </h3>
        </div>

        {checklistData.items && (
          <div className="space-y-3">
            {checklistData.items.map((item, itemIndex) => {
              const isCompleted =
                checklistItems[component.id]?.[item.id] || item.completed;

              return (
                <div
                  key={itemIndex}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 ${
                    isCompleted
                      ? "bg-indigo-50 dark:bg-indigo-900/20"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {itemIndex + 1}.
                    </span>
                    <span
                      className={`ml-2 leading-relaxed ${
                        isCompleted
                          ? "text-gray-600 dark:text-gray-400 line-through"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.task_text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case "text":
        return renderTextComponent(component);
      case "code":
        return renderCodeComponent(component);
      case "image":
        return renderImageComponent(component);
      case "video":
        return renderVideoComponent(component);
      case "exercise":
        return renderExerciseComponent(component);
      case "hint":
        return renderHintComponent(component);
      case "checklist":
        return renderChecklistComponent(component);
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900 flex flex-col">
      <header className="sticky top-0 left-0 right-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-gray-900 dark:text-white text-2xl">
              {isArabic ? "المواد التعليمية" : "Learning Material"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{isArabic ? "١ دقيقة" : "1 min"}</span>
          </div>
        </div>
      </header>

      <main
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="max-w-4xl mx-auto px-8 py-8 mb-24">
          {material.data?.map((container: any, containerIdx: number) => (
            <div key={containerIdx}>
              {container.components?.map(renderComponent)}
              {containerIdx < material.data.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-12" />
              )}
            </div>
          ))}

          {renderChecklistComponent({
            id: 999,
            type: "checklist",
            data: {
              title: isArabic ? "التعليمات" : "Instructions",
              items: material.testCases,
            },
          })}
        </div>
      </main>
    </div>
  );
}
