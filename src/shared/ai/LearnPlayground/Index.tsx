import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NotebookPen,
  BookOpen,
  Copy,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { TabKey, State, Action, ChatMessage } from "./types";
import { useRef } from "react";
import PdfReader from "./PdfReader";
import YouTubeReader from "./YoutubeReader";
import { useTranslation } from "react-i18next";
import ChatInput from "./chat/chatInput";
import { Input } from "@/components/ui/input";
import {
  getWorkSpace,
  sendWorkspaceChatMessage,
} from "@/utils/_apis/learnPlayground-api";
import { useParams } from "react-router-dom";
import ChatMessages from "./chat/ChatMessage";

const TABS_CONFIG = [
  { id: "chat", labelKey: "tabs.chat", icon: MessageCircle },
  { id: "flashcards", labelKey: "tabs.flashcards", icon: Copy },
  { id: "quizzes", labelKey: "tabs.quizzes", icon: NotebookPen },
  { id: "summary", labelKey: "tabs.summary", icon: BookOpen },
] as const;

// Enhanced reducer to handle chat messages, streaming, and workspace data
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_CONTENT":
      return {
        ...state,
        contentType: action.contentType,
        status: { kind: "loading", for: action.contentType },
      };
    case "SET_SRC":
      return { ...state, src: action.src };
    case "SET_PAGE":
      return { ...state, page: Math.max(1, action.page) };
    case "SET_PAGE_COUNT":
      return { ...state, pageCount: action.pageCount };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.pageCount
          ? Math.min(state.pageCount, state.page + 1)
          : state.page + 1,
      };
    case "PREV_PAGE":
      return { ...state, page: Math.max(1, state.page - 1) };
    case "SET_STATUS":
      return { ...state, status: action.status };
    case "SET_PROMPT":
      return { ...state, prompt: action.prompt };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "ZOOM_IN":
      return { ...state, zoom: Math.min(3.0, +(state.zoom + 0.2).toFixed(2)) };
    case "ZOOM_OUT":
      return { ...state, zoom: Math.max(0.4, +(state.zoom - 0.2).toFixed(2)) };
    case "RESET_ZOOM":
      return { ...state, zoom: 1 };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "ADD_HIGHLIGHT":
      return {
        ...state,
        highlights: [...(state.highlights || []), action.highlight],
      };
    case "REMOVE_HIGHLIGHT":
      return {
        ...state,
        highlights: (state.highlights || []).filter((h) => h.id !== action.id),
      };
    case "SET_HIGHLIGHTS":
      return { ...state, highlights: action.highlights || [] };
    case "SET_SELECTED_TEXT":
      return { ...state, selectedText: action.text };
    case "ADD_TO_CHAT":
      return {
        ...state,
        tab: "chat",
        prompt: action.text,
      };
    case "SET_YOUTUBE_VIDEO":
      return { ...state, youtubeVideoId: action.videoId };
    case "SET_YOUTUBE_TIME":
      return {
        ...state,
        youtubeCurrentTime: action.currentTime,
        youtubeDuration: action.duration,
      };
    case "SET_YOUTUBE_PLAYING":
      return { ...state, youtubeIsPlaying: action.isPlaying };
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), action.message],
        prompt: "",
      };
    case "SET_CHAT_INPUT":
      return { ...state, chatInput: action.input };
    case "CLEAR_CHAT":
      return { ...state, chatMessages: [] };
    case "SET_CHAT_LOADING":
      return { ...state, chatLoading: action.loading };
    case "SET_STREAMING_MESSAGE":
      return { ...state, streamingMessage: action.content };
    case "ADD_STREAMING_CHUNK":
      return {
        ...state,
        streamingMessage: (state.streamingMessage || "") + action.chunk,
      };
    case "COMPLETE_STREAMING_MESSAGE":
      const completedMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: state.streamingMessage || action.content,
        timestamp: new Date(),
        isComplete: true,
      };
      return {
        ...state,
        chatMessages: [...(state.chatMessages || []), completedMessage],
        streamingMessage: "",
        chatLoading: false,
      };
    // Fixed workspace action - matches the dispatch call
    case "SET_WORKSPACE":
      return {
        ...state,
        workspace: action.workspace,
        title:
          action.workspace?.workspaceName || action.workspace?.title || null,
        youtubeVideoId: action.workspace?.youtubeUrl
          ? extractYouTubeId(action.workspace.youtubeUrl)
          : state.youtubeVideoId,
        contentType: action.workspace?.contentType || state.contentType,
        src: action.workspace?.pdfUrl || state.src,
        transcript: action.workspace?.transcript || null,
      };
    case "SET_TITLE":
      return { ...state, title: action.title };
    case "SET_TRANSCRIPT":
      return { ...state, transcript: action.transcript };
    case "SET_TRANSCRIPT_LOADING":
      return { ...state, transcriptLoading: action.loading };
    default:
      return state;
  }
};

// Helper function to extract YouTube video ID from URL
const extractYouTubeId = (url: string): string => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

// Fixed initial state with all required properties including streaming
const initialState: State = {
  tab: "chat",
  contentType: "youtube",
  src: "https://arxiv.org/pdf/1706.03762",
  page: 1,
  pageCount: null,
  zoom: 1,
  status: { kind: "idle" },
  prompt: "",
  notes: "",
  sidebarOpen: true,
  highlights: [],
  selectedText: "",
  youtubeVideoId: "dQw4w9WgXcQ",
  youtubeCurrentTime: 0,
  youtubeDuration: 0,
  youtubeIsPlaying: false,
  chatMessages: [],
  chatInput: "",
  chatLoading: false,
  streamingMessage: "",
  workspace: null,
  title: null,
  transcript: null,
  transcriptLoading: false,
};

// Skeleton Components
const ContentSkeleton = () => (
  <div className="w-full h-full flex flex-col space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex-1 bg-gray-100 rounded-lg animate-pulse" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

const TabsSkeleton = () => (
  <div className="h-full flex flex-col">
    <div className="p-2 pt-0 flex-shrink-0">
      <div className="flex space-x-2 rounded-2xl bg-gray-100 p-1 w-fit mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-24 rounded-xl" />
        ))}
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2 mt-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const ChatSkeleton = () => (
  <div className="flex-1 flex flex-col p-4 space-y-4">
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex space-x-2 max-w-xs ${
              i % 2 === 0 ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-auto">
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

const LearnPlaygroundRoot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading] = useState(false);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    right: 0,
  });

  const isRTL = i18n.language === "ar";

  // Fixed workspace fetching function
  const fetchTheWorkSpace = async () => {
    if (!id) {
      setWorkspaceLoading(false);
      return;
    }

    try {
      setWorkspaceLoading(true);
      setContentLoading(true);

      const response: any = await getWorkSpace(id);

      // Handle both nested and flat response structures
      const workspaceData = response.workspace || response;

      // Dispatch with the correct action type
      dispatch({
        type: "SET_WORKSPACE",
        workspace: workspaceData,
      });

      // Handle YouTube content
      if (workspaceData.youtubeVideo?.youtubeUrl || workspaceData.youtubeUrl) {
        const youtubeUrl =
          workspaceData.youtubeVideo?.youtubeUrl || workspaceData.youtubeUrl;

        dispatch({
          type: "SET_CONTENT",
          contentType: "youtube",
        });

        const vdID = youtubeUrl.includes("youtu.be/")
          ? youtubeUrl.split("/").pop()?.split("?")[0]
          : youtubeUrl.split("v=")[1]?.split("&")[0];

        if (vdID) {
          dispatch({
            type: "SET_YOUTUBE_VIDEO",
            videoId: vdID,
          });
        }

        // Load transcript if available
        if (workspaceData.transcript) {
          dispatch({
            type: "SET_TRANSCRIPT",
            transcript: workspaceData.transcript,
          });
        }
      }

      // Handle PDF content
      if (workspaceData.contentType === "pdf" && workspaceData.pdfUrl) {
        dispatch({
          type: "SET_CONTENT",
          contentType: "pdf",
        });
        dispatch({
          type: "SET_SRC",
          src: workspaceData.pdfUrl,
        });
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
  };

  useEffect(() => {
    fetchTheWorkSpace();
  }, [id]);

  // Updated handleSendMessage with streaming support
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !id) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: message.trim(),
        timestamp: new Date(),
      };

      dispatch({ type: "ADD_CHAT_MESSAGE", message: userMessage });
      dispatch({ type: "SET_CHAT_LOADING", loading: true });
      dispatch({ type: "SET_STREAMING_MESSAGE", content: "" });

      try {
        console.log("HHHHHH");
        await sendWorkspaceChatMessage(
          id,
          message.trim(),
          i18n.language as "en" | "ar",
          undefined, // model
          (chunk) => {
            console.log({ chunk });
            if (chunk.chunk) {
              dispatch({ type: "ADD_STREAMING_CHUNK", chunk: chunk.chunk });
            }

            if (chunk.isComplete) {
              dispatch({
                type: "COMPLETE_STREAMING_MESSAGE",
                content: chunk.chunk || "",
              });
            }

            if (chunk.metadata?.error) {
              const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                type: "assistant",
                content: chunk.metadata.error,
                timestamp: new Date(),
                metadata: { error: chunk.metadata.error },
              };
              dispatch({ type: "ADD_CHAT_MESSAGE", message: errorMessage });
              dispatch({ type: "SET_CHAT_LOADING", loading: false });
              dispatch({ type: "SET_STREAMING_MESSAGE", content: "" });
            }
          }
        );
      } catch (error) {
        console.error("Failed to send message:", error);

        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "assistant",
          content: t(
            "chat.error_occurred",
            "An error occurred while sending your message."
          ),
          timestamp: new Date(),
          metadata: { error: "Network error" },
        };

        dispatch({ type: "ADD_CHAT_MESSAGE", message: errorMessage });
        dispatch({ type: "SET_CHAT_LOADING", loading: false });
        dispatch({ type: "SET_STREAMING_MESSAGE", content: "" });
      }
    },
    [id, i18n.language, t]
  );

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  const updateIndicatorPosition = useCallback(() => {
    if (!tabsListRef.current) return;

    const activeTabIndex = TABS_CONFIG.findIndex((tab) => tab.id === state.tab);
    const tabElements = tabsListRef.current.querySelectorAll('[role="tab"]');
    const activeTabElement = tabElements[activeTabIndex] as HTMLElement;

    if (activeTabElement && tabsListRef.current) {
      const tabsListRect = tabsListRef.current.getBoundingClientRect();
      const activeTabRect = activeTabElement.getBoundingClientRect();
      const relativeLeft = activeTabRect.left - tabsListRect.left;
      const tabWidth = activeTabRect.width;
      const rightPosition = tabsListRect.width - relativeLeft - tabWidth;

      setIndicatorStyle({
        width: Math.max(0, tabWidth - 2),
        right: Math.max(0, rightPosition - 2),
      });
    }
  }, [state.tab]);

  useEffect(() => {
    checkScrollability();
    updateIndicatorPosition();

    const container = scrollContainerRef.current;
    if (container) {
      const handleScroll = () => {
        checkScrollability();
        updateIndicatorPosition();
      };

      const handleResize = () => {
        checkScrollability();
        setTimeout(updateIndicatorPosition, 100);
      };

      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [checkScrollability, updateIndicatorPosition]);

  useEffect(() => {
    const timeoutId = setTimeout(updateIndicatorPosition, 100);
    return () => clearTimeout(timeoutId);
  }, [state.tab, updateIndicatorPosition]);

  // Touch and mouse handlers for tab scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fixed getDisplayTitle function with null checks
  const getDisplayTitle = () => {
    return (
      state.workspace?.workspaceName ||
      state.workspace?.title ||
      state.title ||
      "Untitled Workspace"
    );
  };

  if (workspaceLoading) {
    return (
      <section
        style={{
          maxHeight: "calc(100vh - 3rem)",
          minHeight: "calc(100vh - 3rem)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
        className="flex items-center justify-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-gray-600">
            {t("loading.workspace", "Loading workspace...")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        maxHeight: "calc(100vh - 3rem)",
        minHeight: "calc(100vh - 3rem)",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-2 flex items-center justify-between">
        <div className="max-w-[34rem] flex-grow relative">
          {workspaceLoading ? (
            <Skeleton className="h-10 w-full rounded-2xl" />
          ) : (
            <Input
              className="rounded-2xl shadow-none border-none w-full"
              value={getDisplayTitle()}
              readOnly
            />
          )}
          {contentLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30} className="mt-2">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-full p-4 pt-0"
          >
            {contentLoading ? (
              <ContentSkeleton />
            ) : state.contentType === "pdf" ? (
              <PdfReader
                src={state.src}
                page={state.page}
                zoom={state.zoom}
                status={state.status}
                selectedText={state.selectedText}
                onLoaded={(pageCount) => {
                  dispatch({ type: "SET_PAGE_COUNT", pageCount });
                  dispatch({
                    type: "SET_STATUS",
                    status: { kind: "idle" },
                  });
                  setContentLoading(false);
                }}
                onError={(message) => {
                  dispatch({
                    type: "SET_STATUS",
                    status: { kind: "error", message },
                  });
                  setContentLoading(false);
                }}
                onNext={() => dispatch({ type: "NEXT_PAGE" })}
                onPrev={() => dispatch({ type: "PREV_PAGE" })}
                onGoto={(p) => dispatch({ type: "SET_PAGE", page: p })}
                onZoomIn={() => dispatch({ type: "ZOOM_IN" })}
                onZoomOut={() => dispatch({ type: "ZOOM_OUT" })}
                onResetZoom={() => dispatch({ type: "RESET_ZOOM" })}
                onTextSelect={(text) =>
                  dispatch({ type: "SET_SELECTED_TEXT", text })
                }
                onAddToChat={(text) => dispatch({ type: "ADD_TO_CHAT", text })}
                pageCount={state.pageCount}
              />
            ) : state.contentType === "youtube" ? (
              <YouTubeReader
                videoId={state.youtubeVideoId}
                transcript={
                  state.workspace?.youtubeVideo?.transcribe?.data as any
                }
                onVideoSelect={(videoId) =>
                  dispatch({ type: "SET_YOUTUBE_VIDEO", videoId })
                }
                onTimeUpdate={(currentTime, duration) =>
                  dispatch({
                    type: "SET_YOUTUBE_TIME",
                    currentTime,
                    duration,
                  })
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
                className="w-full h-full"
              />
            ) : null}
          </motion.div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30} className="mt-2">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-full"
          >
            {workspaceLoading ? (
              <TabsSkeleton />
            ) : (
              <Tabs
                value={state.tab}
                onValueChange={(v) =>
                  dispatch({ type: "SET_TAB", tab: v as TabKey })
                }
                className="h-full flex flex-col"
              >
                <div className="relative p-2 pt-0 flex-shrink-0">
                  {canScrollLeft && (
                    <div
                      className={`absolute ${
                        isRTL ? "right-2 sm:right-4" : "left-2 sm:left-4"
                      } top-2 sm:top-4 bottom-2 sm:bottom-4 w-4 sm:w-8 z-20 pointer-events-none`}
                      style={{
                        background: `linear-gradient(to ${
                          isRTL ? "left" : "right"
                        }, rgba(255,255,255,0.8), transparent)`,
                        backdropFilter: "blur(1px)",
                      }}
                    />
                  )}

                  <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scrollbar-hide flex w-full items-center justify-center relative touch-pan-x"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      cursor: isDragging ? "grabbing" : "grab",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <TabsList
                      ref={tabsListRef}
                      className="relative !space-x-0 !p-1 flex items-center gap-4 h-12
                       min-w-max rounded-2xl sm:rounded-3xl border w-fit shadow-sm"
                      style={{ direction: isRTL ? "rtl" : "ltr" }}
                    >
                      <motion.div
                        className="absolute top-[4px] sm:top-[6px] bottom-[4px] sm:bottom-[6px]
                         bg-gradient-to-b from-white to-gray-50 ring-1 ring-black/5 rounded-3xl z-10"
                        animate={{
                          width: indicatorStyle.width,
                          right: indicatorStyle.right,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />

                      {TABS_CONFIG.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = state.tab === tab.id;

                        return (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 relative z-20 flex-shrink-0
                                transition-all duration-150 
                                bg-transparent hover:bg-transparent data-[state=active]:bg-transparent
                                rounded-lg sm:rounded-lg h-7 sm:h-9
                                flex flex-row items-center justify-center
                                hover:scale-[1.02] active:scale-[0.98]
                                select-none cursor-pointer gap-1.5"
                            style={{
                              minWidth: "fit-content",
                              padding: "0 8px",
                              margin: "0 1px",
                            }}
                          >
                            <span
                              className={`text-xs sm:text-sm transition-colors duration-150 whitespace-nowrap ${
                                isActive
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {t(tab.labelKey)}
                            </span>
                            {isActive ? (
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm flex-shrink-0" />
                            ) : (
                              <IconComponent className="w-3 h-3 flex-shrink-0 text-gray-600" />
                            )}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  {canScrollRight && (
                    <div
                      className={`absolute ${
                        isRTL ? "left-2 sm:left-4" : "right-2 sm:right-4"
                      } top-2 sm:top-4 bottom-2 sm:bottom-4 w-6 sm:w-12 z-20 pointer-events-none`}
                      style={{
                        background: `linear-gradient(to ${
                          isRTL ? "right" : "left"
                        }, rgba(255,255,255,0.8), transparent)`,
                        backdropFilter: "blur(1px)",
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent
                    value="chat"
                    style={{
                      maxHeight: "calc(100vh - 9rem)",
                      minHeight: "calc(100vh - 9rem)",
                    }}
                    className="m-0 flex flex-1 flex-col relative items-end justify-end"
                  >
                    {isLoading ? (
                      <ChatSkeleton />
                    ) : (
                      <>
                        <div className="w-full flex-1 flex flex-col">
                          <ChatMessages
                            messages={state.chatMessages || []}
                            isLoading={state.chatLoading}
                            streamingMessage={state.streamingMessage}
                            onSendMessage={handleSendMessage}
                          />
                        </div>
                        <ChatInput
                          className="flex-shrink-0 p-2 pb-2"
                          value={state.prompt}
                          expandSection={false}
                          disabled={state.chatLoading}
                          onChange={(value: string) =>
                            dispatch({ type: "SET_PROMPT", prompt: value })
                          }
                          onSubmit={handleSendMessage}
                          placeholder={t(
                            "chat.placeholder",
                            "Type your message..."
                          )}
                        />
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="flashcards" className="m-0 h-full">
                    {isLoading ? (
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t(
                          "flashcards.coming_soon",
                          "Flashcards coming soon..."
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="quizzes" className="m-0 h-full">
                    {isLoading ? (
                      <div className="p-4 space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t("quizzes.coming_soon", "Quizzes coming soon...")}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="summary" className="m-0 h-full">
                    {isLoading ? (
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="mt-6 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t("summary.coming_soon", "Summary coming soon...")}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </motion.div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default function LearnPlayGround() {
  return <LearnPlaygroundRoot />;
}
