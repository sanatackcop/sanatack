import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar, AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="!bg-[#0C0C0C] h-screen w-screen">
      <div className="flex w-screen h-screen">
        <AppSidebar />
        <div className="flex w-screen">
          <main className="flex-1 !bg-[#0C0C0C] text-white">
            <DashboardNavbar />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
