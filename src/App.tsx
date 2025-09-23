import { useTranslation } from "react-i18next";
import { UserContextProvider } from "./context/UserContext";
import ErrorBoundary from "./utils/ErrorBoundary";
import Router from "./utils/router";
import { DASHBOARDTYPE } from "./utils/types/platfrom";

function App({ switch_dashboard }: { switch_dashboard: DASHBOARDTYPE }) {
  const { i18n } = useTranslation();
  return (
    <div
      className="font-rubik min-h-screen bg-white dark:bg-black"
      dir={i18n.dir()}
    >
      <div className="relative min-h-screen">
        <UserContextProvider>
          <ErrorBoundary>
            <Router switch_dashboard={switch_dashboard} />
          </ErrorBoundary>
        </UserContextProvider>
      </div>
    </div>
  );
}

export default App;
