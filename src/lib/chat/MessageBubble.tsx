import React from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "../types";
import { AssistantMessage, UserMessage } from "./ChatHelpers";
import "katex/dist/katex.min.css";

export const MessageBubble: React.FC<{
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

  const who = message.role as "user" | "assistant" | "system" | undefined;
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
