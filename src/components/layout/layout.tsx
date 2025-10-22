import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import * as React from "react";
import { PanelLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const CONFIG = {
  AUTO_COLLAPSE_THRESHOLD: 10,
  MIN_SIZE: 13,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 16,
  MAIN_MIN_SIZE: 55,
} as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const lastViableSize = React.useRef<number>(CONFIG.DEFAULT_SIZE);
  const panelRef = React.useRef<any>(null);
  const autoCollapseTimeoutRef = React.useRef<number | null>(null);

  const currentDir = i18n.dir();
  const isRTL = currentDir === "rtl";

  React.useEffect(() => {
    return () => {
      if (autoCollapseTimeoutRef.current) {
        clearTimeout(autoCollapseTimeoutRef.current);
      }
    };
  }, []);

  const handlePanelResize = React.useCallback(
    (size: number) => {
      if (autoCollapseTimeoutRef.current) {
        clearTimeout(autoCollapseTimeoutRef.current);
        autoCollapseTimeoutRef.current = null;
      }

      const panelCollapsed = size <= 1;
      setIsCollapsed(panelCollapsed);

      if (panelCollapsed) {
        return;
      }

      if (size >= CONFIG.MIN_SIZE) {
        lastViableSize.current = size;
      }

      if (size < CONFIG.AUTO_COLLAPSE_THRESHOLD && size > 1 && !isDragging) {
        autoCollapseTimeoutRef.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.collapse();
          }
        }, 200);
      }
    },
    [isDragging]
  );

  const handleDraggingChange = React.useCallback((dragging: boolean) => {
    setIsDragging(dragging);

    if (dragging && autoCollapseTimeoutRef.current) {
      clearTimeout(autoCollapseTimeoutRef.current);
      autoCollapseTimeoutRef.current = null;
    }

    if (!dragging && panelRef.current) {
      const currentSize = panelRef.current.getSize();
      if (currentSize < CONFIG.AUTO_COLLAPSE_THRESHOLD && currentSize > 1) {
        autoCollapseTimeoutRef.current = setTimeout(() => {
          if (panelRef.current) {
            panelRef.current.collapse();
          }
        }, 300);
      }
    }
  }, []);

  const expandSidebar = React.useCallback(() => {
    if (panelRef.current) {
      const targetSize = Math.max(
        CONFIG.MIN_SIZE,
        Math.min(lastViableSize.current, CONFIG.MAX_SIZE)
      );
      panelRef.current.resize(targetSize);
    }
  }, []);

  const handleCollapse = React.useCallback(() => {
    setIsCollapsed(true);
  }, []);

  const handleExpand = React.useCallback(() => {
    setIsCollapsed(false);
  }, []);

  return (
    <SidebarProvider>
      <div
        className="flex h-dvh w-screen overflow-hidden bg-zinc-100/20 dark:bg-[#101012]"
        dir={currentDir}
      >
        <ResizablePanelGroup
          direction="horizontal"
          className={isRTL ? "flex-row-reverse" : ""}
        >
          <ResizablePanel
            ref={panelRef}
            defaultSize={CONFIG.DEFAULT_SIZE}
            minSize={CONFIG.MIN_SIZE}
            maxSize={CONFIG.MAX_SIZE}
            collapsible={true}
            collapsedSize={0}
            onResize={handlePanelResize}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
            className="transition-all duration-200 ease-out"
          >
            <div
              className={`h-full transition-opacity duration-200 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              }`}
            >
              <AppSidebar />
            </div>
          </ResizablePanel>

          <ResizablePanel
            defaultSize={100 - CONFIG.DEFAULT_SIZE}
            minSize={CONFIG.MAIN_MIN_SIZE}
            className="min-w-0"
          >
            <div className="relative flex h-full min-w-0 min-h-0">
              {!isCollapsed && (
                <ResizableHandle
                  withHandle={false}
                  onDragging={handleDraggingChange}
                  aria-label={
                    isRTL
                      ? "[translate:تغيير حجم الشريط الجانبي]"
                      : "Resize sidebar"
                  }
                  className={`
                    absolute top-0 ${
                      isRTL ? "right-0" : "left-0"
                    } z-20 h-full w-1.5 select-none
                    transition-all duration-200 ease-out cursor-col-resize
                    ${
                      isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"
                    }
                    before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 
                    before:w-px before:transition-colors before:duration-200
                    ${
                      isDragging
                        ? "before:bg-blue-400/60"
                        : "before:bg-border/40 hover:before:bg-blue-300/50"
                    }
                  `}
                />
              )}

              {isCollapsed && (
                <button
                  type="button"
                  onClick={expandSidebar}
                  className={`
                    absolute top-3 z-30 inline-flex items-center gap-2 px-2 py-2 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 group
                    hover:bg-gray-100/40 duration-400 transition-all ease-linear
                    dark:border-white/10 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/90
                    ${isRTL ? "right-3" : "left-3"}
                  `}
                  aria-label={
                    isRTL ? "[translate:فتح الشريط الجانبي]" : "Open sidebar"
                  }
                  title={
                    isRTL ? "[translate:فتح الشريط الجانبي]" : "Open sidebar"
                  }
                >
                  <PanelLeft className="h-4 w-4 text-zinc-600 group-hover:text-zinc-950 duration-200 transition-all ease-linear" />
                </button>
              )}

              <main className={`flex-1 min-w-0 min-h-0 flex`}>
                <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <div className="h-full min-h-0 overflow-hidden">
                      <div
                        className="h-full overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-blue-200/70
                       scrollbar-track-transparent hover:scrollbar-thumb-blue-300/80"
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
}
