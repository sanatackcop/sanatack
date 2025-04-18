import { UserContextProvider } from "./context/UserContext";
import ErrorBoundary from "./utils/ErrorBoundary";
import Router from "./utils/router";
import { DASHBOARDTYPE } from "./utils/types/platfrom";

function App({ switch_dashboard }: { switch_dashboard: DASHBOARDTYPE }) {
  return (
    <div className="font-rubik min-h-screen bg-white dark:bg-black" dir="rtl">
      <div className="relative min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center -z-20"
          style={{
            backgroundImage: 'url("/bg-pattern.png")',
            backgroundColor: "#000",
            backgroundBlendMode: "overlay",
          }}
        />
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
