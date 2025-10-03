import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Crown,
  Plus,
  MapIcon,
  CalendarDaysIcon,
  CheckCircle,
  Clock10,
  Brain,
  ChevronsUpDown,
  Box,
  Play,
  BoxIcon,
  ChevronDown,
  LogOut,
  Globe,
} from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSpacesApi, getAllSpacesApi } from "@/utils/_apis/courses-apis";
import { getAllWorkSpace } from "@/utils/_apis/learnPlayground-api";
import Skeleton from "@mui/material/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
}

interface MenuGroup {
  groupTitle: string;
  menuItems: MenuItem[];
}

interface Workspace {
  id: string;
  title?: string;
  workspaceName?: string;
  contentType: "youtube" | "pdf";
  updatedAt: string;
}

type RawSpace = { id: string; name: string; description?: string | null };
type SpaceItem = { id: string; title: string; url: string };

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAllSpaces, setShowAllSpaces] = useState(false);

  const [currentWorkspace] = useState({
    name: "Working Towards A Plan 2025",
  });

  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true);
  const [showAllRecent, setShowAllRecent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isRTL = i18n.language === "ar";

  const getTextAlignment = () => (isRTL ? "text-right" : "text-left");
  const getFlexDirection = () => (isRTL ? "flex-row-reverse" : "flex-row");

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    setNewName(t("sidebar.newSpace"));
  }, [i18n.language, t]);

  const topItemGroups: MenuGroup[] = useMemo(
    () => [
      {
        groupTitle: "Learning",
        menuItems: [
          { title: "Add Content", url: "/dashboard/overview", icon: Plus },
          {
            title: t("sidebar.createMap"),
            url: "/dashboard/learn/map",
            icon: MapIcon,
          },
          { title: "Your Brain", url: "/dashboard/learn/brain", icon: Brain },
          { title: "Discover", url: "/dashboard/learn/ds", icon: Globe },
        ],
      },
      {
        groupTitle: "Task Management",
        menuItems: [
          { title: "Tasks", url: "/dashboard/learn/tasks", icon: CheckCircle },
          { title: "Promodo", url: "/dashboard/learn/promodo", icon: Clock10 },
          {
            title: t("common.calendar"),
            url: "/dashboard/learn/calendar",
            icon: CalendarDaysIcon,
          },
        ],
      },
    ],
    [t]
  );

  // New Help And Tools Group
  const helpAndToolsGroup: MenuGroup = {
    groupTitle: "Help And Tools",
    menuItems: [
      {
        title: "Discord",
        url: "https://discord.com",
        icon: Globe,
      },
      {
        title: "Chrome Extension",
        url: "https://chrome.google.com/webstore/category/extensions",
        icon: BoxIcon,
      },
    ],
  };

  // Combine all groups including the new HelpAndTools group
  const allItemGroups = useMemo(() => {
    return [...topItemGroups, helpAndToolsGroup];
  }, [topItemGroups]);

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

  useEffect(() => {
    const fetchSpaces = async () => {
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
    };
    fetchSpaces();
  }, [t]);

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

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoadingRecent(true);
        const { workspaces: fetchedWorkspaces }: any = await getAllWorkSpace();
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
    };
    fetchRecent();
  }, []);

  const getWorkspaceTitle = (workspace: Workspace) => {
    if (workspace.workspaceName) return workspace.workspaceName;
    return workspace.title || "Untitled";
  };

  const isWorkspaceActive = (workspaceId: string) => {
    return location.pathname === `/dashboard/learn/workspace/${workspaceId}`;
  };

  const MenuEntry = ({ item }: { item: MenuItem }) => {
    const ItemIcon = item.icon;
    const currentPathname = location.pathname;

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              className={clsx(
                "w-full flex items-center gap-2 px-3 py-2 transition-all duration-300 transform relative group rounded-xl",
                item.url === currentPathname
                  ? "bg-gray-100/70 text-zinc-900"
                  : "hover:bg-gray-100/70 text-zinc-400/80 hover:text-gray-900"
              )}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={
                item.url.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <ItemIcon
                size={14}
                className={clsx(
                  "flex-shrink-0",
                  item.url === currentPathname
                    ? "text-zinc-900"
                    : "text-zinc-400/80 group-hover:text-zinc-900"
                )}
              />
              <span
                className={clsx(
                  "text-xs font-medium flex-1",
                  getTextAlignment()
                )}
              >
                {item.title}
              </span>
            </NavLink>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const MenuGroupEntry = ({ group }: { group: MenuGroup }) => {
    return (
      <div>
        <div
          className={clsx(
            "flex items-center justify-between w-full px-2 py-2 text-xs text-[#60605d] font-normal select-none rounded-md",
            getFlexDirection()
          )}
        >
          <span>{group.groupTitle}</span>
        </div>
        <div className="ml-1 space-y-1">
          {group.menuItems.map((item) => (
            <MenuEntry key={item.url} item={item} />
          ))}
        </div>
      </div>
    );
  };

  const RecentWorkspaceEntry = ({ workspace }: { workspace: Workspace }) => {
    const isActive = isWorkspaceActive(workspace.id);
    const workspaceUrl = `/dashboard/learn/workspace/${workspace.id}`;

    return (
      <NavLink
        to={workspaceUrl}
        className={clsx(
          "w-full flex items-center py-2 rounded-xl transition-all duration-300",
          isActive
            ? "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
            : "hover:bg-gray-100/70 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        )}
      >
        <div className="relative flex-shrink-0 px-2">
          {isActive ? (
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </div>
        <span
          className={clsx(
            "text-xs font-medium flex-1 truncate",
            getTextAlignment()
          )}
        >
          {getWorkspaceTitle(workspace)}
        </span>
      </NavLink>
    );
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={i18n.language}
      className="h-full flex flex-col border-r bg-[#f9f9f6]"
    >
      <div className="flex flex-col h-full py-2 pl-3 pr-2">
        {/* Workspace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="group flex items-center gap-3 px-2 py-3 cursor-pointer rounded-xl bg-gray-200/50 transition-colors">
              <div
                className={clsx(
                  "flex flex-1 min-w-0 gap-2 items-center",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Box className="text-zinc-600 w-4 h-4" />
                <span className="text-xs font-medium text-zinc-600 dark:text-gray-100 truncate">
                  {currentWorkspace.name}
                </span>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* Top Menu Groups including Help And Tools */}
        <div className="flex-shrink-0 flex flex-col space-y-2">
          {allItemGroups.map((group) => (
            <MenuGroupEntry key={group.groupTitle} group={group} />
          ))}
          <hr className="-mx-5" />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-2 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Recent Workspaces */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3
                className={clsx(
                  "text-xs text-[#60605d] font-normal",
                  getTextAlignment()
                )}
              >
                {t("sidebar.recent")}
              </h3>
            </div>
            <div className="flex flex-col space-y-1">
              {loadingRecent ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex items-center gap-3 py-2",
                      getFlexDirection()
                    )}
                  >
                    <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
                    <div className="h-3 w-32 bg-gray-300 rounded-lg animate-pulse" />
                  </div>
                ))
              ) : !workspaces || workspaces.length === 0 ? (
                <div
                  className={clsx(
                    "py-2 text-xs text-muted-foreground",
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
                        "w-full text-[10px] text-gray-600 dark:text-gray-400 py-2 hover:underline transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/20",
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

          {/* Spaces */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3
                className={clsx(
                  "text-xs  text-[#60605d] font-normal dark:text-gray-200",
                  getTextAlignment()
                )}
              >
                {t("sidebar.spaces")}
              </h3>

              <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogTrigger asChild>
                  <button
                    className={clsx(
                      "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                      getFlexDirection()
                    )}
                  >
                    <Plus size={12} />
                  </button>
                </DialogTrigger>
                <DialogContent
                  dir={isRTL ? "rtl" : "ltr"}
                  className="rounded-3xl"
                >
                  <DialogHeader className={getTextAlignment()}>
                    <DialogTitle className={getTextAlignment()}>
                      {t("dialogs.createNewSpace")}
                    </DialogTitle>
                    <DialogDescription className={getTextAlignment()}>
                      {t("dialogs.chooseSpaceName")}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-2">
                    <Label htmlFor="space-name" className={getTextAlignment()}>
                      {t("dialogs.spaceName")}
                    </Label>
                    <Input
                      id="space-name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={t("dialogs.spaceNamePlaceholder")}
                      className="rounded-xl"
                      dir={isRTL ? "rtl" : "ltr"}
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    />
                  </div>

                  {spacesError && (
                    <p
                      className={clsx(
                        "text-sm text-destructive",
                        getTextAlignment()
                      )}
                    >
                      {spacesError}
                    </p>
                  )}

                  <DialogFooter
                    className={clsx(
                      "gap-2 sm:gap-0",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setOpenCreate(false)}
                      disabled={creating}
                      className="rounded-xl"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      onClick={doCreateSpace}
                      disabled={creating || !newName.trim()}
                      className="rounded-xl"
                    >
                      {creating ? t("dialogs.creating") : t("common.save")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col space-y-1">
              {loadingSpaces ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2",
                      getFlexDirection()
                    )}
                  >
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-32 rounded-lg" />
                  </div>
                ))
              ) : spacesError ? (
                <div
                  className={clsx(
                    "px-3 py-2 text-xs text-destructive",
                    getTextAlignment()
                  )}
                >
                  {spacesError}
                </div>
              ) : spaces.length === 0 ? (
                <div
                  className={clsx(
                    "px-3 py-2 text-xs text-muted-foreground",
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
                          "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300",
                          isActive
                            ? "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
                            : "hover:bg-gray-100/70 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300"
                        )
                      }
                    >
                      <BoxIcon size={14} className="flex-shrink-0" />
                      <span
                        className={clsx(
                          "text-xs font-medium flex-1 truncate",
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
                        "w-full text-[10px] text-gray-600 dark:text-gray-400 py-2 hover:underline transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/20",
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
        </div>

        <div className="flex-shrink-0 mt-auto pt-4">
          <div className="relative">
            <div
              className="w-52 absolute -top-6 right-3 z-5 h-8 bg-gradient-to-br from-green-50 to-emerald-50
             dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30 rounded-xl shadow-sm flex items-center justify-center"
            >
              <span className="text-green-700 dark:text-green-300 text-[10px] font-semibold">
                {t("sidebar.freePlan")}
              </span>
            </div>
          </div>

          <div className="relative user-dropdown-container bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-gray-700/30">
            <button
              onClick={() => setShowUserDropdown((s) => !s)}
              className="w-full flex items-center gap-2 p-3 hover:bg-white dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            >
              <div className={clsx("flex-1", getTextAlignment())}>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {t("user.userName")}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={clsx(
                  "text-gray-400 transition-transform duration-200",
                  showUserDropdown && "rotate-180"
                )}
              />
            </button>

            {showUserDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-2 z-50">
                <button
                  className={clsx(
                    "w-full flex items-center gap-2 p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl text-xs transition-all duration-200",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <Crown size={14} className="text-yellow-500" />
                  <span className="flex-1 font-medium">
                    {t("sidebar.upgrade")}
                  </span>
                </button>

                <button
                  className={clsx(
                    "w-full flex items-center gap-2 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-xs text-red-600 dark:text-red-400 transition-all duration-200",
                    getFlexDirection(),
                    getTextAlignment()
                  )}
                >
                  <LogOut size={14} />
                  <span className="flex-1 font-medium">
                    {t("sidebar.logout")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
