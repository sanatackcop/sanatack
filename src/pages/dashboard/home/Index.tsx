import { useEffect, useState } from "react";

import {
  getAllCoursesApi,
  getCourseReportApi,
} from "@/utils/_apis/courses-apis";
import { CoursesReport } from "@/types/courses";
import { CoursesContext } from "@/utils/types";
import {
  AnimatedBackground,
  EmptyState,
  ModernSectionHeader,
  ProfessionalCourseCard,
  StatsCards,
} from "./components/course.helpers";

export default function DashboardHome() {
  const [courses, setCourses] = useState<CoursesContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<CoursesReport>({
    completedCourses: 0,
    totalHours: 0,
    streakDays: 0,
    certifications: 0,
  });

  const fetchAllCourses = async () => {
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل الدورات. الرجاء المحاولة لاحقاً.");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getCourseReportApi();
      setStats(res);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchAllCourses();
      fetchStats();
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 transition-colors duration-500">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-16">
        <StatsCards stats={stats} />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-900 dark:text-white font-medium">
                جاري تحميل الدورات...
              </span>
            </div>
          </div>
        ) : courses.filter((course) => course.isEnrolled == true).length > 0 ? (
          <section className="space-y-8">
            <ModernSectionHeader
              title="تابع دوراتك الحالية"
              description="أكمل ما بدأته وارتقِ بمهاراتك إلى المستوى التالي"
              showViewAll={false}
            />
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => course.isEnrolled == true)
                .map((course: any) => (
                  <ProfessionalCourseCard key={course.id} course={course} />
                ))}
            </div>
          </section>
        ) : (
          <EmptyState
            title="لا توجد دورات حالية"
            description="ابدأ رحلتك التعليمية واختر من مجموعة واسعة من الدورات المتاحة"
            actionText="ابدأ التعلم الآن"
          />
        )}

        <section className="space-y-8 pt-8">
          <ModernSectionHeader
            title="موصى به لك"
            description="دورات مختارة بعناية لتناسب اهتماماتك ومستواك التعليمي"
            showViewAll={true}
          />

          {error ? (
            <div className="flex items-center justify-center py-16">
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                {error}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((course) => course.isEnrolled == false)
                .map((course: any) => (
                  <ProfessionalCourseCard key={course.id} course={course} />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
