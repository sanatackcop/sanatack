import { navItem } from "./types";

export type navList = navItem[];

export const navItems: navList = [
  { title: "nav.features", isActive: false, href: "/#ai-tutor-features" },
  { title: "nav.pricing", isActive: false, href: "/#pricing" },
  { title: "nav.careers", isActive: false, href: "/#magic-ai-features" },
  { title: "nav.community", isActive: false, href: "/#use-cases" },
  { title: "nav.blog", isActive: false, href: "/#faqs" },
];
