import {
  Blocks,
  BrickWall,
  Building2,
  Cuboid,
  House,
  LucideProps,
  School,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import SanatackLogo from "../assets/logo.svg";
import SanatackDarkLogo from "../assets/dark_logo.svg";

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children?: SidebarItem[];
}

// Menu items.
const items: SidebarItem[] = [
  {
    title: "Career Paths",
    url: "/careerPaths",
    icon: Building2,
  },
  {
    title: "Roadmaps",
    url: "/roadmaps",
    icon: School,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: House,
  },
  {
    title: "Modules",
    url: "/modules",
    icon: BrickWall,
  },
  {
    title: "Lessons",
    url: "/lessons",
    icon: Cuboid,
  },
  {
    title: "Materials",
    url: "/materials",
    icon: Blocks,
  },
];

export default function AppSidebar({ darkMode }: { darkMode: boolean }) {
  return (
    <Sidebar collapsible="icon" variant="sidebar" side="right">
      <SidebarHeader>
        <img
          src={darkMode ? SanatackDarkLogo : SanatackLogo}
          alt="Image"
          className=" w-20 h-10 object-cover"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={"/admin" + item.url}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
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
