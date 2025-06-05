import {
  CheckCircle,
  Zap,
  BookOpen,
  Clock,
  ArrowRight,
  Award,
} from "lucide-react";
import GenericCard from "@/components/card";
import AppLayout from "@/components/layout/Applayout";
import { CourseTags } from "@/components/tagsList";
import { CoursesContext } from "@/types/courses";
import {
  getAllCoursesApi,
  getCurrentCoursesApi,
} from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

type Step = { text: string; done: boolean };
type Day = { label: string; active: boolean };

interface Props {
  userName: string;
  steps: Step[];
  days: Day[];
  className?: string;
}

const StatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full blur-2xl opacity-50"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <BookOpen size={24} className="text-white dark:text-gray-900" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">0</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            دورة مكتملة
          </p>
        </div>
      </div>
    </div>

    <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full blur-2xl opacity-50"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Clock size={24} className="text-white dark:text-gray-900" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">0</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            ساعة تعلم
          </p>
        </div>
      </div>
    </div>

    <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full blur-2xl opacity-50"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <Award size={24} className="text-white dark:text-gray-900" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">0</p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            شهادة حاصل عليها
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ModernSectionHeader = ({
  title,
  description,
  showViewAll = false,
}: any) => (
  <div className="flex items-end justify-between mb-8">
    <div className="space-y-2">
      <h2 className="text-3xl font-black text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
        {description}
      </p>
    </div>
    {showViewAll && (
      <Link to="/dashboard/courses">
        <button className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-semibold hover:gap-3 transition-all duration-300">
          عرض الكل
          <ArrowRight size={16} />
        </button>
      </Link>
    )}
  </div>
);

const EmptyState = ({ title, description, actionText }: any) => (
  <div className="relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-12 text-center shadow-sm">
    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 opacity-50"></div>
    <div className="relative z-10 max-w-md mx-auto space-y-6">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
        <BookOpen size={32} className="text-gray-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <button className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl px-6 py-3 font-semibold hover:shadow-lg transition-shadow duration-300">
        <BookOpen size={18} />
        {actionText}
      </button>
    </div>
  </div>
);

export default function DashboardHome() {
  const [currentCourses, setCurrentCourses] = useState<any[]>([]);
  const fetchCurrentCourses = async () => {
    try {
      const res = await getCurrentCoursesApi();
      setCurrentCourses(res);
    } catch {}
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CoursesContext[]>([]);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCurrentCourses();
  }, []);

  return (
    <AppLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gray-100 dark:bg-gray-800 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="relative z-10 space-y-16 pb-16">
        <StatsCards />

        {currentCourses.length > 0 ? (
          <section className="space-y-8">
            <ModernSectionHeader
              title="تابع دوراتك الحالية"
              description="أكمل ما بدأته وارتقِ بمهاراتك إلى المستوى التالي"
              showViewAll={true}
            />
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <GenericCard
                    title={course.title}
                    link={`/dashboard/courses/${course.id}/${course.title}`}
                    progress={course.progress}
                    description={course.description}
                  />
                </div>
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

        <section className="space-y-8">
          <ModernSectionHeader
            title="موصى به لك"
            description="دورات مختارة بعناية لتناسب اهتماماتك ومستواك التعليمي"
            showViewAll={true}
          />

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="w-5 h-5 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-900 dark:text-white font-medium">
                  جاري التحميل...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                {error}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <GenericCard
                    id={`${course.id}`}
                    title={course.title}
                    description={course.description}
                    link={`/dashboard/courses/${course.id}/${course.title}`}
                    className={clsx(
                      index === 0 && "md:col-span-2 lg:col-span-1"
                    )}
                  >
                    {course?.tags && (
                      <CourseTags
                        duration={course?.tags.durtionsHours}
                        unitesNum={course?.tags.unitesNum}
                        level={course?.level}
                        courseType={course?.tags.courseType}
                      />
                    )}
                  </GenericCard>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export function LearningHabitCard({ userName, steps, days, className }: Props) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden flex flex-col gap-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 shadow-xl lg:flex-row",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full blur-2xl opacity-20"></div>

      <div className="relative z-10 flex-1 space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-medium">
            <Zap size={14} />
            عادة التعلم اليومية
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">
            أهلاً بك، {userName}!
          </h2>

          <p className="text-gray-600 dark:text-gray-400">
            اتخذ خطواتك الأولى لبناء عادة تعلم قوية ومستدامة
          </p>
        </div>

        <div className="space-y-4">
          {steps.map(({ text, done }) => (
            <div
              key={text}
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <span
                className={clsx(
                  "font-medium",
                  done
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {text}
              </span>

              {done && (
                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white dark:text-gray-900" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden w-px self-stretch bg-gray-200 dark:bg-gray-700 lg:block" />

      <div className="relative z-10 flex items-center gap-6 overflow-x-auto lg:overflow-visible lg:flex-col lg:gap-4">
        {days.map(({ label, active }, idx) => (
          <div
            key={`${label}-${idx}`}
            className={clsx(
              "flex flex-col items-center gap-2 min-w-fit lg:flex-row lg:gap-3 lg:w-full lg:justify-start",
              active
                ? "text-gray-900 dark:text-white"
                : "text-gray-400 dark:text-gray-600"
            )}
          >
            <div
              className={clsx(
                "flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                active
                  ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white shadow-lg"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              )}
            >
              <Zap
                className={clsx(
                  "w-5 h-5 transition-colors duration-300",
                  active
                    ? "text-white dark:text-gray-900"
                    : "text-gray-400 dark:text-gray-600"
                )}
              />
            </div>

            <span className="text-sm font-medium whitespace-nowrap lg:text-base">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
