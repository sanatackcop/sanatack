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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserProfileMenu from "@/components/UserProfile";

interface TopNavbarProps {
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

export const TopNavbar: React.FC<TopNavbarProps> = ({
  courseData,
  prevMaterial,
  nextMaterial,
  handlePrev,
  handleNext,
  currentIndex,
  totalMaterials,
  setSidebarOpen,
  sidebarOpen,
  currentMaterial,
  handleComplete,
  handleRestart,
  userData = {
    name: "أحمد محمد",
    level: 12,
    totalXp: 2450,
  },
}) => {
  const [congratsOpen, setCongratsOpen] = useState(false);

  const onCompleteClick = () => {
    handleComplete();
    setCongratsOpen(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 shadow-sm">
        <div className="w-full">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>

              <UserProfileMenu onlyAvatar={true} userData={userData} />
            </div>

            <div className="flex-1 flex items-center justify-center gap-4">
              <div className="hidden lg:flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!prevMaterial}
                  onClick={handlePrev}
                  className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="hidden xl:inline">السابق</span>
                </Button>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentIndex + 1} من {totalMaterials}
                    </span>
                  </div>
                  {currentMaterial && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {currentMaterial.title}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!nextMaterial || nextMaterial.locked}
                  onClick={handleNext}
                  className="gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <span className="hidden xl:inline">التالي</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex lg:hidden items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!prevMaterial}
                  onClick={handlePrev}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentIndex + 1} / {totalMaterials}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!nextMaterial || nextMaterial.locked}
                  onClick={handleNext}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentMaterial && (
                <>
                  {currentMaterial.completed ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                      onClick={handleRestart}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="hidden sm:inline">إعادة</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
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

          <div className="px-4 lg:px-8 pb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  {courseData.completedLessons}/{courseData.totalLessons}
                </span>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                      style={{ width: `${courseData.progress}%` }}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-2 flex items-center justify-between">
                    {[0, 25, 50, 75, 100].map((marker) => (
                      <div
                        key={marker}
                        className={`w-2 h-2 rounded-full ${
                          courseData.progress >= marker
                            ? "bg-white ring-2 ring-blue-500"
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

      <Dialog open={congratsOpen} onOpenChange={setCongratsOpen}>
        <DialogContent className="max-w-md border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce">
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
            <div className="flex items-center justify-center gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-lg font-bold text-green-700 dark:text-green-300">
                +{courseData.xp ? Math.round(courseData.xp * 0.1) : 10} XP
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                تقدم {Math.round(100 / totalMaterials)}%
              </span>
            </div>
          </div>

          <DialogClose asChild>
            <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              متابعة التعلم
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
