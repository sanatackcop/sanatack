import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Clipboard,
  ClipboardCheck,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Attachment = {
  id?: string;
  filename?: string;
  mimetype?: string;
  size?: number;
  type?: string;
  url?: string;
  contentPreview?: string;
  status?: "uploading" | "uploaded";
};

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
    attachments?: Attachment[];
  };
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  streamingMessage?: string;
  onSendMessage: (message: string) => Promise<void>;
}

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
  const isError = !!message.metadata?.error;
  const displayContent = isStreaming ? streamingContent : message.content;
  const attachments: Attachment[] = Array.isArray(message.metadata?.attachments)
    ? (message.metadata?.attachments as Attachment[])
    : [];

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
        {/* bubble */}
        <div
          className={`group relative overflow-hidden rounded-2xl px-4 py-3 transition-colors duration-200  ${
            isUser
              ? "bg-zinc-50/85 text-zinc-900 border border-zinc-200 dark:bg-zinc-900/70 dark:text-zinc-100 dark:border-zinc-800/60"
              : isError
              ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-300"
              : "text-zinc-900  dark:text-zinc-100"
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
                    <h1 className="text-lg font-bold mb-3 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700 pb-1">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 text-zinc-800 dark:text-zinc-200 leading-relaxed">
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
                      className={`text-zinc-800 dark:text-zinc-200 leading-relaxed flex items-start ${
                        isRtl ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600 rounded-full mt-2 flex-shrink-0 ${
                          isRtl ? "ml-2" : "mr-2"
                        }`}
                      ></span>
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-zinc-800 dark:text-zinc-200">
                      {children}
                    </em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className={`${
                        isRtl ? "border-r-4 pr-4" : "border-l-4 pl-4"
                      } border-blue-500 py-2 my-3 bg-zinc-50 text-zinc-700 italic rounded dark:bg-zinc-900/50 dark:text-zinc-200`}
                    >
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="my-4 border-t border-zinc-200 dark:border-zinc-700" />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-zinc-50 dark:bg-zinc-900/40">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-700">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-zinc-800 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-800/60">
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

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((attachment, index) => {
                  const sizeLabel = formatFileSize(attachment.size);
                  const url = attachment.url;
                  const filename = attachment.filename || "attachment";
                  const key = attachment.id || `${filename}-${index}`;
                  const isImageAttachment = (attachment.type || "")
                    .toLowerCase()
                    .includes("image");

                  if (isImageAttachment && url) {
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700"
                      >
                        <img
                          src={url}
                          alt={filename}
                          className="max-h-48 w-full object-cover"
                          loading="lazy"
                        />
                        <div className="flex items-center justify-between px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-300">
                          <span className="font-medium truncate">
                            {filename}
                          </span>
                          {sizeLabel && <span>{sizeLabel}</span>}
                        </div>
                      </a>
                    );
                  }

                  const statusMessage = !url
                    ? attachment.status === "failed"
                      ? failedLabel
                      : uploadingLabel
                    : undefined;

                  const attachmentContent = (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{filename}</div>
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
                          <p className="mt-1 line-clamp-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                            {attachment.contentPreview}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  return url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      {attachmentContent}
                    </a>
                  ) : (
                    <div
                      key={key}
                      className={`rounded-xl border border-dashed px-3 py-2 text-xs transition-colors ${
                        attachment.status === "failed"
                          ? "border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
                          : "border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400"
                      }`}
                    >
                      {attachmentContent}
                    </div>
                  );
                })}
              </div>
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
}> = ({ /*content, */ isUser }) => {
  // const [copied, setCopied] = useState(false);
  // const onCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(content);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 1200);
  //   } catch {}
  // };

  return (
    <div
      className={`absolute ${
        isUser ? "top-1.5 left-2" : "top-1.5 right-2"
      } flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}
    ></div>
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

  const hasMessages = messages && messages.length > 0;
  const uploadingLabel = t("chat.attachment.uploading", "Uploading…");
  const failedLabel = t("chat.attachment.failed", "Failed to upload");

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
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center shadow-lg dark:shadow-zinc-900/40">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {t("chat.welcome", "تعلم مع المدرس الذكي")}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
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
              uploadingLabel={uploadingLabel}
              failedLabel={failedLabel}
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
              uploadingLabel={uploadingLabel}
              failedLabel={failedLabel}
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
                <div className="bg-zinc-50/85 border border-zinc-200 rounded-2xl px-4 py-3 shadow-sm dark:bg-zinc-900/70 dark:border-zinc-800/60 dark:shadow-none">
                  <div className="flex space-x-1">
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
