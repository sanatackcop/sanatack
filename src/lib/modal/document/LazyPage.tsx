import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { Page } from "react-pdf";

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="border rounded-md p-3 flex flex-col items-center gap-2 bg-zinc-50 dark:bg-zinc-900"
    >
      {isVisible ? (
        <Page pageNumber={pageNumber} width={180} />
      ) : (
        <div className="w-[180px] h-[230px] rounded-md bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      )}

      <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-200 mt-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="h-4 w-4 accent-blue-600"
        />
        <span>Include page {pageNumber}</span>
      </label>
    </div>
  );
}
