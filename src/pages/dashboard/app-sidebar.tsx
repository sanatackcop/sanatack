import {
  Home,
  Sun,
  Moon,
  Crown,
  BookOpen,
  ClipboardList,
  Map,
  ChartScatter,
  Group,
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/dark_logo.svg";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSettings } from "@/context/SettingsContexts";
import UserProfileMenu from "@/components/UserProfile";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "الرئيسية",
    url: "/dashboard/overview",
    icon: Home,
    requiresPaid: false,
    comingSoon: false,
  },
  {
    title: "كورساتك",
    url: "/dashboard/courses",
    icon: BookOpen,
    requiresPaid: false,
    comingSoon: false,
  },
  {
    title: "بيئة الدراسة",
    url: "/dashboard/ai/env",
    icon: Group,
    requiresPaid: false,
    comingSoon: true,
  },
  {
    title: "المسارات",
    url: "/dashboard/roadMap",
    icon: Map,
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
    title: "التحليل العميق",
    url: "/dashboard/assessments",
    icon: ChartScatter,
    requiresPaid: false,
    comingSoon: true,
  },
];

export function SubscriptionBanner({
  onUpgrade,
  isCollapsed,
}: {
  onUpgrade: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div className="flex justify-center p-2">
        <button
          onClick={onUpgrade}
          className="p-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md"
          title="ترقية إلى النسخة المدفوعة"
        >
          <Crown size={18} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-3 mb-3 p-4  border-2
     border-blue-500 rounded-lg animate-crown"
    >
      <div className="flex items-center gap-2 mb-2">
        <Crown size={18} className="text-blue-600 " />
        <h3 className="font-bold text-sm text-blue-500 ">
          ترقية إلى النسخة المدفوعة
        </h3>
      </div>
      <p className="text-xs text-blue-300 300 mb-3">
        احصل على وصول كامل لجميع الميزات والدورات المتقدمة
      </p>
      {/* <button
        onClick={onUpgrade}
        className="w-full bg-blue-500  text-white 
         hover:bg-gray-800  transition-colors duration-200 py-2 px-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
      >
        <Zap size={14} />
        ترقية الآن
      </button> */}
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const activePath = location.pathname;
  const { darkMode } = useSettings();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isUserPaid = false;

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-full sm:w-64"
    >
      <SidebarContent className="bg-white dark:bg-gray-900">
        <div className="h-[60px] flex justify-normal items-center overflow-hidden">
          <img
            src={
              isCollapsed
                ? "/icon.svg"
                : darkMode
                ? String(LogoDark)
                : String(LogoLight)
            }
            alt="logo"
            className={cn(
              "h-full w-auto  transition-all ",
              isCollapsed ? "p-0" : "object-contain pr-6 pt-1 scale-[2] "
            )}
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
                          ? "bg-blue-600 text-right text-white hover:text-white hover:bg-blue-700 h-10 px-3 rounded-lg font-medium"
                          : isDisabled
                          ? "text-gray-400 text-right dark:text-gray-500  h-10 px-3 rounded-lg"
                          : "text-gray-700 text-right dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 h-10 px-3 rounded-lg transition-all duration-200"
                      }
                    >
                      {isDisabled ? (
                        <div className="flex items-center justify-between gap-3 opacity-50 relative w-full">
                          <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            <span className="text-nowrap">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isComingSoon && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                قريباً
                              </span>
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
      </SidebarContent>
      {/* <SidebarFooter className="bg-white dark:bg-gray-900">
        <div className="mt-auto ">
          {!isUserPaid && (
            <SubscriptionBanner
              onUpgrade={handleUpgrade}
              isCollapsed={isCollapsed}
            />
          )}
        </div>
      </SidebarFooter> */}
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
          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
}
