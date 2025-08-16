import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import { createSpacesApi, getAllSpacesApi } from "@/utils/_apis/courses-apis";
import Switch from "@mui/material/Switch";

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

const initialTopItems: MenuItem[] = [
  {
    title: "إضافة محتوى",
    url: "/dashboard/overview",
    icon: Plus,
    isPremium: false,
  },
  { title: "البحث", url: "/dashboard/search", icon: Search, isSoon: true },
  { title: "استكشاف", url: "/dashboard/explore", icon: Compass, isSoon: true },
  { title: "التاريخ", url: "/dashboard/history", icon: History, isSoon: true },
];

const initialHelpItems: MenuItem[] = [
  {
    title: "ملاحظات",
    url: "/dashboard/feedback",
    icon: ThumbsUp,
    isSoon: true,
  },
  {
    title: "إضافة كروم",
    url: "/dashboard/extension",
    icon: Chrome,
    isSoon: true,
  },
  {
    title: "ديسكورد",
    url: "/dashboard/discord",
    icon: MessageCircle,
    isSoon: true,
  },
  {
    title: "ادعو واكسب",
    url: "/dashboard/invite",
    icon: DollarSign,
    isSoon: true,
  },
];

export function AppSidebar() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [spacesError, setSpacesError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("مساحة جديدة");

  const [recents] = useState<MenuItem[]>([]);
  const [showAllSpaces, setShowAllSpaces] = useState(false);

  const navigate = useNavigate();

  const topItems = useMemo(() => initialTopItems, []);
  const helpItems = useMemo(() => initialHelpItems, []);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

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
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors rounded-full",
      isActive
        ? "bg-gray-100 dark:bg-gray-800"
        : "hover:bg-gray-100  dark:hover:bg-gray-800/50"
    );

  const disabledClasses =
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors opacity-60 cursor-not-allowed select-none";

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
        setSpacesError(e?.message ?? "تعذّر تحميل المساحات");
      } finally {
        setLoadingSpaces(false);
      }
    };

    fetchSpaces();
  }, []);

  const doCreateSpace = async () => {
    setCreating(true);
    setSpacesError(null);
    try {
      const payload = { name: newName?.trim() || "مساحة جديدة" };
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
      setSpacesError(e?.message ?? "تعذّر إنشاء المساحة");
    } finally {
      setCreating(false);
    }
  };

  const Badges = ({ item }: { item: MenuItem }) => (
    <div className="ml-auto flex items-center gap-2">
      {item.isPremium && (
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          <Crown size={10} />
          بريميوم
        </span>
      )}
      {item.isSoon && (
        <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          قريبًا
        </span>
      )}
      {item.isNew && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
    </div>
  );

  const MenuEntry = ({ item }: { item: MenuItem }) => {
    const ItemIcon = item.icon;
    const isDisabled = !!(item.isPremium || item.isSoon);

    if (isDisabled) {
      return (
        <div
          className={disabledClasses}
          aria-disabled
          title={
            item.isPremium
              ? "متاح في الباقة بريميوم"
              : item.isSoon
              ? "قريبًا"
              : ""
          }
        >
          <ItemIcon size={18} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item.title}
          </span>
          <Badges item={item} />
        </div>
      );
    }

    return (
      <NavLink to={item.url} className={linkClasses}>
        <ItemIcon size={18} className="text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {item.title}
        </span>
        <Badges item={item} />
      </NavLink>
    );
  };

  return (
    <div
      className="h-full w-72 bg-[#fbfbfa] dark:bg-gray-950 z-50 flex flex-col border-l border-gray-200 dark:border-gray-800"
      dir="rtl"
      lang="ar"
    >
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="h-[60px] flex justify-normal items-center overflow-hidden w-full">
          <img
            src={darkMode ? String(LogoDark) : String(LogoLight)}
            alt="logo"
            className={clsx(
              "h-full w-auto transition-all object-contain pr-6 scale-[2]"
            )}
          />
        </div>
      </div>

      <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          {topItems.map((item) => (
            <MenuEntry key={item.url} item={item} />
          ))}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-3 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.flex-1::-webkit-scrollbar { display: none; }`}</style>

        {recents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white px-3 mb-3">
              الأخيرة
            </h3>
            <div className="space-y-1">
              {recents.map((item) => {
                const ItemIcon = item.icon ?? History;

                const isAddContent = item.url === "/dashboard/add-content";
                const isSpace = item.url.startsWith("/dashboard/spaces/");
                const canClick = isAddContent || isSpace;

                if (!canClick) {
                  const annotated: MenuItem = { ...item, isSoon: true };
                  return (
                    <div
                      key={item.url}
                      className={disabledClasses}
                      aria-disabled
                      title="قريبًا"
                    >
                      <ItemIcon
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.title}
                      </span>
                      <Badges item={annotated} />
                    </div>
                  );
                }

                return (
                  <NavLink key={item.url} to={item.url} className={linkClasses}>
                    <ItemIcon
                      size={18}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="px-3 mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              المساحات
            </h3>

            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Plus size={14} />
                  إنشاء
                </button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>إنشاء مساحة جديدة</DialogTitle>
                  <DialogDescription>
                    اختر اسمًا لمساحتك ثم اضغط إنشاء.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                  <Label htmlFor="space-name">اسم المساحة</Label>
                  <Input
                    id="space-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: مساحة الفريق"
                  />
                </div>

                {spacesError && (
                  <p className="text-sm text-destructive">{spacesError}</p>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenCreate(false)}
                    disabled={creating}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={doCreateSpace}
                    disabled={creating || !newName.trim()}
                  >
                    {creating ? "جارٍ الإنشاء…" : "إنشاء"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Spaces list */}
          <div className="space-y-1">
            {loadingSpaces ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </>
            ) : spacesError ? (
              <div className="px-3 py-2 text-sm text-destructive">
                {spacesError}
              </div>
            ) : spaces.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                لا توجد مساحات بعد.
              </div>
            ) : (
              <>
                {(showAllSpaces ? spaces : spaces.slice(0, 6)).map((item) => (
                  <NavLink key={item.id} to={item.url} className={linkClasses}>
                    <Users
                      size={18}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                  </NavLink>
                ))}

                {spaces.length > 6 && (
                  <button
                    onClick={() => setShowAllSpaces((prev) => !prev)}
                    className="w-full text-xs text-blue-600 dark:text-blue-400 text-center py-1 hover:underline"
                  >
                    {showAllSpaces ? "عرض أقل" : "عرض المزيد"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white px-3 mb-3">
            المساعدة والأدوات
          </h3>
          <div className="space-y-1">
            {helpItems.map((item) => (
              <MenuEntry key={item.url} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <button className="w-full py-2 text-green-700 dark:text-green-300 text-sm font-medium">
            خطة مجانية
          </button>
        </div>

        <div className="relative user-dropdown-container bg-white rounded-2xl border-zinc-300 border">
          <button
            onClick={() => setShowUserDropdown((s) => !s)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                أسامة زيد
              </p>
            </div>
            <ChevronDown
              size={16}
              className={clsx(
                "text-gray-400 transition-transform",
                showUserDropdown && "rotate-180"
              )}
            />
          </button>

          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1">
              <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-right text-sm">
                <Settings size={16} className="text-gray-500" />
                <span className="flex-1">الإعدادات</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-right text-sm">
                <Crown size={16} className="text-yellow-500" />
                <span className="flex-1">الترقية</span>
              </button>
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                <Switch
                  value={darkMode}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDarkMode();
                  }}
                />
                <div className="flex items-center gap-2 text-sm">
                  <span>الوضع الليلي</span>
                  {darkMode ? (
                    <Moon size={14} className="text-gray-500" />
                  ) : (
                    <Sun size={14} className="text-gray-500" />
                  )}
                </div>
              </div>
              <hr className="my-1 -mx-2 border-gray-200 dark:border-gray-700" />
              <button className="w-full flex items-center gap-3 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-right text-sm text-red-600 dark:text-red-400">
                <LogOut size={16} />
                <span className="flex-1">تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
