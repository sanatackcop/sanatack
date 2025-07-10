import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar, AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <div className="flex min-h-screen w-screen ">
        <AppSidebar />
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto scrollbar-hidden ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
