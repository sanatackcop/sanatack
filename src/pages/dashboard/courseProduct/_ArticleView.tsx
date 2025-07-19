import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  Code,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import { MaterialType } from "@/utils/types/adminTypes";
import { Article, InfoCardProps } from "@/types/courses";

interface CodeBlockProps {
  code: string;
  language: string;
}

export interface QuoteProps {
  text: string;
  author?: string;
}

export default function ArticleView({
  article,
}: {
  article: any;
}): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const [slides, setSlides] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { updateCurrentCheck: updateCurrentMaterial } = useSettings();
  useEffect(() => {
    if (!article?.data) return;

    const convertedMaterials: any[] = article.data
      .filter((container: any) => container && container.components)
      .flatMap((container: any) =>
        container.components.map((component: any) => ({
          id: `${component.id}`,
          type: MaterialType.ARTICLE,
          data: {
            ...component.data,
            containerTitle: container.title,
            componentType: component.type,
          },
        }))
      )
      .sort((a: any, b: any) => parseInt(a.id) - parseInt(b.id));

    setSlides(convertedMaterials);
    setLoading(false);
  }, [article]);

  const CodeBlock = ({ code, language }: CodeBlockProps) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    };

    // Clean and format the code
    const formatCode = (codeString: string) => {
      // Replace literal \n with actual line breaks
      let formattedCode = codeString.replace(/\\n/g, "\n");
      // Replace literal \t with actual tabs
      formattedCode = formattedCode.replace(/\\t/g, "\t");
      // Replace literal spaces with actual spaces
      formattedCode = formattedCode.replace(/\\s/g, " ");
      return formattedCode;
    };

    const formattedCode = formatCode(code);

    return (
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 dark:bg-gray-700">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all rounded-lg"
          >
            {copiedCode === code ? (
              <>
                <Check size={16} />
                تم النسخ
              </>
            ) : (
              <>
                <Copy size={16} />
                نسخ
              </>
            )}
          </button>
          <div className="flex items-center gap-3">
            <Code className="text-blue-400" size={20} />
            <span className="text-gray-300 font-medium">{language}</span>
          </div>
        </div>
        <pre className="p-6 text-gray-100 overflow-x-auto text-sm leading-relaxed whitespace-pre font-mono">
          <code>{formattedCode}</code>
        </pre>
      </div>
    );
  };

  const InfoCard = ({ type, title, content }: InfoCardProps) => {
    const configs = {
      info: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        icon: <Lightbulb size={32} />,
      },
      tip: {
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        icon: <CheckCircle size={32} />,
      },
      warning: {
        bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
        icon: <AlertTriangle size={32} />,
      },
      success: {
        bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        icon: <CheckCircle size={32} />,
      },
      error: {
        bg: "bg-gradient-to-br from-red-500 to-red-600",
        icon: <XCircle size={32} />,
      },
    };

    const config = configs[type];

    return (
      <div
        className={`${config.bg} text-white rounded-3xl p-8 shadow-2xl text-center`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
          {config.icon}
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-lg leading-relaxed opacity-90">{content}</p>
      </div>
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev < slides.length - 1 ? prev + 1 : prev;
      updateCurrentMaterial({
        ...article,
        total_read: newSlide,
        id: article.data?.id,
        duration: article.data?.duration,
      });
      return newSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") nextSlide();
    if (e.key === "ArrowRight") prevSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const renderSlide = (slide: any) => {
    const { componentType, containerTitle, ...data } = slide.data;

    switch (componentType) {
      case "text":
        return (
          <div className="space-y-8 text-justify">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title || containerTitle}
              </h2>
            </div>
            <div className="flex flex-col justify-between flex-grow">
              {/* Handle paragraph text */}
              {data.textType === "paragraph" && (data.content || data.text) && (
                <div className="text-base sm:text-lg mt-2 text-gray-900 dark:text-gray-300 whitespace-pre-line">
                  <p className="mb-3">{data.content || data.text}</p>
                </div>
              )}

              {/* Handle heading text */}
              {data.textType === "heading" && (data.content || data.text) && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.content || data.text}
                  </h3>
                </div>
              )}

              {/* Handle paragraph with listItems */}
              {data.textType === "paragraph" &&
                data.listItems &&
                data.listItems.length > 0 && (
                  <div className="text-base sm:text-lg mt-2 text-gray-900 dark:text-gray-300 whitespace-pre-line">
                    {data.listItems.map((item: any, index: number) => (
                      <p
                        key={index}
                        className={`mb-3 ${item.bold ? "font-bold" : ""}`}
                      >
                        {item.text}
                      </p>
                    ))}
                  </div>
                )}

              {/* Handle heading with listItems */}
              {data.textType === "heading" &&
                data.listItems &&
                data.listItems.length > 0 && (
                  <div className="space-y-4">
                    {data.listItems.map((item: any, index: number) => (
                      <h3
                        key={index}
                        className={`text-2xl font-bold text-gray-900 dark:text-white ${
                          item.bold ? "font-extrabold" : ""
                        }`}
                      >
                        {item.text}
                      </h3>
                    ))}
                  </div>
                )}

              {/* Handle bullet list */}
              {data.textType === "bullet-list" &&
                data.listItems &&
                data.listItems.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-900 dark:text-gray-300">
                    {data.listItems.map((item: any, index: number) => (
                      <li
                        key={index}
                        className={`${item.bold ? "font-bold" : ""}`}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}

              {/* Handle numbered list */}
              {data.textType === "numbered-list" &&
                data.listItems &&
                data.listItems.length > 0 && (
                  <ol className="list-decimal list-inside space-y-2 text-base sm:text-lg text-gray-900 dark:text-gray-300">
                    {data.listItems.map((item: any, index: number) => (
                      <li
                        key={index}
                        className={`${item.bold ? "font-bold" : ""}`}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ol>
                )}

              {/* Fallback for any text content */}
              {!data.textType && (data.content || data.text) && (
                <div className="text-base sm:text-lg mt-2 text-gray-900 dark:text-gray-300 whitespace-pre-line">
                  <p className="mb-3">{data.content || data.text}</p>
                </div>
              )}
            </div>
          </div>
        );

      case "code":
        return (
          <div className="space-y-8">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title || containerTitle}
              </h2>
            </div>
            <div className="space-y-4 text-left">
              {data.code && (
                <div className="max-w-full mx-auto">
                  <CodeBlock
                    code={data.code}
                    language={data.language || "javascript"}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-8">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title || containerTitle}
              </h2>
            </div>
            {data.url && (
              <div className="flex justify-start">
                <img
                  src={data.url}
                  alt={data.title || "صورة المقال"}
                  className="w-full h-auto rounded-xl shadow-lg max-h-80 object-cover"
                />
              </div>
            )}
          </div>
        );

      case "hint":
        return (
          <div className="space-y-8">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title || containerTitle}
              </h2>
            </div>
            {data.hint && (
              <div className="max-w-2xl mx-auto">
                <InfoCard type="info" title="نصيحة" content={data.hint} />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-8 text-justify">
            <div className="text-start">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title || containerTitle || "محتوى المقال"}
              </h2>
            </div>
            <div className="text-base sm:text-lg mt-2 text-gray-900 dark:text-gray-300">
              محتوى غير معروف
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-blue-500"
            size={48}
          />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            جاري تحميل المحتوى...
          </p>
        </div>
      </div>
    );
  }

  if (!article || !article.data || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-xl text-gray-600 dark:text-gray-400">
            لا توجد مقالات متاحة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{currentSlide + 1}</span>
              <span>/</span>
              <span>{slides.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main
        className="relative h-[calc(100vh-80px)] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full flex items-center justify-center p-6">
          <div className="w-full max-w-5xl mx-auto pb-40 h-full max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hidden">
            {renderSlide(slides[currentSlide])}
          </div>
        </div>

        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute hidden md:block right-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all ${
            currentSlide === 0
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110"
          }`}
        >
          <ChevronRight size={24} />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`absolute hidden md:block left-6 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all ${
            currentSlide === slides.length - 1
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110"
          }`}
        >
          <ChevronLeft size={24} />
        </button>
      </main>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-blue-500 scale-125"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
