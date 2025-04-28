import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar, AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="min-h-screen bg-[#0C0C0C]">
      <div className="flex min-h-screen w-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1 bg-[#0C0C0C]">
          <DashboardNavbar />
          <main className="flex-1 text-white">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
