import { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";
import { X, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface LazyPdfPageProps {
  pageNumber: number;
  isSelected: boolean;
  onToggle: () => void;
}

export default function LazyPage({
  pageNumber,
  isSelected,
  onToggle,
}: LazyPdfPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={[
          "group relative rounded-xl border border-zinc-200 dark:border-zinc-800",
          "bg-white dark:bg-zinc-900 p-3 transition-shadow hover:shadow-sm",
          isSelected ? "bg-zinc-50 dark:bg-zinc-900/60" : "",
        ].join(" ")}
      >
        <div className="relative mx-auto w-fit">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={isSelected}
            className="relative block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
          >
            {isVisible ? (
              <Page pageNumber={pageNumber} width={180} />
            ) : (
              <div className="h-[230px] w-[180px] rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            )}

            <div
              className={[
                "absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-medium backdrop-blur",
                isSelected
                  ? "bg-[#0eb981] text-white"
                  : "bg-white/85 text-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200",
              ].join(" ")}
            >
              Page {pageNumber}
            </div>

            <div
              className={[
                "absolute right-2 top-2 h-2.5 w-2.5 rounded-full",
                isSelected ? "bg-[#0eb981]" : "bg-zinc-300 dark:bg-zinc-600",
              ].join(" ")}
            />
          </button>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="
              absolute bottom-2 right-2 z-10 rounded-md
              border border-zinc-200 dark:border-zinc-700
              bg-white/90 dark:bg-zinc-900/90 backdrop-blur
              p-1.5 text-zinc-700 dark:text-zinc-200 shadow-sm
              opacity-0 group-hover:opacity-100 transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
            "
            aria-label="Magnify page"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 text-xs">
          {isSelected ? (
            <span className="font-medium text-[#0eb981]">Included</span>
          ) : (
            <span className="text-zinc-500">Click to include</span>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="bg-black/50" />

        <DialogContent
          className="
      max-w-[90vw] max-h-[90vh]
      p-0 overflow-hidden
      bg-zinc-900
    "
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close preview"
            className="
        absolute right-4 top-4 z-20
        rounded-full bg-white p-2
        text-black shadow
        hover:bg-zinc-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-black
      "
          >
            <X className="h-4 w-4" />
          </button>

          {/* Preview content */}
          <div className="flex h-[90vh] w-[90vw] items-center justify-center overflow-auto p-6">
            <Page
              pageNumber={pageNumber}
              scale={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
