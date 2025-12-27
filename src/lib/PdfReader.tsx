import React, { useEffect, useRef, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Status } from "./types";

if (
  typeof window !== "undefined" &&
  pdfjs.GlobalWorkerOptions.workerSrc !== workerSrc
) {
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
}

interface PdfReaderProps {
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
}

const PdfReader: React.FC<PdfReaderProps> = ({
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
}) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(800);

  /* ───────────────── Resize (simple & stable) ───────────────── */
  useEffect(() => {
    const update = () => {
      if (!scrollRef.current) return;
      setContainerWidth(Math.max(400, scrollRef.current.clientWidth - 64));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ───────────────── Scroll to page (controlled) ───────────────── */
  useEffect(() => {
    const el = document.querySelector(`[data-page="${page}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  /* ───────────────── PDF handlers ───────────────── */
  const handleLoadSuccess = (pdf: any) => {
    onLoaded(pdf.numPages);
  };

  const handleLoadError = (err: Error) => {
    console.error(err);
    onError(err.message || t("pdfLoadError"));
  };

  return (
    <Card className="flex h-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white dark:bg-zinc-950 px-3 py-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => page > 1 && onGoto(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {page} / {pageCount || 0}
            </span>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => pageCount && page < pageCount && onGoto(page + 1)}
              disabled={!pageCount || page >= pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onZoomOut}>
              −
            </Button>
            <Button size="sm" variant="outline" onClick={onResetZoom}>
              {Math.round(zoom * 100)}%
            </Button>
            <Button size="sm" variant="outline" onClick={onZoomIn}>
              +
            </Button>
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-thin">
          {status.kind === "error" ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <RotateCcw className="mx-auto mb-4 h-10 w-10 text-red-500" />
                <p className="text-sm text-zinc-600">{status.message}</p>
              </div>
            </div>
          ) : status.kind === "loading" ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
            </div>
          ) : (
            <Document
              file={src}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              loading={
                <div className="flex h-[600px] items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
                </div>
              }
            >
              {Array.from({ length: pageCount || 0 }, (_, i) => i + 1).map(
                (p) => (
                  <div
                    key={p}
                    data-page={p}
                    className="mb-4 flex justify-center"
                  >
                    <Page
                      pageNumber={p}
                      width={containerWidth * zoom}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                )
              )}
            </Document>
          )}
        </div>
      </div>
    </Card>
  );
};

export default memo(PdfReader);
