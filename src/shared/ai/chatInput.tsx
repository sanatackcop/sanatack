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
  ChevronDown,
  File,
  X,
  Paperclip,
  FileText,
  Link,
  Image,
  Search,
} from "lucide-react";

export type Model = {
  id: string;
  name: string;
  isActive?: boolean;
  color?: string;
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
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "اكتب رسالتك هنا...",
  models = [
    {
      id: "gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      isActive: true,
      color: "emerald",
    },
    { id: "gpt-4o", name: "GPT-4o", color: "blue" },
    { id: "claude-3.5", name: "Claude 3.5 Sonnet", color: "purple" },
  ],
  onModelChange,
  contexts = [],
  onContextsChange,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isModelPopoverOpen, setIsModelPopoverOpen] = useState(false);
  const [isContextPopoverOpen, setIsContextPopoverOpen] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<Context[]>(contexts);
  const [contextSearch, setContextSearch] = useState("");

  const activeModel = models.find((m) => m.isActive) ?? models[0];
  const [selectedModel, setSelectedModel] = useState<Model>(activeModel);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea with smooth transitions
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    // Reset height to calculate scroll height
    textarea.style.height = "auto";

    // Calculate new height with limits
    const scrollHeight = textarea.scrollHeight;
    const minHeight = 56; // Single line height
    const maxHeight = 200; // Maximum height before scroll

    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Enable/disable scroll based on content
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  const submit = () => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed, selectedModel, selectedContexts);
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    onModelChange?.(model);
    setIsModelPopoverOpen(false);
    textAreaRef.current?.focus();
  };

  const handleContextToggle = (context: Context) => {
    const isSelected = selectedContexts.some((c) => c.id === context.id);
    let newContexts: Context[];

    if (isSelected) {
      newContexts = selectedContexts.filter((c) => c.id !== context.id);
    } else {
      newContexts = [...selectedContexts, context];
    }

    setSelectedContexts(newContexts);
    onContextsChange?.(newContexts);
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
  };

  const getContextIcon = (type: Context["type"]) => {
    switch (type) {
      case "file":
        return <FileText className="w-3 h-3" />;
      case "image":
        return <Image className="w-3 h-3" />;
      case "url":
        return <Link className="w-3 h-3" />;
      default:
        return <File className="w-3 h-3" />;
    }
  };

  const getContextColor = (type: Context["type"]) => {
    switch (type) {
      case "file":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "image":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
      case "url":
        return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Sample contexts with better data structure
  const availableContexts: Context[] = [
    {
      id: "1",
      name: "تقرير المشروع Q4",
      content: "تقرير ربعي شامل...",
      type: "file",
      size: "2.4 MB",
      preview: "تحليل الأداء المالي والتشغيلي للربع الأخير...",
    },
    {
      id: "2",
      name: "دليل واجهة المستخدم",
      content: "دليل التصميم...",
      type: "file",
      size: "856 KB",
      preview: "إرشادات التصميم والألوان والخطوط...",
    },
    {
      id: "3",
      name: "صورة النموذج الأولي",
      content: "نموذج التصميم",
      type: "image",
      size: "1.2 MB",
      preview: "صورة توضيحية للتصميم المقترح",
    },
    {
      id: "4",
      name: "وثائق API",
      content: "https://api.example.com/docs",
      type: "url",
      preview: "دليل مطور واجهة البرمجة الكامل",
    },
  ];

  const filteredContexts = availableContexts.filter(
    (context) =>
      context.name.toLowerCase().includes(contextSearch.toLowerCase()) ||
      context.preview?.toLowerCase().includes(contextSearch.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative group mx-auto ${className}`}>
      {/* Context Pills - More modern design */}
      {selectedContexts.length > 0 && (
        <div className="mb-3" dir="rtl">
          <div className="flex flex-wrap gap-2">
            {selectedContexts.map((context) => (
              <Badge
                key={context.id}
                variant="secondary"
                className={`${getContextColor(
                  context.type
                )} pl-2 pr-3 py-1.5 text-xs font-medium rounded-lg border transition-all hover:shadow-sm`}
              >
                <div className="flex items-center gap-1.5">
                  {getContextIcon(context.type)}
                  <span className="max-w-32 truncate">{context.name}</span>
                  <button
                    onClick={() => removeContext(context.id)}
                    className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 transition-colors"
                    aria-label={`إزالة ${context.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative">
        <div
          className={`relative rounded-2xl border transition-all duration-200 ${
            isFocused
              ? "border-gray-300 dark:border-gray-600 shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/20"
              : "border-gray-200 dark:border-gray-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-700"
          } bg-white dark:bg-gray-900`}
        >
          {/* Textarea */}
          <textarea
            ref={textAreaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                  setIsFocused(false);
                }
              }, 100);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            dir="rtl"
            className="w-full px-4 pr-4 pl-20 py-3 text-base bg-transparent border-0 resize-none focus:outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500 transition-all duration-200"
            style={{ minHeight: "56px", maxHeight: "200px" }}
            rows={1}
          />

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-800">
            {/* Left side - Context and Model selectors */}
            <div className="flex items-center gap-2">
              {/* Context Selector */}
              <Popover
                open={isContextPopoverOpen}
                onOpenChange={setIsContextPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Paperclip className="w-4 h-4 ml-1" />
                    <span>سياق</span>
                    {selectedContexts.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="mr-1 h-5 min-w-5 px-1.5 text-xs"
                      >
                        {selectedContexts.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0"
                  align="start"
                  side="bottom"
                  sideOffset={8}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="البحث في السياق..."
                        value={contextSearch}
                        onChange={(e) => setContextSearch(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-0 focus:outline-none placeholder:text-gray-400"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredContexts.map((context) => {
                        const isSelected = selectedContexts.some(
                          (c) => c.id === context.id
                        );
                        return (
                          <button
                            key={context.id}
                            onClick={() => handleContextToggle(context)}
                            className={`w-full p-3 text-right rounded-lg border transition-all hover:shadow-sm ${
                              isSelected
                                ? getContextColor(context.type)
                                : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                            }`}
                            dir="rtl"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                {getContextIcon(context.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-medium truncate">
                                    {context.name}
                                  </h4>
                                  {context.size && (
                                    <span className="text-xs text-gray-500">
                                      {context.size}
                                    </span>
                                  )}
                                </div>
                                {context.preview && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 text-right truncate">
                                    {context.preview}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Model Selector */}
              <Popover
                open={isModelPopoverOpen}
                onOpenChange={setIsModelPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div
                      className={`w-2 h-2 rounded-full bg-${
                        selectedModel.color || "emerald"
                      }-500 ml-1`}
                    />
                    <span>{selectedModel.name}</span>
                    <ChevronDown className="w-3 h-3 mr-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-2"
                  align="start"
                  side="bottom"
                  sideOffset={8}
                >
                  <div className="space-y-1">
                    {models.map((model) => {
                      const isActive = selectedModel.id === model.id;
                      return (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model)}
                          className={`w-full text-right p-2 text-sm rounded flex items-center justify-between transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            isActive ? "bg-gray-100 dark:bg-gray-800" : ""
                          }`}
                          dir="rtl"
                        >
                          <span>{model.name}</span>
                          <div
                            className={`w-2 h-2 rounded-full bg-${
                              model.color || "emerald"
                            }-500`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Send button with black styling */}
            <Button
              onClick={submit}
              disabled={!value?.trim()}
              size="sm"
              className={`h-8 w-8 rounded-lg transition-all ${
                value?.trim()
                  ? "bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-900 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
