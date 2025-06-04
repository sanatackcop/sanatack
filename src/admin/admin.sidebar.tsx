import {
  Blocks,
  BrickWall,
  Cuboid,
  House,
  LucideProps,
  NotebookText,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

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
    children: [
      {
        title: "Quiz",
        url: "/quizes",
        icon: NotebookText,
      },
      {
        title: "Video",
        url: "/videos",
        icon: NotebookText,
      },
      {
        title: "Resources",
        url: "/resources",
        icon: NotebookText,
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={'/admin'+item.url} className=" flex justify-between">
                      <span>{item.title}</span>
                      <item.icon />
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
