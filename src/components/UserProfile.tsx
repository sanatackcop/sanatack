import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Trophy,
  Award,
  TrendingUp,
} from "lucide-react";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function UserProfileMenu({
  onlyAvatar = false,
  userData,
}: {
  onlyAvatar?: boolean;
  userData?: any;
}) {
  const getLevelColor = (level: number) => {
    if (level >= 20) return "from-purple-500 to-pink-500";
    if (level >= 15) return "from-yellow-500 to-orange-500";
    if (level >= 10) return "from-blue-500 to-cyan-500";
    if (level >= 5) return "from-green-500 to-emerald-500";
    return "from-gray-500 to-gray-600";
  };

  const xpToNextLevel = (userData?.level || 1) * 200;
  const currentLevelXp = (userData?.totalXp || 0) % xpToNextLevel;
  const levelProgress = (currentLevelXp / xpToNextLevel) * 100;

  return (
    <>
      {!onlyAvatar ? (
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                المستخدم
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                user@example.com
              </p>
            </div>
            <ChevronDown
              size={16}
              className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200"
            />
          </button>

          <div className="absolute left-0 top-full  w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2">
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                <User size={16} />
                <span className="text-sm">الملف الشخصي</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                <Settings size={16} />
                <span className="text-sm">الإعدادات</span>
              </button>
              <Separator className="bg-gray-200 dark:bg-gray-700 my-1" />
              <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200">
                <LogOut size={16} />
                <span className="text-sm">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative p-0 h-10 w-10 rounded-full"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`h-full w-full bg-gradient-to-br ${getLevelColor(
                        userData.level || 1
                      )} flex items-center justify-center`}
                    >
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br ${getLevelColor(
                    userData.level || 1
                  )} flex items-center justify-center ring-2 ring-white dark:ring-gray-900`}
                >
                  <span className="text-[9px] font-bold text-white">
                    {userData.level}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0">
            {/* Profile Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${getLevelColor(
                          userData.level || 1
                        )} flex items-center justify-center`}
                      >
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {userData.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        مستوى {userData.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {currentLevelXp}/{xpToNextLevel} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Level Progress */}
              <div className="mt-3">
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Award className="h-4 w-4" />
                <span>الإنجازات</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
