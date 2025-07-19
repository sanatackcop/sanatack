import { useEffect, useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Flame,
  Trophy,
  CheckCircle2,
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
import { CourseDetails, MaterialContext } from "@/types/courses";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSettings } from "@/context/SettingsContexts";
import { MaterialType } from "@/utils/types/adminTypes";
import { Link } from "react-router-dom";

interface NavigationPlaygroundProps {
  courseData: CourseDetails;
  prevMaterial: MaterialContext;
  nextMaterial: MaterialContext;
  currentIndex: number;
  totalDuration: number;
  sidebarOpen: boolean;
  currentMaterial: MaterialContext;
  totalLessons: number;
  completedLessons: number;
  userData?: {
    name: string;
    avatar?: string;
    level?: number;
    totalXp?: number;
    streak?: number;
    completedCourses?: number;
  };
  handlePrev: () => void;
  handleNext: () => void;
  setSidebarOpen: (open: boolean) => void;
  handleComplete: () => void;
  handleRestart: () => void;
}

export const NavigationPlayground = ({
  courseData,
  prevMaterial,
  nextMaterial,
  handlePrev,
  handleNext,
  setSidebarOpen,
  sidebarOpen,
  currentMaterial,
  totalLessons,
  completedLessons,
  handleComplete,
  userData,
}: NavigationPlaygroundProps) => {
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [finished, setFinished] = useState(currentMaterial.isFinished);
  const { currentCheck } = useSettings();

  const xpGained = Math.round((userData?.totalXp || 1000) * 0.05);
  const streakBonus = (userData?.streak || 0) > 7 ? 50 : 0;

  const onCompleteClick = () => {
    handleComplete();
    setCongratsOpen(true);
  };

  useEffect(() => {
    if (!currentCheck || finished) return;

    if (
      currentCheck.type === MaterialType.ARTICLE &&
      currentMaterial.type === MaterialType.ARTICLE
    ) {
      const totalSlides = Object.keys(currentMaterial.data).length - 1;
      if (totalSlides !== currentCheck.total_read) {
        setFinished(false);
        return;
      }
    } else if (
      currentCheck.type === MaterialType.VIDEO &&
      currentMaterial.type === MaterialType.VIDEO
    ) {
      if (currentCheck.duration === 0) {
        setFinished(false);
        return;
      }
    } else if (
      currentCheck.type === MaterialType.QUIZ_GROUP &&
      currentMaterial.type === MaterialType.QUIZ_GROUP
    ) {
      if (currentCheck.result < 60) {
        setFinished(false);
        return;
      }
    }

    setFinished(true);
  }, [currentCheck]);

  useEffect(() => {
    setFinished(currentMaterial.isFinished);
  }, [currentMaterial]);

  return (
    <TooltipProvider>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-600 shadow-sm">
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
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    التقدم الإجمالي
                  </span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {courseData.progress}%
                  </span>
                </div>
                <div className="relative">
                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-200 via-green-500 to-green-600 transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${courseData.progress}%` }}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-3 flex items-center justify-between">
                    {[0, 25, 50, 75, 100].map((marker) => (
                      <div
                        key={marker}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          courseData.progress! >= marker
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

      {/* Mid Navbar */}
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
                disabled={!nextMaterial || !finished}
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
          </div>
        </div>
      </nav>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="w-full px-4 lg:px-8">
          <div className="flex h-18 items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                disabled={!prevMaterial}
                onClick={handlePrev}
                className="gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium">السابق</div>
                  {prevMaterial && (
                    <div className="text-xs text-gray-500 truncate max-w-32">
                      {prevMaterial.title}
                    </div>
                  )}
                </div>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                disabled={!nextMaterial || !finished}
                onClick={handleNext}
                className="gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">التالي</div>
                  {nextMaterial && (
                    <div className="text-xs text-gray-500 truncate max-w-32">
                      {nextMaterial.title}
                    </div>
                  )}
                </div>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {currentMaterial && !nextMaterial && (
                // <Button
                //   size="lg"
                //   variant="outline"
                //   className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200"
                //   onClick={onCompleteClick}
                //   disabled={!finished}
                // >
                //   <CheckCircle2 className="h-4 w-4" />
                //   <span>إكمال الدرس</span>
                // </Button>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    إكمال الدرس
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={congratsOpen} onOpenChange={setCongratsOpen}>
        <DialogContent className="max-w-lg border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
          <DialogHeader>
            <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full w-fit">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
              إنجاز رائع! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-2 text-lg">
              لقد أكملت هذا الدرس بنجاح! استمر في رحلة التعلم المذهلة.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 shadow-sm border border-amber-200 dark:border-amber-800">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  +{xpGained} XP
                </div>
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  نقاط خبرة جديدة
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {courseData.progress}%
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  تقدم في الكورس
                </div>
              </div>
            </div>

            {streakBonus > 0 && (
              <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 shadow-sm border border-orange-200 dark:border-orange-800">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    +{streakBonus} XP
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    مكافأة السلسلة المتتالية
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogClose asChild>
            <Button className="mt-8 w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-xl">
              متابعة رحلة التعلم
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default NavigationPlayground;
