import { CheckCircle, Zap } from "lucide-react";
import GenericCard from "@/components/card";
import AppLayout from "@/components/layout/Applayout";
import GenericSection from "@/components/section";
import { CourseTags } from "@/components/tagsList";
import { CourseInterface } from "@/types/courses";
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

const HeroSection = () => (
  <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-600 via-gray-600 to-gray-700 p-8 text-white shadow-xl">
    <div className="relative z-10 space-y-5">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
        ارتقِ بمهاراتك إلى المستوى التالي
      </h1>
      <p className="max-w-2xl text-base sm:text-lg md:text-xl opacity-90">
        اكتشف أفضل الدورات المصممة لتطوير قدراتك المهنية والشخصية مع خبراء
        المجال.
      </p>

      <div className="flex flex-wrap gap-4">
        <a className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
          <Link
            to="/dashboard/courses"
            className="flex items-center gap-1 text-white  rounded-full px-4 py-2"
          >
            تصفح الدورات
          </Link>
        </a>
      </div>
    </div>

    <img
      src="/images/hero-illustration.svg"
      alt=""
      width={320}
      height={320}
      className="absolute -bottom-4 -right-8 hidden lg:block"
    />
  </section>
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
  const [courses, setCourses] = useState<CourseInterface[]>([]);

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
      <div className="space-y-10">
        <HeroSection />

        <GenericSection
          title="تابع دوراتك الحالية"
          description="أكمل ما بدأته وارتقِ بمهاراتك."
        />
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentCourses.length &&
            currentCourses.map((p) => (
              <GenericCard
                key={p.id}
                title={p.title}
                id={p.id}
                progress={p.progress}
                description={p.description}
              />
            ))}
        </div>

        <GenericSection title="موصى به لك" description="تعلم افضل المهرات" />
        <div
          className={clsx(
            "grid gap-5",
            "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {courses.map((course, index) => (
            <GenericCard
              id={`${course.id}`}
              key={course.id}
              title={course.title}
              description={course.description}
              className={clsx(
                "flex flex-col",
                index === 0 && "md:col-span-2 lg:col-span-2"
              )}
            >
              <CourseTags
                duration={course.duration}
                unitesNum={course.unitesNum}
                level={course.level}
                courseType={course.courseType}
              />
            </GenericCard>
          ))}
        </div>
        {loading && <p className="text-center">جاري التحميل...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
      </div>
    </AppLayout>
  );
}

export function LearningHabitCard({ userName, steps, days, className }: Props) {
  return (
    <section
      className={clsx(
        "flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm lg:flex-row",
        className
      )}
    >
      <div className="flex-1">
        <h2 className="mb-6 text-2xl font-extrabold lg:text-3xl">
          Welcome, {userName}!
        </h2>

        <div className="relative pl-10">
          <span className="absolute left-0 top-1 text-3xl font-bold leading-none">
            <span className="text-gray-900">1</span>
            <Zap className="inline-block h-[1.25rem] w-[1.25rem] translate-y-[2px] text-yellow-500" />
          </span>

          <h3 className="mb-4 text-lg font-semibold">
            Take your first steps to building a learning habit.
          </h3>

          <ul className="space-y-3">
            {steps.map(({ text, done }) => (
              <li key={text} className="flex items-center justify-between">
                <span
                  className={clsx(
                    "text-sm md:text-base",
                    done ? "text-gray-800" : "text-gray-500"
                  )}
                >
                  {text}
                </span>

                {done && (
                  <CheckCircle className="h-6 w-6 shrink-0 text-emerald-600" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* vertical divider                                                 */}
      <div className="hidden w-px self-stretch bg-gray-200 lg:block" />

      <div className="flex items-center gap-8 overflow-x-auto lg:overflow-visible">
        {days.map(({ label, active }, idx) => (
          <div
            key={`${label}-${idx}`}
            className={clsx(
              "flex flex-col items-center gap-1",
              active ? "text-gray-900" : "text-gray-400"
            )}
          >
            <span className="text-sm font-medium">{label}</span>

            <div
              className={clsx(
                "grid h-14 w-14 place-items-center rounded-full border",
                active ? "border-yellow-500 bg-yellow-50" : "border-transparent"
              )}
            >
              <Zap
                className={clsx(
                  "h-5 w-5",
                  active ? "text-yellow-500" : "text-gray-300"
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
