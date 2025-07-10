import { checkIsNewCourse, DateDisplay } from "@/lib/utils";
import { CoursesReport } from "@/types/courses";
import { CoursesContext } from "@/utils/types";
import {
  BookOpen,
  TrendingUp,
  Code,
  Brain,
  Database,
  Shield,
  Smartphone,
  BarChart3,
  Palette,
  Globe,
  Camera,
  Cpu,
  Award,
  ArrowRight,
  Clock,
  Calendar,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function getTopicIcon(topic: string) {
  const iconMap: any = {
    "ذكاء اصطناعي": Brain,
    الخلفية: Code,
    "تطوير ويب": Globe,
    "تطوير جوال": Smartphone,
    "قواعد بيانات": Database,
    "أمن معلومات": Shield,
    "علم بيانات": BarChart3,
    تسويق: TrendingUp,
    تصميم: Palette,
    تصوير: Camera,
    شبكات: Cpu,
    تقني: Code,
  };

  return iconMap[topic] || BookOpen;
}

export const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
    <div
      className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full blur-3xl opacity-50 animate-bounce"
      style={{ animationDuration: "6s" }}
    ></div>

    <div
      className="absolute top-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-900/20 dark:to-blue-900/20 rounded-2xl rotate-45 blur-xl opacity-40 animate-spin"
      style={{ animationDuration: "20s" }}
    ></div>
    <div
      className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-l from-indigo-200 to-cyan-200 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-full blur-lg opacity-30 animate-ping"
      style={{ animationDuration: "8s" }}
    ></div>

    <div className="absolute inset-0 opacity-10">
      <div
        className="w-full h-full bg-gradient-to-br from-transparent via-blue-300 dark:via-blue-700 to-transparent"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
    </div>

    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60 animate-bounce"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

export const StatsCards = ({ stats }: { stats: CoursesReport }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
    <div className="group relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
      <div
        className="absolute -top-2 -right-2 w-16 h-16 border border-blue-200 dark:border-blue-700 rounded-full animate-spin"
        style={{ animationDuration: "10s" }}
      ></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <BookOpen size={24} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.completedCourses}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            دورة مكتملة
          </p>
        </div>
      </div>
    </div>

    <div className="group relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-800/30 dark:to-blue-800/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute -top-1 -right-1 w-12 h-12 border-2 border-cyan-200 dark:border-cyan-700 rounded-lg rotate-45 animate-pulse"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Clock size={24} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalHours}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            ساعة تعلم
          </p>
        </div>
      </div>
    </div>

    <div className="group relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-sky-100 dark:from-indigo-800/30 dark:to-sky-800/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute -top-3 -right-3 w-20 h-20 border border-indigo-200 dark:border-indigo-700 rounded-full animate-ping opacity-30"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Award size={24} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.certifications}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            شهادة حاصل عليها
          </p>
        </div>
      </div>
    </div>

    <div className="group relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-100 to-sky-100 dark:from-indigo-800/30 dark:to-sky-800/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute -top-3 -right-3 w-20 h-20 border border-indigo-200 dark:border-indigo-700 rounded-full animate-ping opacity-30"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
          <TrendingUp size={24} className="text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.streakDays}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            يوم متتالي
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const ModernSectionHeader = ({
  title,
  description,
  showViewAll = false,
}: any) => (
  <div className="flex items-end justify-between mb-8">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
        {description}
      </p>
    </div>
    {showViewAll && (
      <button
        className="group inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 
      transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        عرض الكل
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, description, actionText }: any) => (
  <div className="relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center shadow-sm">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-800/20 dark:to-indigo-900/10"></div>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-blue-200 to-indigo-200 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-full blur-3xl opacity-40 animate-pulse"></div>
    <div className="relative z-10 max-w-md mx-auto space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-700/50 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
        <BookOpen size={32} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200">
        <BookOpen size={18} />
        {actionText}
      </button>
    </div>
  </div>
);

export const getTopicColors = (topic: string) => {
  const colorMap: any = {
    "ذكاء اصطناعي": {
      bg: "from-blue-600 to-indigo-600",
      iconBg:
        "from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-700/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      tagBg: "bg-blue-100 dark:bg-blue-900/30",
      tagText: "text-blue-700 dark:text-blue-300",
      tagBorder: "border-blue-200 dark:border-blue-700",
    },
    الخلفية: {
      bg: "from-cyan-600 to-blue-600",
      iconBg:
        "from-cyan-100 to-blue-100 dark:from-cyan-800/50 dark:to-blue-700/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      tagBg: "bg-cyan-100 dark:bg-cyan-900/30",
      tagText: "text-cyan-700 dark:text-cyan-300",
      tagBorder: "border-cyan-200 dark:border-cyan-700",
    },
    "تطوير ويب": {
      bg: "from-indigo-600 to-cyan-600",
      iconBg:
        "from-indigo-100 to-cyan-100 dark:from-indigo-800/50 dark:to-cyan-700/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      tagBg: "bg-indigo-100 dark:bg-indigo-900/30",
      tagText: "text-indigo-700 dark:text-indigo-300",
      tagBorder: "border-indigo-200 dark:border-indigo-700",
    },
    "تطوير جوال": {
      bg: "from-sky-600 to-blue-600",
      iconBg:
        "from-sky-100 to-blue-100 dark:from-sky-800/50 dark:to-blue-700/50",
      iconColor: "text-sky-600 dark:text-sky-400",
      tagBg: "bg-sky-100 dark:bg-sky-900/30",
      tagText: "text-sky-700 dark:text-sky-300",
      tagBorder: "border-sky-200 dark:border-sky-700",
    },
    "قواعد بيانات": {
      bg: "from-slate-600 to-blue-600",
      iconBg:
        "from-slate-100 to-blue-100 dark:from-slate-800/50 dark:to-blue-700/50",
      iconColor: "text-slate-600 dark:text-slate-400",
      tagBg: "bg-slate-100 dark:bg-slate-900/30",
      tagText: "text-slate-700 dark:text-slate-300",
      tagBorder: "border-slate-200 dark:border-slate-700",
    },
    "أمن معلومات": {
      bg: "from-red-600 to-blue-600",
      iconBg:
        "from-red-100 to-blue-100 dark:from-red-800/50 dark:to-blue-700/50",
      iconColor: "text-red-600 dark:text-red-400",
      tagBg: "bg-red-100 dark:bg-red-900/30",
      tagText: "text-red-700 dark:text-red-300",
      tagBorder: "border-red-200 dark:border-red-700",
    },
    "علم بيانات": {
      bg: "from-cyan-600 to-indigo-600",
      iconBg:
        "from-cyan-100 to-indigo-100 dark:from-cyan-800/50 dark:to-indigo-700/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      tagBg: "bg-cyan-100 dark:bg-cyan-900/30",
      tagText: "text-cyan-700 dark:text-cyan-300",
      tagBorder: "border-cyan-200 dark:border-cyan-700",
    },
    تسويق: {
      bg: "from-pink-600 to-blue-600",
      iconBg:
        "from-pink-100 to-blue-100 dark:from-pink-800/50 dark:to-blue-700/50",
      iconColor: "text-pink-600 dark:text-pink-400",
      tagBg: "bg-pink-100 dark:bg-pink-900/30",
      tagText: "text-pink-700 dark:text-pink-300",
      tagBorder: "border-pink-200 dark:border-pink-700",
    },
    تصميم: {
      bg: "from-violet-600 to-blue-600",
      iconBg:
        "from-violet-100 to-blue-100 dark:from-violet-800/50 dark:to-blue-700/50",
      iconColor: "text-violet-600 dark:text-violet-400",
      tagBg: "bg-violet-100 dark:bg-violet-900/30",
      tagText: "text-violet-700 dark:text-violet-300",
      tagBorder: "border-violet-200 dark:border-violet-700",
    },
  };

  return colorMap[topic] || colorMap["برمجة"];
};

export const LevelBadge = ({ level }: any) => {
  const levelConfig: any = {
    مبتدئ: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-700",
    },
    متوسط: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-700",
    },
    متقدم: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-700",
    },
  };

  const config = levelConfig[level] || levelConfig["مبتدئ"];

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      {level}
    </span>
  );
};

export const ProfessionalCourseCard = ({
  course,
}: {
  course: CoursesContext;
}) => {
  const nav = useNavigate();
  const TopicIcon = getTopicIcon(course.topic);
  const topicColors = getTopicColors(course.topic);

  return (
    <div
      className={`
        group relative bg-white dark:bg-gray-900
        rounded-2xl border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-lg transition-all duration-300
        overflow-hidden
        h-full
        grid grid-rows-[auto,1fr]
      `}
    >
      <div
        className={`relative h-24 bg-gradient-to-br ${topicColors.iconBg} overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />

        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {checkIsNewCourse(course.created_at) && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700">
              جديد
            </span>
          )}
          <div className="w-11 h-11 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
            <TopicIcon size={22} className={topicColors.iconColor} />
          </div>
          <LevelBadge level={course.level} />
        </div>
      </div>

      <div className="p-6 grid grid-rows-[1fr,auto] h-full">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                {course.title}
              </h3>
              {/* <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                <Bookmark size={18} />
              </button> */}
            </div>
            <p className="text-gray-600 truncate dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          </div>

          {course.progress !== undefined && (
            <div className="space-y-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700 dark:text-green-300 font-medium">
                  التقدم
                </span>
                <span className="font-bold text-green-800 dark:text-green-200">
                  {course.progress ?? 0}%
                </span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress ?? 0}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Clock size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {course.course_info.durationHours} ساعة
              </span>
            </div>
            {/* <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Target size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {course.material_count} درس
              </span>
            </div> */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Users size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {course.enrolledCount} طالب
              </span>
            </div>
            {/* {course.rating && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Star
                  size={14}
                  className="text-amber-500"
                  fill="currentColor"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {course.rating}
                </span>
              </div>
            )} */}
          </div>

          <div className="flex flex-wrap gap-2 pb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${topicColors.tagBg} ${topicColors.tagText} ${topicColors.tagBorder}`}
            >
              <TopicIcon size={12} />
              {course.topic}
            </span>
            {course.course_info.new_skills_result &&
              course.course_info.new_skills_result
                .slice(0, 2)
                .map((tech: any, index: any) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700"
                  >
                    {tech}
                  </span>
                ))}
            {course.course_info.new_skills_result &&
              course.course_info.new_skills_result.length > 2 && (
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
                  +{course.course_info.new_skills_result.length - 2}
                </span>
              )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs.text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>{DateDisplay(course.updated_at)}</span>
          </div>
          {course.progress == 100 ? (
            <p>لقد انتهيت من هذه الدورة</p>
          ) : (
            <button
              onClick={() =>
                nav(`/dashboard/courses/${course.id}`, { replace: true })
              }
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${topicColors.bg} text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md`}
            >
              متابعة
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
