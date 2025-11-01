import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  X,
  Paperclip,
  AtSign,
  FileText,
  Loader2,
  Search,
  Globe,
  BookOpen,
  Wrench,
  MessageSquare,
  Sparkles,
  Check,
} from "lucide-react";
import i18n from "@/i18n";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

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
  icon?: React.ReactNode;
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
  appliedContextIds?: string[];
}

// Context categories with icons
const contextCategories = {
  workspace: {
    title: "Workspace Contexts",
    titleAr: "سياقات مساحة العمل",
  },
  learning: {
    title: "Learning Contexts",
    titleAr: "سياقات التعلم",
  },
  uploads: {
    title: "Attachments",
    titleAr: "المرفقات",
  },
  other: {
    title: "Other Contexts",
    titleAr: "سياقات أخرى",
  },
};

const contextTypeIcons = {
  document: FileText,
  video: FileText,
  transcript: FileText,
  search: Globe,
  study_mode: BookOpen,
  study_tools: Wrench,
  chat_instructions: MessageSquare,
};

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  expandSection,
  contexts = [],
  onContextsChange,
  className = "",
  onAutoContextClick,
  hasAutoContext = true,
  autoContextCount = 0,
  autoContextLoading = false,
  selectedModel,
  availableContexts = [],
  onSearchContexts,
  appliedContextIds = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<Context[]>(
    contexts ?? []
  );
  const [contextSearch, setContextSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionTriggerPos, setMentionTriggerPos] = useState<number | null>(
    null
  );
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedContextIndex, setSelectedContextIndex] = useState(0);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [searchResults, setSearchResults] =
    useState<Context[]>(availableContexts);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setSelectedContexts(contexts ?? []);
  }, [contexts]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const searchContextsDebounced = async () => {
      if (!contextSearch.trim()) {
        setSearchResults(availableContexts);
        setIsSearching(false);
        return;
      }

      if (onSearchContexts) {
        setIsSearching(true);
        try {
          const results = await onSearchContexts(contextSearch);
          setSearchResults(results);
        } catch (error) {
          console.error("Failed to search contexts:", error);
          toast.error(
            isRTL ? "فشل البحث عن السياقات" : "Failed to search contexts"
          );
        } finally {
          setIsSearching(false);
        }
      } else {
        // Local filtering if no search callback provided
        const filtered = availableContexts.filter((ctx) =>
          ctx.name.toLowerCase().includes(contextSearch.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchContextsDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [contextSearch, availableContexts, onSearchContexts, isRTL]);

  // Update search results when availableContexts changes
  useEffect(() => {
    if (!contextSearch.trim()) {
      setSearchResults(availableContexts);
    }
  }, [availableContexts, contextSearch]);

  // Categorize contexts
  const getContextKey = (ctx: Context): string => {
    return (
      ctx.id ||
      (ctx.metadata?.workspaceContextId as string | undefined) ||
      (ctx.metadata?.mentionToken as string | undefined) ||
      (ctx.metadata?.fileId as string | undefined) ||
      ctx.name
    );
  };

  const categorizedContexts = useMemo(() => {
    const workspace: Context[] = [];
    const learning: Context[] = [];
    const uploads: Context[] = [];
    const other: Context[] = [];

    searchResults.forEach((ctx) => {
      const scope = ctx.metadata?.scope as string | undefined;

      if (scope === "workspace" || ctx.metadata?.workspaceContextId) {
        workspace.push(ctx);
        return;
      }

      if (scope === "learning") {
        learning.push(ctx);
        return;
      }

      if (scope === "upload" || ctx.metadata?.fileId || ctx.file) {
        uploads.push(ctx);
        return;
      }

      other.push(ctx);
    });

    const ordered = [...workspace, ...learning, ...uploads, ...other];
    const indexByRef = new Map<Context, number>();
    ordered.forEach((ctx, idx) => {
      indexByRef.set(ctx, idx);
    });

    return { workspace, learning, uploads, other, ordered, indexByRef };
  }, [searchResults]);

  const appliedContextIdsSet = useMemo(() => {
    const set = new Set<string>();
    appliedContextIds
      ?.filter((id): id is string => Boolean(id))
      .forEach((id) => set.add(String(id)));
    selectedContexts.forEach((ctx) => {
      set.add(getContextKey(ctx));
    });
    return set;
  }, [appliedContextIds, selectedContexts]);

  useEffect(() => {
    const total = categorizedContexts.ordered.length;
    if (total === 0 && selectedContextIndex !== 0) {
      setSelectedContextIndex(0);
      return;
    }
    if (total > 0 && selectedContextIndex >= total) {
      setSelectedContextIndex(total - 1);
    }
  }, [categorizedContexts.ordered.length, selectedContextIndex]);

  const addContext = (context: Context) => {
    setSelectedContexts((prev) => {
      if (prev.some((ctx) => ctx.id === context.id)) {
        toast.info(isRTL ? "السياق مضاف بالفعل" : "Context already added");
        return prev;
      }
      const updated = [...prev, context];
      onContextsChange?.(updated);
      return updated;
    });

    // Insert @mention into text
    if (mentionTriggerPos !== null) {
      const beforeMention = value.substring(0, mentionTriggerPos);
      const afterMention = value.substring(cursorPosition);
      const newValue = `${beforeMention}@${context.name} ${afterMention}`;
      onChange(newValue);

      // Set cursor position after the mention
      setTimeout(() => {
        const newCursorPos = mentionTriggerPos + context.name.length + 2;
        textAreaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }, 0);
    }

    setContextMenuOpen(false);
    setShowContextMenu(false);
    setMentionTriggerPos(null);
    setContextSearch("");
  };

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
            scope: "upload",
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
    const overlay = overlayRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const minHeight = 56;
    const maxHeight = 160;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

    textarea.style.height = `${newHeight}px`;
    if (overlay) {
      overlay.style.height = `${newHeight}px`;
    }
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  useEffect(() => {
    setSelectedContexts(contexts);
  }, [contexts]);

  // Render highlighted text with mentions
  const renderHighlightedText = () => {
    if (!value) return null;

    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(value)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {value.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted mention
      const mentionName = match[1];
      const isValidMention = selectedContexts.some(
        (ctx) => ctx.name === mentionName
      );

      if (isValidMention) {
        parts.push(
          <span
            key={`mention-${match.index}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
          >
            @{mentionName}
          </span>
        );
      } else {
        parts.push(
          <span key={`mention-${match.index}`} className="text-zinc-500">
            @{mentionName}
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{value.substring(lastIndex)}</span>
      );
    }

    return parts;
  };

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
        setContextMenuOpen(true);
        setSelectedContextIndex(0);
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
      const allResults = categorizedContexts.ordered;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedContextIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : prev
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedContextIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (e.key === "Enter" && allResults[selectedContextIndex]) {
        e.preventDefault();
        addContext(allResults[selectedContextIndex]);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setShowContextMenu(false);
        setContextMenuOpen(false);
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

  const removeContext = (contextId: string) => {
    setSelectedContexts((prev) => {
      const updated = prev.filter(
        (ctx) => getContextKey(ctx) !== contextId
      );
      onContextsChange?.(updated);

      const contextToRemove = prev.find(
        (ctx) => getContextKey(ctx) === contextId
      );
      if (contextToRemove) {
        const mentionPattern = new RegExp(`@${contextToRemove.name}\\s?`, "g");
        const newValue = value.replace(mentionPattern, "");
        onChange(newValue);
      }

      return updated;
    });
  };

  const getContextIcon = (context: Context) => {
    const IconComponent =
      contextTypeIcons[context.type as keyof typeof contextTypeIcons];
    return IconComponent ? (
      <IconComponent className="w-4 h-4" />
    ) : (
      <FileText className="w-4 h-4" />
    );
  };

  const renderContextItem = (context: Context) => {
    const index = categorizedContexts.indexByRef.get(context) ?? 0;
    const isSelected = index === selectedContextIndex && showContextMenu;
    const contextKey = getContextKey(context);
    const isApplied = appliedContextIdsSet.has(contextKey);
    const isAdded = selectedContexts.some(
      (ctx) => getContextKey(ctx) === contextKey
    );

    const isDisabled = isAdded;

    const baseClasses = [
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group border",
      isApplied
        ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-100"
        : "border-transparent",
      !isDisabled && !isApplied
        ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        : "",
      isSelected ? "ring-1 ring-blue-200 dark:ring-blue-700" : "",
      isDisabled && !isApplied ? "opacity-60" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const iconColor = isApplied
      ? "text-emerald-600 dark:text-emerald-300"
      : isSelected
      ? "text-blue-600 dark:text-blue-400"
      : "text-zinc-400 dark:text-zinc-500";

    return (
      <button
        key={`${contextKey}-${index}`}
        onClick={() => addContext(context)}
        disabled={isDisabled}
        className={baseClasses}
      >
        <div className={`flex-shrink-0 ${iconColor}`}>
          {getContextIcon(context)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {context.name}
          </div>
          {context.metadata?.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {context.metadata.description}
            </p>
          )}
        </div>
        {isApplied ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
        ) : context.metadata?.count ? (
          <div className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
            {context.metadata.count}
          </div>
        ) : null}
      </button>
    );
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
                  className="group flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
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
                      removeContext(getContextKey(context));
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
            {/* Highlighted overlay */}
            <div
              ref={overlayRef}
              className={`
                absolute inset-0 pointer-events-none whitespace-pre-wrap break-words
                text-base leading-relaxed text-zinc-900 dark:text-zinc-100
                ${isRTL ? "text-right pr-6 pl-16" : "text-left pl-4 pr-16"}
                py-4 overflow-hidden
              `}
              style={{
                minHeight: "56px",
                maxHeight: "160px",
              }}
            >
              {renderHighlightedText()}
            </div>

            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setCursorPosition(target.selectionStart);
              }}
              placeholder={actualPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`
                flex-1 text-base bg-transparent border-0 resize-none 
                outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-transparent
                ${isRTL ? "text-right pr-6 pl-16" : "text-left pl-4 pr-16"}
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                text-zinc-900 dark:text-zinc-100
                leading-relaxed transition-all duration-200 
                py-4 relative z-10
                caret-zinc-900 dark:caret-zinc-100
              `}
              style={{
                minHeight: "56px",
                maxHeight: "160px",
                color: value ? "transparent" : undefined,
                caretColor: "rgb(24 24 27)",
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
                    <Popover
                      open={contextMenuOpen}
                      onOpenChange={setContextMenuOpen}
                      modal={true}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-2xl dark:bg-transparent border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                          size="sm"
                          disabled={autoContextLoading}
                        >
                          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 transition-all duration-100 hover:text-zinc-900 dark:hover:text-zinc-100">
                            {autoContextLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <AtSign className="w-3.5 h-3.5" />
                            )}
                            <span className="font-medium">
                              {isRTL ? "إضافة سياق" : "Add Context"}
                            </span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 rounded-xl p-0 shadow-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        align={isRTL ? "end" : "start"}
                        side="top"
                        sideOffset={8}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col">
                          {/* Search Header */}
                          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                              <Input
                                value={contextSearch}
                                onChange={(e) =>
                                  setContextSearch(e.target.value)
                                }
                                placeholder={isRTL ? "بحث" : "Search"}
                                className="pl-9 h-9 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-blue-500"
                              />
                            </div>
                          </div>

                          {onAutoContextClick && (
                            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={autoContextLoading}
                                className="w-full justify-start gap-2 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-white dark:text-zinc-300 dark:hover:text-white"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onAutoContextClick();
                                }}
                              >
                                {autoContextLoading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isRTL
                                    ? "توليد سياق تلقائي"
                                    : "Generate workspace context"}
                                </span>
                              </Button>
                            </div>
                          )}

                          <ScrollArea className="h-[360px]">
                            {isSearching ? (
                              <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                              </div>
                            ) : searchResults.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" />
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                  {isRTL
                                    ? "لم يتم العثور على سياقات"
                                    : "No contexts found"}
                                </p>
                                {contextSearch && (
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    {isRTL
                                      ? `لا توجد نتائج لـ "${contextSearch}"`
                                      : `No results for "${contextSearch}"`}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="p-2">
                                {categorizedContexts.workspace.length > 0 && (
                                  <div className="mb-4">
                                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                                      <span>
                                        {isRTL
                                          ? contextCategories.workspace.titleAr
                                          : contextCategories.workspace.title}
                                      </span>
                                      {typeof autoContextCount === "number" &&
                                        autoContextCount > 0 && (
                                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                                            {autoContextCount}
                                          </span>
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                      {categorizedContexts.workspace.map(
                                        (ctx) => renderContextItem(ctx)
                                      )}
                                    </div>
                                  </div>
                                )}

                                {categorizedContexts.learning.length > 0 && (
                                  <div className="mb-4">
                                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                      {isRTL
                                        ? contextCategories.learning.titleAr
                                        : contextCategories.learning.title}
                                    </div>
                                    <div className="space-y-0.5">
                                      {categorizedContexts.learning.map((ctx) =>
                                        renderContextItem(ctx)
                                      )}
                                    </div>
                                  </div>
                                )}

                                {categorizedContexts.uploads.length > 0 && (
                                  <div className="mb-4">
                                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                      {isRTL
                                        ? contextCategories.uploads.titleAr
                                        : contextCategories.uploads.title}
                                    </div>
                                    <div className="space-y-0.5">
                                      {categorizedContexts.uploads.map((ctx) =>
                                        renderContextItem(ctx)
                                      )}
                                    </div>
                                  </div>
                                )}

                                {categorizedContexts.other.length > 0 && (
                                  <div>
                                    <div className="px-3 py-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                      {isRTL
                                        ? contextCategories.other.titleAr
                                        : contextCategories.other.title}
                                    </div>
                                    <div className="space-y-0.5">
                                      {categorizedContexts.other.map((ctx) =>
                                        renderContextItem(ctx)
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </ScrollArea>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  <Button
                    variant="outline"
                    className="rounded-2xl dark:bg-transparent border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 transition-all duration-100 hover:text-zinc-900 dark:hover:text-zinc-100">
                      <Paperclip className="size-3.5" />
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
                        ? "bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-sm"
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
