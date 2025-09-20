import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import {
  MessageSquareText,
  Brain,
  NotebookPen,
  BookOpen,
  StickyNote,
  BarChart3,
  Network,
  Volume2,
} from "lucide-react";
import ChatInput from "./chatInput";
import { TabKey } from "./types";
import { useRef, useState, useEffect } from "react";

// Define tabs configuration
const TABS_CONFIG = [
  { id: "chat", label: "دردشة", icon: MessageSquareText },
  { id: "flashcards", label: "بطاقات", icon: Brain },
  { id: "quizzes", label: "اختبارات", icon: NotebookPen },
  { id: "summary", label: "ملخص", icon: BookOpen },
  { id: "notes", label: "ملاحظات", icon: StickyNote },
  { id: "charts", label: "الرسوم البيانية", icon: BarChart3 },
  { id: "mindmaps", label: "الخرائط الذهنية", icon: Network },
  { id: "audio", label: "توليد الصوت", icon: Volume2 },
] as const;

export function ToolTipNav({ dispatch, state }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    right: 0,
  });

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const updateIndicatorPosition = () => {
    if (!tabsListRef.current) return;

    const activeTabIndex = TABS_CONFIG.findIndex((tab) => tab.id === state.tab);
    const tabElements = tabsListRef.current.querySelectorAll('[role="tab"]');
    const activeTabElement = tabElements[activeTabIndex] as HTMLElement;

    if (activeTabElement && tabsListRef.current) {
      const tabsListRect = tabsListRef.current.getBoundingClientRect();
      const activeTabRect = activeTabElement.getBoundingClientRect();

      // Calculate position relative to the tabs list container
      const relativeLeft = activeTabRect.left - tabsListRect.left;
      const tabWidth = activeTabRect.width;

      // For RTL, we need to calculate from the right edge
      const rightPosition = tabsListRect.width - relativeLeft - tabWidth;

      setIndicatorStyle({
        width: tabWidth - 8, // Subtract 8px for padding (4px on each side)
        right: rightPosition + 4, // Add 4px offset for centering
      });
    }
  };

  useEffect(() => {
    checkScrollability();
    updateIndicatorPosition();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, []);

  // Update indicator when tab changes
  useEffect(() => {
    updateIndicatorPosition();
  }, [state.tab]);

  // Update indicator on window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateIndicatorPosition, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <>
      <ResizableHandle
        withHandle
        className="
          mx-0                        
          w-[3px]                      
          bg-gray-200 hover:bg-gray-300
          relative
          data-[direction=horizontal]:cursor-col-resize
          after:content-[''] after:absolute after:-inset-x-2 after:inset-y-0
        "
      />

      <ResizablePanel defaultSize={50} minSize={30} className="h-full">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="h-full"
          dir="rtl"
        >
          <div className="px-4">
            <Card className="h-[56rem]">
              <Tabs
                value={state.tab}
                onValueChange={(v) =>
                  dispatch({ type: "SET_TAB", tab: v as TabKey })
                }
                dir="rtl"
                className="h-full flex flex-col"
              >
                <div className="px-4 md:px-6 lg:px-8">
                  <div className="!p-0 relative overflow-hidden">
                    <div
                      className={`absolute right-0 top-0 bottom-0 w-4 z-20 pointer-events-none transition-opacity duration-300 ${
                        canScrollRight ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: `linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, 
                        rgba(255,255,255,0.2) 70%, rgba(255,255,255,0) 100%)`,
                      }}
                    />

                    <div
                      ref={scrollContainerRef}
                      className="overflow-x-auto scrollbar-hide relative"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{ cursor: isDragging ? "grabbing" : "grab" }}
                    >
                      <TabsList
                        ref={tabsListRef}
                        className="relative !space-x-0 !p-1 flex items-center gap-0 h-14 min-w-max
                        rounded-2xl backdrop-blur-sm"
                      >
                        <motion.div
                          className="
                            absolute top-[12px] bottom-1
                            bg-gradient-to-b from-white to-gray-50
                            ring-1 ring-black/10 rounded-xl
                            h-8 z-10 
                          "
                          animate={{
                            width: indicatorStyle.width,
                            right: indicatorStyle.right,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />

                        {TABS_CONFIG.map((tab, index) => {
                          const IconComponent = tab.icon;
                          const isActive = state.tab === tab.id;
                          const isComingSoon = index >= 5;

                          return (
                            <TabsTrigger
                              key={tab.id}
                              value={tab.id}
                              className={`
                                gap-2 px-4 py-2 relative z-20 flex-shrink-0
                                transition-all duration-200
                                bg-transparent hover:bg-transparent data-[state=active]:bg-transparent
                                rounded-xl h-10
                                flex flex-row items-center justify-center
                                hover:scale-105 active:scale-95
                                select-none cursor-pointer
                                ${
                                  isComingSoon
                                    ? "cursor-pointer opacity-80"
                                    : ""
                                }
                              `}
                              style={{
                                minWidth: "fit-content",
                                padding: "0 16px",
                                margin: "0 4px",
                              }}
                              onMouseEnter={updateIndicatorPosition}
                            >
                              {isActive ? (
                                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm flex-shrink-0" />
                              ) : (
                                <IconComponent
                                  className={`w-4 h-4 flex-shrink-0 ${
                                    isComingSoon
                                      ? "text-gray-400"
                                      : "text-gray-500 group-hover:text-gray-700"
                                  }`}
                                />
                              )}
                              <span
                                className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                                  isActive
                                    ? "text-black font-semibold"
                                    : isComingSoon
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {tab.label}
                              </span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </div>
                  </div>
                </div>
                <hr />
                <div
                  className="flex-1 min-h-0 px-3 pb-4 overflow-auto scrollbar-hide mt-6"
                  dir="rtl"
                >
                  {/* Chat Tab Content */}
                  <TabsContent value="chat" className="m-0 h-full">
                    <div className="h-full flex flex-col" dir="rtl">
                      {/* Chat Messages Area */}
                      <div className="flex-1 mb-4 p-4 bg-gray-50 rounded-lg min-h-[300px] flex items-center justify-center">
                        <div className="text-center text-base text-gray-500">
                          ابدأ المحادثة من هنا...
                        </div>
                      </div>

                      {/* Chat Input - Positioned at bottom */}
                      <div className="flex-shrink-0">
                        <ChatInput
                          value={""}
                          onChange={function (): void {
                            throw new Error("Function not implemented.");
                          }}
                          className="text-right"
                          placeholder="اكتب رسالتك هنا..."
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Flashcards Tab */}
                  <TabsContent value="flashcards" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-base text-gray-500">
                        محتوى البطاقات التعليمية قيد التطوير...
                      </div>
                    </div>
                  </TabsContent>

                  {/* Quizzes Tab */}
                  <TabsContent value="quizzes" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-base text-gray-500">
                        محتوى الاختبارات قيد التطوير...
                      </div>
                    </div>
                  </TabsContent>

                  {/* Summary Tab */}
                  <TabsContent value="summary" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-base text-gray-500">
                        محتوى الملخص قيد التطوير...
                      </div>
                    </div>
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-base text-gray-500">
                        محتوى الملاحظات قيد التطوير...
                      </div>
                    </div>
                  </TabsContent>

                  {/* Charts Tab - Coming Soon */}
                  <TabsContent value="charts" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md relative"
                      >
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          الرسوم البيانية
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          إنشاء الرسوم البيانية التفاعلية والمخططات الذكية لتصور
                          البيانات بطريقة احترافية ومبتكرة
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700">
                            قيد التطوير - متاح قريباً
                          </span>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute inset-0 -z-10 opacity-30">
                          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
                          <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg"></div>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>

                  {/* Mind Maps Tab - Coming Soon */}
                  <TabsContent value="mindmaps" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md relative"
                      >
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          الخرائط الذهنية
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          إنتاج الخرائط الذهنية الذكية والتفاعلية لتنظيم الأفكار
                          والمعلومات بشكل بصري وإبداعي
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">
                            قيد التطوير - متاح قريباً
                          </span>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute inset-0 -z-10 opacity-30">
                          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-xl"></div>
                          <div className="absolute bottom-20 right-20 w-24 h-24 bg-emerald-500/10 rounded-full blur-lg"></div>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>

                  {/* Audio Tab - Coming Soon */}
                  <TabsContent value="audio" className="m-0 h-full">
                    <div className="h-full flex items-center justify-center p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md relative"
                      >
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          توليد الصوت
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          تحويل النصوص إلى صوت طبيعي بالذكاء الاصطناعي مع دعم
                          اللغة العربية والأصوات المتنوعة
                        </p>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50 rounded-full">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-purple-700">
                            قيد التطوير - متاح قريباً
                          </span>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute inset-0 -z-10 opacity-30">
                          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                          <div className="absolute bottom-20 right-20 w-24 h-24 bg-violet-500/10 rounded-full blur-lg"></div>
                        </div>
                      </motion.div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </motion.div>
      </ResizablePanel>
    </>
  );
}
