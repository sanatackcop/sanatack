import { ReactNode } from "react";

export type navItem = {
  cta?: string;
  title: string;
  isActive?: boolean;
  icon?: any;
  href: string;
  description?: string;
};

export type FooterItem = {
  icon?: React.ReactNode;
  text: string;
};

export type GenericCardProps = {
  type?: string;
  id?: string;
  title?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  progress?: number;
  link?: string;
};

export type Tab = {
  label: string;
  value: string;
  count?: number;
};
export type GenericTabsProps<T> = {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  data: Record<string, T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};
export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[]
  isPublish: boolean;
}
export type MaterialType = "video" | "reading" | "quiz";

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  duration?: string | null;
  description?: string;
  content?: React.ReactNode;
  url?: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completedCount: number;
  totalCount: number;
  materials: Material[];
}

export interface Module {
  id: string;
  description: string;
  title: string;
  lessons: Lesson[];
}
