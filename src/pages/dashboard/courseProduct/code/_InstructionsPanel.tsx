import { PlayCircleIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

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

type ComponentData =
  | TextData
  | CodeData
  | ImageData
  | VideoData
  | ExerciseData
  | HintData;

interface Component {
  id: number;
  type: "text" | "code" | "image" | "video" | "exercise" | "hint";
  data: ComponentData;
}

export default function InstructionsPanel({
  material,
  currentContainerIndex,
  setCurrentContainerIndex,
  isArabic = true,
}: {
  material: any;
  currentContainerIndex: number;
  setCurrentContainerIndex: (index: number) => void;
  isArabic?: boolean;
}) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [expandedCode, setExpandedCode] = useState<Set<number>>(new Set());
  console.log({ material: material.data });
  const currentContainer = material.data[currentContainerIndex];

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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const renderTextComponent = (component: Component, index: number) => {
    const textData = component.data as TextData;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {textData.title && (
          <header className="flex items-center gap-2 text-primary-300 uppercase tracking-wide text-sm">
            <span className="font-semibold text-right">{textData.title}</span>
          </header>
        )}

        {textData.textType === "heading" && textData.content && (
          <h2 className="text-2xl font-bold text-gray-100 text-right leading-relaxed">
            {textData.content}
          </h2>
        )}

        {textData.textType === "paragraph" && textData.content && (
          <p className="leading-relaxed text-base text-gray-200 text-right">
            {textData.content}
          </p>
        )}

        {textData.textType === "bullet-list" && textData.listItems && (
          <div className="space-y-2">
            <ul className="space-y-2 text-right">
              {textData.listItems.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className={`flex items-start gap-3 text-gray-200 ${
                    item.bold ? "font-bold" : ""
                  }`}
                  dir="rtl"
                >
                  <span className="text-primary-400 mt-2 text-sm">•</span>
                  <span className="flex-1">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {textData.textType === "numbered-list" && textData.listItems && (
          <div className="space-y-2">
            <ol className="space-y-2 text-right">
              {textData.listItems.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className={`flex items-start gap-3 text-gray-200 ${
                    item.bold ? "font-bold" : ""
                  }`}
                  dir="rtl"
                >
                  <span className="text-primary-400 mt-0.5 text-sm font-mono min-w-[1.5rem] text-center">
                    {itemIndex + 1}.
                  </span>
                  <span className="flex-1">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Fallback for old text format */}
        {!textData.textType && textData.content && (
          <p className="leading-relaxed text-base text-gray-200 text-right">
            {textData.content}
          </p>
        )}
      </section>
    );
  };

  const renderCodeComponent = (component: Component, index: number) => {
    const codeData = component.data as CodeData as any;
    const isExpanded = expandedCode.has(component.id);
    const shouldTruncate =
      codeData.code && codeData.code.split("\n").length > 15;
    const displayCode =
      shouldTruncate && !isExpanded
        ? codeData?.code.split("\n").slice(0, 15).join("\n") + "\n..."
        : codeData.code;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {codeData.title && (
          <header className="flex items-center gap-2 text-primary-300 uppercase tracking-wide text-sm">
            <span className="font-semibold text-right">{codeData.title}</span>
          </header>
        )}

        {codeData.code && (
          <div className="space-y-3" dir="ltr">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {codeData.language && (
                  <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full font-mono">
                    {codeData.language}
                  </span>
                )}
                <button
                  onClick={() => copyToClipboard(codeData.code!, component.id)}
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  title={isArabic ? "نسخ الكود" : "Copy code"}
                >
                  {copiedCode === component.id ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <CopyIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <span className="text-xs font-medium text-gray-400 text-right">
                {isArabic ? "مثال الكود" : "Code Example"}
              </span>
            </div>

            <div className="relative bg-[#0d1117] rounded-lg border border-gray-800 overflow-hidden">
              <SyntaxHighlighter
                language={codeData.language || "javascript"}
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  backgroundColor: "#0d1117",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
                wrapLines
                wrapLongLines
              >
                {displayCode || ""}
              </SyntaxHighlighter>

              {shouldTruncate && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1117] to-transparent h-8 flex items-end justify-center pb-2">
                  <button
                    onClick={() => toggleCodeExpansion(component.id)}
                    className="text-xs text-primary-400 hover:text-primary-300 bg-[#0d1117] px-3 py-1 rounded border border-gray-700 hover:border-primary-500 transition-colors"
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
          </div>
        )}
      </section>
    );
  };

  const renderImageComponent = (component: Component, index: number) => {
    const imageData = component.data as ImageData;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {imageData.title && (
          <header className="flex items-center gap-2 text-primary-300 uppercase tracking-wide text-sm">
            <span className="font-semibold text-right">{imageData.title}</span>
          </header>
        )}

        {imageData.url && (
          <figure className="space-y-3">
            <img
              src={imageData.url}
              alt={imageData.alt || imageData.title || "صورة"}
              className="w-full rounded-lg shadow-lg border border-gray-800"
              loading="lazy"
            />
            {imageData.caption && (
              <figcaption className="text-center text-sm text-gray-400 italic">
                {imageData.caption}
              </figcaption>
            )}
          </figure>
        )}
      </section>
    );
  };

  const renderVideoComponent = (component: Component, index: number) => {
    const videoData = component.data as VideoData;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {videoData.title && (
          <header className="flex items-center gap-2 text-primary-300 uppercase tracking-wide text-sm">
            <span className="font-semibold text-right">{videoData.title}</span>
          </header>
        )}

        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
          <div className="text-center space-y-3">
            <PlayCircleIcon className="w-16 h-16 text-primary-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-gray-300 font-medium">
                {isArabic ? "انقر لتشغيل الفيديو" : "Click to play video"}
              </p>
              {videoData.url && (
                <a
                  href={videoData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm underline"
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

  const renderExerciseComponent = (component: Component, index: number) => {
    const exerciseData = component.data as ExerciseData;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 space-y-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 font-bold text-right">
                {isArabic ? "تمرين" : "Exercise"}
              </span>
              {exerciseData.difficulty && (
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(
                    exerciseData.difficulty
                  )}`}
                >
                  {isArabic
                    ? exerciseData.difficulty === "easy"
                      ? "سهل"
                      : exerciseData.difficulty === "medium"
                      ? "متوسط"
                      : "صعب"
                    : exerciseData.difficulty}
                </span>
              )}
            </div>
            {exerciseData.title && (
              <h3 className="text-lg font-semibold text-gray-100 text-right">
                {exerciseData.title}
              </h3>
            )}
          </header>

          {exerciseData.description && (
            <p className="text-gray-200 leading-relaxed text-right">
              {exerciseData.description}
            </p>
          )}

          {exerciseData.initialCode && (
            <div className="space-y-2" dir="ltr">
              <span
                className="text-xs font-medium text-orange-400 block text-right"
                dir="rtl"
              >
                {isArabic ? "الكود المبدئي:" : "Initial Code:"}
              </span>
              <SyntaxHighlighter
                language="javascript"
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  backgroundColor: "#0d1117",
                  fontSize: "0.875rem",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                }}
              >
                {exerciseData.initialCode}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderHintComponent = (component: Component, index: number) => {
    const hintData = component.data as HintData;

    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {hintData.hint && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold text-sm">
                {isArabic ? "💡 تلميح" : "💡 Hint"}
              </span>
              <p className="text-gray-200 leading-relaxed text-right flex-1">
                {hintData.hint}
              </p>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderComponent = (component: Component, index: number) => {
    switch (component.type) {
      case "text":
        return renderTextComponent(component, index);
      case "code":
        return renderCodeComponent(component, index);
      case "image":
        return renderImageComponent(component, index);
      case "video":
        return renderVideoComponent(component, index);
      case "exercise":
        return renderExerciseComponent(component, index);
      case "hint":
        return renderHintComponent(component, index);
      default:
        return null;
    }
  };

  return (
    <aside
      className="w-[40%] flex flex-col border-l border-gray-800 bg-[#0b0e14] overflow-hidden"
      dir="rtl"
    >
      <header className="sticky top-0 z-10 bg-[#1a1f2b] border-b border-gray-800 px-6 py-4 shadow-inner">
        {currentContainer && (
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-primary-400">
                {currentContainerIndex + 1}
              </span>
              <h3 className="font-semibold text-base text-gray-200">
                {currentContainer.title}
              </h3>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8 text-gray-200">
        {currentContainer?.components?.map(renderComponent)}

        {material.data?.length > 1 && (
          <nav className="pt-8 border-t border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setCurrentContainerIndex(
                    Math.max(0, currentContainerIndex - 1)
                  )
                }
                disabled={currentContainerIndex === 0}
                className="text-xs uppercase tracking-wide text-gray-300 hover:text-gray-100 disabled:opacity-40 transition-colors"
              >
                {isArabic ? "→ السابق" : "← Previous"}
              </button>

              <div className="flex items-center gap-2">
                {material.data.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentContainerIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentContainerIndex
                        ? "w-6 bg-primary-500"
                        : "w-2 bg-gray-600 hover:bg-gray-500"
                    }`}
                    title={`${isArabic ? "الحاوية" : "Container"} ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentContainerIndex(
                    Math.min(
                      material.data.length - 1,
                      currentContainerIndex + 1
                    )
                  )
                }
                disabled={currentContainerIndex === material.data.length - 1}
                className="text-xs uppercase tracking-wide text-gray-300 hover:text-gray-100 disabled:opacity-40 transition-colors"
              >
                {isArabic ? "← التالي" : "Next →"}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="text-center text-xs text-gray-500">
              {isArabic
                ? `${currentContainerIndex + 1} من ${material.data.length}`
                : `${currentContainerIndex + 1} of ${material.data.length}`}
            </div>
          </nav>
        )}
      </main>
    </aside>
  );
}
