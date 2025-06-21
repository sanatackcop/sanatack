import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Sparkles,
  Trophy,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface navigationPlaygroundProps {
  courseData: {
    completedLessons: number;
    totalLessons: number;
    progress: number;
    xp?: number;
    streak?: number;
  };
  prevMaterial: any;
  nextMaterial: any;
  handlePrev: () => void;
  handleNext: () => void;
  currentIndex: number;
  totalMaterials: number;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  currentMaterial: {
    title: string;
    completed?: boolean;
    locked?: boolean;
  } | null;
  handleComplete: () => void;
  handleRestart: () => void;
  userData?: {
    name: string;
    avatar?: string;
    level?: number;
    totalXp?: number;
  };
}

export const NavigationPlayground: React.FC<navigationPlaygroundProps> = ({
  courseData,
  prevMaterial,
  nextMaterial,
  handlePrev,
  handleNext,
  totalMaterials,
  setSidebarOpen,
  sidebarOpen,
  currentMaterial,
  handleComplete,
  handleRestart,
}) => {
  const [congratsOpen, setCongratsOpen] = useState(false);

  const onCompleteClick = () => {
    handleComplete();
    setCongratsOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 
      flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-600 shadow-sm ">
        <div className="w-full">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8 gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>

            <div className="flex-1 flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {courseData.completedLessons}/{courseData.totalLessons}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    ≈ 15 دقيقة
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    التقدم الإجمالي
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {12}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-200 via-green-500 to-green-600 transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${12}%` }}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-3 flex items-center justify-between">
                    {[0, 25, 50, 75, 100].map((marker) => (
                      <div
                        key={marker}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          12 >= marker
                            ? "bg-white ring-2 ring-blue-500 shadow-lg"
                            : "bg-gray-300 dark:bg-gray-600"
                        } ${marker === 0 || marker === 100 ? "opacity-0" : ""}`}
                        style={{
                          position: "absolute",
                          left: `${marker}%`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-600 shadow-2xl">
        <div className="w-full px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={!prevMaterial}
                onClick={handlePrev}
                className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="hidden sm:inline">السابق</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={
                  !nextMaterial || (nextMaterial && nextMaterial.locked)
                }
                onClick={handleNext}
                className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <span className="hidden sm:inline">التالي</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 sm:w-24">
                <div className="relative">
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
                      style={{ width: `${courseData.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentMaterial && (
                <>
                  {currentMaterial.completed ? (
                    <Button
                      size="sm"
                      className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={handleRestart}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden sm:inline">إعادة</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={onCompleteClick}
                    >
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">إكمال</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={congratsOpen} onOpenChange={setCongratsOpen}>
        <DialogContent className="max-w-md border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce shadow-2xl">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              إنجاز رائع! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-2">
              لقد أكملت هذا الدرس بنجاح! استمر في التقدم الرائع.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 shadow-sm">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-bold text-green-700 dark:text-green-300">
                +{courseData.xp ? Math.round(courseData.xp * 0.1) : 10} XP
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 shadow-sm">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                تقدم {Math.round(100 / totalMaterials)}%
              </span>
            </div>
          </div>

          <DialogClose asChild>
            <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              متابعة التعلم
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavigationPlayground;
