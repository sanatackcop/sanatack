import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, X, Paperclip, Loader2, AtSign } from "lucide-react";
import i18n from "@/i18n";
import { toast } from "sonner";

const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "text/plain",
  "text/markdown",
]);
const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".txt",
  ".md",
]);

export const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb > 100 ? 0 : 1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(mb > 100 ? 0 : 1)} MB`;
};

const getFileExtension = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : "";
};

export type Model = {
  id: string;
  name: string;
  isActive?: boolean;
  color?: string;
  description?: string;
  speed?: "fast" | "balanced" | "precise";
};

export type Context = {
  id: string;
  name: string;
  content: string;
  type:
    | "file"
    | "text"
    | "url"
    | "image"
    | "video"
    | "transcript"
    | "ai_generated"
    | "document"
    | "summary";
  size?: string;
  preview?: string;
  thumbnail?: string;
  duration?: string;
  metadata?: {
    [key: string]: any;
  };
  file?: File;
};

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string, model: Model, contexts: Context[]) => void;
  placeholder?: string;
  models?: Model[];
  onModelChange?: (model: Model) => void;
  contexts?: Context[];
  onContextsChange?: (contexts: Context[]) => void;
  className?: string;
  expandSection?: boolean;
  optionsToHide?: {
    models?: boolean;
  };
  availableContexts?: Context[];
  onSearchContexts?: (query: string) => Promise<Context[]>;
  hasAutoContext?: boolean;
  autoContextCount?: number;
  onAutoContextClick?: () => void;
  autoContextLoading?: boolean;
  selectedModel?: Model;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  expandSection,
  contexts = [],
  onContextsChange,
  className = "",
  hasAutoContext = true,
  onAutoContextClick,
  autoContextLoading = false,
  selectedModel,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<Context[]>(
    contexts ?? []
  );
  const [, setContextSearch] = useState("");
  const [, setCursorPosition] = useState(0);
  const [, setMentionTriggerPos] = useState<number | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [, setSelectedContextIndex] = useState(0);

  useEffect(() => {
    setSelectedContexts(contexts ?? []);
  }, [contexts]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = i18n.dir() === "rtl";

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const filesArray = Array.from(fileList as ArrayLike<File>);
      if (!filesArray.length) return;

      const contextsToAdd: Context[] = [];

      for (const file of filesArray) {
        const extension = getFileExtension(file.name);
        const isAllowedType =
          ALLOWED_UPLOAD_MIME_TYPES.has(file.type) ||
          ALLOWED_UPLOAD_EXTENSIONS.has(extension);

        if (!isAllowedType) {
          toast.error(
            isRTL
              ? "نوع الملف غير مدعوم. الصيغ المسموح بها: PNG, JPG, JPEG, TXT, MD."
              : "Unsupported file type. Allowed formats: PNG, JPG, JPEG, TXT, MD."
          );
          continue;
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
          toast.error(
            isRTL
              ? "حجم الملف يتجاوز 2 ميجا."
              : "File size exceeds the 2MB limit."
          );
          continue;
        }

        const isTextFile =
          file.type === "text/plain" ||
          file.type === "text/markdown" ||
          extension === ".txt" ||
          extension === ".md";

        let content = `[Attachment] ${file.name}`;
        let preview: string | undefined;

        if (isTextFile) {
          try {
            const textContent = await file.text();
            const truncated =
              textContent.length > 4000
                ? `${textContent.slice(0, 4000)}…`
                : textContent;
            content = truncated;
            preview = truncated.slice(0, 160);
          } catch (error) {
            console.error("Failed to read file content:", error);
            toast.error(
              isRTL
                ? "تعذر قراءة الملف النصي."
                : "Unable to read the text file."
            );
            continue;
          }
        } else {
          content = `[Image Attachment: ${file.name}]`;
          preview = content;
        }

        const contextId = `upload-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        contextsToAdd.push({
          id: contextId,
          name: file.name,
          content,
          type: isTextFile ? "document" : "image",
          size: formatFileSize(file.size),
          preview,
          metadata: {
            fileId: contextId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          },
          file,
        });
      }

      if (!contextsToAdd.length) return;

      setSelectedContexts((prev) => {
        const updated = [...prev, ...contextsToAdd];
        onContextsChange?.(updated);
        return updated;
      });
    },
    [isRTL, onContextsChange]
  );

  const defaultPlaceholder = isRTL
    ? "اسأل الذكاء الاصطناعي أي شيء... (اكتب @ للسياق)"
    : "Ask AI anything... (type @ for context)";
  const actualPlaceholder = placeholder || defaultPlaceholder;

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const minHeight = 56;
    const maxHeight = 160;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  useEffect(() => {
    setSelectedContexts(contexts);
  }, [contexts]);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    const textarea = textAreaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    setCursorPosition(cursorPos);

    // Find @ symbol before cursor
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);

      // Check if there's a space after @ (which would break the mention)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionTriggerPos(lastAtSymbol);
        setContextSearch(textAfterAt);
        setShowContextMenu(true);
        setSelectedContextIndex(0);

        // Filter contexts based on search
      } else {
        setShowContextMenu(false);
        setMentionTriggerPos(null);
      }
    } else {
      setShowContextMenu(false);
      setMentionTriggerPos(null);
    }
  };

  const submit = () => {
    const trimmed = value?.trim();
    if (!trimmed) return;

    // Create a default model if not provided
    const defaultModel: Model = {
      id: "default",
      name: "Default Model",
    };

    onSubmit?.(trimmed, selectedModel || defaultModel, selectedContexts);

    const persistentContexts = selectedContexts.filter(
      (ctx) => !(ctx.metadata?.fileId || ctx.file)
    );
    if (persistentContexts.length !== selectedContexts.length) {
      setSelectedContexts(persistentContexts);
      onContextsChange?.(persistentContexts);
    }
    setIsFocused(false);
    setShowContextMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showContextMenu) {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowContextMenu(false);
        setMentionTriggerPos(null);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !showContextMenu) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      textAreaRef.current?.blur();
      setIsFocused(false);
      setShowContextMenu(false);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFocused) {
      setIsFocused(true);
      textAreaRef.current?.focus();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    await processFiles(files);
    e.target.value = "";
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    await processFiles(droppedFiles);
  };

  const attachments = useMemo(
    () => selectedContexts.filter((ctx) => ctx.metadata?.fileId || ctx.file),
    [selectedContexts]
  );

  const removeAttachment = (contextId: string) => {
    setSelectedContexts((prev) => {
      const updated = prev.filter((ctx) => ctx.id !== contextId);
      onContextsChange?.(updated);
      return updated;
    });
  };

  return (
    <div
      className={`relative w-full mx-auto ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        ref={containerRef}
        className={`relative transition-all duration-300`}
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropFiles}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileChange}
          aria-label={isRTL ? "اختر ملف" : "Choose file"}
          accept=".png,.jpg,.jpeg,.txt,.md,image/png,image/jpeg,text/plain,text/markdown"
        />

        <div
          className={`
            relative rounded-3xl border overflow-hidden
            transition-all duration-300 ease-out
            ${
              isDragging
                ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-blue-200 dark:shadow-blue-900/20"
                : isFocused
                ? "border-zinc-300 dark:border-zinc-600 shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/40"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }
            bg-white dark:bg-zinc-900
          `}
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-950/90 backdrop-blur-sm z-10 pointer-events-none">
              <div className="text-center">
                <Paperclip className="w-12 h-12 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {isRTL ? "أسقط الملفات هنا" : "Drop files here"}
                </p>
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div
              className={`flex flex-wrap gap-2 px-4 pt-3 ${
                isRTL ? "justify-end" : "justify-start"
              }`}
            >
              {attachments.map((context) => (
                <div
                  key={context.id}
                  className="group flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  <span className="font-medium truncate max-w-[160px]">
                    {context.name}
                  </span>
                  {context.size && (
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {context.size}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAttachment(context.id);
                    }}
                    className="text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-100"
                    aria-label={isRTL ? "إزالة الملف" : "Remove attachment"}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-center min-h-[56px]">
            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={actualPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`
                flex-1 text-base bg-transparent border-0 resize-none 
                outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-transparent
                ${isRTL ? "text-right pr-6 pl-16" : "text-left pl-4 pr-16"}
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                text-zinc-900 dark:text-zinc-100
                leading-relaxed transition-all duration-200 
                py-4 truncate text-nowrap
              `}
              style={{
                minHeight: "56px",
                maxHeight: "60px",
              }}
              rows={1}
            />
          </div>

          {expandSection && (
            <div
              className={`
                overflow-hidden transition-all duration-500 ease-out px-3 pb-1
              `}
            >
              <div
                ref={expandedContentRef}
                className={`
                  flex items-center justify-between pb-1
                  transition-all duration-300 ease-out
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1 w-full">
                  {hasAutoContext && (
                    <Button
                      variant="outline"
                      className="rounded-2xl dark:bg-transparent"
                      size="sm"
                      disabled={autoContextLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAutoContextClick?.();
                      }}
                    >
                      <div className="flex items-center gap-1.5  text-zinc-900/50 dark:text-gray-100  transition-all duration-100 hover:text-black">
                        {autoContextLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <AtSign className="w-3.5 h-3.5" />
                        )}
                        <span>{isRTL ? "سياق " : "Add Context"}</span>
                      </div>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    disabled
                    className="rounded-2xl dark:bg-transparent"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-zinc-900/50 dark:text-gray-100  transition-all duration-100 group-hover:text-black">
                      <Paperclip className="size-3" />
                    </div>
                  </Button>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    submit();
                  }}
                  disabled={!value?.trim()}
                  size="sm"
                  className={`
                  size-8 rounded-2xl font-medium transition-all duration-300 ease-out
                  ${
                    value?.trim()
                      ? "bg-zinc-800 hover:bg-zinc-900 dark:bg-gray-200 dark:hover:bg-zinc-600 text-white   dark:shadow-zinc-950"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  }
                `}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
