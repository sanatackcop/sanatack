import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import ShowErrorMessage from "@/utils/ErrorMessage";
import { GenericTabsProps } from "@/utils/types";

export default function GenericTabs<T>({
  tabs,
  activeTab,
  onChange,
  data,
  renderItem,
  loading = false,
  error = null,
  onRetry,
}: GenericTabsProps<T>) {
  return (
    <Tabs
      dir="rtl"
      value={activeTab}
      onValueChange={(value: string) => onChange(value)}
      className="w-full"
    >
      <TabsList className="bg-transparent text-right pb-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative text-md text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#5286D2] data-[state=active]:bg-transparent rounded-none"
          >
            {tab.label}
            {tab.count !== undefined && (
              <Badge
                variant="secondary"
                className="bg-[#252C36B2] text-[#6B737D] flex h-4 w-4 text-xs items-center justify-center mx-1 mt-2 rounded-10"
              >
                {tab.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <Separator className="bg-gray-500 opacity-20" />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      ) : error ? (
        <div className="py-20">
          <ShowErrorMessage message={error} onRetry={onRetry} />
        </div>
      ) : (
        tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="grid md:grid-cols-3 gap-6 sm:grid-cols-1">
              {data[tab.value]?.map((item, index) => renderItem(item, index))}
            </div>
          </TabsContent>
        ))
      )}
    </Tabs>
  );
}
