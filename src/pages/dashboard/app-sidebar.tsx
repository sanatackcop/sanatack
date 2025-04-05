import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import LogoLight from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const items = [
  {
    title: "دورات",
    url: "#",
    icon: Home,
  },
  {
    title: "المسارات",
    url: "#",
    icon: Inbox,
  },
  {
    title: "المشاريع",
    url: "#",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar
      side="right"
      className="!bg-[#0C0C0C] border-l-1 !border-l-[#8D8D8D] border-opacity-20"
    >
      <header></header>
      <SidebarContent className="!bg-[#0C0C0C]">
        <div className="flex-shrink-0">
          <img
            className="w-[90px] md:w-[120px] cursor-pointer"
            src={String(LogoLight)}
            alt="logo"
          />
        </div>
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}





import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-[#8D8D8D] border-opacity-20 !bg-[#0C0C0C]">
      <div className="flex items-center space-x-2">
        <SidebarTrigger>
          <button className="hover:opacity-75">
            <Search />
          </button>
        </SidebarTrigger>
        <span className="text-white text-sm">لوحة القيادة</span>
      </div>

      {/* Right section: icons, settings, user profile, etc. */}
      <div className="flex items-center space-x-3">
        <button className="hover:opacity-75">
          <Settings />
        </button>
        {/* You could also add a user avatar here */}
        <img
          src="https://via.placeholder.com/32"
          alt="User avatar"
          className="rounded-full w-8 h-8"
        />
      </div>
    </nav>
  );
}
