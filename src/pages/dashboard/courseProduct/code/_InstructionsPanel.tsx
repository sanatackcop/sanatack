import { PlayCircleIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface Component {
  id: number;
  type: "text" | "code" | "image" | "video" | "exercise" | "quiz";
  data: {
    title?: string;
    content?: string;
    code?: string;
    language?: string;
    src?: string;
    alt?: string;
    caption?: string;
  };
}

interface Section {
  id: number;
  title: string;
  components: Component[];
}

interface Material {
  id: string;
  main_title: string;
  duration: number;
  data: Section[];
  hint?: string;
  initialCode?: string;
  type: string;
}

export default function FlexibleInstructionsPanel({
  material,
  currentSectionIndex,
  setCurrentSectionIndex,
  isArabic = false,
}: {
  material: Material;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  isArabic?: boolean;
}) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const currentSection = material.data[currentSectionIndex];
  const directionClass = isArabic ? "rtl" : "ltr";
  const textAlignClass = isArabic ? "text-right" : "text-left";
  const flexDirectionClass = isArabic ? "flex-row-reverse" : "flex-row";

  const copyToClipboard = async (code: string, componentId: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(componentId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // const getComponentIcon = (type: Component["type"]) => {
  //   switch (type) {
  //     case "text":
  //       return <FileTextIcon className="w-4 h-4" />;
  //     case "code":
  //       return <CodeIcon className="w-4 h-4" />;
  //     case "image":
  //       return <ImageIcon className="w-4 h-4" />;
  //     case "video":
  //       return <VideoIcon className="w-4 h-4" />;
  //     case "exercise":
  //       return <BrainIcon className="w-4 h-4" />;
  //     case "quiz":
  //       return <CheckCircleIcon className="w-4 h-4" />;
  //     default:
  //       return null;
  //   }
  // };

  const renderComponent = (component: Component, index: number) => {
    return (
      <section key={component.id} className="space-y-4">
        {index > 0 && <hr className="border-gray-700/40 my-6" />}

        {component.data.title && (
          <header
            className={`flex items-center gap-2 text-primary-300 uppercase tracking-wide text-sm ${flexDirectionClass}`}
          >
            <span className="font-semibold">{component.data.title}</span>
          </header>
        )}

        {component.type === "text" && component.data.content && (
          <p
            className={`leading-relaxed text-base text-gray-200 ${textAlignClass}`}
          >
            {component.data.content}
          </p>
        )}

        {component.type === "code" && component.data.code && (
          <div className="space-y-3" dir="ltr">
            <div
              className={`flex items-center justify-between ${flexDirectionClass}`}
            >
              <span className="text-xs font-medium text-gray-400">
                {isArabic ? "مثال الكود" : "Code Example"}
              </span>
              <div className="flex items-center gap-2">
                {component.data.language && (
                  <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full font-mono">
                    {component.data.language}
                  </span>
                )}
                <button
                  onClick={() =>
                    copyToClipboard(component.data.code!, component.id)
                  }
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors"
                  title={isArabic ? "نسخ الكود" : "Copy code"}
                >
                  <CopyIcon
                    className={`w-4 h-4 ${
                      copiedCode === component.id
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>
            <pre className="bg-[#0d1117] rounded-lg border border-gray-800 overflow-x-auto text-sm p-4">
              <code className="font-mono text-gray-100 whitespace-pre-wrap">
                {component.data.code}
              </code>
            </pre>
          </div>
        )}

        {component.type === "image" && component.data.src && (
          <figure className="space-y-2">
            <img
              src={component.data.src}
              alt={component.data.alt || component.data.title || "image"}
              className="w-full rounded shadow-md"
            />
            {component.data.caption && (
              <figcaption className="text-center text-sm text-gray-400 italic">
                {component.data.caption}
              </figcaption>
            )}
          </figure>
        )}

        {component.type === "video" && (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
            <div className="text-center space-y-2">
              <PlayCircleIcon className="w-14 h-14 text-gray-600 mx-auto" />
              <p className="text-gray-400 text-xs">
                {isArabic ? "انقر لتشغيل الفيديو" : "Click to play video"}
              </p>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <aside
      className={`w-[40%] flex flex-col ${
        isArabic ? "border-l" : "border-r"
      } border-gray-800 bg-[#0b0e14] overflow-hidden`}
      dir={directionClass}
    >
      <header className="sticky top-0 z-10 bg-[#1a1f2b] border-b border-gray-800 px-6 py-4 shadow-inner">
        {currentSection && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-primary-400">
              {currentSectionIndex + 1}
            </span>
            <h3 className="font-semibold text-base text-gray-200">
              {currentSection.title}
            </h3>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8 text-gray-200">
        {currentSection?.components?.map(renderComponent)}

        {material.data.length > 1 && (
          <nav className="pt-8 border-t border-gray-800 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))
                }
                disabled={currentSectionIndex === 0}
                className="text-xs uppercase tracking-wide text-gray-300 hover:text-gray-100 disabled:opacity-40"
              >
                {isArabic ? "← السابق" : "← Previous"}
              </button>

              <div className="flex items-center gap-2">
                {material.data.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSectionIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSectionIndex
                        ? "w-6 bg-primary-500"
                        : "w-2 bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentSectionIndex(
                    Math.min(material.data.length - 1, currentSectionIndex + 1)
                  )
                }
                disabled={currentSectionIndex === material.data.length - 1}
                className="text-xs uppercase tracking-wide text-gray-300 hover:text-gray-100 disabled:opacity-40"
              >
                {isArabic ? "التالي →" : "Next →"}
              </button>
            </div>
          </nav>
        )}
      </main>
    </aside>
  );
}
