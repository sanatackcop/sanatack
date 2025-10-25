import { useState, useEffect, useMemo, FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Crown,
  Box,
  Play,
  BoxIcon,
  ChevronDown,
  LogOut,
  FileIcon,
  Brain,
  CalendarDaysIcon,
  CheckCircle,
  Clock10,
  Globe,
  MapIcon,
  Moon,
  Sun,
  Languages,
  MessageCircle,
  Tablet,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import clsx from "clsx";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LogoLight from "@/assets/logo.svg";
import { submitFeedback } from "@/utils/_apis/feedback-api";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";
import { FaChrome, FaDiscord } from "react-icons/fa6";
import LogoDark from "@/assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";

type MenuItem =
  | {
      title: string;
      icon: any;
      comingSoon?: boolean;
      url: string;
      type?: "link";
    }
  | {
      title: string;
      icon: any;
      type: "feedback";
    };

type LinkMenuItem = Extract<MenuItem, { url: string }>;
type FeedbackMenuItem = Extract<MenuItem, { type: "feedback" }>;

interface MenuGroup {
  groupTitle: string;
  menuItems: MenuItem[];
}

interface Workspace {
  id: string;
  title?: string;
  workspaceName?: string;
  workspaceType: "youtube" | "docuemnt";
  updatedAt: string;
}

type RawSpace = { id: string; name: string; description?: string | null };
type SpaceItem = { id: string; title: string; url: string };

interface AppSidebarProps {
  onCollapse?: () => void;
}

export function AppSidebar({ onCollapse }: AppSidebarProps) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useSettings();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const { logout } = useUserContext();
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(true);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isRTL = i18n.dir() === "rtl";
  const nextLanguage = language === "ar" ? "en" : "ar";
  const nextLanguageLabel = t(`languages.${nextLanguage}`);

  const getTextAlignment = () => (isRTL ? "text-right" : "text-left");
  const getFlexDirection = () => (isRTL ? "flex-row-reverse" : "flex-row");

  useEffect(() => {
    setNewName(t("sidebar.newSpace"));
  }, [t]);

  const toggleLanguage = () => {
    const newLang = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
    toast.success(t("languages.changed", { lang: t(`languages.${newLang}`) }));
  };

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSubject = feedbackSubject.trim();
    const trimmedMessage = feedbackMessage.trim();

    if (!trimmedSubject || !trimmedMessage) {
      setFeedbackError(t("sidebar.feedbackForm.validation"));
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      await submitFeedback({
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      toast.success(t("sidebar.feedbackForm.success"));
      setFeedbackSubject("");
      setFeedbackMessage("");
      setFeedbackOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.error?.body ??
        error?.response?.data?.message ??
        error?.message ??
        t("sidebar.feedbackForm.error");
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : t("sidebar.feedbackForm.error")
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const topItemGroups: MenuGroup[] = useMemo(
    () => [
      {
        groupTitle: t("sidebar.groups.learning"),
        menuItems: [
          {
            title: t("sidebar.items.myLearning"),
            url: "/dashboard/overview",
            icon: Box,
          },
          {
            title: t("common.search"),
            url: "/dashboard/search",
            icon: Search,
          },
          {
            title: t("sidebar.items.discover"),
            url: "/dashboard/discover",
            icon: Globe,
            comingSoon: true,
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
          {
            title: t("sidebar.discord"),
            url: "https://discord.gg/WEJDkQS8",
            icon: FaDiscord,
          },
          {
            title: t("sidebar.chromeExtension"),
            url: "https://chrome.google.com/webstore/category/extensions",
            icon: FaChrome,
          },
        ],
      },
    ],
    [t]
  );

  const allItemGroups = useMemo(() => {
    return topItemGroups;
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
    return workspace.title || t("workspace.untitled", "Untitled");
  };

  const isWorkspaceActive = (workspaceId: string) => {
    return location.pathname === `/dashboard/learn/workspace/${workspaceId}`;
  };

  const MenuEntry = ({ item }: { item: LinkMenuItem }) => {
    const ItemIcon = item.icon;
    const currentPathname = location.pathname;
    const isActive = item.url === currentPathname;

    const content = (
      <NavLink
        to={item.comingSoon ? "#" : item.url}
        onClick={(e) => item.comingSoon && e.preventDefault()}
        className={clsx(
          "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors duration-150 group relative",
          item.comingSoon && "opacity-60",
          !item.comingSoon &&
            (isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground")
        )}
        target={
          !item.comingSoon && item.url.startsWith("http") ? "_blank" : undefined
        }
        rel={
          !item.comingSoon && item.url.startsWith("http")
            ? "noopener noreferrer"
            : undefined
        }
      >
        <ItemIcon
          size={16}
          strokeWidth={1.75}
          className={clsx(
            "flex-shrink-0 transition-colors",
            !item.comingSoon &&
              (isActive
                ? "text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground")
          )}
        />
        <span
          className={clsx("text-[13px] font-normal flex-1", getTextAlignment())}
        >
          {item.title}
        </span>
        {item.comingSoon && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-800/50">
            {t("common.comingSoon")}
          </span>
        )}
      </NavLink>
    );

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const FeedbackMenuEntry = ({ item }: { item: FeedbackMenuItem }) => {
    const ItemIcon = item.icon;

    return (
      <Popover
        open={feedbackOpen}
        onOpenChange={(open) => {
          setFeedbackOpen(open);
          if (!open) {
            setFeedbackError(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={clsx(
              "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors duration-150 group relative focus:outline-none",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <ItemIcon
              size={16}
              strokeWidth={1.75}
              className="flex-shrink-0 transition-colors text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
            />
            <span
              className={clsx(
                "text-[13px] font-normal flex-1",
                getTextAlignment()
              )}
            >
              {item.title}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side={isRTL ? "left" : "right"}
          align={isRTL ? "end" : "start"}
          className="w-80 p-4 space-y-3"
          dir={isRTL ? "rtl" : "ltr"}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <form className="space-y-3" onSubmit={handleFeedbackSubmit}>
            <div className="space-y-1">
              <Label htmlFor="feedback-subject">
                {t("sidebar.feedbackForm.subject")}
              </Label>
              <Input
                id="feedback-subject"
                value={feedbackSubject}
                maxLength={120}
                placeholder={t("sidebar.feedbackForm.placeholderSubject")}
                onChange={(event) => {
                  setFeedbackSubject(event.target.value);
                  if (feedbackError) {
                    setFeedbackError(null);
                  }
                }}
                required
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="feedback-message">
                {t("sidebar.feedbackForm.message")}
              </Label>
              <Textarea
                id="feedback-message"
                value={feedbackMessage}
                placeholder={t("sidebar.feedbackForm.placeholderMessage")}
                onChange={(event) => {
                  setFeedbackMessage(event.target.value);
                  if (feedbackError) {
                    setFeedbackError(null);
                  }
                }}
                required
                rows={4}
              />
            </div>
            {feedbackError && (
              <p className="text-xs text-red-500">{feedbackError}</p>
            )}
            <div
              className={clsx(
                "flex items-center",
                isRTL ? "justify-start" : "justify-end"
              )}
            >
              <Button type="submit" size="sm" disabled={feedbackLoading}>
                {feedbackLoading
                  ? t("common.loading")
                  : t("sidebar.feedbackForm.submit")}
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  };
  const MenuGroupEntry = ({ group }: { group: MenuGroup }) => {
    return (
      <div className="space-y-0.5">
        <div
          className={clsx(
            `flex items-center px-2 py-1.5 text-[11px] text-sidebar-foreground/50 
           capitalize tracking-wider select-none`
          )}
        >
          <span>{group.groupTitle}</span>
        </div>
        <div className="space-y-0.5">
          {group.menuItems.map((item) =>
            item.type === "feedback" ? (
              <FeedbackMenuEntry key={item.title} item={item} />
            ) : (
              <MenuEntry key={item.url} item={item} />
            )
          )}
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
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors duration-150 group",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <div className="relative flex-shrink-0">
          {isActive ? (
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          ) : (
            <>
              {workspace.workspaceType === "youtube" ? (
                <Play
                  className="h-4 w-4 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                  strokeWidth={1.75}
                />
              ) : (
                <FileIcon
                  className="h-4 w-4 text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                  strokeWidth={1.75}
                />
              )}
            </>
          )}
        </div>
        <span
          className={clsx(
            "text-[13px] font-normal flex-1 truncate",
            getTextAlignment()
          )}
        >
          {getWorkspaceTitle(workspace)}
        </span>
      </NavLink>
    );
  };

  const SectionHeader = ({
    title,
    action,
  }: {
    title: string;
    action?: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between mb-1">
      <div
        className={clsx(
          `flex items-center px-2 py-1.5 text-[11px] text-sidebar-foreground/50 
           capitalize tracking-wider select-none`,
          getFlexDirection()
        )}
      >
        <span>{title}</span>
      </div>

      {action}
    </div>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={i18n.language}
      className="h-full flex flex-col border-r bg-zinc-50
       dark:bg-zinc-950 dark:border-zinc-800"
    >
      <div className="flex flex-col h-full py-2 pl-3 pr-2">
        <div className="flex items-center justify-between">
          <div
            className={clsx(
              "h-[60px] flex items-center overflow-hidden w-full justify-between group relative"
            )}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            <img
              src={String(darkMode ? LogoDark : LogoLight)}
              alt="logo"
              className={`h-full w-auto transition-all object-contain scale-[2.5] ${
                i18n.dir() === "rtl" ? "pr-6" : "pl-5"
              }`}
            />

            {/* Collapse button - appears on hover */}
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
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col space-y-2 mb-2">
          {allItemGroups.map((group) => (
            <MenuGroupEntry key={group.groupTitle} group={group} />
          ))}
          <hr className="-mx-5 dark:border-zinc-700" />
        </div>

        <div
          className="flex-1 overflow-y-auto min-h-0  py-2 space-y-4"
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
        </div>

        <div className="flex-shrink-0">
          <div
            className="relative user-dropdown-container bg-white dark:bg-zinc-800/60 backdrop-blur-sm rounded-xl border border-zinc-200/50
           dark:border-zinc-700/30"
          >
            <button
              onClick={() => setShowUserDropdown((s) => !s)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {t("user.userName").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={clsx("flex-1 min-w-0", getTextAlignment())}>
                <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                  {t("user.userName")}
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
              dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-zinc-700/30 rounded-2xl p-2 z-50"
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

                <div className="my-1 border-t border-sidebar-border" />

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
    </div>
  );
}
