import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SettingsProvider } from "../src/context/SettingsContexts.tsx";

// TODO: ADD REACT ROUTER
// TODO: ADD THE USER_CONTEXT
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
    <App />
    </SettingsProvider>
  </React.StrictMode>
);
