import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sun,
  Moon,
  Crown,
  Plus,
  Compass,
  History,
  Chrome,
  ChevronDown,
  ThumbsUp,
  DollarSign,
  LogOut,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  HomeIcon,
  MapIcon,
  Globe,
  Monitor,
  BoxIcon,
  CalendarDaysIcon,
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSpacesApi, getAllSpacesApi } from "@/utils/_apis/courses-apis";
import { useSettings } from "@/context/SettingsContexts";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  isAction?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
  isSoon?: boolean;
}

type RawSpace = { id: string; name: string; description?: string | null };
type SpaceItem = { id: string; title: string; url: string };

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { setLanguage } = useSettings();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [recents] = useState<MenuItem[]>([]);
  const [showAllSpaces, setShowAllSpaces] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem("sidebar:collapsed") || "false");
    } catch {
      return false;
    }
  });
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();

  const isRTL = i18n.language === "ar";

  const getTextAlignment = () => {
    return isRTL ? "text-right" : "text-left";
  };

  const getFlexDirection = () => {
    return isRTL ? "flex-row-reverse" : "flex-row";
  };

  const getJustifyContent = () => {
    return isRTL ? "justify-start" : "justify-start";
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
    setNewName(t("sidebar.newSpace"));
  }, [i18n.language, t]);

  const languages = [
    { code: "ar", name: t("languages.ar"), flag: "🇸🇦" },
    { code: "en", name: t("languages.en"), flag: "🇺🇸" },
  ];

  const themeOptions = [
    { value: "light", label: t("theme.light"), icon: Sun },
    { value: "dark", label: t("theme.dark"), icon: Moon },
    { value: "system", label: t("theme.system"), icon: Monitor },
  ];

  const currentTheme =
    themeOptions.find((opt) => opt.value === theme) || themeOptions[2];

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    toast.success(t("languages.changed", { lang: langCode.toUpperCase() }));
  };

  const changeTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (typeof document !== "undefined") {
      if (newTheme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", systemDark);
      } else {
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    }
  };

  const topItems = useMemo(
    (): MenuItem[] => [
      {
        title: t("sidebar.home"),
        url: "/dashboard/overview",
        icon: HomeIcon,
        isPremium: false,
      },
      {
        title: t("sidebar.createMap"),
        url: "/dashboard/overview",
        icon: MapIcon,
        isPremium: true,
      },
      {
        title: t("common.calendar"),
        url: "/dashboard/calendar",
        icon: CalendarDaysIcon,
        isSoon: true,
      },
      {
        title: t("sidebar.explore"),
        url: "/dashboard/explore",
        icon: Compass,
        isSoon: true,
      },
    ],
    [t]
  );

  const helpItems = useMemo(
    (): MenuItem[] => [
      {
        title: t("sidebar.feedback"),
        url: "/dashboard/feedback",
        icon: ThumbsUp,
        isSoon: true,
      },
      {
        title: t("sidebar.chromeExtension"),
        url: "/dashboard/extension",
        icon: Chrome,
        isSoon: true,
      },
      {
        title: t("sidebar.discord"),
        url: "/dashboard/discord",
        icon: MessageCircle,
        isSoon: true,
      },
      {
        title: t("sidebar.inviteAndEarn"),
        url: "/dashboard/invite",
        icon: DollarSign,
        isSoon: true,
      },
    ],
    [t]
  );

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

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] relative group",
      isActive
        ? "bg-zinc-200/50 shadow-md shadow-gray-100/50 dark:shadow-blue-900/25"
        : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:shadow-md hover:shadow-gray-100/50 dark:hover:shadow-gray-800/25 text-gray-700 dark:text-gray-300"
    );

  const disabledClasses =
    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 opacity-60 cursor-not-allowed select-none text-gray-500 dark:text-gray-500";

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

  const Badges = ({ item }: { item: MenuItem }) => (
    <div
      className={clsx("flex items-center gap-2", isRTL ? "mr-auto" : "ml-auto")}
    >
      {item.isPremium && (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-300 shadow-sm">
          <Crown size={10} />
          {t("sidebar.premium")}
        </span>
      )}
      {item.isSoon && (
        <span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 shadow-sm">
          {t("sidebar.soon")}
        </span>
      )}
      {item.isNew && (
        <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm shadow-green-200" />
      )}
    </div>
  );

  const MenuEntry = ({ item }: { item: MenuItem }) => {
    const ItemIcon = item.icon;
    const isDisabled = !!(item.isPremium || item.isSoon);

    const content = (
      <div
        className={clsx(
          isDisabled ? disabledClasses : linkClasses({ isActive: false }),
          isCollapsed && "justify-center px-3"
        )}
        aria-disabled={isDisabled || undefined}
      >
        <ItemIcon size={16} className="flex-shrink-0" />
        {!isCollapsed && (
          <span
            className={clsx("text-sm font-medium flex-1", getTextAlignment())}
          >
            {item.title}
          </span>
        )}
        {!isCollapsed && !isDisabled && <Badges item={item} />}
      </div>
    );

    if (isDisabled) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            {isCollapsed && (
              <TooltipContent
                side={isRTL ? "left" : "right"}
                className="rounded-xl"
              >
                <span className="text-sm">{item.title}</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              className={clsx(
                linkClasses({ isActive: !item.isPremium }),
                isCollapsed && "justify-center px-3"
              )}
            >
              <ItemIcon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span
                  className={clsx(
                    "text-sm font-medium flex-1",
                    getTextAlignment()
                  )}
                >
                  {item.title}
                </span>
              )}
              {!isCollapsed && <Badges item={item} />}
            </NavLink>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side={isRTL ? "left" : "right"}
              className="rounded-xl"
            >
              <span className="text-sm">{item.title}</span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  useEffect(() => {
    localStorage.setItem("sidebar:collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapsed = () => setIsCollapsed((v) => !v);

  return (
    <>
      <div className="my-2 ml-0 mr-2 border rounded-3xl">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          lang={i18n.language}
          className={clsx(
            "h-full flex flex-col transition-all duration-300 ease-in-out ml-0",
            isCollapsed ? "w-16" : "w-80"
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/20 dark:shadow-gray-900/50 border border-white/20 dark:border-gray-700/30 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/30">
              {!isCollapsed && (
                <div
                  className={clsx(
                    "h-[60px] flex items-center overflow-hidden w-full",
                    getJustifyContent()
                  )}
                >
                  <img
                    src={
                      theme === "dark" ? String(LogoDark) : String(LogoLight)
                    }
                    alt="logo"
                    className={`h-full w-auto transition-all object-contain scale-[3] ${
                      i18n.dir() === "rtl" ? "pr-6" : "pl-6"
                    }`}
                  />
                </div>
              )}

              <button
                onClick={toggleCollapsed}
                aria-label={
                  isCollapsed
                    ? t("sidebar.expandSidebar")
                    : t("sidebar.collapseSidebar")
                }
                className={clsx(
                  "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800",
                  "hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50",
                  "transition-all duration-300 p-2 shadow-md hover:shadow-lg transform hover:scale-105",
                  isCollapsed && !isHovering ? "opacity-70" : "opacity-100"
                )}
              >
                {isCollapsed ? (
                  isRTL ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )
                ) : isRTL ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>
            </div>

            {/* Top Items */}
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/30">
              <div className="space-y-2">
                {topItems.map((item) => (
                  <MenuEntry key={item.url} item={item} />
                ))}
              </div>
            </div>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto px-3 py-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.flex-1::-webkit-scrollbar { display: none; }`}</style>

              {/* Recent items */}
              {!!recents.length && !isCollapsed && (
                <div className="mb-6">
                  <h3
                    className={clsx(
                      "text-sm font-bold text-gray-800 dark:text-gray-200 px-4 mb-3 flex items-center gap-2",
                      getFlexDirection()
                    )}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    <span>{t("sidebar.recent")}</span>
                  </h3>
                  <div className="space-y-2">
                    {recents.map((item) => {
                      const ItemIcon = item.icon ?? History;
                      const isAddContent =
                        item.url === "/dashboard/add-content";
                      const isSpace = item.url.startsWith("/dashboard/spaces/");
                      const canClick = isAddContent || isSpace;

                      if (!canClick) {
                        const annotated: MenuItem = { ...item, isSoon: true };
                        return (
                          <div
                            key={item.url}
                            className={disabledClasses}
                            aria-disabled
                            title={t("sidebar.soon")}
                          >
                            <ItemIcon size={18} className="flex-shrink-0" />
                            <span
                              className={clsx(
                                "text-sm font-medium flex-1",
                                getTextAlignment()
                              )}
                            >
                              {item.title}
                            </span>
                            <Badges item={annotated} />
                          </div>
                        );
                      }

                      return (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          className={linkClasses}
                        >
                          <ItemIcon size={18} className="flex-shrink-0" />
                          <span
                            className={clsx(
                              "text-sm font-medium flex-1",
                              getTextAlignment()
                            )}
                          >
                            {item.title}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spaces */}
              {!isCollapsed && (
                <div className="mb-6">
                  <div className="px-4 mb-3 flex items-center justify-between">
                    <h3
                      className={clsx(
                        "text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2",
                        getFlexDirection()
                      )}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                      <span>{t("sidebar.spaces")}</span>
                    </h3>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                      <DialogTrigger asChild>
                        <button
                          className={clsx(
                            "inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105",
                            getFlexDirection()
                          )}
                        >
                          <Plus size={14} />
                          <span>{t("sidebar.create")}</span>
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
                            {creating
                              ? t("dialogs.creating")
                              : t("common.save")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Spaces list */}
                  <div className="space-y-2">
                    {loadingSpaces ? (
                      <>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "flex items-center gap-3 px-4 py-3",
                              getFlexDirection()
                            )}
                          >
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-40 rounded-lg" />
                          </div>
                        ))}
                      </>
                    ) : spacesError ? (
                      <div
                        className={clsx(
                          "px-4 py-2 text-sm text-destructive",
                          getTextAlignment()
                        )}
                      >
                        {spacesError}
                      </div>
                    ) : spaces.length === 0 ? (
                      <div
                        className={clsx(
                          "px-4 py-2 text-sm text-muted-foreground",
                          getTextAlignment()
                        )}
                      >
                        {t("sidebar.noSpacesYet")}
                      </div>
                    ) : (
                      <>
                        {(showAllSpaces ? spaces : spaces.slice(0, 6)).map(
                          (item) => (
                            <NavLink
                              key={item.id}
                              to={item.url}
                              className={linkClasses}
                            >
                              <BoxIcon size={16} className="flex-shrink-0" />
                              <span
                                className={clsx(
                                  "text-sm font-medium flex-1",
                                  getTextAlignment()
                                )}
                              >
                                {item.title}
                              </span>
                            </NavLink>
                          )
                        )}

                        {spaces.length > 6 && (
                          <button
                            onClick={() => setShowAllSpaces((prev) => !prev)}
                            className={clsx(
                              "w-full text-xs text-blue-600 dark:text-blue-400 py-2 hover:underline transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20",
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
              )}

              {/* Help & Tools */}
              <div className="mb-6">
                {!isCollapsed && (
                  <h3
                    className={clsx(
                      "text-sm font-bold text-gray-800 dark:text-gray-200 px-4 mb-3 flex items-center gap-2",
                      getFlexDirection()
                    )}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                    <span>{t("sidebar.helpAndTools")}</span>
                  </h3>
                )}
                <div className="space-y-2">
                  {helpItems.map((item) => (
                    <MenuEntry key={item.url} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 mt-auto relative">
              {!isCollapsed && (
                <div
                  className="absolute bottom-12 left-1/2 -translate-x-1/2  w-44right-4 h-10 bg-gradient-to-br from-green-50 to-emerald-50
                 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30 rounded-xl shadow-sm z-0"
                >
                  <div
                    className={clsx(
                      "py-1 text-green-700 text-center items-center w-44 dark:text-green-300 text-xs font-semibold"
                    )}
                  >
                    {t("sidebar.freePlan")}
                  </div>
                </div>
              )}

              <div
                className={clsx(
                  "relative user-dropdown-container bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-zinc-200/50 dark:border-gray-700/30 z-10",
                  isCollapsed && "px-2 py-2 flex items-center justify-center"
                )}
              >
                <button
                  onClick={() => !isCollapsed && setShowUserDropdown((s) => !s)}
                  className={clsx(
                    "w-full flex items-center gap-3 p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200",
                    isCollapsed && "justify-center"
                  )}
                >
                  {!isCollapsed && (
                    <div className={clsx("flex-1", getTextAlignment())}>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {t("user.userName")}
                      </p>
                    </div>
                  )}
                  {!isCollapsed && (
                    <ChevronDown
                      size={16}
                      className={clsx(
                        "text-gray-400 transition-transform duration-200",
                        showUserDropdown && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {!isCollapsed && showUserDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl p-2 z-50">
                    <button
                      className={clsx(
                        "w-full flex items-center gap-3 p-3 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl text-sm transition-all duration-200",
                        getFlexDirection(),
                        getTextAlignment()
                      )}
                    >
                      <Crown size={16} className="text-yellow-500" />
                      <span className="flex-1 font-medium">
                        {t("sidebar.upgrade")}
                      </span>
                    </button>

                    {/* Language section */}
                    <div className="p-2">
                      <div
                        className={clsx(
                          "flex items-center gap-3 p-2 text-sm font-medium text-gray-700 dark:text-gray-300",
                          getFlexDirection(),
                          getTextAlignment()
                        )}
                      >
                        <Globe size={16} className="text-gray-500" />
                        <span className="flex-1">{t("sidebar.language")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={clsx(
                              "flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all duration-200",
                              i18n.language === lang.code
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                                : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                            )}
                          >
                            <span className="text-sm">{lang.flag}</span>
                            <span className="flex-1 text-center">
                              {lang.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Theme section */}
                    <div className="p-2">
                      <div
                        className={clsx(
                          "flex items-center gap-3 p-2 text-sm font-medium text-gray-700 dark:text-gray-300",
                          getFlexDirection(),
                          getTextAlignment()
                        )}
                      >
                        <currentTheme.icon
                          size={16}
                          className="text-gray-500"
                        />
                        <span className="flex-1">{t("theme.theme")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-2">
                        {themeOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <button
                              key={option.value}
                              onClick={() =>
                                changeTheme(
                                  option.value as "light" | "dark" | "system"
                                )
                              }
                              className={clsx(
                                "flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all duration-200",
                                theme === option.value
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                                  : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                              )}
                            >
                              <IconComponent size={14} />
                              <span>{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <hr className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent -mx-3 my-2" />

                    <button
                      className={clsx(
                        "w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400 transition-all duration-200",
                        getFlexDirection(),
                        getTextAlignment()
                      )}
                    >
                      <LogOut size={16} />
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
      </div>
    </>
  );
}
