import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Bot,
  MessageCircle,
  Copy,
  Volume2,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isComplete?: boolean;
  metadata?: {
    workspaceId?: string;
    workspaceName?: string;
    chatType?: string;
    error?: string;
  };
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  streamingMessage?: string;
  onSendMessage: (message: string) => Promise<void>;
}

const MessageActions: React.FC<{ content: string; isRtl?: boolean }> = ({
  content,
  isRtl,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleAudio = () => {
    // Placeholder for audio functionality - you can implement text-to-speech here
    console.log("Audio feature not implemented yet");
    // Future implementation:
    // const utterance = new SpeechSynthesisUtterance(content);
    // utterance.lang = isRtl ? 'ar-SA' : 'en-US';
    // speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`flex items-center mt-3 pt-2 border-t border-gray-100 ${
        isRtl ? "flex-row-reverse" : ""
      }`}
    >
      <button
        onClick={handleAudio}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-all duration-200 hover:shadow-sm"
        title={t("chat.audio", "Read aloud")}
      >
        <ThumbsUp size={14} />
      </button>

      <button
        onClick={handleAudio}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-all duration-200 hover:shadow-sm"
        title={t("chat.audio", "Read aloud")}
      >
        <ThumbsDown size={14} />
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-all duration-200 hover:shadow-sm"
        title={t("chat.copy", "Copy message")}
      >
        {copied ? (
          <Check size={14} className="text-green-600" />
        ) : (
          <Copy size={14} />
        )}
        <span></span>
      </button>

      <button
        onClick={handleAudio}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-all duration-200 hover:shadow-sm"
        title={t("chat.audio", "Read aloud")}
      >
        <Volume2 size={12} />
      </button>
    </motion.div>
  );
};

const CodeBlock: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <div className="my-4">
      <SyntaxHighlighter
        language={match[1]}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "8px",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers={true}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono border">
      {children}
    </code>
  );
};

const MessageBubble: React.FC<{
  message: ChatMessage;
  isStreaming?: boolean;
  streamingContent?: string;
  isRtl?: boolean;
}> = ({
  message,
  isStreaming = false,
  streamingContent = "",
  isRtl = false,
}) => {
  const { t } = useTranslation();
  const who = (message.type ?? message.role) as
    | "user"
    | "assistant"
    | undefined;
  const isUser = who === "user";
  const isError = message.metadata?.error;

  const displayContent = isStreaming ? streamingContent : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      }}
      className={`flex  ${
        isUser
          ? isRtl
            ? "justify-start"
            : "justify-end"
          : isRtl
          ? "justify-end"
          : "justify-start"
      } mb-6`}
    >
      <div
        className={`flex max-w-[85%] ${
          isUser
            ? isRtl
              ? "flex-row"
              : "flex-row-reverse"
            : isRtl
            ? "flex-row-reverse"
            : "flex-row"
        } items-start gap-3`}
      >
        <div
          className={`relative group overflow-hidden rounded-2xl px-4 py-3 transition-all duration-200 ${
            isUser
              ? "bg-white/80 text-gray-900 border border-gray-200 dark:bg-neutral-900/70 dark:border-white/10"
              : isError
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-white/80 text-gray-900 border border-gray-200 dark:bg-neutral-900/70 dark:border-white/10"
          }`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-60
              [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]
              [background:radial-gradient(1px_1px_at_18px_18px,rgba(0,0,0,.06)_1px,transparent_1px)]
              [background-size:22px_22px]
              dark:opacity-50
              dark:[background:radial-gradient(1px_1px_at_18px_18px,rgba(255,255,255,.07)_1px,transparent_1px)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -z-10 size-40 blur-2xl opacity-20
              rounded-full
              bg-gradient-to-br from-blue-500/30 via-transparent to-transparent
              -top-10 -left-10
              dark:from-blue-400/20"
          />

          {isError && (
            <div className="mb-2 text-sm font-medium text-red-600">
              {t("chat.error", "خطأ")}
            </div>
          )}

          <div
            className={`text-sm leading-relaxed ${
              isRtl ? "text-right" : "text-left"
            }`}
            dir={isRtl ? "rtl" : "ltr"}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">
                {displayContent}
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-3 text-gray-900 border-b border-gray-200 dark:border-white/10 pb-1">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mb-2 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mb-2 text-gray-900">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 text-gray-800 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      className={`mb-3 last:mb-0 space-y-1 ${
                        isRtl ? "mr-4" : "ml-4"
                      }`}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol
                      className={`mb-3 last:mb-0 space-y-1 ${
                        isRtl ? "mr-4" : "ml-4"
                      } list-decimal`}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li
                      className={`text-gray-800 leading-relaxed flex items-start ${
                        isRtl ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0 ${
                          isRtl ? "ml-2" : "mr-2"
                        }`}
                      ></span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800">{children}</em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`${
                        isRtl ? "border-r-4 pr-4" : "border-l-4 pl-4"
                      } border-blue-500 py-2 my-3 bg-gray-50 text-gray-700 italic rounded`}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-4 border-t border-gray-200" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-gray-800 border-b border-gray-100">
                      {children}
                    </td>
                  ),
                }}
              >
                {displayContent}
              </ReactMarkdown>
            )}

            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 ml-1 bg-current"
              />
            )}
          </div>

          {/* {isAssistant && !isStreaming && !isError && (
            <MessageActions content={displayContent} isRtl={isRtl} />
          )} */}
        </div>
      </div>
    </motion.div>
  );
};

export default function ChatMessages({
  messages,
  isLoading = false,
  streamingMessage,
}: ChatMessagesProps) {
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(i18n.language === "ar");
  }, [i18n.language]);

  return (
    <div
      className={`flex1  w-10/12 h-full p-4 space-y-2 ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {messages.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center text-center h-full"
        >
          <div className="space-y-4 ">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {t("chat.welcome", "تعلم مع المدرس الذكي")}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {t(
                  "chat.welcome_message",
                  "اسأل أي سؤال عن المحتوى أو احصل على المساعدة فيما تحتاجه."
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={false}
              isRtl={isRtl}
            />
          ))}

          {isLoading && streamingMessage && (
            <MessageBubble
              message={{
                id: "streaming",
                type: "assistant",
                role: "assistant",
                content: "",
                timestamp: new Date(),
              }}
              isStreaming={true}
              streamingContent={streamingMessage}
              isRtl={isRtl}
            />
          )}

          {isLoading && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${isRtl ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`flex items-start gap-3 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
