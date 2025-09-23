import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SettingsProvider } from "./context/SettingsContexts.tsx";
import "./i18n"; // 👈 initialize i18n here

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <App switch_dashboard={import.meta.env.VITE_PLATFORM_TYPE} />
    </SettingsProvider>
  </React.StrictMode>
);
