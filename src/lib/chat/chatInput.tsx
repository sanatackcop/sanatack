import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  File,
  X,
  FileText,
  Link,
  Image,
  ChevronDown,
  Paperclip,
  Mic,
  AudioWaveform,
  Video,
  BookOpen,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";
import i18n from "@/i18n";

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
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  expandSection,
  models = [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      isActive: true,
      color: "emerald",
      description: "Fast and efficient for most tasks",
      speed: "fast",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      color: "blue",
      description: "Advanced reasoning and analysis",
      speed: "balanced",
    },
    {
      id: "claude-3.5",
      name: "Claude 3.5 Sonnet",
      color: "purple",
      description: "Creative and detailed responses",
      speed: "precise",
    },
  ],
  onModelChange,
  contexts = [],
  onContextsChange,
  className = "",
  optionsToHide,
  availableContexts = [
    {
      id: "1",
      name: "Introduction to React Hooks",
      content:
        "Complete transcript of React Hooks tutorial covering useState, useEffect, and custom hooks...",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
      duration: "15:30",
      preview:
        "Learn about React Hooks including useState, useEffect, useContext, and how to create custom hooks...",
      metadata: {
        views: "125K",
        author: "React Mastery",
        uploadedAt: "2 days ago",
      },
    },
    {
      id: "2",
      name: "Machine Learning Basics - Full Transcript",
      content: "Complete transcript from ML fundamentals course...",
      type: "transcript",
      preview:
        "Understanding supervised and unsupervised learning, neural networks, and practical applications in real-world scenarios...",
      metadata: {
        author: "AI Academy",
      },
    },
    {
      id: "3",
      name: "Python Course - AI Summary",
      content:
        "AI-generated comprehensive notes from Python programming course",
      type: "ai_generated",
      preview:
        "Key concepts: Variables, Data Types, Functions, Classes, OOP principles, File handling, Exception handling, and best practices...",
      metadata: {
        author: "AI Generated",
      },
    },
    {
      id: "4",
      name: "Web Development Full Stack Tutorial",
      content: "Complete full stack web development course transcript",
      type: "video",
      thumbnail:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      duration: "2:15:45",
      preview:
        "Master HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and deploy your applications...",
      metadata: {
        views: "340K",
        author: "Dev Academy",
        uploadedAt: "1 week ago",
      },
    },
    {
      id: "5",
      name: "Data Structures & Algorithms",
      content: "DSA comprehensive course transcript",
      type: "transcript",
      preview:
        "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, Searching, Dynamic Programming...",
      metadata: {
        author: "CS Fundamentals",
      },
    },
    {
      id: "6",
      name: "TypeScript Deep Dive - AI Notes",
      content: "AI-generated study material from TypeScript course",
      type: "ai_generated",
      preview:
        "Type annotations, interfaces, generics, advanced types, decorators, modules, and TypeScript best practices...",
      metadata: {
        author: "AI Generated",
      },
    },
  ],
  // onSearchContexts,
  hasAutoContext = true,
  autoContextCount = 3,
  onAutoContextClick,
  autoContextLoading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isModelPopoverOpen, setIsModelPopoverOpen] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<Context[]>(contexts);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextSearch, setContextSearch] = useState("");
  const [filteredContexts, setFilteredContexts] =
    useState<Context[]>(availableContexts);
  const [mentionTriggerPos, setMentionTriggerPos] = useState<number | null>(
    null
  );
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedContextIndex, setSelectedContextIndex] = useState(0);

  const activeModel = models.find((m) => m.isActive) ?? models[0];
  const [selectedModel, setSelectedModel] = useState<Model>(activeModel);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const contextItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isRTL = i18n.dir() === "rtl";

  const defaultPlaceholder = isRTL
    ? "اسأل الذكاء الاصطناعي أي شيء... (اكتب @ للسياق)"
    : "Ask AI anything... (type @ for context)";
  const actualPlaceholder = placeholder || defaultPlaceholder;

  const isExpanded =
    isFocused || selectedContexts.length > 0 || isModelPopoverOpen;

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

  // Handle @ mention detection
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
        const filtered = availableContexts.filter(
          (ctx) =>
            ctx.name.toLowerCase().includes(textAfterAt.toLowerCase()) ||
            ctx.preview?.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        setFilteredContexts(filtered);
      } else {
        setShowContextMenu(false);
        setMentionTriggerPos(null);
      }
    } else {
      setShowContextMenu(false);
      setMentionTriggerPos(null);
    }
  };

  // Handle context selection from menu
  const handleContextSelect = (context: Context) => {
    if (mentionTriggerPos === null) return;

    // Add to selected contexts
    if (!selectedContexts.find((c) => c.id === context.id)) {
      const newContexts = [...selectedContexts, context];
      setSelectedContexts(newContexts);
      onContextsChange?.(newContexts);
    }

    // Replace @mention with context name
    const beforeMention = value.substring(0, mentionTriggerPos);
    const afterCursor = value.substring(cursorPosition);
    const newValue = `${beforeMention}@${context.name} ${afterCursor}`;

    onChange(newValue);
    setShowContextMenu(false);
    setMentionTriggerPos(null);
    setContextSearch("");

    // Focus back on textarea
    setTimeout(() => {
      textAreaRef.current?.focus();
      const newCursorPos = mentionTriggerPos + context.name.length + 2;
      textAreaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const submit = () => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed, selectedModel, selectedContexts);
    setIsFocused(false);
    setShowContextMenu(false);
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    onModelChange?.(model);
    setIsModelPopoverOpen(false);
  };

  const removeContext = (contextId: string) => {
    const newContexts = selectedContexts.filter((c) => c.id !== contextId);
    setSelectedContexts(newContexts);
    onContextsChange?.(newContexts);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showContextMenu) {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowContextMenu(false);
        setMentionTriggerPos(null);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedContextIndex((prev) =>
          Math.min(prev + 1, filteredContexts.length - 1)
        );
        contextItemRefs.current[selectedContextIndex + 1]?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedContextIndex((prev) => Math.max(prev - 1, 0));
        contextItemRefs.current[selectedContextIndex - 1]?.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (filteredContexts[selectedContextIndex]) {
          handleContextSelect(filteredContexts[selectedContextIndex]);
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (filteredContexts[selectedContextIndex]) {
          handleContextSelect(filteredContexts[selectedContextIndex]);
        }
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

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isModelPopoverOpen && !showContextMenu) {
        setIsFocused(false);
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        if (!isModelPopoverOpen) {
          setIsFocused(false);
          setShowContextMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModelPopoverOpen]);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFocused) {
      setIsFocused(true);
      textAreaRef.current?.focus();
    }
  };

  const getContextIcon = (type: Context["type"]) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "video":
        return <Video className={iconClass} />;
      case "transcript":
        return <FileText className={iconClass} />;
      case "ai_generated":
        return <Sparkles className={iconClass} />;
      case "document":
        return <BookOpen className={iconClass} />;
      case "summary":
        return <Sparkles className={iconClass} />;
      case "file":
        return <FileText className={iconClass} />;
      case "image":
        return <Image className={iconClass} />;
      case "url":
        return <Link className={iconClass} />;
      default:
        return <File className={iconClass} />;
    }
  };

  const getContextColor = (type: Context["type"]) => {
    switch (type) {
      case "video":
        return "bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-800";
      case "transcript":
        return "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800";
      case "ai_generated":
        return "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800";
      case "document":
        return "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800";
      case "summary":
        return "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800";
      case "file":
        return "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800";
      case "image":
        return "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800";
      case "url":
        return "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800";
      default:
        return "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700";
    }
  };

  const getModelColorClass = (color?: string) => {
    switch (color) {
      case "emerald":
        return "bg-emerald-500";
      case "blue":
        return "bg-blue-500";
      case "purple":
        return "bg-purple-500";
      default:
        return "bg-emerald-500";
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRecordClick = () => {
    alert(
      isRTL
        ? "تسجيل الصوت غير مدعوم حاليا"
        : "Audio recording not supported yet"
    );
  };

  const handleTalkClick = () => {
    alert(
      isRTL
        ? "تحدث مع الذكاء الاصطناعي غير مدعوم حاليا"
        : "Talk to AI not supported yet"
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newContexts = [...selectedContexts];
    Array.from(files).forEach((file) => {
      newContexts.push({
        id: file.name + "-" + Date.now(),
        name: file.name,
        content: "",
        type: "file",
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    });
    setSelectedContexts(newContexts);
    onContextsChange?.(newContexts);
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

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;
    const newContexts = [...selectedContexts];
    Array.from(droppedFiles).forEach((file) => {
      newContexts.push({
        id: file.name + "-" + Date.now(),
        name: file.name,
        content: "",
        type: "file",
        size: (file.size / 1024).toFixed(2) + " KB",
      });
    });
    setSelectedContexts(newContexts);
    onContextsChange?.(newContexts);
  };

  return (
    <div
      className={`relative w-full mx-auto ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Context Mention Menu - Compact */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-in slide-in-from-bottom-2 fade-in-0 duration-200"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-xl  border border-zinc-200 dark:border-zinc-700 overflow-hidden max-w-md">
            <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <Search className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {isRTL ? "السياق" : "Context"}
                  {contextSearch && (
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">
                      : "{contextSearch}"
                    </span>
                  )}
                </span>
                <span className="ml-auto text-xs text-zinc-500">
                  {filteredContexts.length}
                </span>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredContexts.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">
                    {isRTL ? "لم يتم العثور على سياقات" : "No contexts found"}
                  </p>
                </div>
              ) : (
                <div className="p-1.5 space-y-0.5">
                  {filteredContexts.map((context, index) => (
                    <button
                      key={context.id}
                      ref={(el) => (contextItemRefs.current[index] = el)}
                      onClick={() => handleContextSelect(context)}
                      className={`w-full p-2 rounded-lg transition-all duration-150 text-left group ${
                        index === selectedContextIndex
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {context.thumbnail ? (
                          <div className="relative flex-shrink-0">
                            <img
                              src={context.thumbnail}
                              alt={context.name}
                              className="w-12 h-9 object-cover rounded"
                            />
                            {context.duration && (
                              <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 py-0 rounded">
                                {context.duration}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 ${getContextColor(
                              context.type
                            )}`}
                          >
                            <div className="w-3.5 h-3.5">
                              {getContextIcon(context.type)}
                            </div>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 text-xs">
                            {context.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 capitalize"
                            >
                              {context.type.replace("_", " ")}
                            </Badge>
                            {context.metadata?.author && (
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                                {context.metadata.author}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div
        ref={containerRef}
        className={`relative transition-all duration-300 ${
          isDragging ? "scale-[1.02]" : "scale-100"
        }`}
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
        />

        <div
          className={`
            relative rounded-3xl border-2 overflow-hidden
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
                <Paperclip className="w-12 h-12 mx-auto mb-2 text-blue-600 dark:text-blue-400 animate-bounce" />
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {isRTL ? "أسقط الملفات هنا" : "Drop files here"}
                </p>
              </div>
            </div>
          )}

          {/* Context Pills Above Input */}
          {selectedContexts.length > 0 && (
            <div className={`px-3 pt-3 pb-2`}>
              <div className="flex flex-wrap gap-2">
                {selectedContexts.map((context) => (
                  <Badge
                    key={context.id}
                    variant="secondary"
                    className={`
                      ${getContextColor(context.type)} 
                      px-2.5 py-1.5 text-xs font-medium rounded-lg border
                      transition-all duration-200 cursor-default
                      flex items-center gap-1.5 hover:scale-105
                    `}
                  >
                    <div className="w-3.5 h-3.5 flex-shrink-0">
                      {getContextIcon(context.type)}
                    </div>
                    <span className="max-w-[180px] truncate font-medium">
                      {context.name}
                    </span>
                    {context.duration && (
                      <span className="text-[10px] opacity-70 flex-shrink-0">
                        {context.duration}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeContext(context.id);
                      }}
                      className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0 ml-0.5"
                      aria-label={`${isRTL ? "إزالة" : "Remove"} ${
                        context.name
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="relative flex items-center min-h-[56px] px-3">
            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={actualPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`
                flex-1 text-base bg-transparent border-0 resize-none
                outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-transparent
                rounded-full
                ${isRTL ? "text-right pr-6 pl-16" : "text-left pl-4 pr-16"}
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                text-zinc-900 dark:text-zinc-100
                leading-relaxed transition-all duration-200
                py-4
              `}
              style={{
                minHeight: "56px",
                maxHeight: "160px",
                lineHeight: "1.6",
              }}
              rows={1}
            />

            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isRTL ? "left-4" : "right-4"
              }`}
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  submit();
                }}
                disabled={!value?.trim()}
                size="sm"
                className={`
                  size-9 rounded-xl font-medium
                                    transition-all duration-300 ease-out
                  ${
                    value?.trim()
                      ? "bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white hover:scale-110 active:scale-95  dark:shadow-zinc-950"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  }
                `}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {expandSection && (
            <div
              className={`
                overflow-hidden transition-all duration-500 ease-out
                ${
                  isExpanded || expandSection
                    ? "max-h-32 opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div
                ref={expandedContentRef}
                className={`
                  flex items-center justify-between px-4 py-3 border-t
                  border-zinc-200 dark:border-zinc-800
                  transition-all duration-300 ease-out
                  ${
                    isExpanded || expandSection
                      ? "transform translate-y-0"
                      : "transform -translate-y-2"
                  }
                  ${isRTL ? "flex-row-reverse" : "flex-row"}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                {!optionsToHide?.models && (
                  <div className="flex items-center gap-2">
                    <Popover
                      open={isModelPopoverOpen}
                      onOpenChange={setIsModelPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModelPopoverOpen(!isModelPopoverOpen);
                          }}
                          className="h-9 px-3 text-sm bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 font-medium border border-zinc-200 dark:border-zinc-700 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${getModelColorClass(
                                selectedModel.color
                              )}`}
                            />
                            <span>{selectedModel.name}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                                isModelPopoverOpen ? "rotate-180" : "rotate-0"
                              }`}
                            />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900  backdrop-blur-sm animate-in slide-in-from-bottom-2 fade-in-0 duration-300"
                        align={isRTL ? "end" : "start"}
                        side="top"
                        sideOffset={8}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        <div
                          className="space-y-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                            {isRTL ? "اختر النموذج" : "Select Model"}
                          </div>
                          {models.map((model) => {
                            const isActive = selectedModel.id === model.id;
                            return (
                              <button
                                key={model.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleModelSelect(model);
                                }}
                                className={`
                                  w-full p-3 text-sm rounded-lg font-medium text-left
                                  transition-all duration-200 ease-out
                                  hover:scale-[1.01] active:scale-[0.99]
                                  ${
                                    isActive
                                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 "
                                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                                  }
                                `}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="font-semibold">
                                        {model.name}
                                      </div>
                                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {model.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${getModelColorClass(
                                      model.color
                                    )}`}
                                  />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Auto Context Button */}
                    {hasAutoContext && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 rounded-xl text-blue-700 dark:text-blue-300 transition-all duration-200 font-medium border border-blue-200 dark:border-blue-800 hover:scale-[1.02] active:scale-[0.98]"
                        disabled={autoContextLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAutoContextClick?.();
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          {autoContextLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>{isRTL ? "سياق تلقائي" : "Auto context"}</span>
                          {autoContextCount > 0 && (
                            <Badge className="ml-1 h-5 px-1.5 text-[10px] bg-blue-600 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-700 text-white">
                              {autoContextCount}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    )}
                  </div>
                )}

                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "إرفاق ملف" : "Attach File"}
                    className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={handleAttachClick}
                  >
                    <Paperclip className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "تسجيل الصوت" : "Record Audio"}
                    className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={handleRecordClick}
                  >
                    <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "تحدث مع الذكاء" : "Talk to AI"}
                    className="rounded-full p-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={handleTalkClick}
                  >
                    <AudioWaveform className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
