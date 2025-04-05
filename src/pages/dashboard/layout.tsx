"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="!bg-[#0C0C0C] h-screen w-screen">
      <div className="flex h-screen">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          {/* <DashboardNavbar /> */}

          <main className="flex-1 p-4 !bg-[#0C0C0C] text-white">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
