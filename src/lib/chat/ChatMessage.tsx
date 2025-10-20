import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Bot,
  User,
  Clipboard,
  ClipboardCheck,
  Link as LinkIcon,
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

// ---------- utilities ----------
const formatClock = (d?: Date) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

// ---------- Code block with header + copy ----------
const CodeBlock: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children ?? "").replace(/\n$/, "");
  const lang = match?.[1] ?? "text";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="group/code my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between px-3 py-2 text-xs bg-gray-50/80 dark:bg-neutral-800/60 border-b border-gray-200 dark:border-white/10">
        <span className="font-mono text-gray-600 dark:text-gray-300">
          {lang}
        </span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.9rem",
          lineHeight: 1.6,
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// ---------- Message bubble ----------
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
  if (!message) return null;

  const who = (message.type ?? message.role) as
    | "user"
    | "assistant"
    | undefined;
  const isUser = who === "user";
  const isError = !!message.metadata?.error;
  const displayContent = isStreaming ? streamingContent : message.content;

  // layout helpers
  const containerJustify = isUser
    ? isRtl
      ? "justify-start"
      : "justify-end"
    : isRtl
    ? "justify-end"
    : "justify-start";
  const innerDirection = isUser
    ? isRtl
      ? "flex-row"
      : "flex-row-reverse"
    : isRtl
    ? "flex-row-reverse"
    : "flex-row";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
      className={`flex ${containerJustify} mb-5`}
    >
      <div className={`flex max-w-[85%] ${innerDirection} items-start gap-3`}>
        {/* avatar */}
        <div className="shrink-0 select-none">
          <div
            className={`w-8 h-8 rounded-full grid place-items-center border ${
              isUser
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* bubble */}
        <div
          className={`group relative overflow-hidden rounded-2xl px-4 py-3 transition-colors duration-200 border shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-blue-50 to-white text-blue-900 border-blue-200 dark:from-blue-900/30 dark:to-neutral-900 dark:text-blue-100 dark:border-blue-800/50"
              : isError
              ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200"
              : "bg-white/90 text-gray-900 dark:bg-neutral-900/70 dark:text-gray-100 dark:border-white/10 border-gray-200"
          }`}
        >
          {/* subtle pattern & glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [background:radial-gradient(1px_1px_at_18px_18px,rgba(0,0,0,.04)_1px,transparent_1px)] [background-size:22px_22px] dark:[background:radial-gradient(1px_1px_at_18px_18px,rgba(255,255,255,.05)_1px,transparent_1px)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -z-10 size-40 blur-2xl opacity-20 rounded-full bg-gradient-to-br from-blue-500/25 via-transparent to-transparent -top-14 -left-14 dark:from-blue-400/15"
          />

          {/* bubble toolbar */}
          <BubbleToolbar
            message={message}
            content={displayContent}
            isUser={!!isUser}
          />

          {/* content */}
          <div
            className={`text-[0.95rem] leading-relaxed ${
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
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      {children}
                      <LinkIcon className="w-3.5 h-3.5" />
                    </a>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-3 text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-1">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul
                      className={`mb-3 last:mb-0 space-y-1 ${
                        isRtl ? "mr-4" : "ml-4"
                      } list-disc`}
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
                      className={`leading-relaxed ${
                        isRtl ? "text-right" : "text-left"
                      }`}
                    >
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`${
                        isRtl ? "border-r-4 pr-4" : "border-l-4 pl-4"
                      } border-blue-500/60 py-2 my-3 bg-blue-50/40 dark:bg-blue-950/20 rounded`}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="my-4 border-t border-gray-200 dark:border-white/10" />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 border border-gray-200 dark:border-white/10 rounded-lg">
                      <table className="min-w-full">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left font-semibold border-b border-gray-200 dark:border-white/10">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 border-b border-gray-100 dark:border-white/5">
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
                aria-label="typing"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block align-baseline w-2 h-4 ml-1 bg-current rounded-sm"
              />
            )}
          </div>

          {/* timestamp */}
          <div
            className={`mt-2 text-[11px] ${
              isUser
                ? "text-blue-600/70 dark:text-blue-200/60"
                : "text-gray-500 dark:text-gray-400"
            } ${isRtl ? "text-left" : "text-right"}`}
          >
            {formatClock(message.timestamp)}
            {message.metadata?.workspaceName ? (
              <>
                {" "}
                ·{" "}
                <span className="truncate max-w-[12rem] inline-block align-bottom">
                  {message.metadata.workspaceName}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BubbleToolbar: React.FC<{
  message: ChatMessage;
  content: string;
  isUser: boolean;
}> = ({ content, isUser }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div
      className={`absolute ${
        isUser ? "top-1.5 left-2" : "top-1.5 right-2"
      } flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
    >
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-neutral-800/60 hover:bg-white dark:hover:bg-neutral-700/70"
        title="Copy message"
      >
        {copied ? (
          <ClipboardCheck className="w-3 h-3" />
        ) : (
          <Clipboard className="w-3 h-3" />
        )}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};

// ---------- ChatMessages ----------
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

  const hasMessages = messages && messages.length > 0;

  return (
    <div
      className={`flex-1 w-10/12 h-full p-4 ${isRtl ? "rtl" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {!hasMessages && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center text-center h-full"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("chat.welcome", "تعلم مع المدرس الذكي")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                {t(
                  "chat.welcome_message",
                  "اسأل أي سؤال عن المحتوى أو احصل على المساعدة فيما تحتاجه."
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col">
          {messages.map((message) => (
            <MessageBubble
              key={message.id || `${message.timestamp}-${message.role}`}
              message={message}
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
              isStreaming
              streamingContent={streamingMessage}
              isRtl={isRtl}
            />
          )}

          {isLoading && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className={`flex ${isRtl ? "justify-end" : "justify-start"} mt-2`}
            >
              <div
                className={`flex items-start gap-3 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm">
                  <div
                    className={`flex ${
                      isRtl ? "space-x-reverse" : ""
                    } space-x-1`}
                  >
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.4,
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
        </div>
      )}
    </div>
  );
}
