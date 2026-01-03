import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Brain } from "lucide-react";
import { ChatMessage } from "../types";
import "katex/dist/katex.min.css";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  streamingMessage?: string;
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatMessages({
  messages,
  isLoading = false,
  streamingMessage,
}: ChatMessagesProps) {
  const { t, i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    setIsRtl(i18n.language === "ar");
  }, [i18n.language]);

  const isAtBottom = useCallback((epsPx = 4) => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - (el.scrollTop + el.clientHeight) <= epsPx;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "auto", block: "end" });
  }, []);

  useLayoutEffect(() => {
    if (lockedRef.current) return;

    if (!isAtBottom(6)) return;

    requestAnimationFrame(() => {
      if (lockedRef.current) return;
      scrollToBottom();
    });
  }, [
    messages.length,
    streamingMessage,
    isLoading,
    isAtBottom,
    scrollToBottom,
  ]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      lockedRef.current = !isAtBottom(4);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, [isAtBottom]);

  const hasMessages = messages && messages.length > 0;
  const uploadingLabel = t("chat.attachment.uploading", "Uploading…");
  const failedLabel = t("chat.attachment.failed", "Failed to upload");
  const thinkingLabel = isRtl ? "جاري التفكير..." : "Thinking...";

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden relative">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3"
        onWheelCapture={(e) => {
          if (e.deltaY < 0) lockedRef.current = true;
        }}
        onTouchMoveCapture={() => {
          if (!isAtBottom(4)) lockedRef.current = true;
        }}
        style={{ overflowAnchor: "none" }}
      >
        {!hasMessages && !isLoading ? null : (
          <div className="flex flex-col w-full">
            {messages.map((message, ind) => (
              <div
                className="mx-6"
                key={
                  message.id || `${message.created_at}-${message.role}-${ind}`
                }
              >
                <MessageBubble
                  message={message}
                  isRtl={isRtl}
                  uploadingLabel={uploadingLabel}
                  failedLabel={failedLabel}
                />
              </div>
            ))}

            {isLoading && streamingMessage && (
              <div className="mx-6">
                <MessageBubble
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: "",
                    created_at: new Date(),
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
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                className={`flex ${
                  isRtl ? "justify-end" : "justify-start"
                } mt-2 mx-6`}
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
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
