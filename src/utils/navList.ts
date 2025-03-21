import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "الرئيسية", isActive: true, href: "/" },
  { title: "الكورسات", isActive: false, href: "/articles/list" },
  { title: "المسارات", isActive: false, href: "/tracks" },
  { title: "المسار الوظيفي", isActive: false, href: "/courses" },
  { title: "MicroDegree", isActive: false, href: "/about" },
  {
    title: "انضم مجانا",
    isActive: true,
    href: "/singup",
   },
];
