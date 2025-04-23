import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar, AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="min-h-screen bg-[#0C0C0C] ">
      <div className="flex h-full  ">
        <AppSidebar />
        <div>
          <main className="flex-1 bg-[#0C0C0C] text-white  ">
            <DashboardNavbar />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
