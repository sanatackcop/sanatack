import { useState, useEffect } from "react";
import {
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { InfoCardProps } from "@/types/courses";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export interface QuoteProps {
  text: string;
  author?: string;
}

export default function ArticleView({
  article,
}: {
  article: any;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (article?.data) setLoading(false);
  }, [article]);

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

    useEffect(()=> { 
      // che 80ck for the scrollin gleng if
    }, [])

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

  const renderSlide = (slide: any, compIdx: number) => {
    const { componentType, containerTitle, ...data } = slide.data;

    switch (componentType) {
      case "text":
        return (
          <div className="space-y-8 text-justify" id={compIdx.toString()}>
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
                  <SyntaxHighlighter
                    language={data.language || "javascript"}
                    style={atomOneDark}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      backgroundColor: "#282c34",
                      fontSize: "0.95rem",
                      borderRadius: "0.75rem",
                    }}
                    wrapLines
                    wrapLongLines
                  >
                    {data.code}
                  </SyntaxHighlighter>
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

  if (!article || !article.data || article.data.length === 0) {
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
    <div className=" overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10 flex items-center gap-4">
          <BookOpen className="text-blue-600 dark:text-blue-400" size={32} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h1>
        </header>
        {article.data.map((container: any, cIdx: number) => (
          <section key={container.id || cIdx} className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 border-b border-blue-100 dark:border-blue-800 pb-2">
              {container.title}
            </h2>
            <div className="space-y-10">
              {container.components.map((component: any, compIdx: number) => (
                <div key={component.id || compIdx}>
                  {renderSlide(
                    {
                      data: {
                        ...component.data,
                        componentType: component.type,
                        containerTitle: container.title,
                      },
                    },
                    compIdx
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
