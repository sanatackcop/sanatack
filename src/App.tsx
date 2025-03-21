import { UserContextProvider } from "./context/UserContext";
import ErrorBoundary from "./utils/ErrorBoundary";
import Router from "./utils/router";

function App() {
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
        {/* <SettingsProvider> */}
        <UserContextProvider>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </UserContextProvider>
        {/* </SettingsProvider> */}
      </div>
    </div>
  );
}

export default App;
