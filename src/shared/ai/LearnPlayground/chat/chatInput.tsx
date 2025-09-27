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
  Sparkles,
  Zap,
  Brain,
  Paperclip,
  Mic,
  AudioWaveform,
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
  type: "file" | "text" | "url" | "image";
  size?: string;
  preview?: string;
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isModelPopoverOpen, setIsModelPopoverOpen] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<Context[]>(contexts);

  const activeModel = models.find((m) => m.isActive) ?? models[0];
  const [selectedModel, setSelectedModel] = useState<Model>(activeModel);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = i18n.dir() === "rtl";

  const defaultPlaceholder = isRTL
    ? "اسأل الذكاء الاصطناعي أي شيء..."
    : "Ask AI anything...";
  const actualPlaceholder = placeholder || defaultPlaceholder;

  // Fixed expansion logic
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

  const submit = () => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed, selectedModel, selectedContexts);
    setIsFocused(false);
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    if (e.key === "Escape") {
      textAreaRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Small delay to allow for clicking on buttons
    setTimeout(() => {
      if (!isModelPopoverOpen) {
        setIsFocused(false);
      }
    }, 150);
  };

  // Handle clicks outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!isModelPopoverOpen) {
          setIsFocused(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModelPopoverOpen]);

  // Handle container clicks to maintain focus
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFocused) {
      setIsFocused(true);
      textAreaRef.current?.focus();
    }
  };

  const getContextIcon = (type: Context["type"]) => {
    const iconClass = "w-3.5 h-3.5";
    switch (type) {
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

  // Drag and Drop support
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
      {/* Context Pills */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          selectedContexts.length > 0
            ? "max-h-48 opacity-100 mb-4"
            : "max-h-0 opacity-0 mb-0"
        } ${isRTL ? "mr-1" : "ml-1"}`}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedContexts.map((context, index) => (
            <Badge
              key={context.id}
              variant="secondary"
              className={`
                ${getContextColor(context.type)} 
                px-3 py-2 text-sm font-medium rounded-xl border
                transition-all duration-300 cursor-default backdrop-blur-sm
                transform translate-y-0 opacity-100
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-center gap-2">
                {getContextIcon(context.type)}
                <span className="max-w-32 truncate font-medium">
                  {context.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeContext(context.id);
                  }}
                  className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
                  aria-label={`${isRTL ? "إزالة" : "Remove"} ${context.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Input Container with drag & drop */}
      <div
        ref={containerRef}
        className={`relative ${isDragging ? "border-2 border-blue-400" : ""}`}
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
            relative rounded-3xl border overflow-hidden
            transition-all duration-300 ease-out
            ${
              isFocused
                ? "border-gray-300 dark:border-gray-500/50 shadow-sm shadow-gray-200/50 dark:shadow-gray-800/50"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md"
            }
            bg-white dark:bg-gray-900
          `}
        >
          {/* Input Area */}
          <div className="relative flex items-center min-h-[56px] px-3">
            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={actualPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`
                flex-1 text-base bg-transparent border-0 resize-none focus:outline-none 
                ${isRTL ? "text-right pr-6 pl-16" : "text-left pl-6 pr-16"}
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                text-gray-900 dark:text-gray-100
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
                  h-8 w-8 rounded-xl font-medium
                  transition-all duration-300 ease-out
                  ${
                    value?.trim()
                      ? "bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-700 text-white hover:scale-105 active:scale-95"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Expanded Section with buttons on right or left based on language */}
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
                flex items-center justify-between px-4 py-3 border-t rounded-3xl  
                  border-none
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
                {/* Left side: Model Selector */}
                <div className="flex items-center gap-3">
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
                        className="h-9 px-3 text-sm bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-700 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${getModelColorClass(
                              selectedModel.color
                            )}`}
                          />
                          <span>{selectedModel.name}</span>
                          <ChevronDown
                            className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                              isModelPopoverOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-80 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-xl backdrop-blur-sm animate-in slide-in-from-bottom-2 fade-in-0 duration-300"
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
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
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
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                              }
                            `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <div className="font-semibold">
                                      {model.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
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
                </div>

                {/* Right side: Action buttons according to LTR / RTL */}
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "إرفاق ملف" : "Attach File"}
                    className="rounded-full p-2"
                    onClick={handleAttachClick}
                  >
                    <Paperclip className="w-6 h-6 text-gray-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "تسجيل الصوت" : "Record Audio"}
                    className="rounded-full p-2"
                    onClick={handleRecordClick}
                  >
                    <Mic className="w-6 h-6 text-gray-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isRTL ? "تحدث مع الذكاء" : "Talk to AI"}
                    className="rounded-full p-2 bg-zinc-700"
                    onClick={handleTalkClick}
                  >
                    <AudioWaveform className="w-6 h-6 text-white" />
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
