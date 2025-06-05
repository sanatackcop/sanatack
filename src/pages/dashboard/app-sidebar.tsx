import {
  Home,
  Bell,
  Sun,
  Moon,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Zap,
  Briefcase,
  BookOpen,
  ClipboardList,
  FolderOpen,
  Code,
  Map
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/logo_black.svg";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSettings } from "@/context/SettingsContexts";

const items = [
  {
    title: "الرئيسية",
    url: "/dashboard/overview",
    icon: Home,
    requiresPaid: false,
    comingSoon: false,
  },
  {
    title: "الدورات",
    url: "/dashboard/courses",
    icon: BookOpen,
    requiresPaid: false,
    comingSoon: false,
  },
  {
    title: "المسارات",
    url: "/dashboard/roadMap",
    icon: Map,
    requiresPaid: false,
    comingSoon: false,
  },
  {
    title: "المسار المهني",
    url: "/dashboard/careerPath",
    icon: Briefcase,
    requiresPaid: false,
    comingSoon: true,
  },
  {
    title: "صناعة خطة تعليم",
    url: "/dashboard/assessments",
    icon: ClipboardList,
    requiresPaid: false,
    comingSoon: true,
  },
  {
    title: "المشاريع",
    url: "/dashboard/assessments",
    icon: FolderOpen,
    requiresPaid: false,
    comingSoon: true,
  },
  {
    title: "ليت كود",
    url: "/dashboard/assessments",
    icon: Code,
    requiresPaid: false,
    comingSoon: true,
  },
];

function SubscriptionBanner({ onUpgrade }: any) {
  return (
    <div className="mx-3 mb-3 p-4 bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-white rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Crown size={18} className="text-gray-900 dark:text-white" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
          ترقية إلى النسخة المدفوعة
        </h3>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
        احصل على وصول كامل لجميع الميزات والدورات المتقدمة
      </p>
      <button
        onClick={onUpgrade}
        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 py-2 px-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Zap size={14} />
        ترقية الآن
      </button>
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const activePath = location.pathname;
  const { darkMode } = useSettings();

  // Mock user subscription status - replace with actual user context
  const isUserPaid = false; // This should come from your user context/state

  const handleUpgrade = () => {
    // Handle upgrade logic here
    console.log("Upgrade clicked");
  };

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-full sm:w-64"
    >
      <SidebarContent className="bg-white dark:bg-gray-900">
        <div className="h-[60px] flex justify-normal items-center overflow-hidden">
          <img
            src={darkMode ? String(LogoDark) : String(LogoLight)}
            alt="logo"
            className="h-full w-auto object-contain transform scale-[2] pr-6 pt-1"
          />
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />

        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 text-right">
              {items.map((item) => {
                const isActive = activePath.startsWith(item.url);
                const isLocked = item.requiresPaid && !isUserPaid;
                const isComingSoon = item.comingSoon;
                const isDisabled = isLocked || isComingSoon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!isDisabled}
                      className={
                        isActive
                          ? "bg-gray-900 text-right dark:bg-white text-white dark:text-gray-900 h-10 px-3 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-medium"
                          : isDisabled
                          ? "text-gray-400 text-right dark:text-gray-500 cursor-not-allowed h-10 px-3 rounded-lg"
                          : "text-gray-700 text-right dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 h-10 px-3 rounded-lg transition-all duration-200"
                      }
                    >
                      {isDisabled ? (
                        <div className="flex items-center gap-3 opacity-50 relative">
                          <item.icon size={20} />
                          <span>{item.title}</span>
                          <div className="ml-auto flex items-center gap-1">
                            {isComingSoon && (
                              <>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                  قريباً
                                </span>
                              </>
                            )}
                            {isLocked && (
                              <Crown size={14} className="text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon size={20} />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto">
          {!isUserPaid && <SubscriptionBanner onUpgrade={handleUpgrade} />}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export function DashboardNavbar() {
  const { darkMode, toggleDarkMode } = useSettings();

  return (
    <nav className="sticky z-50 top-0 h-[69px] flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <SidebarTrigger>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
              <div className="w-full h-0.5 bg-gray-700 dark:bg-gray-300 rounded"></div>
            </div>
          </button>
        </SidebarTrigger>

        <div className="relative">
          <a
            href="#"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 block"
          >
            <Bell
              size={18}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            />
          </a>
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            {darkMode ? (
              <Sun
                size={20}
                className="text-gray-700 dark:text-gray-300 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors duration-200"
              />
            ) : (
              <Moon
                size={20}
                className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
              />
            )}
          </div>
        </button>

        <div className="ml-2">
          <ProfilerDropDown />
        </div>
      </div>
    </nav>
  );
}

function ProfilerDropDown() {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            المستخدم
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            user@example.com
          </p>
        </div>
        <ChevronDown
          size={16}
          className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200"
        />
      </button>

      <div className="absolute left-0 top-full  w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2">
          <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
            <User size={16} />
            <span className="text-sm">الملف الشخصي</span>
          </button>
          <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
            <Settings size={16} />
            <span className="text-sm">الإعدادات</span>
          </button>
          <Separator className="bg-gray-200 dark:bg-gray-700 my-1" />
          <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200">
            <LogOut size={16} />
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
}
