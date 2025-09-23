import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sun,
  Moon,
  Crown,
  Users,
  Plus,
  Search,
  Compass,
  History,
  Chrome,
  ChevronDown,
  User,
  ThumbsUp,
  Settings,
  DollarSign,
  LogOut,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  HomeIcon,
  MapIcon,
  Globe,
  Monitor,
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
  const [newName, setNewName] = useState(t("sidebar.newSpace"));
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
        title: t("sidebar.search"),
        url: "/dashboard/search",
        icon: Search,
        isSoon: true,
      },
      {
        title: t("sidebar.explore"),
        url: "/dashboard/explore",
        icon: Compass,
        isSoon: true,
      },
      {
        title: t("sidebar.history"),
        url: "/dashboard/history",
        icon: History,
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
    <div className="ml-auto flex items-center gap-2">
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
        <ItemIcon size={20} className="flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium flex-1 text-right">
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
              <TooltipContent side="right" className="rounded-xl">
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
              className={({ isActive }) =>
                clsx(
                  linkClasses({ isActive }),
                  isCollapsed && "justify-center px-3"
                )
              }
            >
              <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 select-none dark:text-black hover:bg-zinc-100/50">
                <ItemIcon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium flex-1 text-right">
                    {item.title}
                  </span>
                )}
              </div>
              {!isCollapsed && <Badges item={item} />}
            </NavLink>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" className="rounded-xl">
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
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/30">
              {!isCollapsed && (
                <div className="h-[60px] flex justify-normal items-center overflow-hidden w-full">
                  <img
                    src={
                      theme === "dark" ? String(LogoDark) : String(LogoLight)
                    }
                    alt="logo"
                    className={clsx(
                      "h-full w-auto transition-all object-contain pr-6 scale-[2]"
                    )}
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
                  i18n.language === "ar" ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )
                ) : i18n.language === "ar" ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>
            </div>

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

              {!!recents.length && !isCollapsed && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 px-4 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    {t("sidebar.recent")}
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
                            <span className="text-sm font-medium flex-1 text-right">
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
                          <span className="text-sm font-medium flex-1 text-right">
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
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                      {t("sidebar.spaces")}
                    </h3>

                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                      <DialogTrigger asChild>
                        <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
                          <Plus size={14} />
                          {t("sidebar.create")}
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        dir={i18n.language === "ar" ? "rtl" : "ltr"}
                        className="rounded-3xl"
                      >
                        <DialogHeader>
                          <DialogTitle>
                            {t("dialogs.createNewSpace")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("dialogs.chooseSpaceName")}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2">
                          <Label htmlFor="space-name">
                            {t("dialogs.spaceName")}
                          </Label>
                          <Input
                            id="space-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={t("dialogs.spaceNamePlaceholder")}
                            className="rounded-xl"
                          />
                        </div>

                        {spacesError && (
                          <p className="text-sm text-destructive">
                            {spacesError}
                          </p>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
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

                  <div className="space-y-2">
                    {loadingSpaces ? (
                      <>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3"
                          >
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-40 rounded-lg" />
                          </div>
                        ))}
                      </>
                    ) : spacesError ? (
                      <div className="px-4 py-2 text-sm text-destructive">
                        {spacesError}
                      </div>
                    ) : spaces.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
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
                              <Users size={18} className="flex-shrink-0" />
                              <span className="text-sm font-medium flex-1 text-right">
                                {item.title}
                              </span>
                            </NavLink>
                          )
                        )}

                        {spaces.length > 6 && (
                          <button
                            onClick={() => setShowAllSpaces((prev) => !prev)}
                            className="w-full text-xs text-blue-600 dark:text-blue-400 text-center py-2 hover:underline transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 px-4 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                    {t("sidebar.helpAndTools")}
                  </h3>
                )}
                <div className="space-y-2">
                  {helpItems.map((item) => (
                    <MenuEntry key={item.url} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Footer / User Section */}
            <div className="p-4 mt-auto">
              {!isCollapsed && (
                <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30 rounded-2xl shadow-sm">
                  <button className="w-full py-2 text-green-700 dark:text-green-300 text-sm font-bold">
                    {t("sidebar.freePlan")}
                  </button>
                </div>
              )}

              <div
                className={clsx(
                  "relative user-dropdown-container bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-lg",
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <User size={18} className="text-white" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-right">
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

                {/* Enhanced Dropdown */}
                {!isCollapsed && showUserDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl p-2">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl text-right text-sm transition-all duration-200">
                      <Settings size={16} className="text-gray-500" />
                      <span className="flex-1 font-medium">
                        {t("sidebar.settings")}
                      </span>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl text-right text-sm transition-all duration-200">
                      <Crown size={16} className="text-yellow-500" />
                      <span className="flex-1 font-medium">
                        {t("sidebar.upgrade")}
                      </span>
                    </button>

                    <div className="p-2">
                      <div className="flex items-center gap-3 p-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
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

                    <div className="p-2">
                      <div className="flex items-center gap-3 p-2 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
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

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />

                    <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-right text-sm text-red-600 dark:text-red-400 transition-all duration-200">
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
