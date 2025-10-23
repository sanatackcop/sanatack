import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useRef,
} from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  MessageCircle,
  Loader2,
  BrainCog,
  Scan,
  TestTube2,
  Code,
  GalleryVerticalEnd,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  getWorkSpace,
  getWorkSpaceChatHistory,
  sendWorkspaceChatMessage,
} from "@/utils/_apis/learnPlayground-api";
import { useParams } from "react-router-dom";
import FlashCards from "../../../lib/flashcards/FlashCards";
import Tooltip from "@mui/material/Tooltip";
import ChatInput from "@/lib/chat/chatInput";
import ChatMessages from "@/lib/chat/ChatMessage";
import { initialState } from "@/lib/consts";
import MindMap from "@/lib/mindMap/MindMap";
import PdfReader from "@/lib/PdfReader";
import { QuizList } from "@/lib/quizzes/Quiz";
import { SummaryList } from "@/lib/summary/Summary";
import { ChatMessage, TabKey, Workspace } from "@/lib/types";
import YouTubeReader from "@/lib/YoutubeReader";
import { ChatSkeleton, ContentSkeleton, reducer, TabsSkeleton } from "../utils";

const TABS_CONFIG = [
  { id: "chat", labelKey: "tabs.chat", icon: MessageCircle },
  { id: "flashcards", labelKey: "tabs.flashcards", icon: GalleryVerticalEnd },
  { id: "quizzes", labelKey: "tabs.quizzes", icon: TestTube2 },
  { id: "summary", labelKey: "tabs.summary", icon: BookOpen },
  { id: "deepExplanation", labelKey: "Deep Explantion", icon: BrainCog },
  { id: "code", labelKey: "tabs.code", icon: Code },
] as const;

const PANEL_BASE_CLASSES =
  "m-0 h-full flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/40 shadow-sm dark:shadow-none backdrop-blur-sm";

// const CODE_TEMPLATES: Record<string, string> = {
//   javascript: `function solution() {
//   console.log("Hello, world!");
// }

// solution();
// `,
//   typescript: `function solution(): void {
//   console.log("Hello, world!");
// }

// solution();
// `,
//   python: `def solution():
//     print("Hello, world!")

// if __name__ == "__main__":
//     solution()
// `,
//   java: `public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello, world!");
//     }
// }
// `,
//   cpp: `#include <iostream>

// int main() {
//     std::cout << "Hello, world!" << std::endl;
//     return 0;
// }
// `,
//   c: `#include <stdio.h>

// int main() {
//     printf("Hello, world!\\n");
//     return 0;
// }
// `,
//   csharp: `using System;

// public class Program {
//     public static void Main() {
//         Console.WriteLine("Hello, world!");
//     }
// }
// `,
//   go: `package main

// import "fmt"

// func main() {
//     fmt.Println("Hello, world!")
// }
// `,
//   rust: `fn main() {
//     println!("Hello, world!");
// }
// `,
// };

// const LANGUAGE_OPTIONS = [
//   { value: "javascript", label: "JavaScript / Node.js" },
//   { value: "typescript", label: "TypeScript" },
//   { value: "python", label: "Python" },
//   { value: "java", label: "Java" },
//   { value: "cpp", label: "C++" },
//   { value: "c", label: "C" },
//   { value: "csharp", label: "C#" },
//   { value: "go", label: "Go" },
//   { value: "rust", label: "Rust" },
// ] as const;

const LearnPlayground: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace | undefined>();
  const [fullScreen, setFullScreen] = useState(false);

  // const [codeLanguage, setCodeLanguage] = useState<string>("javascript");
  // const [codeContent, setCodeContent] = useState<string>(
  //   CODE_TEMPLATES.javascript
  // );
  // const [codeInput, setCodeInput] = useState<string>("");
  // const [codeResult, setCodeResult] = useState<RunCodeResponse | null>(null);
  // const [codeRunning, setCodeRunning] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isRTL = i18n.language === "ar";

  // const codeEditorExtensions = useMemo(() => {
  //   if (codeLanguage === "javascript" || codeLanguage === "typescript") {
  //     return [
  //       javascript({
  //         jsx: codeLanguage === "javascript",
  //         typescript: codeLanguage === "typescript",
  //       }),
  //     ];
  //   }
  //   return [];
  // }, [codeLanguage]);

  // const handleLanguageChange = useCallback(
  //   (value: string) => {
  //     setCodeLanguage(value);
  //     setCodeContent((prev) => {
  //       const previousTemplate = CODE_TEMPLATES[codeLanguage];
  //       const nextTemplate = CODE_TEMPLATES[value];

  //       if (!prev.trim() && nextTemplate) {
  //         return nextTemplate;
  //       }

  //       if (previousTemplate && prev === previousTemplate && nextTemplate) {
  //         return nextTemplate;
  //       }

  //       return prev;
  //     });
  //     setCodeResult(null);
  //   },
  //   [codeLanguage]
  // );

  // const handleRunCode = useCallback(async () => {
  //   if (!codeContent.trim()) {
  //     toast.error(t("codeRunner.toast.missingCode"));
  //     return;
  //   }

  //   if (!codeLanguage) {
  //     toast.error(t("codeRunner.toast.missingLanguage"));
  //     return;
  //   }

  //   try {
  //     setCodeRunning(true);
  //     setCodeResult(null);
  //     const response = await runWorkspaceCode({
  //       code: codeContent,
  //       language: codeLanguage,
  //       stdin: codeInput,
  //     });

  //     setCodeResult(response);

  //     if (response.success) {
  //       toast.success(t("codeRunner.status.success"));
  //     } else {
  //       toast.error(response.error || t("codeRunner.toast.runFailed"));
  //     }
  //   } catch (error: any) {
  //     console.error("Failed to run code:", error);
  //     toast.error(
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         t("codeRunner.toast.runFailed")
  //     );
  //   } finally {
  //     setCodeRunning(false);
  //   }
  // }, [codeContent, codeInput, codeLanguage, t]);

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

      dispatch({ type: "SET_WORKSPACE", workspace: workspaceData });
      setWorkspace(workspaceData);

      const youtubeUrl = workspaceData.youtubeVideo?.transcript?.data?.url;
      if (youtubeUrl) {
        dispatch({ type: "SET_WORKSPACE_TYPE", workspaceType: "youtube" });
        const videoId = extractVideoId(youtubeUrl);
        if (videoId) {
          dispatch({ type: "SET_YOUTUBE_VIDEO", videoId });
        }
        if (workspaceData.transcript) {
          dispatch({
            type: "SET_TRANSCRIPT",
            transcript: workspaceData.transcript,
          });
        }
      }
      if (
        workspaceData.workspaceType === "document" &&
        workspaceData.documentUrl
      ) {
        dispatch({ type: "SET_WORKSPACE_TYPE", workspaceType: "document" });
        dispatch({ type: "SET_SRC", src: workspaceData.documentUrl });
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
        await sendWorkspaceChatMessage(
          id,
          message.trim(),
          i18n.language as "en" | "ar",
          undefined,
          (chunk) => {
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

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => checkScrollability();
    const handleResize = () => checkScrollability();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScrollability]);

  const handleDragStart = useCallback((clientX: number) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(clientX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !scrollContainerRef.current) return;
      const x = clientX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) e.preventDefault();
    handleDragMove(e.pageX);
  };
  const handleTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].pageX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].pageX);

  const getDisplayTitle = useCallback(() => {
    return (
      state.workspace?.workspaceName ||
      state.workspace?.title ||
      state.title ||
      "Untitled Workspace"
    );
  }, [state.workspace, state.title]);

  const renderContent = () => {
    if (contentLoading) {
      return <ContentSkeleton />;
    }


    if (state.workspaceType === "document") {
      return (
        <PdfReader
          src={state.src}
          page={state.page}
          zoom={state.zoom}
          status={state.status}
          selectedText={state.selectedText}
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
          onNext={() => dispatch({ type: "NEXT_PAGE" })}
          onPrev={() => dispatch({ type: "PREV_PAGE" })}
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

    if (state.workspaceType === "youtube") {
      return (
        <YouTubeReader
          videoId={state.youtubeVideoId}
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
          className="w-full h-full flex-grow"
        />
      );
    }

    return null;
  };

  // Loading state
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
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("loading.workspace", "Loading workspace...")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{ height: "calc(100vh - 3rem)" }}
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col"
    >
      <div className="p-2 pb-0 pl-12 flex items-center justify-between flex-shrink-0">
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
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400 dark:text-zinc-500" />
            </div>
          )}
        </div>
      </div>

      <ResizablePanelGroup
        key={fullScreen ? "pg-full" : "pg-split"}
        direction="horizontal"
        dir="ltr"
        className="flex-1 min-h-0"
        autoSaveId={fullScreen ? "fs-layout" : "split-layout"}
      >
        {fullScreen ? (
          <ResizablePanel
            defaultSize={100}
            minSize={0}
            className="mt-2 min-h-0 flex flex-col"
          >
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="h-full flex flex-col min-h-0"
            >
              {workspaceLoading ? (
                <TabsSkeleton />
              ) : (
                <Tabs
                  value={state.tab}
                  onValueChange={(v) =>
                    dispatch({ type: "SET_TAB", tab: v as TabKey })
                  }
                  className="h-full flex flex-col min-h-0"
                >
                  {/* Tabs Header */}
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
                      className="overflow-x-auto scrollbar-hide flex w-full items-center gap-2 justify-center relative touch-pan-x"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleDragEnd}
                      style={{
                        cursor: isDragging ? "grabbing" : "grab",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <TabsList
                        ref={tabsListRef}
                        className="relative !space-x-0 !p-1 flex items-center gap-4 h-11 min-w-max rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/40 shadow-sm dark:shadow-none backdrop-blur-sm w-fit"
                        style={{ direction: isRTL ? "rtl" : "ltr" }}
                      >
                        {TABS_CONFIG.map((tab) => {
                          const IconComponent = tab.icon;
                          const isActive = state.tab === tab.id;
                          return (
                            <TabsTrigger
                              key={tab.id}
                              value={tab.id}
                              className={`px-2 sm:px-3 py-1.5 sm:py-2 relative z-20 flex-shrink-0 transition-all duration-150 
                        hover:bg-transparent data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800/60 rounded-xl h-7 sm:h-9 flex flex-row items-center 
                        justify-center select-none cursor-pointer gap-1.5`}
                              style={{
                                minWidth: "fit-content",
                                padding: "0 8px",
                                margin: "0 1px",
                              }}
                            >
                              {isActive ? (
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                              ) : (
                                <IconComponent className="size-4 flex-shrink-0 text-zinc-600 dark:text-zinc-300" />
                              )}
                              <span
                                className={`text-xs font-normal sm:text-sm transition-colors duration-150 whitespace-nowrap ${
                                  isActive
                                    ? "text-zinc-900 dark:text-zinc-100"
                                    : "text-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {t(tab.labelKey as any)}
                              </span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>

                      <Tooltip
                        title={t("workspace.fullScreen", "Full Screen")}
                        className="cursor-pointer"
                      >
                        <Scan
                          className="opacity-50 hover:opacity-100 transition-all ease-linear duration-200 size-5"
                          onClick={() => {
                            setFullScreen(!fullScreen);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {state.tab === "chat" && (
                      <TabsContent
                        value="chat"
                        className={`${PANEL_BASE_CLASSES} flex-1 relative items-end justify-end min-h-0 overflow-hidden`}
                        style={{ maxHeight: "100%" }}
                      >
                        {state.isLoading ? (
                          <div className="w-full flex-1">
                            <ChatSkeleton />
                          </div>
                        ) : (
                          <>
                            <div className="w-full flex-1 flex flex-col justify-end items-center overflow-y-auto min-h-0">
                              <ChatMessages
                                messages={state.chatMessages || []}
                                isLoading={state.chatLoading}
                                streamingMessage={state.streamingMessage}
                                onSendMessage={handleSendMessage}
                              />
                            </div>
                            <ChatInput
                              className="flex-shrink-0 p-2 px-20 pb-2"
                              value={state.prompt}
                              hasAutoContext={true}
                              expandSection={true}
                              onChange={(value: string) =>
                                dispatch({ type: "SET_PROMPT", prompt: value })
                              }
                              onSubmit={handleSendMessage}
                              placeholder={t(
                                "chat.placeholder",
                                `Ask anything about ${getDisplayTitle()}...`
                              )}
                            />
                          </>
                        )}
                      </TabsContent>
                    )}

                    {state.tab === "flashcards" && workspace && (
                      <TabsContent
                        value="flashcards"
                        className={`${PANEL_BASE_CLASSES}`}
                        style={{ maxHeight: "100%" }}
                      >
                        <FlashCards workspaceId={workspace.id} />
                      </TabsContent>
                    )}

                    {state.tab === "quizzes" && workspace && (
                      <TabsContent
                        value="quizzes"
                        className={`${PANEL_BASE_CLASSES} p-4 text-zinc-500 dark:text-zinc-300`}
                      >
                        <QuizList
                          workspaceId={(workspace && workspace.id) || ""}
                        />
                      </TabsContent>
                    )}

                    {state.tab === "summary" && workspace?.id && (
                      <TabsContent
                        value="summary"
                        className={`${PANEL_BASE_CLASSES} p-4 text-zinc-500 dark:text-zinc-300`}
                        style={{ maxHeight: "100%" }}
                      >
                        <SummaryList workspaceId={String(workspace.id)} />
                      </TabsContent>
                    )}

                    {state.tab === "deepExplanation" && (
                      <TabsContent
                        value="deepExplanation"
                        className="m-0 h-full p-4 text-gray-500 flex flex-col"
                        style={{ maxHeight: "100%" }}
                      >
                        <MindMap
                          workspaceId={(workspace && workspace.id) || ""}
                        />
                      </TabsContent>
                    )}
                  </div>
                </Tabs>
              )}
            </motion.div>
          </ResizablePanel>
        ) : (
          <>
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="mt-2 min-h-0 flex flex-col"
            >
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="h-full p-4 pt-0 flex flex-col min-h-0"
              >
                {renderContent()}
              </motion.div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="mt-2 min-h-0 flex flex-col"
            >
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="h-full flex flex-col min-h-0"
              >
                {workspaceLoading ? (
                  <TabsSkeleton />
                ) : (
                  <Tabs
                    value={state.tab}
                    onValueChange={(v) =>
                      dispatch({ type: "SET_TAB", tab: v as TabKey })
                    }
                    className="h-full flex flex-col min-h-0"
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
                        className="overflow-x-auto scrollbar-hide flex w-full items-center gap-2 justify-center relative touch-pan-x"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleDragEnd}
                        style={{
                          cursor: isDragging ? "grabbing" : "grab",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <TabsList
                          ref={tabsListRef}
                          className="relative !space-x-0 !p-1 flex items-center gap-4 h-11 min-w-max rounded-2xl border w-fit"
                          style={{ direction: isRTL ? "rtl" : "ltr" }}
                        >
                          {TABS_CONFIG.map((tab) => {
                            const IconComponent = tab.icon;
                            const isActive = state.tab === tab.id;
                            return (
                              <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={`px-2 sm:px-3 py-1.5 sm:py-2 relative z-20 flex-shrink-0 transition-all duration-150 
                          hover:bg-transparent data-[state=active]:bg-gray-50 rounded-xl h-7 sm:h-9 flex flex-row items-center 
                          justify-center select-none cursor-pointer gap-1.5`}
                                style={{
                                  minWidth: "fit-content",
                                  padding: "0 8px",
                                  margin: "0 1px",
                                }}
                              >
                                {isActive ? (
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                                ) : (
                                  <IconComponent className="size-4 flex-shrink-0 text-gray-600" />
                                )}
                                <span
                                  className={`text-xs font-normal sm:text-sm transition-colors duration-150 whitespace-nowrap ${
                                    isActive ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {t(tab.labelKey as any)}
                                </span>
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>

                        <Tooltip title="Full Screen" className="cursor-pointer">
                          <Scan
                            className="opacity-50 hover:opacity-100 transition-all ease-linear duration-200 size-5"
                            onClick={() => {
                              setFullScreen(!fullScreen);
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                      {state.tab === "chat" && (
                        <TabsContent
                          value="chat"
                          className="m-0 flex-1 flex flex-col relative items-end justify-end min-h-0"
                          style={{ maxHeight: "100%" }}
                        >
                          {state.isLoading ? (
                            <div className="w-full flex-1">
                              <ChatSkeleton />
                            </div>
                          ) : (
                            <>
                              <div className="w-full  flex-1 flex flex-col justify-end items-center overflow-y-auto min-h-0">
                                <ChatMessages
                                  messages={state.chatMessages || []}
                                  isLoading={state.chatLoading}
                                  streamingMessage={state.streamingMessage}
                                  onSendMessage={handleSendMessage}
                                />
                              </div>
                              <ChatInput
                                className="flex-shrink-0 p-2 px-20 pb-2"
                                value={state.prompt}
                                expandSection={false}
                                onChange={(value: string) =>
                                  dispatch({
                                    type: "SET_PROMPT",
                                    prompt: value,
                                  })
                                }
                                onSubmit={handleSendMessage}
                                placeholder={t(
                                  "chat.placeholder",
                                  `Ask anything about ${getDisplayTitle()}...`
                                )}
                              />
                            </>
                          )}
                        </TabsContent>
                      )}

                      {state.tab === "flashcards" && workspace && (
                        <TabsContent
                          value="flashcards"
                          className="m-0 h-full flex flex-col"
                          style={{ maxHeight: "100%" }}
                        >
                          <FlashCards workspaceId={workspace.id} />
                        </TabsContent>
                      )}

                      {state.tab === "quizzes" && (
                        <TabsContent
                          value="quizzes"
                          className="m-0 h-full p-4 text-gray-500 flex flex-col"
                        >
                          <QuizList
                            workspaceId={(workspace && workspace.id) || ""}
                          />
                        </TabsContent>
                      )}

                      {state.tab === "summary" && (
                        <TabsContent
                          value="summary"
                          className="m-0 h-full p-4 text-gray-500 flex flex-col"
                          style={{ maxHeight: "100%" }}
                        >
                          <SummaryList
                            workspaceId={
                              String(workspace && workspace.id) || ""
                            }
                          />
                        </TabsContent>
                      )}

                      {state.tab === "deepExplanation" && (
                        <TabsContent
                          value="deepExplanation"
                          className="m-0 h-full p-4 text-gray-500 flex flex-col"
                          style={{ maxHeight: "100%" }}
                        >
                          <MindMap
                            workspaceId={(workspace && workspace.id) || ""}
                          />
                        </TabsContent>
                      )}
                    </div>
                  </Tabs>
                )}
              </motion.div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </section>
  );
};

export default LearnPlayground;
