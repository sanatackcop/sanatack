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
