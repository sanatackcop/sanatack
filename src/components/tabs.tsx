import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShowErrorMessage from "@/utils/ErrorMessage";
import { GenericTabsProps } from "@/utils/types";
import LoadingScreen from "./LoadingScreen";

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
  const activeTabData = data[activeTab] || [];
  const isEmpty = !loading && !error && activeTabData.length === 0;

  return (
    <div className="w-full">
      <Tabs
        dir="rtl"
        value={activeTab}
        onValueChange={(value: string) => onChange(value)}
        className="w-full bg-transparent"
      >
        <TabsList className="h-auto bg-transparent p-0 mb-4 flex-wrap justify-start items-center mt-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`
  relative px-4 py-3 mr-6 mb-2 text-sm font-medium
  bg-transparent border-0 rounded-none
  text-gray-600 dark:text-gray-400
  hover:text-gray-900 dark:hover:text-gray-100
  data-[state=active]:text-[#5286D2] dark:data-[state=active]:text-[#5286D2]
  transition-all duration-200 ease-in-out
  hover:bg-gray-50 dark:hover:bg-gray-800/50
  focus:outline-none focus:ring-0 focus:ring-offset-0
  group
`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <Badge
                    variant="secondary"
                    className={`
                      h-5 px-2 text-xs font-medium
                      bg-gray-100 dark:bg-gray-800
                      text-gray-600 dark:text-gray-400
                      group-data-[state=active]:bg-[#5286D2]/10
                      group-data-[state=active]:text-[#5286D2]
                      transition-all duration-200
                      animate-in fade-in-0 zoom-in-50
                    `}
                  >
                    {tab.count}
                  </Badge>
                )}
              </span>

              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#5286D2] rounded-full"
                initial={false}
                animate={{
                  scaleX: activeTab === tab.value ? 1 : 0,
                  opacity: activeTab === tab.value ? 1 : 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              />

              <motion.div
                className="absolute inset-0 bg-gray-100 dark:bg-gray-800/30 rounded-md -z-10"
                initial={false}
                whileHover={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        <div>
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingScreen />
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="py-20"
              >
                <ShowErrorMessage message={error} onRetry={onRetry} />
              </motion.div>
            ) : isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-center items-center py-20"
              >
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5286D2] hover:text-[#4a75bb] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                )}
              </motion.div>
            ) : (
              tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  >
                    <AnimatePresence>
                      {data[tab.value]?.map((item, index) => (
                        <motion.div
                          key={`${tab.value}-${index}`}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.05,
                          }}
                          layout
                        >
                          {renderItem(item, index)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </TabsContent>
              ))
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
