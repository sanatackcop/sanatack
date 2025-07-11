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
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";
import { ArticleContext, InfoCardProps, MaterialData } from "@/types/courses";

interface CodeBlockProps {
  code: string;
  language: string;
}

interface QuoteProps {
  text: string;
  author?: string;
}

const Quote = ({ text, author }: QuoteProps) => (
  <div className="text-center py-8">
    <div className="text-5xl text-blue-500 mb-1">"</div>
    <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed max-w-3xl mx-auto">
      {text}
    </blockquote>
    {author && (
      <cite className="text-lg font-medium text-blue-600 dark:text-blue-400">
        — {author}
      </cite>
    )}
  </div>
);

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

export default function ArticleView({
  article,
}: {
  article: ArticleContext;
}): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const { updateCurrentCheck: updateCurrentMaterial } = useSettings();

  const slides = article?.data || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev < slides.length - 1 ? prev + 1 : prev;
      updateCurrentMaterial({
        ...article,
        total_read: newSlide,
        id: article.id,
        duration: article.duration,
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

const renderSlide = (slide: MaterialData) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const CodeBlock = ({ code, language }: CodeBlockProps) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl w-full">
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
        <pre className="p-6 text-gray-100 overflow-x-auto text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  switch (slide.type) {
    case "hero":
      return (
        <div className="space-y-8 text-justify">
          <div className="text-start">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {slide.title}
            </h2>
            {slide.description && (
              <p className="text-xl text-gray-600 dark:text-blue-400 mb-6">
                {slide.description}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-between flex-grow">
            {slide.body && (
              <p className="text-base sm:text-lg mt-2 text-gray-900 dark:text-gray-300 whitespace-pre-line">
                {slide.body}
              </p>
            )}
          </div>
        </div>
      );

    case "section":
      return (
        <div className="space-y-8">
          <div className="text-start">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {slide.title}
            </h2>
            {slide.description && (
              <p className="text-xl text-gray-600 dark:text-blue-400 mb-6">
                {slide.description}
              </p>
            )}
          </div>
          {slide.image && (
            <div className="flex justify-start">
              <img
                src={slide.image}
                alt={slide.title || "صورة المقال"}
                className="w-full h-auto rounded-xl shadow-lg max-h-80 object-cover"
              />
            </div>
          )}
          <div className="space-y-4">
            {slide.body && (
              <div className="text-start">
                <div className="text-lg text-justify leading-relaxed text-gray-900 dark:text-gray-300 max-w-full">
                  {slide.body.split("\n").map((line: string, index: number) => (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {slide.code && (
              <div className="max-w-full mx-auto">
                <CodeBlock
                  code={slide.code.code}
                  language={slide.code.language}
                />
              </div>
            )}

            {slide.quote && (
              <Quote text={slide.quote.text} author={slide.quote.author} />
            )}

            {slide.info && (
              <div className="max-w-2xl mx-auto">
                <InfoCard {...slide.info} />
              </div>
            )}
          </div>
        </div>
      );

    case "conclusion":
      return (
        <div className="space-y-8">
          <div className="text-start">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {slide.title}
            </h2>
            {slide.description && (
              <p className="text-xl text-gray-600 dark:text-blue-400 mb-6">
                {slide.description}
              </p>
            )}
          </div>

          {slide.image && (
            <div className="flex justify-start">
              <img
                src={slide.image}
                alt={slide.title || "صورة المقال"}
                className="max-w-full h-auto rounded-xl shadow-lg max-h-80 object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            {slide.body && (
              <div className="text-start">
                <div className="text-lg text-justify leading-relaxed text-gray-900 dark:text-gray-300 max-w-full">
                  {slide.body.split("\n").map((line: string, index: number) => (
                    <p key={index} className="mb-3">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {slide.code && (
              <div className="max-w-full mx-auto">
                <CodeBlock
                  code={slide.code.code}
                  language={slide.code.language}
                />
              </div>
            )}

            {slide.quote && (
              <Quote text={slide.quote.text} author={slide.quote.author} />
            )}

            {slide.info && (
              <div className="max-w-2xl mx-auto">
                <InfoCard {...slide.info} />
              </div>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
};
