import { useEffect, useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Flame,
  Star,
  Trophy,
  Zap,
  PlayCircle,
  Info,
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
import { CourseDetailsContext, MaterialContext } from "@/types/courses";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MaterialPreview } from "../_course.modules.previewer";
import { useSettings } from "@/context/SettingsContexts";
import { MaterialType } from "@/utils/types/adminTypes";

interface NavigationPlaygroundProps {
  courseData: CourseDetailsContext;
  prevMaterial: MaterialContext | null;
  nextMaterial: MaterialContext | null;
  currentIndex: number;
  sidebarOpen: boolean;
  currentMaterial: MaterialContext;
  userData?: {
    name: string;
    avatar?: string;
    level?: number;
    totalXp?: number;
    streak?: number;
    completedCourses?: number;
  };
  handlePrev: () => void;
  handleNext: () => Promise<void>;
  setSidebarOpen: (open: boolean) => void;
  handleComplete: () => void;
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
  handleComplete,
  userData,
  currentIndex,
}: NavigationPlaygroundProps) => {
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [finished, setFinished] = useState(currentMaterial.isFinished);
  const { currentCheck } = useSettings();

  const currentModule = courseData.modules?.find((module) =>
    module.lessons.some((lesson) =>
      lesson.materials.some((mat) => mat.id === currentMaterial.id)
    )
  );

  if (!currentModule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <Info className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
          حدث خطأ أثناء تحميل الدرس
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          لم نتمكن من العثور على الوحدة أو الدرس الحالي. يرجى إعادة المحاولة
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const xpGained = Math.round((userData?.totalXp || 1000) * 0.05);
  const streakBonus = (userData?.streak || 0) > 7 ? 50 : 0;

  const onCompleteClick = () => {
    handleComplete();
    setCongratsOpen(true);
  };

  useEffect(() => {
    if (!currentCheck || finished) return;
    if (
      currentCheck.type == MaterialType.ARTICLE &&
      currentMaterial.type == MaterialType.ARTICLE
    ) {
      const totalSlides = Object.keys(currentMaterial.data).length - 1;
      if (totalSlides != currentCheck.total_read) {
        setFinished(false);
        return;
      }
    } else if (
      currentCheck.type == MaterialType.VIDEO &&
      currentMaterial.type == MaterialType.VIDEO
    ) {
      if (currentCheck.duration == 0) {
        setFinished(false);
        return;
      }
    } else if (
      currentCheck.type == MaterialType.QUIZ_GROUP &&
      currentMaterial.type == MaterialType.QUIZ_GROUP
    ) {
      console.log({ currentCheck });
      if (currentCheck.result < 60) {
        setFinished(false);
        return;
      }
    }

    setFinished(true);
  }, [currentCheck]);

  useEffect(() => {
    console.log(currentMaterial);
    setFinished(currentMaterial.isFinished);
  }, [currentMaterial]);

  async function handleNextWrapper() {
    await handleNext();
  }

  return (
    <TooltipProvider>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="w-full">
          <div className="flex h-20 items-center justify-between px-4 lg:px-8 gap-4">
            {/* Left Section - Menu & Course Info */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105"
              >
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Button>

              <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-56">
                    {courseData.title || "Course Title"}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    الدرس {currentIndex + 1} من {currentModule.lessons.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Progress & Stats */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {currentModule.completedMaterials}/
                      {currentModule.totalMaterials}
                    </span>
                  </div>
                  {/* <div className="hidden sm:flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      ≈ {Math.round(estimatedDuration / 60)}س{" "}
                      {estimatedDuration % 60}د
                    </span>
                  </div> */}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {courseData.progress}%
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                  >
                    مكتمل
                  </Badge>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700 shadow-inner overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
                    style={{ width: `${courseData.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                {/* Progress Milestones */}
                <div className="absolute top-0 left-0 w-full h-4 flex items-center justify-between pointer-events-none">
                  {[0, 25, 50, 75, 100].map((marker) => (
                    <div
                      key={marker}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        (courseData?.progress ?? 0) >= marker
                          ? "bg-white ring-2 ring-emerald-500 shadow-lg scale-110"
                          : "bg-gray-300 dark:bg-gray-600 scale-90"
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

            {/* Right Section - User Stats & Profile */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* XP & Streak */}
              <div className="hidden lg:flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                        {userData?.totalXp?.toLocaleString() || "1,250"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إجمالي نقاط الخبرة</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-xl">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                        {userData?.streak || 7}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>سلسلة الأيام المتتالية</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* User Avatar & Menu */}
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-800">
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {userData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userData?.name || "المتعلم"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    المستوى {userData?.level || 5}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="w-full px-4 lg:px-8">
          <div className="flex h-18 items-center justify-between py-3">
            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                disabled={!prevMaterial}
                onClick={handlePrev}
                className="gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed w-40 min-w-[10rem] max-w-[10rem]"
              >
                <ChevronRight className="h-5 w-5" />
                <div className="hidden sm:block text-right w-full">
                  <div className="text-sm font-medium">السابق</div>
                  {prevMaterial && (
                    <div className="text-xs text-gray-500 truncate w-full">
                      {prevMaterial.title}
                    </div>
                  )}
                </div>
              </Button>

              <Button
                variant="ghost"
                size="lg"
                disabled={
                  !currentMaterial.isFinished && (!nextMaterial || !finished)
                }
                onClick={handleNextWrapper}
                className={`gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed w-40 min-w-[10rem] max-w-[10rem] ${
                  finished ? "progress" : ""
                }`}
              >
                <div className="hidden sm:block text-left w-full">
                  <div className="text-sm font-medium">التالي</div>
                  {nextMaterial && (
                    <div className="text-xs text-gray-500 truncate w-full">
                      {nextMaterial.title}
                    </div>
                  )}
                </div>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="hidden w-72 truncate md:flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2">
              <PlayCircle className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentMaterial.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-4">
                  <p className=" mr-3">
                    {MaterialPreview[currentMaterial.type]?.label}
                  </p>
                  <p>{Math.floor(currentMaterial.duration / 60)} دقيقة</p>
                </div>
              </div>
            </div>

            {currentMaterial && !nextMaterial && (
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-xl"
                  onClick={onCompleteClick}
                >
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">إكمال الكورس</span>
                </Button>
              </div>
            )}
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
            {/* XP Reward */}
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

            {/* Progress Update */}
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

            {/* Streak Bonus */}
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
