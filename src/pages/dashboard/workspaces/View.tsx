import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  MessageCircle,
  Loader2,
  BrainCog,
  Scan,
  TestTube2,
  GalleryVerticalEnd,
  Mic,
  Library,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  getWorkSpace,
  getWorkSpaceChatHistory,
  sendWorkspaceChatMessage,
  getWorkspaceContexts,
  generateWorkspaceAutoContext,
} from "@/utils/_apis/learnPlayground-api";
import { useParams } from "react-router-dom";
import FlashCards from "../../../lib/flashcards/FlashCards";
import Tooltip from "@mui/material/Tooltip";
import ChatInput, {
  Context as ChatContext,
  Model as ChatModel,
} from "@/lib/chat/chatInput";
import ChatMessages from "@/lib/chat/ChatMessage";
import { initialState } from "@/lib/consts";
import DeepExplanation from "@/lib/explantion/DeepExplnation";
import PdfReader from "@/lib/PdfReader";
import { QuizList } from "@/lib/quizzes/Quiz";
import { SummaryList } from "@/lib/summary/Summary";
import { NoteList } from "@/lib/note/Note";
import {
  ChatMessage,
  TabKey,
  Workspace,
  WorkspaceContext,
  WorkspaceContextInput,
} from "@/lib/types";
import YouTubeReader from "@/lib/YoutubeReader";
import {
  ChatSkeleton,
  ContentSkeleton,
  reducer,
  getRateLimitToastMessage,
  isRateLimitError,
} from "../utils";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePageTitle } from "@/context/PageTitleContext";
import clsx from "clsx";

const TABS_CONFIG = [
  { id: "chat", labelKey: "tabs.chat", icon: MessageCircle, isSoon: false },
  {
    id: "flashcards",
    labelKey: "tabs.flashcards",
    icon: GalleryVerticalEnd,
    isSoon: false,
  },
  { id: "quizzes", labelKey: "tabs.quizzes", icon: TestTube2, isSoon: false },
  { id: "summary", labelKey: "tabs.summary", icon: BookOpen, isSoon: false },
  {
    id: "deepExplanation",
    labelKey: "tabs.deepExplanation",
    icon: BrainCog,
    isSoon: false,
  },
  { id: "notes", labelKey: "tabs.notes", icon: StickyNote, isSoon: false },
] as const;

const LearnPlayground: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | undefined>();
  const [fullScreen, setFullScreen] = useState(false);
  const [workspaceContexts, setWorkspaceContexts] = useState<
    WorkspaceContext[]
  >([]);
  const [selectedContexts, setSelectedContexts] = useState<ChatContext[]>([]);
  const [autoContextEnabled, setAutoContextEnabled] = useState(false);
  const [autoContextLoading, setAutoContextLoading] = useState(false);
  const [appliedContextIds, setAppliedContextIds] = useState<string[]>([]);
  const { setTitleContent, setTitle } = usePageTitle();

  // Responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileContent, setShowMobileContent] = useState(true);

  const hasContent = state.type === "document" || state.type === "video";

  const isRTL = i18n.dir() === "rtl";
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleTabCount, setVisibleTabCount] = useState<number>(TABS_CONFIG.length);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);

  const getDisplayTitle = useCallback(() => {
    return (
      state.workspace?.workspaceName ||
      state.workspace?.title ||
      state.title ||
      "Untitled Workspace"
    );
  }, [state.workspace, state.title]);

  useEffect(() => {
    setTitle(getDisplayTitle());
    return () => setTitle("");
  }, [getDisplayTitle, setTitle]);

  const handleToggleFullScreen = useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const calculateVisibleTabs = useCallback(() => {
    const container = tabsContainerRef.current;
    const measureContainer = measureContainerRef.current;
    if (!container || !measureContainer) return;

    const buttons = measureContainer.querySelectorAll('button');
    if (buttons.length === 0) return;

    const widths: number[] = [];
    buttons.forEach((btn) => {
      widths.push(btn.getBoundingClientRect().width);
    });

    const containerWidth = container.getBoundingClientRect().width;
    const overflowButtonWidth = 40;
    const gap = 6;
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < widths.length; i++) {
      const tabWidth = widths[i] + gap;
      const needsOverflow = i < widths.length - 1;
      const availableWidth = needsOverflow 
        ? containerWidth - overflowButtonWidth - gap 
        : containerWidth;
      
      if (totalWidth + tabWidth <= availableWidth) {
        totalWidth += tabWidth;
        count++;
      } else {
        break;
      }
    }

    setVisibleTabCount((prev) => {
      const newCount = Math.max(1, count);
      return prev !== newCount ? newCount : prev;
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(calculateVisibleTabs, 50);
    return () => clearTimeout(timeoutId);
  }, [calculateVisibleTabs]);

  useLayoutEffect(() => {
    calculateVisibleTabs();
    
    let rafId: number;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(calculateVisibleTabs);
    });
    
    if (tabsContainerRef.current) {
      resizeObserver.observe(tabsContainerRef.current);
    }
    
    window.addEventListener('resize', calculateVisibleTabs);
    
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', calculateVisibleTabs);
    };
  }, [calculateVisibleTabs]);

  const visibleTabs = useMemo(
    () => TABS_CONFIG.slice(0, visibleTabCount),
    [visibleTabCount]
  );
  const hiddenTabs = useMemo(
    () => TABS_CONFIG.slice(visibleTabCount),
    [visibleTabCount]
  );

  const headerContent = useMemo(() => {
    return (
      <div className="flex items-center justify-end w-full gap-1 sm:gap-2 min-w-0">
        {/* Hidden container for measuring all tab widths */}
        <div
          ref={measureContainerRef}
          style={{
            position: 'fixed',
            visibility: 'hidden',
            pointerEvents: 'none',
            top: -9999,
            left: -9999,
          }}
          aria-hidden="true"
        >
          <div className="inline-flex h-8 sm:h-9 items-center gap-1 sm:gap-1.5 p-0">
            {TABS_CONFIG.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className="inline-flex items-center justify-center rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 gap-1 sm:gap-2 border"
                >
                  <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">
                    {t(tab.labelKey as any)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={tabsContainerRef}
          className="flex-1 min-w-0 overflow-hidden flex justify-start sm:justify-end"
        >
          <Tabs
            value={state.tab}
            onValueChange={(v) =>
              dispatch({ type: "SET_TAB", tab: v as TabKey })
            }
          >
            <TabsList
              className={clsx(
                "inline-flex h-8 sm:h-9 items-center gap-1 sm:gap-1.5 rounded-none bg-transparent border-none p-0",
                isRTL ? "flex-row-reverse" : ""
              )}
            >
              {visibleTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = state.tab === tab.id;

                const trigger = (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={tab.isSoon}
                    className={clsx(
                      "inline-flex items-center justify-center rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex-shrink-0",
                      "h-8 sm:h-9 px-2 sm:px-3 gap-1 sm:gap-2",
                      isActive
                        ? "bg-[#179E7E] !text-white border-2 border-[#58CC02] shadow-sm dark:!text-white"
                        : "dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700",
                      "hover:bg-zinc-50 dark:hover:bg-zinc-750 hover:!text-black",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden md:inline whitespace-nowrap">
                      {t(tab.labelKey as any)}
                    </span>
                  </TabsTrigger>
                );

                if (!tab.isSoon) return trigger;

                return (
                  <Tooltip
                    key={tab.id}
                    title={t("workspace.comingSoon", "Coming soon")}
                  >
                    <span>{trigger}</span>
                  </Tooltip>
                );
              })}

              {hiddenTabs.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={clsx(
                        "h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border flex-shrink-0",
                        hiddenTabs.some((tab) => state.tab === tab.id)
                          ? "bg-[#179E7E] !text-white border-[#58CC02]"
                          : "dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[160px] z-50">
                    {hiddenTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = state.tab === tab.id;
                      return (
                        <DropdownMenuItem
                          key={tab.id}
                          disabled={tab.isSoon}
                          onClick={() =>
                            dispatch({ type: "SET_TAB", tab: tab.id as TabKey })
                          }
                          className={clsx(
                            "flex items-center gap-2 cursor-pointer",
                            isActive && "bg-[#179E7E]/10 text-[#179E7E]"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{t(tab.labelKey as any)}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TabsList>
          </Tabs>
        </div>

        {!isMobile && !isTablet && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Tooltip title={t("workspace.fullScreen", "Full Screen")}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFullScreen}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750"
              >
                <Scan className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-600 dark:text-zinc-300" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }, [state.tab, t, handleToggleFullScreen, isMobile, isTablet, visibleTabs, hiddenTabs, isRTL]);

  useEffect(() => {
    setTitleContent(headerContent);
    return () => setTitleContent(null);
  }, [headerContent, setTitleContent]);

  // Responsive detection
  useEffect(() => {
    handleAutoContext();
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const autoContextCount = useMemo(() => {
    if (!workspaceContexts.length) return 0;
    const autoGenerated = workspaceContexts.filter(
      (ctx) => ctx.isAutoGenerated,
    );
    return autoGenerated.length > 0
      ? autoGenerated.length
      : workspaceContexts.length;
  }, [workspaceContexts]);

  const mapContextType = useCallback((type?: string): ChatContext["type"] => {
    switch (type) {
      case "video":
        return "video";
      case "transcript":
        return "transcript";
      case "document":
        return "document";
      case "summary":
      case "ai_generated":
        return "summary";
      case "note":
      case "text":
        return "text";
      default:
        return "text";
    }
  }, []);

  const mapWorkspaceContextsToChat = useCallback(
    (contexts: WorkspaceContext[] = []): ChatContext[] =>
      contexts.map((context) => {
        const content = context.content ?? "";
        const rawTitle =
          (context.title ?? "").trim() ||
          (context.metadata?.title as string | undefined)?.trim() ||
          (context.metadata?.fileName as string | undefined)?.trim() ||
          (context.source ?? "").trim();
        const name =
          rawTitle && rawTitle.length > 0
            ? rawTitle
            : `Context ${(context.id || "").slice(0, 6) || ""}`;
        return {
          id: context.id,
          name,
          content,
          type: mapContextType(context.type),
          preview: content.length > 160 ? `${content.slice(0, 160)}…` : content,
          metadata: {
            ...context.metadata,
            source: context.source,
            isAutoGenerated: context.isAutoGenerated,
            workspaceContextId: context.id,
            scope: "workspace",
          },
        };
      }),
    [mapContextType],
  );

  const mapChatContextsToPayload = useCallback(
    (contexts: ChatContext[]): WorkspaceContextInput[] =>
      contexts
        .filter((ctx) => !(ctx.metadata?.fileId || ctx.file))
        .map((ctx) => ({
          id: ctx.id,
          title: ctx.name,
          content: ctx.content,
          type: ctx.type,
          source: ctx.metadata?.source,
          metadata: ctx.metadata,
        })),
    [],
  );

  const getContextKey = useCallback((ctx: ChatContext): string => {
    return (
      ctx.id ||
      (ctx.metadata?.workspaceContextId as string | undefined) ||
      (ctx.metadata?.mentionToken as string | undefined) ||
      (ctx.metadata?.fileId as string | undefined) ||
      ctx.name
    );
  }, []);

  const availableContexts = useMemo(
    () => mapWorkspaceContextsToChat(workspaceContexts),
    [mapWorkspaceContextsToChat, workspaceContexts],
  );

  const handleContextsChange = useCallback(
    (contexts: ChatContext[]) => {
      setSelectedContexts(contexts);
      setAutoContextEnabled(false);
      const keys = contexts.map(getContextKey);
      setAppliedContextIds(keys);
    },
    [getContextKey],
  );

  useEffect(() => {
    if (!selectedContexts.length && autoContextEnabled) {
      setAutoContextEnabled(false);
    }
  }, [selectedContexts, autoContextEnabled]);

  useEffect(() => {
    setSelectedContexts((current) => {
      if (!current.length) return current;

      const attachmentContexts = current.filter(
        (ctx) => ctx.metadata?.fileId || ctx.file instanceof File,
      );

      const selectedIds = new Set(
        current
          .filter((ctx) => ctx.metadata?.workspaceContextId)
          .map((ctx) => ctx.metadata?.workspaceContextId as string),
      );

      const updatedContexts = availableContexts.filter((ctx) =>
        ctx.metadata?.workspaceContextId
          ? selectedIds.has(ctx.metadata.workspaceContextId as string)
          : false,
      );

      if (
        updatedContexts.length ===
          current.filter((ctx) => !ctx.metadata?.fileId && !ctx.file).length &&
        attachmentContexts.length ===
          current.filter((ctx) => ctx.metadata?.fileId || ctx.file).length
      ) {
        return current;
      }

      return [...updatedContexts, ...attachmentContexts];
    });
  }, [availableContexts]);

  const extractVideoId = useCallback((url: string): string | null => {
    if (url.includes("youtu.be/")) {
      return url.split("/").pop()?.split("?")[0] || null;
    }
    return url.split("v=")[1]?.split("&")[0] || null;
  }, []);

  const fetchWorkspace = useCallback(async () => {
    if (!id) {
      setWorkspaceLoading(false);
      return;
    }

    try {
      setWorkspaceLoading(true);
      setContentLoading(true);

      const [response, history] = await Promise.all([
        getWorkSpace(id),
        getWorkSpaceChatHistory(id),
      ]);

      const workspaceData = response.workspace;
      workspaceData.chatMessages = history;

      let contextsList = (workspaceData.contexts as WorkspaceContext[]) ?? [];

      if (!contextsList.length) {
        try {
          contextsList = await getWorkspaceContexts(id);
        } catch (contextError) {
          console.error("Failed to load workspace contexts:", contextError);
        }
      }

      workspaceData.contexts = contextsList;
      setWorkspaceContexts(contextsList);

      dispatch({ type: "SET_WORKSPACE", workspace: workspaceData });
      setWorkspace(workspaceData);

      const videoUrl = workspaceData.video?.url;
      const documentUrl = workspaceData.document?.url;

      if (videoUrl) {
        setFullScreen(false);
        dispatch({ type: "SET_WORKSPACE_TYPE", workspaceType: "video" });
        dispatch({ type: "SET_SRC", src: videoUrl });

        const videoId = extractVideoId(videoUrl);
        if (videoId) {
          dispatch({ type: "SET_YOUTUBE_VIDEO", videoId });
        }
        if (workspaceData.video?.transcript) {
          dispatch({
            type: "SET_TRANSCRIPT",
            transcript: workspaceData.video.transcript,
          });
        }
      } else if (documentUrl) {
        setFullScreen(false);
        dispatch({ type: "SET_WORKSPACE_TYPE", workspaceType: "document" });
        dispatch({ type: "SET_SRC", src: documentUrl });
      } else {
        workspaceData.type = "chat";
        dispatch({ type: "SET_WORKSPACE_TYPE", workspaceType: "chat" });
        dispatch({ type: "SET_SRC", src: "" });
        setFullScreen(true);
        setContentLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch workspace:", error);
      dispatch({
        type: "SET_STATUS",
        status: { kind: "error", message: "Failed to load workspace" },
      });
    } finally {
      setWorkspaceLoading(false);
      setTimeout(() => setContentLoading(false), 1000);
    }
  }, [id, extractVideoId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleAutoContext = useCallback(async () => {
    if (!id) return;
    try {
      setAutoContextLoading(true);
      const contexts = await generateWorkspaceAutoContext(id, true);
      setWorkspaceContexts(contexts);
      setWorkspace((prev) =>
        prev ? { ...prev, contexts: contexts ?? [] } : prev,
      );
      setSelectedContexts(mapWorkspaceContextsToChat(contexts));
      const keys = contexts
        .map((ctx) => ctx.id)
        .filter((value): value is string => Boolean(value));
      setAppliedContextIds(keys);
      setAutoContextEnabled(contexts.length > 0);

      if (contexts.length < 0) {
        toast.info(
          t(
            "chat.auto_context_empty",
            "No context was generated for this workspace yet.",
          ),
        );
      }
    } catch (error) {
      console.error("Failed to generate auto context:", error);
      setAutoContextEnabled(false);
      setAppliedContextIds([]);
      if (isRateLimitError(error)) {
        toast.error(getRateLimitToastMessage(isRTL));
      } else {
        toast.error(
          t(
            "chat.auto_context_failed",
            "Unable to generate context for this workspace.",
          ),
        );
      }
    } finally {
      setAutoContextLoading(false);
    }
  }, [id, mapWorkspaceContextsToChat, t, isRTL]);

  const handleSendMessage = useCallback(
    async (
      message: string,
      model?: ChatModel,
      contextsOverride?: ChatContext[],
    ) => {
      if (!message.trim() || !id) return;

      const streamAssistantMessage = (
        content: string,
        metadata?: Record<string, any>,
      ) => {
        dispatch({ type: "START_STREAMING_MESSAGE" });

        if (!content) {
          dispatch({
            type: "COMPLETE_STREAMING_MESSAGE",
            content: "",
            metadata,
          });
          return;
        }

        const chunkSize = 40;
        const intervalMs = 1;
        let index = 0;

        const intervalId = setInterval(() => {
          const nextChunk = content.slice(index, index + chunkSize);
          dispatch({ type: "ADD_STREAMING_CHUNK", chunk: nextChunk });
          index += chunkSize;

          if (index >= content.length) {
            clearInterval(intervalId);
            dispatch({
              type: "COMPLETE_STREAMING_MESSAGE",
              content,
              metadata,
            });
          }
        }, intervalMs);
      };

      const contextsToSend =
        contextsOverride && contextsOverride.length
          ? contextsOverride
          : selectedContexts;

      const attachmentContexts = contextsToSend.filter(
        (ctx) => ctx.metadata?.fileId && ctx.file instanceof File,
      );

      const attachmentFiles = attachmentContexts
        .map((ctx) => ctx.file)
        .filter((file): file is File => file instanceof File);

      const userAttachmentMetadata = attachmentContexts.map((ctx) => ({
        id:
          ctx.metadata?.fileId ??
          ctx.id ??
          `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        filename: ctx.name,
        mimetype: ctx.file?.type,
        size: ctx.file?.size,
        type: ctx.type === "image" ? "image" : "text",
        status: "uploading",
      }));

      const contextPayload = mapChatContextsToPayload(contextsToSend);

      const userMessage: any = {
        id: Date.now().toString(),
        type: "user",
        role: "user",
        content: message.trim(),
        timestamp: new Date(),
        metadata:
          userAttachmentMetadata.length > 0
            ? { attachments: userAttachmentMetadata }
            : undefined,
      };

      dispatch({ type: "ADD_CHAT_MESSAGE", message: userMessage });
      dispatch({ type: "SET_CHAT_LOADING", loading: true });

      try {
        const res = await sendWorkspaceChatMessage(
          id,
          message.trim(),
          i18n.language as "en" | "ar",
          {
            model: model?.id,
            contexts: contextPayload,
            autoContext: autoContextEnabled,
            attachments: attachmentFiles,
          },
        );

        // If backend returns attachments in metadata, mark them uploaded
        if (Array.isArray(res.metadata?.attachments)) {
          const uploadedAttachments = res.metadata.attachments.map(
            (attachment: any) => ({
              ...attachment,
              status: "uploaded",
            }),
          );
          dispatch({
            type: "UPDATE_MESSAGE_ATTACHMENTS",
            messageId: userMessage.id,
            attachments: uploadedAttachments,
          });
        }

        // Apply contextsApplied logic (same as before)
        if (Array.isArray(res.metadata?.contextsApplied)) {
          const applied = (res.metadata.contextsApplied as any[])
            .map((item) => {
              if (typeof item === "string") return item;
              if (item && typeof item === "object") {
                return (
                  (item.id as string | undefined) ||
                  (item.title as string | undefined) ||
                  ""
                );
              }
              return "";
            })
            .filter((value): value is string => Boolean(value));

          setAppliedContextIds(applied.length ? applied : []);

          const hasWorkspaceApplied = (
            res.metadata.contextsApplied as any[]
          ).some(
            (item) =>
              item && typeof item === "object" && item.scope === "workspace",
          );
          setAutoContextEnabled(hasWorkspaceApplied);
        }

        // Error returned as metadata (if your backend does that)
        if (res.metadata?.error) {
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: res.metadata.error,
            created_at: new Date(),
            metadata: { error: res.metadata.error },
          };
          dispatch({ type: "ADD_CHAT_MESSAGE", message: errorMessage });
          dispatch({ type: "SET_CHAT_LOADING", loading: false });
          return;
        }

        streamAssistantMessage(res.message || "", res.metadata);
      } catch (error) {
        console.error("Failed to send message:", error);

        if (userAttachmentMetadata.length > 0) {
          const failedAttachments = userAttachmentMetadata.map(
            (attachment) => ({
              ...attachment,
              status: "failed",
            }),
          );
          dispatch({
            type: "UPDATE_MESSAGE_ATTACHMENTS",
            messageId: userMessage.id,
            attachments: failedAttachments,
          });
        }

        const hitLimit = isRateLimitError(error);
        const failureMessage = hitLimit
          ? getRateLimitToastMessage(isRTL)
          : t(
              "chat.error_occurred",
              "An error occurred while sending your message.",
            );

        if (hitLimit) toast.error(failureMessage);

        const errorMessage: any = {
          id: Date.now().toString(),
          type: "assistant",
          role: "assistant",
          content: failureMessage,
          timestamp: new Date(),
          metadata: { error: failureMessage },
        };

        dispatch({ type: "ADD_CHAT_MESSAGE", message: errorMessage });
        dispatch({ type: "SET_CHAT_LOADING", loading: false });
        setAppliedContextIds([]);
      }
    },
    [
      id,
      i18n.language,
      mapChatContextsToPayload,
      selectedContexts,
      t,
      autoContextEnabled,
      isRTL,
    ],
  );

  const handleQuickSend = useCallback(
    (message: string) =>
      handleSendMessage(message, undefined, selectedContexts),
    [handleSendMessage, selectedContexts],
  );

  const renderContent = () => {
    if (contentLoading) {
      return <ContentSkeleton />;
    }

    if (state.type === "document") {
      return (
        <PdfReader
          src={state.src || ""}
          page={state.page}
          zoom={state.zoom}
          status={state.status}
          onLoaded={(pageCount) => {
            dispatch({ type: "SET_PAGE_COUNT", pageCount });
            dispatch({ type: "SET_STATUS", status: { kind: "idle" } });
            setContentLoading(false);
          }}
          onError={(message) => {
            dispatch({
              type: "SET_STATUS",
              status: { kind: "error", message },
            });
            setContentLoading(false);
          }}
          onGoto={(p) => dispatch({ type: "SET_PAGE", page: p })}
          onZoomIn={() => dispatch({ type: "ZOOM_IN" })}
          onZoomOut={() => dispatch({ type: "ZOOM_OUT" })}
          onResetZoom={() => dispatch({ type: "RESET_ZOOM" })}
          onTextSelect={(text) => dispatch({ type: "SET_SELECTED_TEXT", text })}
          onAddToChat={(text) => dispatch({ type: "ADD_TO_CHAT", text })}
          pageCount={state.pageCount}
        />
      );
    }

    if (state.type === "video") {
      return (
        <YouTubeReader
          videoId={state.youtubeVideoId || ""}
          transcript={state.workspace?.video?.transcript?.data as any}
          onVideoSelect={(videoId) =>
            dispatch({ type: "SET_YOUTUBE_VIDEO", videoId })
          }
          onTimeUpdate={(currentTime, duration) =>
            dispatch({ type: "SET_YOUTUBE_TIME", currentTime, duration })
          }
          onPlay={() =>
            dispatch({ type: "SET_YOUTUBE_PLAYING", isPlaying: true })
          }
          onPause={() =>
            dispatch({ type: "SET_YOUTUBE_PLAYING", isPlaying: false })
          }
          onReady={() => setContentLoading(false)}
          onTranscriptLoad={(transcript) =>
            dispatch({ type: "SET_TRANSCRIPT", transcript })
          }
        />
      );
    }

    return null;
  };

  const renderTabsContent = () => {
    return (
      <div className="h-full flex flex-col">
        <Tabs
          value={state.tab}
          onValueChange={(v) => dispatch({ type: "SET_TAB", tab: v as TabKey })}
          className="h-full flex flex-col"
        >
          {state.tab === "chat" && (
            <TabsContent
              value="chat"
              className="flex-1 m-0 flex flex-col h-full"
            >
              {state.isLoading ? (
                <div className="p-3 sm:p-4 md:p-6">
                  <ChatSkeleton />
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full">
                  <ScrollArea className="flex-1">
                    <div
                      className={clsx(
                        "mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8",
                        fullScreen || isMobile || isTablet ? "max-w-full lg:px-8" : "max-w-4xl"
                      )}
                    >
                      <ChatMessages
                        messages={state.chatMessages || []}
                        isLoading={state.chatLoading}
                        streamingMessage={state.streamingMessage}
                        onSendMessage={handleQuickSend}
                      />
                    </div>
                  </ScrollArea>
                  <div>
                    <div
                      className={clsx(
                        "mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4",
                        fullScreen || isMobile || isTablet ? "max-w-full lg:px-8" : "max-w-4xl"
                      )}
                    >
                      <ChatInput
                        className="w-full"
                        value={state.prompt}
                        isSending={state.chatLoading}
                        hasAutoContext={false}
                        expandSection={!isMobile}
                        contexts={selectedContexts}
                        availableContexts={availableContexts}
                        autoContextCount={autoContextCount}
                        autoContextLoading={autoContextLoading}
                        onChange={(value: string) =>
                          dispatch({
                            type: "SET_PROMPT",
                            prompt: value,
                          })
                        }
                        onSubmit={(value, model, contexts) =>
                          handleSendMessage(value, model, contexts)
                        }
                        onContextsChange={handleContextsChange}
                        appliedContextIds={appliedContextIds}
                        placeholder={t("aiActions.chatPlaceholder")}
                        optionsToHide={{
                          models: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          )}

          {/* Flashcards Tab */}
          {state.tab === "flashcards" && workspace && (
            <TabsContent value="flashcards" className="flex-1 m-0 h-full">
              <FlashCards workspaceId={workspace.id} />
            </TabsContent>
          )}

          {/* Quizzes Tab */}
          {state.tab === "quizzes" && (
            <TabsContent value="quizzes" className="flex-1 m-0 h-full">
              <QuizList workspaceId={(workspace && workspace.id) || ""} />
            </TabsContent>
          )}

          {/* Summary Tab */}
          {state.tab === "summary" && (
            <TabsContent value="summary" className="flex-1 m-0 h-full">
              <ScrollArea className="h-full">
                <SummaryList
                  workspaceId={String(workspace && workspace.id) || ""}
                />
              </ScrollArea>
            </TabsContent>
          )}

          {/* Deep Explanation Tab */}
          {state.tab === "deepExplanation" && (
            <TabsContent value="deepExplanation" className="flex-1 m-0 h-full">
              <ScrollArea className="h-full">
                <DeepExplanation
                  workspaceId={(workspace && workspace.id) || ""}
                />
              </ScrollArea>
            </TabsContent>
          )}
          {/* Notes Tab */}
          {state.tab === "notes" && (
            <TabsContent value="notes" className="flex-1 m-0 h-full">
              <ScrollArea className="h-full">
                <NoteList
                  workspaceId={String(workspace && workspace.id) || ""}
                />
              </ScrollArea>
            </TabsContent>
          )}
          {/* Podcasts Tab */}
          {state.tab === "podcasts" && (
            <TabsContent
              value="podcasts"
              className="flex-1 m-0 h-full flex items-center justify-center"
            >
              <div className="text-center p-4 sm:p-6">
                <Mic className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 mx-auto mb-3 sm:mb-4 text-zinc-400 dark:text-zinc-500" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 text-zinc-900 dark:text-zinc-100">
                  {t("workspace.podcastsComingSoon", "Podcasts Coming Soon")}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  {t("workspace.featureInDevelopment", "This feature is under development")}
                </p>
              </div>
            </TabsContent>
          )}

          {/* Sources Tab */}
          {state.tab === "sources" && (
            <TabsContent value="sources" className="flex-1 m-0 h-full">
              <ScrollArea className="h-full">
                <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4 md:mb-6">
                    {t("workspace.sources", "Sources")}
                  </h2>
                  <div className="grid gap-2 sm:gap-3 md:gap-4">
                    {workspaceContexts.length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <Library className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-zinc-400 dark:text-zinc-500" />
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                          {t("workspace.noSources", "No sources available")}
                        </p>
                      </div>
                    ) : (
                      workspaceContexts.map((context) => (
                        <div
                          key={context.id}
                          className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                        >
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base">
                            {context.title || t("workspace.untitledSource", "Untitled Source")}
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-3">
                            {context.content?.slice(0, 200)}
                            {(context.content?.length || 0) > 200 && "..."}
                          </p>
                          {context.type && (
                            <span className="inline-block mt-1.5 sm:mt-2 px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {context.type}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  };

  if (workspaceLoading) {
    return (
      <section
        className="h-[calc(100vh-3rem)] flex items-center justify-center px-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-zinc-600 dark:text-zinc-400" />
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 text-center">
            {t("loading.workspace", "Loading workspace...")}
          </p>
        </div>
      </section>
    );
  }

  if (fullScreen && !isMobile && !isTablet) {
    return (
      <section
        className="h-[calc(93vh)] min-h-0 min-w-0 overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full min-h-0 min-w-0 overflow-hidden"
        >
          {renderTabsContent()}
        </motion.div>
      </section>
    );
  }

  if (isMobile || isTablet) {
    if (!hasContent) {
      return (
        <section
          className="h-[calc(93vh)] min-h-0 min-w-0 overflow-hidden"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full min-h-0 min-w-0 overflow-hidden"
          >
            {renderTabsContent()}
          </motion.div>
        </section>
      );
    }

    return (
      <section
        className="h-[calc(93vh)] min-h-0 min-w-0 flex flex-col overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <Button
            variant={showMobileContent ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMobileContent(true)}
            className={clsx(
              "flex-1 h-8 sm:h-9 text-sm",
              showMobileContent
                ? "bg-[#179E7E] text-white hover:bg-[#15896d]"
                : "dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
            )}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("workspace.content", "Content")}
          </Button>
          <Button
            variant={!showMobileContent ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMobileContent(false)}
            className={clsx(
              "flex-1 h-8 sm:h-9 text-sm",
              !showMobileContent
                ? "bg-[#179E7E] text-white hover:bg-[#15896d]"
                : "dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
            )}
          >
            {t("workspace.tools", "Tools")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
          <motion.div
            key={showMobileContent ? "content" : "tabs"}
            initial={{ opacity: 0, x: showMobileContent ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full min-h-0 min-w-0 overflow-hidden"
          >
            {showMobileContent ? (
              <div className="h-full min-h-0 min-w-0 overflow-hidden p-1 sm:p-2">
                {renderContent()}
              </div>
            ) : (
              <div className="h-full min-h-0 min-w-0 overflow-hidden">
                {renderTabsContent()}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="h-[calc(93vh)] min-h-0 min-w-0 overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full min-h-0 min-w-0 overflow-hidden"
        autoSaveId="workspace-split-layout"
      >
        <ResizablePanel
          defaultSize={52}
          minSize={30}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-full min-h-0 min-w-0 overflow-hidden"
          >
            <div className="h-full min-h-0 min-w-0 overflow-hidden p-2 pt-0">
              {renderContent()}
            </div>
          </motion.div>
        </ResizablePanel>

        <ResizableHandle
          onPointerDown={() => setIsResizing(true)}
          onPointerUp={() => setIsResizing(false)}
          onPointerCancel={() => setIsResizing(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-2 bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
          style={{
            opacity: isResizing || isHovered ? 1 : 0.35,
            transition: "opacity 0.3s ease",
            cursor: "col-resize",
            pointerEvents: "auto",
          }}
        />

        <ResizablePanel
          defaultSize={48}
          minSize={30}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <motion.div
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-full min-h-0 min-w-0 overflow-hidden p-2 pt-0"
          >
            <div className="h-full min-h-0 min-w-0 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
              <div className="h-full min-h-0 min-w-0 overflow-hidden">
                {renderTabsContent()}
              </div>
            </div>
          </motion.div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default LearnPlayground;
