import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "nav.features", isActive: false, href: "/#ai-tutor-features" },
  { title: "nav.pricing", isActive: false, href: "/#pricing" },
  { title: "nav.faqs", isActive: false, href: "/#faqs" },
];
