import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Copy,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Card } from "@/components/ui/card";
import { Status } from "./types";

if (
  typeof window !== "undefined" &&
  pdfjs.GlobalWorkerOptions.workerSrc !== workerSrc
) {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}

const PDFPageComponent = memo<{
  pageNumber: number;
  width: number;
}>(
  ({ pageNumber, width }) => {
    const { t } = useTranslation();

    return (
      <div className="pdf-page-wrapper mb-2" data-page={pageNumber}>
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={true}
          renderAnnotationLayer={false}
          className="border-none"
          loading={
            <div
              className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-900"
              style={{ width, height: Math.round(width * 1.414) }}
            >
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          }
          error={
            <div
              className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-red-300"
              style={{ width, height: Math.round(width * 1.414) }}
            >
              <div className="text-red-600 text-center">
                <span className="block text-xl mb-1">⚠️</span>
                <p className="text-xs">
                  {t("pageLoadFailed", { page: pageNumber })}
                </p>
              </div>
            </div>
          }
        />
      </div>
    );
  },
  (prev, next) =>
    prev.pageNumber === next.pageNumber && prev.width === next.width
);
PDFPageComponent.displayName = "PDFPageComponent";

type ZoomMode = "page-fit" | "100" | "80" | "70";

interface PopoverPosition {
  x: number;
  y: number;
}

const PdfReader: React.FC<{
  src: string;
  page: number;
  zoom: number;
  status: Status;
  pageCount: number | null;
  onLoaded: (pageCount: number) => void;
  onError: (message: string) => void;
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
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pdfDocumentRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [currentSelection, setCurrentSelection] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(page);
  const [pageInputValue, setPageInputValue] = useState<string>("");
  const [fitMode, setFitMode] = useState<ZoomMode>("page-fit");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    x: 0,
    y: 0,
  });

  // Only load 3 pages at a time (current + 1 before + 1 after)
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([1]));

  // Calculate width once on mount and on significant resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      const padding = 64;
      const newWidth = Math.floor(
        (containerRef.current?.clientWidth || 800) - padding
      );
      setContainerWidth(Math.max(400, newWidth));
    };

    updateWidth();

    let timeout: number;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateWidth, 500); // Very long debounce
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track page visibility with IntersectionObserver
  useEffect(() => {
    if (!pageCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(
              entry.target.getAttribute("data-page") || "1"
            );

            // Update active page
            setActivePage(pageNum);
            onGoto(pageNum);

            // Load current page + surrounding pages
            setLoadedPages((prev) => {
              const newSet = new Set(prev);
              for (
                let i = Math.max(1, pageNum - 1);
                i <= Math.min(pageCount, pageNum + 1);
                i++
              ) {
                newSet.add(i);
              }
              return newSet;
            });
          }
        });
      },
      {
        root: scrollAreaRef.current,
        threshold: 0.5,
        rootMargin: "200px 0px", // Preload pages 200px before they're visible
      }
    );

    // Observe all page wrappers
    const pages = document.querySelectorAll(".pdf-page-wrapper");
    pages.forEach((page) => observer.observe(page));

    return () => observer.disconnect();
  }, [pageCount, onGoto]);

  // Check if selection is within PDF
  const isSelectionInPDF = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element =
      container.nodeType === Node.ELEMENT_NODE
        ? (container as Element)
        : container.parentElement;

    return element?.closest(".pdf-page-wrapper") !== null;
  }, []);

  // Handle text selection
  useEffect(() => {
    let timeout: number;

    const handleSelection = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim() || "";

        if (selectedText.length < 2 || !isSelectionInPDF()) {
          setCurrentSelection("");
          setShowPopover(false);
          onTextSelect("");
          return;
        }

        const range = selection!.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setPopoverPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });

        setCurrentSelection(selectedText);
        setShowPopover(true);
        onTextSelect(selectedText);
      }, 100);
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".pdf-page-wrapper")) {
        handleSelection();
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    document.addEventListener("dblclick", handleDblClick);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("selectionchange", handleSelection);
      document.removeEventListener("dblclick", handleDblClick);
    };
  }, [isSelectionInPDF, onTextSelect]);

  // Click outside to close popover
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current?.contains(e.target as Node)) return;

      if (!(e.target as HTMLElement).closest(".pdf-page-wrapper")) {
        setShowPopover(false);
        setCurrentSelection("");
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Action handlers
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentSelection);
    setShowPopover(false);
    window.getSelection()?.removeAllRanges();
    setCurrentSelection("");
  }, [currentSelection]);

  const handleAddToChat = useCallback(() => {
    onAddToChat(currentSelection);
    setShowPopover(false);
    window.getSelection()?.removeAllRanges();
    setCurrentSelection("");
  }, [currentSelection, onAddToChat]);

  const handleExplain = useCallback(() => {
    onAddToChat(`${t("explain")}: ${currentSelection}`);
    setShowPopover(false);
    window.getSelection()?.removeAllRanges();
    setCurrentSelection("");
  }, [currentSelection, onAddToChat, t]);

  // Calculate effective width
  const effectiveWidth = useMemo(() => {
    const baseWidth = 800;
    let width: number;

    switch (fitMode) {
      case "page-fit":
        width = containerWidth * zoom;
        break;
      case "100":
        width = baseWidth;
        break;
      case "80":
        width = baseWidth * 0.8;
        break;
      case "70":
        width = baseWidth * 0.7;
        break;
      default:
        width = baseWidth;
    }

    return Math.floor(width / 10) * 10; // Round to nearest 10
  }, [containerWidth, zoom, fitMode]);

  // Document handlers
  const handleDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      onLoaded(pdf.numPages);
      setLoadedPages(new Set([1])); // Start with just the first page
    },
    [onLoaded]
  );

  const handleDocumentLoadError = useCallback(
    (error: Error) => {
      console.error("PDF Load Error:", error);
      onError(error.message || t("pdfLoadError"));
    },
    [onError, t]
  );

  // Navigation
  const scrollToPage = useCallback((pageNumber: number) => {
    const pageElement = document.querySelector(`[data-page="${pageNumber}"]`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    if (activePage > 1) scrollToPage(activePage - 1);
  }, [activePage, scrollToPage]);

  const handleNextPage = useCallback(() => {
    if (pageCount && activePage < pageCount) scrollToPage(activePage + 1);
  }, [activePage, pageCount, scrollToPage]);

  const handlePageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInputValue(e.target.value);
    },
    []
  );

  const handlePageInputSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = parseInt(pageInputValue);
      if (pageNum && pageNum >= 1 && pageCount && pageNum <= pageCount) {
        scrollToPage(pageNum);
        setPageInputValue("");
      }
    },
    [pageInputValue, pageCount, scrollToPage]
  );

  const getZoomLabel = useCallback(() => {
    switch (fitMode) {
      case "page-fit":
        return t("pageFit");
      case "100":
        return "100%";
      case "80":
        return "80%";
      case "70":
        return "70%";
      default:
        return t("pageFit");
    }
  }, [fitMode, t]);

  // Keyboard shortcuts
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
      } else if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges();
        setCurrentSelection("");
        setShowPopover(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onZoomIn, onZoomOut, onResetZoom]);

  const placeholderPages = useMemo(() => {
    if (!pageCount) return [];
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }, [pageCount]);

  return (
    <Card className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div ref={containerRef} className="flex-1 overflow-hidden">
          <div className="sticky -top-1 z-20 flex items-center justify-between bg-white dark:border-zinc-200/20 dark:bg-zinc-950 px-3 py-2 border-b backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePrevPage}
                disabled={activePage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <form onSubmit={handlePageInputSubmit}>
                  <Input
                    type="text"
                    value={pageInputValue || activePage}
                    onChange={handlePageInputChange}
                    onBlur={() => setPageInputValue("")}
                    onFocus={(e) => e.target.select()}
                    className="h-8 w-12 text-center text-sm px-1"
                  />
                </form>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  / {pageCount || 0}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextPage}
                disabled={!pageCount || activePage >= pageCount}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {getZoomLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFitMode("page-fit")}>
                    {t("pageFit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFitMode("100")}>
                    100%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFitMode("80")}>
                    80%
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFitMode("70")}>
                    70%
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div
            ref={scrollAreaRef}
            className="h-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600"
          >
            {status.kind === "error" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                    {t("fileLoadError")}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {status.message}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("retry")}
                  </Button>
                </div>
              </div>
            ) : status.kind === "loading" ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    {t("loadingFile")}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("pleaseWait")}
                  </p>
                </div>
              </div>
            ) : (
              <div ref={pdfDocumentRef} className="flex flex-col items-center">
                <Document
                  file={src}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  onLoadError={handleDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center min-h-[600px]">
                      <Loader2 className="h-12 w-12 animate-spin text-zinc-400" />
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center min-h-[600px] text-red-600">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  }
                >
                  {placeholderPages.map((pageNumber) =>
                    loadedPages.has(pageNumber) ? (
                      <PDFPageComponent
                        key={pageNumber}
                        pageNumber={pageNumber}
                        width={effectiveWidth + 100}
                      />
                    ) : (
                      <div
                        key={pageNumber}
                        className="pdf-page-wrapper mb-2 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                        data-page={pageNumber}
                        style={{
                          width: effectiveWidth,
                          height: Math.round(effectiveWidth * 1.414),
                        }}
                      >
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                      </div>
                    )
                  )}
                </Document>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopover && currentSelection && (
        <div
          ref={popoverRef}
          className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={handleExplain}
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">{t("explain")}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={handleAddToChat}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{t("tabs.chat")}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">{t("copy")}</span>
            </Button>
          </div>
        </div>
      )}

      <style>{`
        ::selection {
          background-color: rgba(59, 130, 246, 0.35) !important;
        }
        .dark ::selection {
          background-color: rgba(96, 165, 250, 0.45) !important;
        }
        .react-pdf__Page__textContent {
          user-select: text !important;
        }
      `}</style>
    </Card>
  );
};

export default memo(PdfReader);
