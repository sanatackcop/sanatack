import { createContext, useContext } from "react";

type SidebarRefreshContextValue = {
  refreshWorkspace: () => Promise<void>;
};

const SidebarRefreshContext = createContext<
  SidebarRefreshContextValue | undefined
>(undefined);

export const SidebarRefreshProvider = SidebarRefreshContext.Provider;

export const useSidebarRefresh = () => {
  const context = useContext(SidebarRefreshContext);
  if (!context) {
    throw new Error(
      "useSidebarRefresh must be used within a SidebarRefreshProvider"
    );
  }
  return context;
};

export { SidebarRefreshContext };
