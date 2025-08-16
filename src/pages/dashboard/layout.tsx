import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <div className="flex min-h-screen w-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 overflow-hidden">
          <header className="flex items-center gap-2 p-4 justify-end">
            <Button
              variant="outline"
              size="sm"
              color="green"
              className="flex items-center gap-2 rounded-full"
              onClick={() => {
                console.log("Update clicked");
              }}
            >
              تحديث
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 rounded-full"
              onClick={() => {
                console.log("Complete profile clicked");
              }}
            >
              أكمل ملفك الشخصي
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto scrollbar-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
