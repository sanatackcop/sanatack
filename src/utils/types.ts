export type navItem = {
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
  title?: string;
  subtitle?: string;
  description?: string;
  footerItems?: FooterItem[];
  className?: string;
};
export type TabType = "all" | "started" | "done";
export type Tab = {
  label: string;
  value: TabType;
  count?: number;
};

export type GenericTabsProps<T> = {
  tabs: Tab[];
  activeTab: TabType;
  onChange: (value: TabType) => void;
  data: Record<TabType, T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};
