import {
  Calendar,
  AlignVerticalSpaceBetween,
  Home,
  Inbox,
  Bell,
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
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

const items = [
  { title: "الرئيسية", url: "/dashboard/overview", icon: Home },
  { title: "الدورات", url: "/dashboard/courses", icon: Inbox },
  {
    title: "المسارات",
    url: "/dashboard/tracks",
    icon: AlignVerticalSpaceBetween,
  },
  { title: "المشاريع", url: "/dashboard/projects", icon: Calendar },
];

export function AppSidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="!bg-[#0C0C0C] border-l border-gray-500 border-opacity-20 w-full sm:w-64"
    >
      <SidebarContent className="!bg-[#0C0C0C]">
        <div className="flex justify-normal">
          <img
            src={String(LogoLight)}
            alt="logo"
            className="w-[200px] max-w-full -mt-6 -mb-10 -mr-6 "
          />
        </div>
        <Separator className="bg-gray-500 opacity-20" />
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
                          ? "bg-[#293546] bg-opacity-40 h-10 px-2 text-white hover:bg-opacity-40"
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
        <Separator className="bg-gray-500 opacity-20" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}


export function DashboardNavbar() {
  return (
    <nav className=" h-[69px] flex items-center justify-between px-2 py-3 border-b border-[#8D8D8D] border-opacity-20 !bg-[#0C0C0C]">
      <div className="flex items-center  ">
        <SidebarTrigger>
          <button className="hover:opacity-75"></button>
        </SidebarTrigger>
        <a href="" className="mx-3">
          <Bell
            size={18}
            className="text-gray-500 hover:text-gray-700"
            style={{
              stroke: "white",
              fill: "#1A1A1A",
            }}
          />
        </a>
        <CommandMenu />
      </div>
    </nav>
  );
}
