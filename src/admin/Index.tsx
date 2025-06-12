"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./admin.sidebar";
import { Outlet } from "react-router-dom";
import { useSettings } from "@/context/SettingsContexts";
import { Moon, Sun } from "lucide-react";

export default function AdminDashboard() {
  const { darkMode, toggleDarkMode } = useSettings();
  return (
    <SidebarProvider>
      <AppSidebar darkMode={darkMode} />
      <main className="p-5 w-full">
        <SidebarInset>
          <div className="flex justify-between mb-5">
            <div className=" flex gap-4">
              <SidebarTrigger />
              {!darkMode ? (
                <Sun color="black" onClick={() => toggleDarkMode()} />
              ) : (
                <Moon onClick={() => toggleDarkMode()} />
              )}
            </div>
          </div>
          <Outlet />
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
