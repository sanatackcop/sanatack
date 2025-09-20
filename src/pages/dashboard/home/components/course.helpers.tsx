import {
  BarChart3,
  BookOpen,
  Brain,
  Camera,
  Code,
  Cpu,
  Database,
  Globe,
  Palette,
  Shield,
  Smartphone,
  TrendingUp,
} from "lucide-react";

import { CoursesContext } from "@/utils/types";

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

export function CourseCardNew({ course }: { course: CoursesContext }) {
  if (!course) return null;

  return (
    <></>
    // <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300">
    //   <div className="relative aspect-[4/3] overflow-hidden">
    //     {coverUrl ? (
    //       <img
    //         src={coverUrl}
    //         alt={course.title || "Course cover"}
    //         className="h-full w-full object-cover"
    //         loading="lazy"
    //       />
    //     ) : (
    //       <div className="h-full w-full grid place-items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
    //         <div className="flex items-center gap-2 text-gray-400">
    //           <ImageIcon size={18} />
    //           <span className="text-sm">لا توجد صورة</span>
    //         </div>
    //       </div>
    //     )}

    //     <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

    //     <div className="absolute top-3 right-3 flex items-center gap-2">
    //       {course.created_at && checkIsNewCourse(course.created_at) && (
    //         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/20 text-blue-700 dark:text-blue-300 backdrop-blur">
    //           جديد
    //         </span>
    //       )}
    //     </div>

    //     <div className="absolute bottom-3 left-3">
    //       <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/20 text-gray-700 dark:text-gray-100 backdrop-blur">
    //         <TopicIcon size={12} />
    //         {course.topic || "عام"}
    //       </span>
    //     </div>
    //   </div>

    //   <div className="p-4">
    //     <div className="mb-2 flex items-start justify-between gap-3">
    //       <h3 className="text-base leading-6 font-bold text-gray-900 dark:text-white line-clamp-2">
    //         {course.title || "دورة بدون عنوان"}
    //       </h3>

    //       {course.progress !== undefined && course.progress !== null && (
    //         <div className="shrink-0">
    //           <ProgressRing value={course.progress || 0} />
    //         </div>
    //       )}
    //     </div>

    //     {course.description && (
    //       <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
    //         {course.description}
    //       </p>
    //     )}

    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
    //         <Clock size={14} />
    //         <span>{course.course_info?.durationHours || 0} ساعة</span>
    //         <span className="mx-1">•</span>
    //         <Users size={14} />
    //         <span>{course.enrolledCount || 0} طالب</span>
    //         <span className="mx-1">•</span>
    //         <Calendar size={14} />
    //         <span>
    //           {course.updated_at ? DateDisplay(course.updated_at) : "N/A"}
    //         </span>
    //       </div>

    //       <button
    //         onClick={() =>
    //           nav(`/dashboard/courses/${course.id}`, { replace: true })
    //         }
    //         className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r ${
    //           topicColors?.bg || "from-blue-600 to-indigo-600"
    //         } hover:shadow-md transition-all`}
    //       >
    //         متابعة
    //         <ArrowRight size={14} />
    //       </button>
    //     </div>

    //     {course.progress !== undefined && course.progress !== null && (
    //       <div className="mt-3">
    //         <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
    //           <div
    //             className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
    //             style={{ width: `${course.progress || 0}%` }}
    //           />
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
}

/**
 * Optional: Study card variant – keeps your existing style but you can tweak freely.
 */
export function StudyCard({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-start rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-shadow"
    >
      <div className="font-bold text-gray-900 dark:text-white line-clamp-1">
        {title}
      </div>
      {subtitle && (
        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
          {subtitle}
        </div>
      )}
    </button>
  );
}

/**
 * Wrapper that chooses which card to render. We assume your `CoursesContext` includes a `type` field ("course" | "study").
 * If it doesn't, pass an explicit `variant` prop or adapt the condition below.
 */
export function LearningCard({
  course,
}: {
  course: CoursesContext & { type?: string };
}) {
  if ((course as any)?.type === "study") {
    return (
      <StudyCard
        title={course.title || "مذكرة دراسة"}
        subtitle={course.description}
        onClick={() => {}}
      />
    );
  }
  return <CourseCardNew course={course} />; // default to course
}

/** Demo for canvas preview only */
export default function Demo() {
  const fake: any = {
    id: "1",
    title: "اتخاذ القرار في الذكاء الاصطناعي",
    description:
      "مقدمة عملية حول النماذج الإحصائية وأساليب التعلّم لاتخاذ القرارات.",
    topic: "ذكاء اصطناعي",
    level: "متوسط",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    progress: 64,
    course_info: {
      durationHours: 18,
      new_skills_result: ["Python", "Pandas", "RL"],
    },
    enrolledCount: 245,
    // cover: "https://images.unsplash.com/photo-1551281044-8d8d8a6d7d05?q=80&w=1200&auto=format&fit=crop", // add your own cover if you want
    type: "course",
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <CourseCardNew course={fake} />
    </div>
  );
}
