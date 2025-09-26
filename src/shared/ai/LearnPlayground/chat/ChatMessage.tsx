import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bot, MessageCircle } from "lucide-react";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
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

const MessageBubble: React.FC<{
  message: ChatMessage;
  isStreaming?: boolean;
  streamingContent?: string;
}> = ({ message, isStreaming = false, streamingContent = "" }) => {
  const { t } = useTranslation();
  const isUser = message.type === "user";
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
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        <div
          className={`relative group rounded-3xl px-4 py-3 ${
            isUser
              ? "bg-zinc-100 text-black border-gray-200 border"
              : isError
              ? "bg-red-50 border border-red-200 text-red-800"
              : " text-gray-900"
          }`}
        >
          {isError && (
            <div className="mb-2 text-sm font-medium text-red-600">
              {t("chat.error", "Error")}
            </div>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {displayContent}
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 ml-1 bg-current"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading = false,
  streamingMessage,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 h-full p-4 space-y-2">
      {messages.length === 0 && !isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-center text-center"
        >
          <div className="space-y-3">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {t("chat.welcome", "Learn with the AI Tutor")}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {t(
                  "chat.welcome_message",
                  "Ask questions about your content or get help with anything you need."
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
            />
          ))}

          {isLoading && streamingMessage && (
            <MessageBubble
              message={{
                id: "streaming",
                type: "assistant",
                content: "",
                timestamp: new Date(),
              }}
              isStreaming={true}
              streamingContent={streamingMessage}
            />
          )}

          {isLoading && !streamingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start mb-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot size={16} className="text-gray-700" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
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
};

export default ChatMessages;
