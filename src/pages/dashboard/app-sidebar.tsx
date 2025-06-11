import {
  Home,
  Inbox,
  Bell,
  Sun,
  Moon,
  GalleryHorizontal,
  ListStart,
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
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CommandMenu } from "@/components/ui/CommandDialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSettings } from "@/context/SettingsContexts";
import { NavUser } from "@/components/ui/nav-user";

const items = [
  { title: "الرئيسية", url: "/dashboard/overview", icon: Home },
  {
    title: "المسار المهني",
    url: "/dashboard/careerPath",
    icon: GalleryHorizontal,
  },
  { title: "المسارات", url: "/dashboard/roadMap", icon: ListStart },
  { title: "الدورات", url: "/dashboard/courses", icon: Inbox },
];
export function AppSidebar() {
  const location = useLocation();
  const activePath = location.pathname;
  const { darkMode } = useSettings();
  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className=" bg-[#eaeaea] dark:bg-[#0C0C0C] border-l border-gray-500 border-opacity-20 w-full sm:w-64"
    >
      <SidebarContent className="bg-[#eaeaea] dark:bg-[#0C0C0C]">
        <div className=" h-[60px] flex justify-normal items-center overflow-hidden">
          <img
            src={darkMode ? String(LogoDark) : String(LogoLight)}
            alt="logo"
            className="h-full w-auto object-contain transform scale-[2] pr-6 pt-1 "
          />
        </div>
        <Separator className="bg-gray-500 dark:opacity-70 opacity-20" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = activePath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive
                          ? " bg-black dark:bg-[#293546] bg-opacity-40 h-10 px-2 text-black dark:text-white hover:bg-opacity-40"
                          : "text-gray-500"
                      }
                    >
                      <Link to={item.url}>
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="bg-gray-500 dark:opacity-70 opacity-20" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
export function DashboardNavbar() {
  const { darkMode, toggleDarkMode } = useSettings();
  return (
    <nav className=" sticky z-50 top-0 h-[69px] flex items-center justify-between px-2 py-3 border-b border-[#8D8D8D] border-opacity-20 bg-[#eaeaea] dark:bg-[#0C0C0C]">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <button className="hover:opacity-75"></button>
        </SidebarTrigger>

        <a href="#" className="mx-1">
          <Bell
            size={18}
            className="stroke-black dark:stroke-white fill-[#1A1A1A] text-gray-500 hover:text-gray-700"
          />
        </a>

        <CommandMenu />
      </div>
      <div className="flex items-center ml-2">
        <button onClick={toggleDarkMode} className="p-3 rounded transition">
          {darkMode ? (
            <Sun size={22} className="text-white" />
          ) : (
            <Moon size={22} className="text-black" />
          )}
        </button>
        <NavUser />
      </div>
    </nav>
  );
}
