import { useState, useEffect, useMemo, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Crown,
  Box,
  BoxIcon,
  ChevronDown,
  LogOut,
  Brain,
  CalendarDaysIcon,
  CheckCircle,
  Zap,
  Clock10,
  MapIcon,
  Moon,
  Sun,
  Languages,
  MessageCircle,
  Tablet,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings,
  X,
} from "lucide-react";
import clsx from "clsx";
import { Progress } from "@/components/ui/progress";
import { createSpacesApi, getAllSpacesApi } from "@/utils/_apis/courses-apis";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import { fetchRateLimitSummary } from "@/utils/_apis/rate-limit-api";
import Skeleton from "@mui/material/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";
import { SearchCommand } from "@/pages/dashboard/search/Index";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import type { RateLimitSummaryResponse } from "@/types/rateLimit";
import type { SidebarRefreshContextValue } from "@/context/SidebarRefreshContext";
import { i18n, t } from "i18next";
import {
  MenuGroupEntry,
  RecentWorkspaceEntry,
  SectionHeader,
} from "./sidehelp";

type MenuItem =
  | {
      title: string;
      icon: any;
      comingSoon?: boolean;
      url: string;
      type?: "link";
      onClick?: any;
    }
  | {
      title: string;
      icon: any;
      type: "feedback";
    };

type LinkMenuItem = Extract<MenuItem, { url: string }>;
export type FeedbackMenuItem = Extract<MenuItem, { type: "feedback" }>;

type MenuGroup = {
  id: string;
  groupTitle: string;
  menuItems: Array<LinkMenuItem | FeedbackMenuItem>;
};

interface Workspace {
  id: string;
  title?: string;
  workspaceName?: string;
  type: "video" | "docuemnt";
  updatedAt: string;
}

type RawSpace = { id: string; name: string; description?: string | null };
type SpaceItem = { id: string; title: string; url: string };

type AppSidebarContentProps = {
  i18n: i18n;
  language: string;
  darkMode: boolean;
  isMobile: boolean;
  isRTL: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setLanguage: (lng: string) => void;
  onCollapse?: () => void;
  onRefreshersChange?: (value: SidebarRefreshContextValue) => void;
};

const AppSidebarContent = ({
  i18n,
  language,
  darkMode,
  isMobile,
  isRTL,
  setIsSettingsOpen,
  toggleDarkMode,
  onCollapse,
  setIsMobileMenuOpen,
  setLanguage,
  onRefreshersChange,
}: AppSidebarContentProps) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { logout, auth, isPro } = useUserContext();
  const [showAllRecent, setShowAllRecent] = useState(false);
  const navigate = useNavigate();
  const [openSerach, setOpenSearch] = useState(false);
  const [loadingRateLimits, setLoadingRateLimits] = useState<boolean>(true);
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    setNewName(t("sidebar.newSpace"));
  }, [t]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  const nextLanguage = language === "ar" ? "en" : "ar";
  const nextLanguageLabel = t(`languages.${nextLanguage}`);

  const getTextAlignment = () => (isRTL ? "text-right" : "text-left");
  const getFlexDirection = () => (isRTL ? "flex-row-reverse" : "flex-row");

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem("sidebar.openGroups", JSON.stringify(openGroups));
  }, [openGroups]);

  const openSearchCommand = () => setOpenSearch(true);
  const topItemGroups: MenuGroup[] = useMemo(
    () => [
      {
        id: "learning",
        groupTitle: t("sidebar.groups.learning"),
        menuItems: [
          {
            title: t("sidebar.items.myLearning"),
            url: "/dashboard/overview",
            icon: Box,
          },
          {
            title: t("common.search"),
            url: "#search",
            icon: Search,
            onClick: openSearchCommand,
          },
          {
            title: t("sidebar.createMap"),
            url: "/dashboard/learn/map",
            icon: MapIcon,
            comingSoon: true,
          },
          {
            title: t("sidebar.items.yourBrain"),
            url: "/dashboard/learn/brain",
            icon: Brain,
            comingSoon: true,
          },
        ],
      },
      {
        id: "taskManagement",
        groupTitle: t("sidebar.groups.taskManagement"),
        menuItems: [
          {
            title: t("sidebar.items.tasks"),
            url: "/dashboard/learn/tasks",
            icon: CheckCircle,
            comingSoon: true,
          },
          {
            title: t("sidebar.items.promodo"),
            url: "/dashboard/learn/promodo",
            icon: Clock10,
            comingSoon: true,
          },
          {
            title: t("common.calendar"),
            url: "/dashboard/learn/calendar",
            icon: CalendarDaysIcon,
            comingSoon: true,
          },
        ],
      },
      {
        id: "helpTools",
        groupTitle: t("sidebar.groups.helpTools"),
        menuItems: [
          {
            title: t("sidebar.feedback"),
            icon: MessageCircle,
            type: "feedback",
          },
          {
            title: t("sidebar.app"),
            url: "https://chrome.google.com/webstore/category/extensions",
            comingSoon: true,
            icon: Tablet,
          },
        ],
      },
    ],
    [t]
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("sidebar.openGroups") || "{}"
      );
      const withDefaults: Record<string, boolean> = { ...saved };
      topItemGroups.forEach((g) => {
        if (withDefaults[g.id] === undefined) withDefaults[g.id] = true;
      });
      setOpenGroups(withDefaults);
    } catch {
      const initial: Record<string, boolean> = {};
      topItemGroups.forEach((g) => (initial[g.id] = true));
      setOpenGroups(initial);
    }
  }, []);

  const allItemGroups = useMemo(() => topItemGroups, [topItemGroups]);
  const [rateLimitSummary, setRateLimitSummary] =
    useState<RateLimitSummaryResponse | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingRateLimits(true);
        const summary = await fetchRateLimitSummary();
        if (mounted) setRateLimitSummary(summary);
      } catch (error) {
        console.error("Failed to fetch rate limit summary", error);
      } finally {
        if (mounted) setLoadingRateLimits(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const overallUsage = useMemo(() => {
    if (!rateLimitSummary) return null;
    const finite = rateLimitSummary.usage.filter(
      (item) => typeof item.limit === "number" && item.limit !== null
    );
    const totalLimit = finite.reduce((sum, item) => sum + (item.limit ?? 0), 0);
    const totalUsed = finite.reduce(
      (sum, item) => sum + (item.usedCredits ?? 0),
      0
    );

    if (totalLimit <= 0) {
      return { used: totalUsed, limit: null, progress: 0 };
    }

    return {
      used: totalUsed,
      limit: totalLimit,
      progress: Math.min((totalUsed / totalLimit) * 100, 100),
    };
  }, [rateLimitSummary]);
  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const doCreateSpace = async () => {
    setCreating(true);
    setSpacesError(null);
    try {
      const payload = { name: newName?.trim() || t("sidebar.newSpace") };
      const res = await createSpacesApi(payload);
      const created: RawSpace = (res?.data ?? res) as RawSpace;
      const item: SpaceItem = {
        id: created.id,
        title: created.name,
        url: `/dashboard/spaces/${created.id}`,
      };
      setSpaces((prev) => [item, ...prev]);
      setOpenCreate(false);
      navigate(item.url);
    } catch (e: any) {
      setSpacesError(e?.message ?? t("errors.failedToCreateSpace"));
    } finally {
      setCreating(false);
    }
  };

  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const refreshSpace = useCallback(async () => {
    setLoadingSpaces(true);
    setSpacesError(null);
    try {
      const res = await getAllSpacesApi();
      const list: RawSpace[] = (res?.data ?? res) as RawSpace[];
      const mapped: SpaceItem[] = (list || []).map((s) => ({
        id: s.id,
        title: s.name,
        url: `/dashboard/spaces/${s.id}`,
      }));
      setSpaces(mapped);
    } catch (e: any) {
      setSpacesError(e?.message ?? t("errors.failedToLoadSpaces"));
    } finally {
      setLoadingSpaces(false);
    }
  }, [t]);

  const refreshWorkspace = useCallback(async () => {
    try {
      setLoadingRecent(true);
      const { workspaces: fetchedWorkspaces }: any = await getAllWorkSpace({});
      const sortedWorkspaces =
        fetchedWorkspaces?.sort(
          (a: Workspace, b: Workspace) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ) || [];
      setWorkspaces(sortedWorkspaces);
    } catch {
      setWorkspaces([]);
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkspace();
  }, [refreshWorkspace]);

  useEffect(() => {
    refreshSpace();
  }, [refreshSpace]);
  useEffect(() => {
    onRefreshersChange?.({ refreshWorkspace, refreshSpace });
  }, [onRefreshersChange, refreshWorkspace, refreshSpace]);

  const toggleLanguage = async () => {
    const newLang = language === "ar" ? "en" : "ar";
    try {
      await i18n.changeLanguage(newLang);
      setLanguage(newLang);
      const newDir = i18n.dir(newLang);
      document.documentElement.setAttribute("dir", newDir);
      document.documentElement.setAttribute("lang", newLang);
      toast.success(
        t("languages.changed", { lang: t(`languages.${newLang}`) })
      );
    } catch {
      const newDir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", newDir);
      document.documentElement.setAttribute("lang", newLang);
    }
  };

  return (
    <>
      <SearchCommand
        open={openSerach}
        setOpen={setOpenSearch}
        spaces={spaces}
        workspaces={(workspaces as any) ?? []}
        onNavigate={(path) => {
          navigate(path);
          if (isMobile) {
            setIsMobileMenuOpen(false);
          }
        }}
      />
      <div className="flex flex-col h-full py-2 pl-3 pr-2">
        <div className="flex items-center justify-between mb-2">
          <div
            className={clsx(
              "h-[30px] flex items-center overflow-hidden w-full justify-between group relative"
            )}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img
              src={String(darkMode ? LogoDark : LogoLight)}
              alt="logo"
              onClick={() => {
                navigate("/dashboard/overview");
                if (isMobile) setIsMobileMenuOpen(false);
              }}
              width={20}
              height={10}
              className={`h-full cursor-pointer w-auto transition-all object-contain scale-110 ${
                isRTL ? "pr-2" : "pl-2"
              }`}
            />

            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  "p-1.5 rounded-md transition-all duration-200",
                  "hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-accent-foreground",
                  isRTL ? "ml-2" : "mr-2"
                )}
                aria-label="Close sidebar"
              >
                <X size={20} strokeWidth={2} />
              </button>
            )}

            {/* Collapse button for desktop - appears on hover */}
            {!isMobile && (
              <button
                onClick={onCollapse}
                className={clsx(
                  "p-1.5 rounded-md transition-all duration-200",
                  "hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-accent-foreground",
                  isLogoHovered ? "opacity-100 visible" : "opacity-0 invisible",
                  isRTL ? "ml-2" : "mr-2"
                )}
                aria-label={t("sidebar.collapse", "Collapse sidebar")}
              >
                {isRTL ? (
                  <ChevronsRight size={18} strokeWidth={2} />
                ) : (
                  <ChevronsLeft size={18} strokeWidth={2} />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col space-y-2 mb-2">
          {allItemGroups.map((group) => (
            <MenuGroupEntry
              key={group.id}
              group={group}
              isRTL={isRTL}
              open={!!openGroups[group.id]}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
          <hr className="-mx-5 dark:border-zinc-700" />
        </div>

        <div
          className="flex-1 overflow-y-auto min-h-0 py-2 space-y-4"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: darkMode
              ? "rgb(55 65 81 / 0.5) transparent"
              : "rgb(209 213 219 / 0.5) transparent",
          }}
        >
          <div>
            <SectionHeader title={t("sidebar.recent")} />
            <div className="space-y-0.5">
              {loadingRecent ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex items-center gap-2 px-2 py-1.5",
                      getFlexDirection()
                    )}
                  >
                    <Skeleton
                      variant="circular"
                      width={16}
                      height={16}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={12}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                  </div>
                ))
              ) : !workspaces || workspaces.length === 0 ? (
                <div
                  className={clsx(
                    "px-2 py-1.5 text-[13px] text-sidebar-foreground/50",
                    getTextAlignment()
                  )}
                >
                  {t("sidebar.noRecentWorkspaces", "No recent workspaces")}
                </div>
              ) : (
                <>
                  {(showAllRecent ? workspaces : workspaces.slice(0, 5)).map(
                    (workspace) => (
                      <RecentWorkspaceEntry
                        key={workspace.id}
                        workspace={workspace}
                      />
                    )
                  )}
                  {workspaces.length > 5 && (
                    <button
                      onClick={() => setShowAllRecent((prev) => !prev)}
                      className={clsx(
                        "w-full px-2 py-1.5 text-[12px] text-sidebar-foreground/60 hover:text-sidebar-accent-foreground rounded-md hover:bg-sidebar-accent/50 transition-colors font-normal",
                        getTextAlignment()
                      )}
                    >
                      {showAllRecent
                        ? t("sidebar.showLess")
                        : t("sidebar.showMore")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Spaces Section */}
          <div>
            <SectionHeader
              title={t("sidebar.spaces")}
              action={
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                  <DialogContent
                    dir={isRTL ? "rtl" : "ltr"}
                    className="rounded-2xl"
                  >
                    <DialogHeader className={getTextAlignment()}>
                      <DialogTitle className={getTextAlignment()}>
                        {t("dialogs.createNewSpace")}
                      </DialogTitle>
                      <DialogDescription className={getTextAlignment()}>
                        {t("dialogs.chooseSpaceName")}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3">
                      <Label
                        htmlFor="space-name"
                        className={getTextAlignment()}
                      >
                        {t("dialogs.spaceName")}
                      </Label>
                      <Input
                        id="space-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={t("dialogs.spaceNamePlaceholder")}
                        className="rounded-lg"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{ textAlign: isRTL ? "right" : "left" }}
                      />
                    </div>

                    {spacesError && (
                      <p
                        className={clsx(
                          "text-sm text-red-600 dark:text-red-400",
                          getTextAlignment()
                        )}
                      >
                        {spacesError}
                      </p>
                    )}

                    <DialogFooter
                      className={clsx(
                        "gap-2 sm:gap-2",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => setOpenCreate(false)}
                        disabled={creating}
                        className="rounded-lg"
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={doCreateSpace}
                        disabled={creating || !newName.trim()}
                        className="rounded-lg"
                      >
                        {creating ? t("dialogs.creating") : t("common.save")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              }
            />

            <div className="space-y-0.5">
              {loadingSpaces ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex items-center gap-2 px-2 py-1.5",
                      getFlexDirection()
                    )}
                  >
                    <Skeleton
                      variant="circular"
                      width={16}
                      height={16}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={12}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                  </div>
                ))
              ) : spacesError ? (
                <div
                  className={clsx(
                    "px-2 py-1.5 text-[13px] text-red-600 dark:text-red-400",
                    getTextAlignment()
                  )}
                >
                  {spacesError}
                </div>
              ) : spaces.length === 0 ? (
                <div
                  className={clsx(
                    "px-2 py-1.5 text-[13px] text-sidebar-foreground/50",
                    getTextAlignment()
                  )}
                >
                  {t("sidebar.noSpacesYet")}
                </div>
              ) : (
                <>
                  {(showAllSpaces ? spaces : spaces.slice(0, 4)).map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.url}
                      className={({ isActive }) =>
                        clsx(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors duration-150 group",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      <BoxIcon
                        size={16}
                        strokeWidth={1.75}
                        className="flex-shrink-0 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                      />
                      <span
                        className={clsx(
                          "text-[13px] font-normal flex-1 truncate",
                          getTextAlignment()
                        )}
                      >
                        {item.title}
                      </span>
                    </NavLink>
                  ))}

                  {spaces.length > 4 && (
                    <button
                      onClick={() => setShowAllSpaces((prev) => !prev)}
                      className={clsx(
                        "w-full px-2 py-1.5 text-[12px] text-sidebar-foreground/60 hover:text-sidebar-accent-foreground rounded-md hover:bg-sidebar-accent/50 transition-colors font-normal",
                        getTextAlignment()
                      )}
                    >
                      {showAllSpaces
                        ? t("sidebar.showLess")
                        : t("sidebar.showMore")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {!isPro?.() && (
            <div>
              <SectionHeader
                title={t("sidebar.limits.title", { defaultValue: "Usage" })}
              />
              <div
                className="space-y-3 rounded-xl border border-zinc-200/70 bg-white p-3 
              shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900"
              >
                {loadingRateLimits ? (
                  <div className="space-y-3">
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={12}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={12}
                      sx={{
                        bgcolor: darkMode
                          ? "rgb(55 65 81)"
                          : "rgb(229 231 235)",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div
                        className={clsx(
                          "flex items-center justify-between text-[12px] font-medium text-sidebar-foreground",
                          getFlexDirection()
                        )}
                      >
                        <span>
                          {t("sidebar.limits.title", { defaultValue: "Usage" })}
                        </span>
                        <span className="text-[11px] text-sidebar-foreground/60">
                          {overallUsage?.limit === null
                            ? t("sidebar.limits.unlimited", {
                                defaultValue: t("dashboard.usage.unlimited", {
                                  defaultValue: "Unlimited",
                                }),
                              })
                            : t("dashboard.usage.usageSummary", {
                                used: overallUsage?.used ?? 0,
                                limit: overallUsage?.limit ?? 0,
                              })}
                        </span>
                      </div>
                      <Progress
                        value={overallUsage?.progress ?? 0}
                        className="h-2"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="button"
                  onClick={() => window.open("/#pricing", "_blank")}
                  className={clsx(
                    "w-full gap-2 rounded-lg dark:bg-[#0FB27C] dark:text-white bg-[#0FB27C] text-white shadow-sm hover:bg-[#003926]",
                    getFlexDirection()
                  )}
                >
                  <Zap size={16} strokeWidth={2} />
                  <span>{t("sidebar.limits.seePricing")}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div
            className="relative user-dropdown-container bg-white dark:bg-zinc-800 backdrop-blur-sm rounded-xl border border-zinc-200/50
         dark:border-zinc-700/30"
          >
            <button
              onClick={() => setShowUserDropdown((s) => !s)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {auth.user.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={clsx("flex-1 min-w-0", getTextAlignment())}>
                <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                  {auth.user.firstName}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 font-normal">
                  {t("sidebar.freePlan")}
                </p>
              </div>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className={clsx(
                  "text-sidebar-foreground/50 transition-transform duration-200 flex-shrink-0",
                  showUserDropdown && "rotate-180"
                )}
              />
            </button>

            {showUserDropdown && (
              <div
                className="absolute bottom-full left-0 right-0 mb-2 bg-white 
            dark:bg-zinc-900 backdrop-blur-xl border border-white/20 dark:border-zinc-700/30 rounded-2xl p-2 z-50"
              >
                <button
                  onClick={toggleDarkMode}
                  className={clsx(
                    "w-full flex items-center gap-2 px-2 py-2 hover:bg-sidebar-accent/50 rounded-md text-[13px] transition-colors text-sidebar-foreground font-normal",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  {darkMode ? (
                    <Sun size={16} strokeWidth={2} />
                  ) : (
                    <Moon size={16} strokeWidth={2} />
                  )}
                  <span className="flex-1">
                    {darkMode
                      ? t("settings.lightMode", "Light Mode")
                      : t("settings.darkMode", "Dark Mode")}
                  </span>
                </button>

                <button
                  onClick={toggleLanguage}
                  className={clsx(
                    "w-full flex items-center gap-2 px-2 py-2 hover:bg-sidebar-accent/50 rounded-md text-[13px] transition-colors text-sidebar-foreground font-normal",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <Languages size={16} strokeWidth={2} />
                  <span className="flex-1">
                    {t("languages.switchTo", {
                      lang: nextLanguageLabel,
                      defaultValue: `Switch to ${nextLanguageLabel}`,
                    })}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setShowUserDropdown(false);
                  }}
                  className={clsx(
                    "w-full flex items-center gap-2 px-2 py-2 hover:bg-sidebar-accent/50 rounded-md text-[13px] transition-colors text-sidebar-foreground font-normal",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <Settings size={16} strokeWidth={2} />
                  <span className="flex-1">{t("sidebar.settings")}</span>
                </button>

                <button
                  className={clsx(
                    "w-full flex items-center gap-2 px-2 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md text-[13px] transition-colors font-normal",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <Crown
                    size={16}
                    strokeWidth={2}
                    className="text-yellow-600 dark:text-yellow-500"
                  />
                  <span className="flex-1 text-sidebar-foreground">
                    {t("sidebar.upgrade")}
                  </span>
                </button>

                <button
                  onClick={() => logout()}
                  className={clsx(
                    "w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-[13px] text-red-600 dark:text-red-400 transition-colors font-normal",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <LogOut size={16} strokeWidth={2} />
                  <span className="flex-1">{t("sidebar.logout")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebarContent;
