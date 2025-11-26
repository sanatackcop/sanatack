import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type PageTitleContextValue = {
  title: string;
  setTitle: (value: string) => void;
  titleContent: ReactNode | null;
  setTitleContent: (value: ReactNode | null) => void;
  openUpgrade: () => void;
  closeUpgrade: () => void;
  isUpgradeOpen: boolean;
};

const PageTitleContext = createContext<PageTitleContextValue | undefined>(
  undefined
);

export const PageTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("");
  const [titleContent, setTitleContent] = useState<ReactNode | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const value = useMemo(
    () => ({
      title,
      setTitle,
      titleContent,
      setTitleContent,
      isUpgradeOpen,
      openUpgrade: () => setIsUpgradeOpen(true),
      closeUpgrade: () => setIsUpgradeOpen(false),
    }),
    [title, titleContent, isUpgradeOpen]
  );

  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
};

export const usePageTitle = (): PageTitleContextValue => {
  const ctx = useContext(PageTitleContext);
  if (!ctx) {
    throw new Error("usePageTitle must be used within a PageTitleProvider");
  }
  return ctx;
};
