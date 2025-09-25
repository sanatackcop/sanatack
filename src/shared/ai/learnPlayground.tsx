import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { NotebookPen, BookOpen, Copy, MessageCircle } from "lucide-react";
import { TabKey } from "./types";
import { useRef } from "react";
import PdfReader from "./PdfReader";
import { State, Action } from "./types";
import YouTubeReader from "./YoutubeReader";
import { useTranslation } from "react-i18next";

const TABS_CONFIG = [
  { id: "chat", labelKey: "tabs.chat", icon: MessageCircle },
  { id: "flashcards", labelKey: "tabs.flashcards", icon: Copy },
  { id: "quizzes", labelKey: "tabs.quizzes", icon: NotebookPen },
  { id: "summary", labelKey: "tabs.summary", icon: BookOpen },
  // { id: "notes", labelKey: "tabs.notes", icon: StickyNote },
  // { id: "charts", labelKey: "tabs.charts", icon: BarChart3 },
  // { id: "mindmaps", labelKey: "tabs.mindmaps", icon: Network },
  // { id: "audio", labelKey: "tabs.audio", icon: Volume2 },
] as const;

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
        prompt: `${action.text}\n\n`,
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
    default:
      return state;
  }
};

const initialState: State = {
  tab: "flashcards",
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
};

const LearnPlaygroundRoot: React.FC = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);
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
        width: Math.max(0, tabWidth - 8),
        right: Math.max(0, rightPosition + 4),
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

  // Enhanced touch support for mobile
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

  return (
    <section
      style={{
        maxHeight: "calc(100vh - 3rem)",
        minHeight: "calc(100vh - 3rem)",
      }}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30} className="relative">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="h-full p-4"
          >
            {state.contentType === "pdf" ? (
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
                }}
                onError={(message) => {
                  dispatch({
                    type: "SET_STATUS",
                    status: { kind: "error", message },
                  });
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
                className="w-full h-full"
              />
            ) : null}
          </motion.div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <Tabs
              value={state.tab}
              onValueChange={(v) =>
                dispatch({ type: "SET_TAB", tab: v as TabKey })
              }
              className="h-full flex flex-col"
            >
              <div className="relative p-2 sm:p-4">
                {/* Left scroll fade */}
                {canScrollLeft && (
                  <div
                    className="absolute left-2 sm:left-4 top-2 sm:top-4 bottom-2 sm:bottom-4 w-4 sm:w-8 z-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.8), transparent)",
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
                    className="relative !space-x-0 !p-1 flex items-center gap-0.5 sm:gap-1 h-10 sm:h-12
                     min-w-max rounded-2xl sm:rounded-3xl backdrop-blur-sm bg-white/90 border w-fit shadow-sm"
                  >
                    <motion.div
                      className="absolute top-[4px] sm:top-[6px] bottom-[4px] sm:bottom-[6px]
                       bg-gradient-to-b from-white to-gray-50 ring-1 ring-black/5 rounded-xl sm:rounded-2xl shadow-sm z-10"
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
                          className={`
                              sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 relative z-20 flex-shrink-0
                              transition-all duration-150 
                              bg-transparent hover:bg-transparent data-[state=active]:bg-transparent
                              rounded-lg sm:rounded-lg h-7 sm:h-9
                              flex flex-row items-center justify-center
                              hover:scale-[1.02] active:scale-[0.98]
                              select-none cursor-pointer
                            `}
                          style={{
                            minWidth: "fit-content",
                            padding: "0 8px",
                            margin: "0 1px",
                          }}
                        >
                          {isActive ? (
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full shadow-sm flex-shrink-0" />
                          ) : (
                            <IconComponent
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0`}
                            />
                          )}
                          <span
                            className={`text-xs sm:text-sm transition-colors duration-150 whitespace-nowrap ${
                              isActive ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {t(tab.labelKey)}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

                {/* Right scroll fade */}
                {canScrollRight && (
                  <div
                    className="absolute right-2 sm:right-4 top-2 sm:top-4 bottom-2 sm:bottom-4 w-6 sm:w-12 z-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to left, rgba(255,255,255,0.8), transparent)",
                      backdropFilter: "blur(1px)",
                    }}
                  />
                )}
              </div>

              <div className="flex-1 p-2 sm:p-4 pt-0">
                {TABS_CONFIG.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="h-full">
                    <Card className="h-full p-4 sm:p-6">
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <tab.icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg sm:text-xl text-gray-700 mb-2">
                          {t(tab.labelKey as any)}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500">
                          {t("common.tabContent", {
                            tab: t(tab.labelKey),
                          } as any)}
                        </p>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </motion.div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default function LearnPlayGround() {
  return <LearnPlaygroundRoot />;
}
