import { PencilIcon } from "lucide-react";
import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "الرئيسية", isActive: true, href: "/" },
  { title: "المدونة", isActive: true, href: "/articles/list" },
  { title: "المسارات", isActive: false, href: "/tracks" },
  { title: "الكورسات", isActive: false, href: "/courses" },
  // { title: "عنا", isActive: true, href: "/about" },
  {
    title: "اكتب",
    isActive: false,
    href: "/write",
    icon: PencilIcon, 
  },
];
