import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Download,
  Search,
  RotateCcw,
  BookmarkPlus,
  MessageCircleQuestion,
  Home,
  Loader2,
  List,
  ChevronUp,
  ChevronDown,
  X,
  PanelLeftClose,
  PanelLeft,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Card } from "@/components/ui/card";
import { Status } from "./types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Simplified selection toolbar (only copy and add to chat)
const SelectionToolbar = memo<{
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onCopy: () => void;
  onAddToChat: () => void;
}>(({ isVisible, position, selectedText, onCopy, onAddToChat }) => {
  if (!isVisible || !selectedText) return null;

  return (
    <div
      className="fixed z-50 bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 flex items-center gap-1"
      style={{
        left: `${Math.min(
          Math.max(position.x - 100, 10),
          window.innerWidth - 210
        )}px`,
        top: `${Math.max(position.y - 60, 10)}px`,
      }}
    >
      {/* Copy Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>نسخ النص</p>
        </TooltipContent>
      </Tooltip>

      {/* Add to Chat Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddToChat}
            className="h-8 w-8 p-0"
          >
            <MessageCircleQuestion className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>إضافة للدردشة</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
});

SelectionToolbar.displayName = "SelectionToolbar";

// Enhanced page thumbnail with actual PDF preview
const PageThumbnail = memo<{
  pageNumber: number;
  isActive: boolean;
  thumbnailWidth: number;
  pdfFile: string;
  onClick: () => void;
}>(({ pageNumber, isActive, thumbnailWidth }) => {
  const [loadError, setLoadError] = useState(false);

  return (
    <div
      className={`
        relative p-2 rounded-xl border cursor-pointer transition-all duration-300 group hover:scale-[1.02]
        ${
          isActive
            ? "bg-blue-50 border-blue-300 shadow-lg ring-2 ring-blue-200 dark:bg-blue-900/20 dark:border-blue-600 dark:ring-blue-800"
            : "bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-750"
        }
      `}
    >
      {/* Page Preview */}
      <div
        className={`
          relative rounded-lg overflow-hidden border-2 transition-all duration-200
          ${
            isActive
              ? "border-blue-400 shadow-sm"
              : "border-zinc-200 dark:border-zinc-600 group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
          }
        `}
      >
        {loadError ? (
          <div
            className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
            style={{
              width: thumbnailWidth,
              height: Math.round(thumbnailWidth * 1.414),
            }}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">📄</div>
              <div className="text-xs font-medium">{pageNumber}</div>
            </div>
          </div>
        ) : (
          <Page
            pageNumber={pageNumber}
            width={thumbnailWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadError={() => setLoadError(true)}
            loading={
              <div
                className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-800"
                style={{
                  width: thumbnailWidth,
                  height: Math.round(thumbnailWidth * 1.414),
                }}
              >
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            }
            error={
              <div
                className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
                style={{
                  width: thumbnailWidth,
                  height: Math.round(thumbnailWidth * 1.414),
                }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">⚠️</div>
                  <div className="text-xs">خطأ</div>
                </div>
              </div>
            }
          />
        )}

        {/* Active page indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              مفتوح
            </div>
          </div>
        )}
      </div>

      {/* Page Info */}
      <div className="mt-2 text-center">
        <div
          className={`text-sm font-medium transition-colors ${
            isActive
              ? "text-blue-700 dark:text-blue-300"
              : "text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
          }`}
        >
          صفحة {pageNumber}
        </div>
      </div>
    </div>
  );
});

PageThumbnail.displayName = "PageThumbnail";

// Enhanced split view sidebar with actual previews
const PagesSidebar = memo<{
  pageCount: number;
  currentPage: number;
  pdfFile: string;
  isOpen: boolean;
  onPageSelect: (page: number) => void;
  onClose: () => void;
}>(({ pageCount, currentPage, pdfFile, isOpen, onPageSelect, onClose }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [thumbnailSize, setThumbnailSize] = useState<
    "small" | "medium" | "large"
  >("medium");

  const thumbnailWidths = {
    small: 80,
    medium: 120,
    large: 160,
  };

  const gridCols = {
    small: "grid-cols-3",
    medium: "grid-cols-2",
    large: "grid-cols-1",
  };

  // Filter pages based on search
  const filteredPages = useMemo(() => {
    if (!searchTerm) return Array.from({ length: pageCount }, (_, i) => i + 1);

    return Array.from({ length: pageCount }, (_, i) => i + 1).filter((page) => {
      const pageStr = page.toString();
      return pageStr.includes(searchTerm);
    });
  }, [pageCount, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="w-96 min-w-96 max-w-96 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
      {/* Enhanced Sidebar Header */}
      <div className="flex-shrink-0 p-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              صفحات المستند
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {filteredPages.length} من {pageCount} صفحة
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="البحث في الصفحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 w-7 p-0"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 w-7 p-0"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Thumbnail Size Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-2">
                <Grid3X3 className="h-3.5 w-3.5 ml-1" />
                حجم
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setThumbnailSize("small")}
                className={
                  thumbnailSize === "small"
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : ""
                }
              >
                صغير
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThumbnailSize("medium")}
                className={
                  thumbnailSize === "medium"
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : ""
                }
              >
                متوسط
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThumbnailSize("large")}
                className={
                  thumbnailSize === "large"
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : ""
                }
              >
                كبير
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Pages Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {viewMode === "grid" ? (
              <div className={`grid gap-4 ${gridCols[thumbnailSize]}`}>
                <Document file={pdfFile} loading={null} error={null}>
                  {filteredPages.map((page) => (
                    <PageThumbnail
                      key={page}
                      pageNumber={page}
                      isActive={page === currentPage}
                      thumbnailWidth={thumbnailWidths[thumbnailSize]}
                      pdfFile={pdfFile}
                      onClick={() => onPageSelect(page)}
                    />
                  ))}
                </Document>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <div
                    key={page}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        page === currentPage
                          ? "bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                          : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      }
                    `}
                    onClick={() => onPageSelect(page)}
                  >
                    {/* Mini Thumbnail */}
                    <div
                      className={`
                        relative rounded border overflow-hidden flex-shrink-0
                        ${
                          page === currentPage
                            ? "border-blue-300"
                            : "border-zinc-300 dark:border-zinc-600"
                        }
                      `}
                    >
                      <Document file={pdfFile} loading={null} error={null}>
                        <Page
                          pageNumber={page}
                          width={60}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={
                            <div className="w-[60px] h-[85px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                            </div>
                          }
                          error={
                            <div className="w-[60px] h-[85px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
                              <div className="text-center text-xs">
                                <div>📄</div>
                                <div>{page}</div>
                              </div>
                            </div>
                          }
                        />
                      </Document>
                    </div>

                    {/* Page Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium ${
                          page === currentPage
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        صفحة {page}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {page === currentPage && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPages.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h4 className="font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  لا توجد نتائج
                </h4>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  جرب البحث بمصطلحات مختلفة
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

PagesSidebar.displayName = "PagesSidebar";

// Single page component with improved intersection observer
const PDFPageComponent = memo<{
  pageNumber: number;
  width: number;
  zoom: number;
  isActive: boolean;
  onPageVisible: (pageNumber: number) => void;
}>(({ pageNumber, width, zoom, isActive, onPageVisible }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const hasReportedVisible = useRef(false);

  useEffect(() => {
    // Reset the flag when page number changes
    hasReportedVisible.current = false;
  }, [pageNumber]);

  useEffect(() => {
    if (!pageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > 0.5 &&
            !hasReportedVisible.current
          ) {
            hasReportedVisible.current = true;
            // Use setTimeout to prevent rapid updates
            setTimeout(() => {
              onPageVisible(pageNumber);
            }, 100);
          } else if (!entry.isIntersecting) {
            hasReportedVisible.current = false;
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-50px 0px -50px 0px", // Add some margin to prevent flickering
      }
    );

    observer.observe(pageRef.current);

    return () => observer.disconnect();
  }, [pageNumber, onPageVisible]);

  return (
    <div
      ref={pageRef}
      className={`
        relative mb-6 rounded-lg overflow-hidden bg-white shadow-sm
        transition-all duration-300 hover:shadow-md
        ${
          isActive
            ? "ring-2 ring-blue-500 shadow-lg"
            : "border border-zinc-200 dark:border-zinc-700"
        }
      `}
    >
      <div className="relative">
        <Page
          key={`page_${pageNumber}_${width}_${zoom}`}
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="border-none"
          loading={
            <div
              className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-900"
              style={{ width, height: Math.round(width * 1.414) }}
            >
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          }
          error={
            <div
              className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-600"
              style={{ width, height: Math.round(width * 1.414) }}
            >
              <div className="text-red-600 text-center">
                <span className="block text-2xl mb-2">⚠️</span>
                <p className="text-sm">فشل تحميل الصفحة {pageNumber}</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
});

PDFPageComponent.displayName = "PDFPageComponent";

// Main PDF Reader component with highlighting removed
const PdfReader: React.FC<{
  src: string;
  page: number;
  zoom: number;
  status: Status;
  pageCount: number | null;
  selectedText: string;
  onLoaded: (pageCount: number) => void;
  onError: (message: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onGoto: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onTextSelect: (text: string) => void;
  onAddToChat: (text: string) => void;
}> = ({
  src,
  page,
  zoom,
  status,
  pageCount,
  onLoaded,
  onError,
  onGoto,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onTextSelect,
  onAddToChat,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectionTimeoutRef = useRef<number>();

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [selectionPosition, setSelectionPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false);
  const [isGotoInputVisible, setIsGotoInputVisible] = useState(false);
  const [gotoInputValue, setGotoInputValue] = useState("");
  const [activePage, setActivePage] = useState<number>(page);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple resize handling
  const updateContainerWidth = useCallback(() => {
    if (!containerRef.current) return;
    const sidebarWidth = isSidebarOpen ? 384 : 0;
    const padding = 64;
    const newWidth = containerRef.current.clientWidth - padding - sidebarWidth;
    setContainerWidth(Math.max(400, newWidth));
  }, [isSidebarOpen]);

  // Simple text selection capture
  const captureSelection = useCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    selectionTimeoutRef.current = window.setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setCurrentSelection("");
        setShowSelectionToolbar(false);
        onTextSelect("");
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText || selectedText.length < 2) {
        setCurrentSelection("");
        setShowSelectionToolbar(false);
        onTextSelect("");
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          setCurrentSelection(selectedText);
          setSelectionPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
          setShowSelectionToolbar(true);
          onTextSelect(selectedText);
        }
      } catch (error) {
        console.error("Error capturing selection:", error);
      }
    }, 150);
  }, [onTextSelect]);

  // Selection change handler
  useEffect(() => {
    const handleSelectionChange = () => {
      requestAnimationFrame(captureSelection);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [captureSelection]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === "") {
        setShowSelectionToolbar(false);
        setCurrentSelection("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateContainerWidth();

    const resizeObserver = new ResizeObserver(updateContainerWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [updateContainerWidth]);

  // Update width when sidebar changes
  useEffect(() => {
    updateContainerWidth();
  }, [isSidebarOpen, updateContainerWidth]);

  // Selection toolbar handlers (removed highlight function)
  const selectionHandlers = useMemo(
    () => ({
      handleCopy: () => {
        if (currentSelection.trim()) {
          navigator.clipboard.writeText(currentSelection.trim());
          window.getSelection()?.removeAllRanges();
          setCurrentSelection("");
          setShowSelectionToolbar(false);
        }
      },
      handleAddToChat: () => {
        if (currentSelection.trim()) {
          onAddToChat(currentSelection.trim());
          window.getSelection()?.removeAllRanges();
          setCurrentSelection("");
          setShowSelectionToolbar(false);
        }
      },
    }),
    [currentSelection, onAddToChat]
  );

  // Context menu handlers
  const contextMenuHandlers = useMemo(
    () => ({
      handleCopyPage: () => {
        navigator.clipboard.writeText(`الصفحة ${activePage} من ${src}`);
      },
      handleDownload: () => {
        const link = document.createElement("a");
        link.href = src;
        link.download = "document.pdf";
        link.click();
      },
      handleBookmark: () => {
        const bookmark = {
          title: `الصفحة ${activePage}`,
          url: src,
          page: activePage,
          timestamp: new Date().toISOString(),
        };
        const bookmarks = JSON.parse(
          localStorage.getItem("pdf-bookmarks") || "[]"
        );
        bookmarks.push(bookmark);
        localStorage.setItem("pdf-bookmarks", JSON.stringify(bookmarks));
      },
    }),
    [activePage, src]
  );

  // Goto handler
  const handleGotoSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = parseInt(gotoInputValue);
      if (pageNum && pageNum >= 1 && pageCount && pageNum <= pageCount) {
        onGoto(pageNum);
        setIsGotoInputVisible(false);
        setGotoInputValue("");

        const pageElement = document.getElementById(`page-${pageNum}`);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [gotoInputValue, pageCount, onGoto]
  );

  // Effective width calculation
  const effectiveWidth = useMemo(() => {
    return containerWidth > 0 ? Math.floor(containerWidth * zoom) : 800;
  }, [containerWidth, zoom]);

  // Document handlers
  const handleDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      onLoaded(pdf.numPages);
    },
    [onLoaded]
  );

  const handleDocumentLoadError = useCallback(
    (error: Error) => {
      console.error("PDF Load Error:", error);
      onError(error.message || "فشل في تحميل ملف PDF");
    },
    [onError]
  );

  // Improved page visibility handler (fixed infinite loop)
  const handlePageVisible = useCallback(
    (pageNumber: number) => {
      // Only update if the page has actually changed
      if (pageNumber !== activePage && pageNumber !== page) {
        setActivePage(pageNumber);
        // Debounce the onGoto call
        setTimeout(() => {
          onGoto(pageNumber);
        }, 200);
      }
    },
    [activePage, page, onGoto]
  );

  // Scroll to page function
  const scrollToPage = useCallback((pageNumber: number) => {
    const pageElement = document.getElementById(`page-${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Fixed sidebar handlers
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handlePageSelectFromSidebar = useCallback(
    (pageNumber: number) => {
      setActivePage(pageNumber);
      scrollToPage(pageNumber);
      onGoto(pageNumber);
    },
    [scrollToPage, onGoto]
  );

  // Update active page when prop changes
  useEffect(() => {
    setActivePage(page);
  }, [page]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            onZoomIn();
            break;
          case "-":
            e.preventDefault();
            onZoomOut();
            break;
          case "0":
            e.preventDefault();
            onResetZoom();
            break;
        }
      } else {
        switch (e.key) {
          case "ArrowUp":
            if (activePage > 1) {
              e.preventDefault();
              scrollToPage(activePage - 1);
            }
            break;
          case "ArrowDown":
            if (pageCount && activePage < pageCount) {
              e.preventDefault();
              scrollToPage(activePage + 1);
            }
            break;
          case "Home":
            e.preventDefault();
            scrollToPage(1);
            break;
          case "End":
            if (pageCount) {
              e.preventDefault();
              scrollToPage(pageCount);
            }
            break;
          case "Escape":
            window.getSelection()?.removeAllRanges();
            setCurrentSelection("");
            setShowSelectionToolbar(false);
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activePage, pageCount, onZoomIn, onZoomOut, onResetZoom, scrollToPage]);

  return (
    <Card className="flex h-[56rem] overflow-hidden">
      {/* Selection Toolbar (without highlight options) */}
      <SelectionToolbar
        isVisible={showSelectionToolbar}
        position={selectionPosition}
        selectedText={currentSelection}
        onCopy={selectionHandlers.handleCopy}
        onAddToChat={selectionHandlers.handleAddToChat}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/98 dark:bg-zinc-950/95 px-3 py-2 border-b backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Sidebar Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSidebarToggle}
                  className={`h-8 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                    isSidebarOpen
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20"
                      : ""
                  }`}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4 ml-1" />
                  ) : (
                    <PanelLeft className="w-4 h-4 ml-1" />
                  )}
                  الصفحات
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isSidebarOpen ? "إخفاء" : "إظهار"} قائمة الصفحات</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Page Navigation */}
            {isGotoInputVisible ? (
              <form
                onSubmit={handleGotoSubmit}
                className="flex items-center gap-1"
              >
                <Input
                  value={gotoInputValue}
                  onChange={(e) => setGotoInputValue(e.target.value)}
                  onBlur={() => {
                    setTimeout(() => setIsGotoInputVisible(false), 200);
                  }}
                  placeholder="رقم الصفحة"
                  className="w-24 h-8 text-center text-sm"
                  autoFocus
                  type="number"
                  min="1"
                  max={pageCount || undefined}
                />
                <span className="text-sm text-zinc-400">
                  / {pageCount || "..."}
                </span>
              </form>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsGotoInputVisible(true)}
                    className="px-3 py-1.5 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-700 rounded-md text-center min-w-[100px] tabular-nums text-sm hover:from-zinc-200 hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-600 transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
                  >
                    <span className="font-medium">{activePage}</span>
                    {pageCount && <span className="text-zinc-400 mx-1">/</span>}
                    {pageCount && (
                      <span className="text-zinc-500">{pageCount}</span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>انقر للذهاب إلى صفحة محددة</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Quick Navigation */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => scrollToPage(Math.max(1, activePage - 1))}
                    disabled={activePage <= 1}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>الصفحة السابقة (↑)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      scrollToPage(Math.min(pageCount || 1, activePage + 1))
                    }
                    disabled={pageCount ? activePage >= pageCount : false}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>الصفحة التالية (↓)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Status and Tools Section */}
          <div className="flex items-center gap-2">
            {/* Status Indicators */}
            {currentSelection && (
              <Badge variant="outline" className="text-xs">
                نص محدد
              </Badge>
            )}

            <Separator orientation="vertical" className="h-6" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onZoomOut}
                    disabled={zoom <= 0.5}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>تصغير (Ctrl + -)</p>
                </TooltipContent>
              </Tooltip>

              <div className="min-w-[60px] text-center bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 rounded-md px-3 py-1 text-sm font-medium border border-zinc-200 dark:border-zinc-600">
                {Math.round(zoom * 100)}%
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onZoomIn}
                    disabled={zoom >= 3}
                    className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>تكبير (Ctrl + +)</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetZoom}
                  className="h-8 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Maximize2 className="w-3 h-3 ml-1" />
                  ملاءمة
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>ملاءمة مع العرض (Ctrl + 0)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Content */}
        <div ref={containerRef} className="flex-1 min-w-0 overflow-hidden">
          <div
            ref={scrollAreaRef}
            className="h-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-500"
          >
            {status.kind === "error" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                    خطأ في تحميل الملف
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {status.message}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mx-auto"
                  >
                    <RotateCcw className="w-4 h-4 ml-2" />
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            ) : status.kind === "loading" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <Loader2 className="h-12 w-12 animate-spin text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    جاري تحميل الملف
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    يرجى الانتظار قليلاً...
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="p-8 max-w-none"
                style={{ minWidth: `${effectiveWidth + 64}px` }}
              >
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div className="flex flex-col items-center gap-0 w-full">
                      <Document
                        file={src}
                        onLoadSuccess={handleDocumentLoadSuccess}
                        onLoadError={handleDocumentLoadError}
                        className="w-full"
                        loading={
                          <div className="flex items-center justify-center min-h-[600px]">
                            <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
                          </div>
                        }
                        error={
                          <div className="flex items-center justify-center min-h-[600px] bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-red-600 text-center">
                              <span className="block text-2xl mb-2">⚠️</span>
                              فشل تحميل الملف
                            </div>
                          </div>
                        }
                      >
                        {pageCount &&
                          Array.from(
                            { length: pageCount },
                            (_, i) => i + 1
                          ).map((pageNumber) => (
                            <div key={pageNumber} id={`page-${pageNumber}`}>
                              <PDFPageComponent
                                pageNumber={pageNumber}
                                width={effectiveWidth}
                                zoom={zoom}
                                isActive={activePage === pageNumber}
                                onPageVisible={handlePageVisible}
                              />
                            </div>
                          ))}
                      </Document>
                    </div>
                  </ContextMenuTrigger>

                  {/* Context Menu */}
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem
                      onClick={contextMenuHandlers.handleCopyPage}
                    >
                      <Copy className="ml-2 h-4 w-4" />
                      نسخ رابط الصفحة
                    </ContextMenuItem>

                    <ContextMenuItem
                      onClick={contextMenuHandlers.handleBookmark}
                    >
                      <BookmarkPlus className="ml-2 h-4 w-4" />
                      إضافة إشارة مرجعية
                      <ContextMenuShortcut>⌘B</ContextMenuShortcut>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem onClick={() => scrollToPage(1)}>
                      <Home className="ml-2 h-4 w-4" />
                      العودة للصفحة الأولى
                      <ContextMenuShortcut>Home</ContextMenuShortcut>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                      onClick={contextMenuHandlers.handleDownload}
                    >
                      <Download className="ml-2 h-4 w-4" />
                      تحميل الملف
                      <ContextMenuShortcut>⌘D</ContextMenuShortcut>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Sidebar (without highlight references) */}
      <PagesSidebar
        pageCount={pageCount || 0}
        currentPage={activePage}
        pdfFile={src}
        isOpen={isSidebarOpen}
        onPageSelect={handlePageSelectFromSidebar}
        onClose={handleSidebarClose}
      />
    </Card>
  );
};

export default memo(PdfReader);
