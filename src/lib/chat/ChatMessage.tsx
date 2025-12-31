import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Clipboard,
  ClipboardCheck,
  Link as LinkIcon,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Brain,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

// ============================================================================
// Types
// ============================================================================

type Attachment = {
  id?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  type?: string;
  url?: string;
  contentPreview?: string;
  status?: any;
  dataUrl?: string;
};

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
    attachments?: Attachment[];
  };
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  streamingMessage?: string;
  onSendMessage: (message: string) => Promise<void>;
}

// ============================================================================
// Utilities
// ============================================================================

const formatFileSize = (bytes?: number) => {
  if (typeof bytes !== "number" || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb > 100 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb > 100 ? 0 : 1)} MB`;
};

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

// ============================================================================
// Code Block Component
// ============================================================================

const CodeBlock: React.FC<{
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
}> = ({ className, children, inline }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children ?? "").replace(/\n$/, "");
  const lang = match?.[1] ?? "text";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[0.9em] font-mono text-pink-600 dark:text-pink-400 break-all overflow-wrap-break-word">
        {children}
      </code>
    );
  }

  return (
    <div className="group/code my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 max-w-full">
      <div className="flex items-center justify-between px-3 py-2 text-xs bg-gray-50/80 dark:bg-neutral-800/60 border-b border-gray-200 dark:border-white/10">
        <span className="font-mono text-gray-600 dark:text-gray-300 truncate">
          {lang}
        </span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 flex-shrink-0"
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
      <div className="overflow-x-auto max-w-full">
        <SyntaxHighlighter
          language={lang}
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
    </div>
  );
};

// ============================================================================
// Message Actions Component
// ============================================================================

const MessageActions: React.FC<{
  content: string;
  isRtl: boolean;
}> = ({ content, isRtl }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleLike = () => {
    setLiked(liked === true ? null : true);
  };

  const handleDislike = () => {
    setLiked(liked === false ? null : false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/50">
      <div
        className={`flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <button
          onClick={handleLike}
          className={`p-1.5 rounded-md transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 ${
            liked === true
              ? "text-green-600 dark:text-green-400"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
          title={isRtl ? "إعجاب" : "Like"}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleDislike}
          className={`p-1.5 rounded-md transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 ${
            liked === false
              ? "text-red-600 dark:text-red-400"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
          title={isRtl ? "عدم إعجاب" : "Dislike"}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded-md transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50 ${
            copied
              ? "text-green-600 dark:text-green-400"
              : "text-zinc-400 dark:text-zinc-600"
          }`}
          title={isRtl ? "نسخ" : "Copy"}
        >
          {copied ? (
            <ClipboardCheck className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// User Message Component
// ============================================================================

const UserMessage: React.FC<{
  message: ChatMessage;
  isRtl: boolean;
}> = ({ message, isRtl }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl px-4 py-3 transition-colors duration-200 bg-zinc-50/85 text-zinc-900 border border-zinc-200 dark:bg-zinc-900/70 dark:text-zinc-100 dark:border-zinc-800/60 max-w-full`}
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [background:radial-gradient(1px_1px_at_18px_18px,rgba(0,0,0,.04)_1px,transparent_1px)] [background-size:22px_22px] dark:[background:radial-gradient(1px_1px_at_18px_18px,rgba(255,255,255,.05)_1px,transparent_1px)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -z-10 size-40 blur-2xl opacity-20 rounded-full bg-gradient-to-br from-blue-500/25 via-transparent to-transparent -top-14 -left-14 dark:from-blue-400/15"
      />

      <div className="relative z-10 text-[1rem] leading-relaxed break-words whitespace-pre-wrap word-wrap overflow-wrap-break-word">
        {message.content}
      </div>

      <div
        className={`mt-2 text-[11px] text-blue-600/70 dark:text-blue-200/60 ${
          isRtl ? "text-left" : "text-right"
        }`}
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
  );
};

// ============================================================================
// Attachment Component
// ============================================================================

const AttachmentItem: React.FC<{
  attachment: Attachment;
  index: number;
  uploadingLabel: string;
  failedLabel: string;
  isRtl: boolean;
}> = ({ attachment, index, uploadingLabel, failedLabel }) => {
  const sizeLabel = formatFileSize(attachment.size);
  const source = attachment.dataUrl || attachment.url;
  const filename = attachment.filename || "attachment";
  const key = attachment.id || `${filename}-${index}`;
  const isImageAttachment = (attachment.type || "")
    .toLowerCase()
    .includes("image");

  if (isImageAttachment && source) {
    return (
      <a
        key={key}
        href={attachment.url || source}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 max-w-full"
      >
        <img
          src={source}
          alt={filename}
          className="max-h-64 w-full object-contain bg-zinc-100 dark:bg-zinc-900"
          loading="lazy"
        />
        <div className="flex items-center justify-between px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-300 min-w-0 gap-2">
          <span className="font-medium truncate min-w-0">{filename}</span>
          {sizeLabel && <span className="flex-shrink-0">{sizeLabel}</span>}
        </div>
      </a>
    );
  }

  const statusMessage = !attachment.url
    ? attachment.status === "failed"
      ? failedLabel
      : uploadingLabel
    : undefined;

  const attachmentContent = (
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate min-w-0">{filename}</div>
        <div
          className={`text-[11px] ${
            attachment.status === "failed"
              ? "text-red-500 dark:text-red-300"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {sizeLabel && <span>{sizeLabel}</span>}
          {statusMessage && (
            <span>
              {sizeLabel ? " · " : ""}
              {statusMessage}
            </span>
          )}
        </div>
        {attachment.contentPreview && (
          <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400 break-words min-w-0">
            {attachment.contentPreview}
          </p>
        )}
      </div>
    </div>
  );

  const canDownload = Boolean(attachment.url);

  return canDownload ? (
    <a
      key={key}
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 min-w-0"
    >
      {attachmentContent}
    </a>
  ) : (
    <div
      key={key}
      className={`rounded-xl border border-dashed px-3 py-2 text-xs transition-colors min-w-0 ${
        attachment.status === "failed"
          ? "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
          : "border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400"
      }`}
    >
      {attachmentContent}
    </div>
  );
};

// ============================================================================
// Assistant Message Component
// ============================================================================

const AssistantMessage: React.FC<{
  message: ChatMessage;
  isStreaming: boolean;
  streamingContent: string;
  isRtl: boolean;
  uploadingLabel: string;
  failedLabel: string;
}> = ({
  message,
  isStreaming,
  streamingContent,
  isRtl,
  uploadingLabel,
  failedLabel,
}) => {
  // Use content directly without sanitization for performance
  const displayContent = isStreaming ? streamingContent : message.content;

  const attachments: Attachment[] = Array.isArray(message.metadata?.attachments)
    ? (message.metadata?.attachments as Attachment[])
    : [];

  // Memoize markdown components to prevent recreation on every render
  const markdownComponents = useMemo(
    () => ({
      code: ({ inline, className, children }: any) => (
        <CodeBlock inline={inline} className={className}>
          {children}
        </CodeBlock>
      ),
      img: ({ src, alt }: { src?: string; alt?: string }) => (
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full h-auto rounded-lg my-6 border border-zinc-200 dark:border-zinc-700"
          loading="lazy"
        />
      ),
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline break-words overflow-wrap-break-word"
        >
          <span className="break-all">{children}</span>
          <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
        </a>
      ),
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-base font-semibold mt-4 mb-2 text-zinc-800 dark:text-zinc-200 break-words max-w-full overflow-wrap-break-word first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-sm font-semibold mt-3 mb-1.5 text-zinc-700 dark:text-zinc-300 break-words max-w-full overflow-wrap-break-word">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-sm font-medium mt-2 mb-1 text-zinc-600 dark:text-zinc-400 break-words max-w-full overflow-wrap-break-word">
          {children}
        </h3>
      ),
      h4: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="text-xs font-medium mt-2 mb-1 text-zinc-500 dark:text-zinc-500 break-words max-w-full overflow-wrap-break-word">
          {children}
        </h4>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-3 last:mb-0 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words min-w-0 max-w-full overflow-wrap-break-word font-normal">
          {children}
        </p>
      ),
      ul: ({ children }: { children?: React.ReactNode }) => (
        <ul
          className={`my-2 space-y-2 ${
            isRtl ? "mr-4" : "ml-4"
          } list-disc min-w-0 max-w-full`}
        >
          {children}
        </ul>
      ),
      ol: ({ children }: { children?: React.ReactNode }) => (
        <ol
          className={`my-2 space-y-2 ${
            isRtl ? "mr-4" : "ml-4"
          } list-decimal min-w-0 max-w-full`}
        >
          {children}
        </ol>
      ),
      li: ({ children }: { children?: React.ReactNode }) => (
        <li className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-1 break-words min-w-0 max-w-full overflow-wrap-break-word font-normal mb-1">
          {children}
        </li>
      ),
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-zinc-800 dark:text-zinc-200 break-words">
          {children}
        </strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic text-zinc-700 dark:text-zinc-300 break-words">
          {children}
        </em>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote
          className={`${
            isRtl ? "border-r-4 pr-5" : "border-l-4 pl-5"
          } border-blue-500 py-3 my-5 bg-zinc-50 text-zinc-700 italic rounded dark:bg-zinc-900/50 dark:text-zinc-200 break-words min-w-0 max-w-full overflow-wrap-break-word`}
        >
          {children}
        </blockquote>
      ),
      hr: () => (
        <hr className="my-6 border-t border-zinc-200 dark:border-zinc-700" />
      ),
      table: ({ children }: { children?: React.ReactNode }) => (
        <div className="overflow-x-auto my-6 max-w-full rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="min-w-full">{children}</table>
        </div>
      ),
      thead: ({ children }: { children?: React.ReactNode }) => (
        <thead className="bg-zinc-50 dark:bg-zinc-900/40">{children}</thead>
      ),
      th: ({ children }: { children?: React.ReactNode }) => (
        <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 break-words min-w-0 max-w-full overflow-wrap-break-word">
          {children}
        </th>
      ),
      td: ({ children }: { children?: React.ReactNode }) => (
        <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/60 break-words min-w-0 max-w-full overflow-wrap-break-word">
          {children}
        </td>
      ),
    }),
    [isRtl]
  );

  return (
    <div className="w-full min-w-0">
      <div
        className={`text-[0.95rem] leading-relaxed min-w-0 max-w-full overflow-hidden font-sans ${
          isRtl ? "text-right" : "text-left"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={markdownComponents}
        >
          {displayContent}
        </ReactMarkdown>

        {isStreaming && (
          <motion.span
            aria-label="typing"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="inline-block align-baseline w-2 h-4 ml-1 bg-current rounded-sm"
          />
        )}
      </div>

      {attachments.length > 0 && (
        <div className="mt-3 space-y-2 min-w-0 max-w-full">
          {attachments.map((attachment, index) => (
            <AttachmentItem
              key={attachment.id || `${attachment.filename}-${index}`}
              attachment={attachment}
              index={index}
              uploadingLabel={uploadingLabel}
              failedLabel={failedLabel}
              isRtl={isRtl}
            />
          ))}
        </div>
      )}

      <div
        className={`mt-2 text-[11px] text-gray-500 dark:text-gray-400 ${
          isRtl ? "text-left" : "text-right"
        }`}
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

      {!isStreaming && (
        <MessageActions content={displayContent} isRtl={isRtl} />
      )}
    </div>
  );
};

// ============================================================================
// Message Bubble Component
// ============================================================================

const MessageBubble: React.FC<{
  message: ChatMessage;
  isStreaming?: boolean;
  streamingContent?: string;
  isRtl?: boolean;
  uploadingLabel?: string;
  failedLabel?: string;
}> = ({
  message,
  isStreaming = false,
  streamingContent = "",
  isRtl = false,
  uploadingLabel = "Uploading…",
  failedLabel = "Failed to upload",
}) => {
  if (!message) return null;

  const who = (message.type ?? message.role) as
    | "user"
    | "assistant"
    | undefined;
  const isUser = who === "user";
  const isAssistant = who === "assistant";

  const containerJustify = isUser
    ? isRtl
      ? "justify-start"
      : "justify-end"
    : isRtl
    ? "justify-end"
    : "justify-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
      className={`flex ${containerJustify} mb-5 w-full break-words px-0`}
    >
      <div
        className={`flex items-start gap-3 max-w-[95%] lg:max-w-[90%] min-w-0 ${
          isUser ? "" : "w-full"
        }`}
      >
        {isUser && <UserMessage message={message} isRtl={isRtl} />}

        {isAssistant && (
          <AssistantMessage
            message={message}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            isRtl={isRtl}
            uploadingLabel={uploadingLabel}
            failedLabel={failedLabel}
          />
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Main Chat Messages Component
// ============================================================================

export default function ChatMessages({
  messages,
  isLoading = false,
  streamingMessage,
}: ChatMessagesProps) {
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth", // For smooth scrolling
        block: "start", // Aligns the top of the element with the top of the scroll container
      });
    }
  };

  useEffect(() => {
    setIsRtl(i18n.language === "ar");
    scrollToElement();
  }, [i18n.language]);

  const hasMessages = messages && messages.length > 0;
  const uploadingLabel = t("chat.attachment.uploading", "Uploading…");
  const failedLabel = t("chat.attachment.failed", "Failed to upload");
  const thinkingLabel = isRtl ? "جاري التفكير..." : "Thinking...";

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!hasMessages && !isLoading ? (
          <></>
        ) : (
          <div className="flex flex-col w-full">
            {messages.map((message, ind) => {
              const isLastMessage =
                ind === messages.length - 1 && !(isLoading && streamingMessage);

              return (
                <div
                  className="mx-2 sm:mx-4 lg:mx-6"
                  key={
                    message.id || `${message.timestamp}-${message.role}-${ind}`
                  }
                >
                  <MessageBubble
                    message={message}
                    isRtl={isRtl}
                    uploadingLabel={uploadingLabel}
                    failedLabel={failedLabel}
                  />
                  <div ref={isLastMessage ? lastMessageRef : undefined}></div>
                </div>
              );
            })}

            {isLoading && streamingMessage && (
              <div ref={lastMessageRef}>
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
                  uploadingLabel={uploadingLabel}
                  failedLabel={failedLabel}
                />
              </div>
            )}

            {isLoading && !streamingMessage && (
              <motion.div
                ref={lastMessageRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className={`flex ${
                  isRtl ? "justify-end" : "justify-start"
                } mt-2`}
              >
                <div
                  className={`flex items-start gap-3 ${
                    isRtl ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="bg-zinc-50/85 border border-zinc-200 rounded-2xl px-4 py-3 shadow-sm dark:bg-zinc-900/70 dark:border-zinc-800/60 dark:shadow-none max-w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="flex-shrink-0"
                      >
                        <Brain className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      </motion.div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {thinkingLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
