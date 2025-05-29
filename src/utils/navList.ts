import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "الكورسات", isActive: false, href: "/articles/list" },
  { title: "المسارات", isActive: false, href: "/tracks" },
  { title: "كيف ننظر للعلم", isActive: false, href: "/tracks" },
  { title: "عنا", isActive: false, href: "/tracks" },
  { title: "تواصل معنا", isActive: false, href: "/tracks" },
];
