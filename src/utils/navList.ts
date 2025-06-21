import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "الكورسات", isActive: false, href: "/signup" },
  { title: "المسارات", isActive: false, href: "/signup" },
  { title: "المسارت المهنية", isActive: false, href: "/signup" },
  // { title: "كيف ننظر للعلم", isActive: false, href: "/tracks" },
  // { title: "عنا", isActive: false, href: "/tracks" },
  // { title: "تواصل معنا", isActive: false, href: "/tracks" },
];
