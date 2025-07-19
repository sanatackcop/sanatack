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
  hint?: string; // Added hint property
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
  isArabic = true,
}: {
  material: any;
  currentContainerIndex: number;
  setCurrentContainerIndex: (index: number) => void;
  isArabic?: boolean;
}) {
  console.log({ material: material });
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
          <header className="flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-wide text-sm md:text-lg">
            <span className="font-semibold text-right">{textData.title}</span>
          </header>
        )}

        {textData.textType === "heading" && textData.content && (
          <h2 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white text-right leading-relaxed">
            {textData.content}
          </h2>
        )}

        {textData.textType === "paragraph" && textData.content && (
          <p className="leading-relaxed text-xs md:text-sm text-gray-800 dark:text-white text-right">
            {textData.content}
          </p>
        )}

        {textData.textType === "bullet-list" && textData.listItems && (
          <div className="space-y-2">
            <ul className="space-y-2 text-right">
              {textData.listItems.map((item, itemIndex) => (
                <li
                  key={item.id || itemIndex}
                  className={`flex items-start gap-3 text-gray-800 dark:text-white  ${
                    item.bold ? "font-bold" : ""
                  }`}
                  dir="rtl"
                >
                  <span className="text-primary-400 mt-2 text-xs md:text-sm">
                    •
                  </span>
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
                  className={`flex items-start gap-3 text-gray-800 dark:text-white  ${
                    item.bold ? "font-bold" : ""
                  }`}
                  dir="rtl"
                >
                  <span className="text-gray-800 dark:text-white  mt-0.5 text-xs md:text-sm font-mono min-w-[1.5rem] text-center">
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
          <p className="leading-relaxed text-sm md:text-base text-gray-800 dark:text-white text-right">
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
          <header className="flex items-center gap-2 text-gray-800 dark:text-white uppercase tracking-wide text-xs md:text-sm">
            <span className="font-semibold text-right">{codeData.title}</span>
          </header>
        )}

        {codeData.code && (
          <div className="space-y-3" dir="ltr">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {codeData.language && (
                  <span className="text-xs md:text-sm px-2 py-0.5 bg-white  dark:bg-gray-800  text-gray-900 dark:text-white  rounded-full font-mono">
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
              <span className="text-xs font-medium text-gray-900 dark:text-white text-right">
                {isArabic ? "مثال الكود" : "Code Example"}
              </span>
            </div>

            <div className="relative bg-white dark:bg-[#0d1117] rounded-lg border border-gray-800 overflow-hidden">
              <SyntaxHighlighter
                language={codeData.language || "javascript"}
                style={atomOneDark}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  backgroundColor: "bg-white dark:bg-[#0d1117]",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
                wrapLines
                wrapLongLines
              >
                {displayCode || ""}
              </SyntaxHighlighter>

              {shouldTruncate && (
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#0d1117] h-8 flex items-end justify-center pb-2">
                  <button
                    onClick={() => toggleCodeExpansion(component.id)}
                    className="text-xs text-primary-400 hover:text-primary-300 bg-white dark:bg-[#0d1117] px-3 py-1 rounded border border-gray-700 hover:border-primary-500 transition-colors"
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
        {/* Patch: If codeData.hint exists, render it as a hint below the code block */}
        {codeData.hint && (
          <div className="bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-2">
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
              <span className="text-yellow-400 font-bold text-xs md:text-sm">
                {isArabic ? "💡 تلميح" : "💡 Hint"}
              </span>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-right text-xs md:text-sm">
                {codeData.hint}
              </p>
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
          <header className="flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-wide text-xs md:text-sm">
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
              <figcaption className="text-center text-xs md:text-sm text-gray-900 dark:text-white italic">
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
          <header className="flex items-center gap-2 text-primary-300 uppercase tracking-wide text-xs md:text-sm">
            <span className="font-semibold text-right">{videoData.title}</span>
          </header>
        )}

        <div className="aspect-video bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
          <div className="text-center space-y-3">
            <PlayCircleIcon className="w-8 h-8 md:w-16 md:h-16 text-primary-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-gray-300 font-medium">
                {isArabic ? "انقر لتشغيل الفيديو" : "Click to play video"}
              </p>
              {videoData.url && (
                <a
                  href={videoData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-xs md:text-sm underline"
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

        <div className="bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 md:p-4 space-y-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 font-bold text-xs md:text-sm text-right">
                {isArabic ? "تمرين:" : "Exercise"}
              </span>
              {exerciseData.title && (
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white text-right">
                  {exerciseData.title}
                </h3>
              )}
              {exerciseData.difficulty && (
                <span
                  className={`text-xs md:text-sm px-2 py-1 rounded-full border ${getDifficultyColor(
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
          </header>

          <div className="flex items-center">
            <span className="text-orange-400 text-xs md:text-sm text-right">
              الشرح:
            </span>
          </div>
          {exerciseData.description && (
            <p className="text-xs md:text-sm text-gray-900 dark:text-white leading-relaxed text-right">
              {exerciseData.description}
            </p>
          )}

          {exerciseData.initialCode && (
            <div className="space-y-2 " dir="ltr">
              <span
                className="text-xs font-medium text-orange-400 block text-right pb-2"
                dir="rtl"
              >
                {isArabic ? "الكود المبدئي:" : "Initial Code:"}
              </span>
              <div className="bg-white dark:bg-[#0d1117]">
                <SyntaxHighlighter
                  language="javascript"
                  style={atomOneDark}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    backgroundColor: "transparent",
                    fontSize: "0.875rem",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem",
                  }}
                >
                  {exerciseData.initialCode}
                </SyntaxHighlighter>
              </div>
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
          <div className="bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
              <span className="text-yellow-400 font-bold text-xs md:text-sm">
                {isArabic ? "💡 تلميح" : "💡 Hint"}
              </span>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-right text-xs md:text-sm">
                {hintData.hint}
              </p>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderComponent = (component: Component, index: number) => {
    console.log({ component: component });
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
  console.log({ currentContainer: currentContainer });
  return (
    <aside
      className="h-1/2 md:h-full w-full md:w-[40%] flex flex-col border-l md:border-l-0 border-b md:border-b-0 bg-[#f3f4f6] dark:bg-gray-900 p-4 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white overflow-hidden"
      dir="rtl"
    >
      <main className="flex-1 overflow-y-auto scrollbar-hidden p-4 md:p-8 md:pb-28 space-y-8 bg-white dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white">
        {currentContainer?.components?.map(renderComponent)}
        {material.data?.length > 1 && (
          <div className="flex items-center justify-between"></div>
        )}
      </main>
    </aside>
  );
}
