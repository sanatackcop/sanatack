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
import {
  SidebarRefreshProvider,
  SidebarRefreshContextValue,
} from "@/context/SidebarRefreshContext";
import { usePageTitle } from "@/context/PageTitleContext";
import { useSettings } from "@/context/SettingsContexts";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import UpgradeModal from "@/shared/workspaces/modals/UpgradeModal";
import { useUserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const CONFIG = {
  AUTO_COLLAPSE_THRESHOLD: 10,
  MIN_SIZE: 13,
  DEFAULT_SIZE: 16,
  MAX_SIZE: 20,
  MAIN_MIN_SIZE: 55,
} as const;

const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
  SIDEBAR_SIZE: "sidebarSize",
} as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const { darkMode } = useSettings();
  const { title, titleContent } = usePageTitle();
  const userContext = useUserContext();
  const [sidebarRefreshers, setSidebarRefreshers] =
    React.useState<SidebarRefreshContextValue>({
      refreshWorkspace: async () => {},
      refreshSpace: async () => {},
    });

  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    return saved === "true";
  });

  const navigate = useNavigate();
  const [isDragging, setIsDragging] = React.useState(false);

  const getInitialSize = () => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_SIZE);
    return saved ? parseFloat(saved) : CONFIG.DEFAULT_SIZE;
  };

  const lastViableSize = React.useRef<number>(getInitialSize());

  const panelRef = React.useRef<any>(null);
  const autoCollapseTimeoutRef = React.useRef<number | null>(null);

  const [isMobile, setIsMobile] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const currentDir = i18n.dir();
  const isRTL = currentDir === "rtl";

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", currentDir);
  }, [currentDir]);

  React.useEffect(() => {
    if (panelRef.current && isCollapsed) {
      panelRef.current.collapse();
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isCollapsed));
  }, [isCollapsed]);

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

      if (panelCollapsed) return;

      if (size >= CONFIG.MIN_SIZE) {
        lastViableSize.current = size;
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_SIZE, String(size));
      }

      if (size < CONFIG.AUTO_COLLAPSE_THRESHOLD && size > 1 && !isDragging) {
        autoCollapseTimeoutRef.current = window.setTimeout(() => {
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
        autoCollapseTimeoutRef.current = window.setTimeout(() => {
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
    if (panelRef.current) {
      panelRef.current.collapse();
    }
  }, []);

  const handleExpand = React.useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const TopBar = () => (
    <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isMobile || isCollapsed ? (
          <button
            type="button"
            onClick={() =>
              isMobile ? setIsMobileMenuOpen(true) : expandSidebar()
            }
            className={`
                    inline-flex items-center gap-2 px-2 py-2 rounded-xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40 group
                    bg-white/80 border border-gray-200/50 shadow-sm backdrop-blur-sm
                    hover:bg-gray-50 hover:shadow-md duration-200 transition-all
                    dark:border-white/10 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/90
                    ${isRTL ? "right-3" : "left-3"}
                  `}
            aria-label={isRTL ? "فتح الشريط الجانبي" : "Open sidebar"}
            title={isRTL ? "فتح الشريط الجانبي" : "Open sidebar"}
          >
            <PanelLeft className="h-4 w-4 text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 duration-200 transition-all" />
          </button>
        ) : null}

        {(isMobile || isCollapsed) && (
          <img
            src={String(darkMode ? LogoDark : LogoLight)}
            alt="Logo"
            className="h-6 w-auto cursor-pointer"
            onClick={() => navigate(`/dashboard/overview`)}
          />
        )}
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
          {title}
        </span>

        {titleContent && <div className="flex-1 min-w-0">{titleContent}</div>}
      </div>

      {!userContext?.isPro() && (
        <div className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""}`}>
          <UpgradeModal />
        </div>
      )}
    </div>
  );

  const mainContent = (
    <main className="flex-1 min-w-0 min-h-0 flex flex-col">
      <TopBar />
      <div className="flex-1 min-w-0 min-h-0 flex">
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
      </div>
    </main>
  );

  return (
    <SidebarRefreshProvider value={sidebarRefreshers}>
      <SidebarProvider>
        <div
          className="flex h-dvh w-screen overflow-hidden bg-zinc-100/20 dark:bg-[#101012]"
          dir={currentDir}
        >
          {isMobile ? (
            <>
              <AppSidebar
                onCollapse={handleCollapse}
                onRefreshersChange={setSidebarRefreshers}
                isMobile={isMobile}
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuChange={setIsMobileMenuOpen}
              />
              <div className="relative flex h-full min-w-0 flex-1">
                {mainContent}
              </div>
            </>
          ) : (
            <ResizablePanelGroup
              key={currentDir}
              direction="horizontal"
              dir={currentDir}
            >
              <ResizablePanel
                ref={panelRef}
                defaultSize={lastViableSize.current}
                minSize={CONFIG.MIN_SIZE}
                maxSize={CONFIG.MAX_SIZE}
                collapsible={true}
                collapsedSize={0}
                onResize={handlePanelResize}
                onCollapse={() => setIsCollapsed(true)}
                onExpand={handleExpand}
                className="transition-all duration-200 ease-out"
              >
                <div
                  className={`h-full transition-opacity duration-200 ${
                    isCollapsed
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  }`}
                >
                  <AppSidebar
                    onCollapse={handleCollapse}
                    onRefreshersChange={setSidebarRefreshers}
                    isMobile={isMobile}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle={false}
                onDragging={handleDraggingChange}
                aria-label={
                  isRTL ? "تغيير حجم الشريط الجانبي" : "Resize sidebar"
                }
                className={`
              relative z-20 w-1.5 select-none
              transition-all duration-200 ease-out cursor-col-resize
              ${isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"}
              before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 
              before:w-px before:transition-colors before:duration-200
              ${
                isDragging
                  ? "before:bg-blue-400/60"
                  : "before:bg-border/40 hover:before:bg-blue-300/50"
              }
            `}
              />

              <ResizablePanel
                defaultSize={100 - lastViableSize.current}
                minSize={CONFIG.MAIN_MIN_SIZE}
                className="min-w-0"
              >
                <div className="relative flex h-full min-w-0 min-h-0">
                  {mainContent}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </SidebarProvider>
    </SidebarRefreshProvider>
  );
}
