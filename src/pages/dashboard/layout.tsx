import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] w-screen overflow-hidden bg-zinc-100/50 ">
        <AppSidebar />

        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <main className="flex-1 min-w-0 min-h-0 p-2  flex">
            <div className="flex-1 min-w-0 min-h-0 flex flex-col">
              <div
                className="flex-1 min-h-0 overflow-hidden bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl shadow-blue-100/30
                dark:shadow-gray-900/50 border border-white/30 dark:border-gray-700/20 backdrop-blur-xl
                hover:shadow-3xl transition-shadow duration-300"
              >
                <div
                  className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-blue-200/70 
                  scrollbar-track-transparent hover:scrollbar-thumb-blue-300/80 p-4 sm:p-6 md:p-8 lg:p-10"
                >
                  <div className="w-full">{children}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
