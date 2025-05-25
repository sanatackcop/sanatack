import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "الكورسات", isActive: false, href: "/articles/list" },
  { title: "المسارات", isActive: false, href: "/tracks" },
  { title: "كيف ننظر لي العلم", isActive: false, href: "/tracks" },
  { title: "عناء", isActive: false, href: "/tracks" },
  { title: "تواصل معنا", isActive: false, href: "/tracks" },
];
