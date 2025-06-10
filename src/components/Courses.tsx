// Enhanced CoursesCard Component
import GenericTabs from "@/components/tabs";
import GenericCard from "@/components/card";
import { CoursesContext } from "@/types/courses";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { CourseTags } from "./tagsList";
import {
  Search,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import GenericSection from "./section";

export default function CoursesCard() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CoursesContext[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || course.level === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const data = {
    all: filteredCourses,
    started: [],
    done: [],
  };

  const tabs = [
    {
      label: "تصفح الكل",
      value: "all",
      count: filteredCourses.length,
      icon: BookOpen,
    },
    { label: "بدأت", value: "started", count: 0, icon: TrendingUp },
    { label: "اكتملت", value: "done", count: 0, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/20 to-transparent dark:from-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/20 to-transparent dark:from-purple-900/10 rounded-full blur-3xl" />

        <div className="relative z-10 pt-8 pb-14">
          <GenericSection
            showDecorations={true}
            title="مكتبة الدورات التعليمية"
            description="استكشف مجموعة شاملة من الدورات المتخصصة في هندسة البرمجيات وعلوم البيانات والذكاء الاصطناعي. طور مهاراتك مع أحدث التقنيات والأدوات المطلوبة في سوق العمل."
            extraContent={
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                  <div className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-800/20 dark:to-gray-900/40 rounded-2xl" />
                    <div className="relative flex items-center justify-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-7 h-7 text-white dark:text-black" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-black dark:text-white">
                          {courses.length}+
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          دورة تعليمية
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-800/20 dark:to-gray-900/40 rounded-2xl" />
                    <div className="relative flex items-center justify-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-black dark:from-gray-300 dark:to-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-7 h-7 text-white dark:text-black" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-black dark:text-white">
                          300+
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          ساعة تعلم
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-800/20 dark:to-gray-900/40 rounded-2xl" />
                    <div className="relative flex items-center justify-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black dark:from-gray-200 dark:to-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-7 h-7 text-white dark:text-black" />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-black dark:text-white">
                          1500+
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          متعلم نشط
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
      </div>

      <div className="relative z-10 -mt-2">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-slate-200/30 dark:border-slate-700/30">
          <GenericTabs
            tabs={tabs}
            activeTab={tab}
            onChange={setTab}
            data={data}
            onRetry={fetchCourses}
            loading={loading}
            error={error}
            renderItem={(course, index) => (
              <div
                key={course.id}
                className={`
                  transform transition-all duration-300 
                  ${index === 0 ? "md:col-span-2 sm:col-span-1" : ""}
                `}
              >
                <GenericCard
                  id={`${course.id}`}
                  title={course.title}
                  description={course.description}
                  className={`
                    h-full min-h-[320px]`}
                  link={`/dashboard/courses/${course.id}`}
                >
                  {course.tags && (
                    <div className="mt-4">
                      <CourseTags
                        duration={course?.tags.durtionsHours}
                        unitesNum={course?.tags.unitesNum}
                        level={course?.level}
                        courseType={course?.tags.courseType}
                      />
                    </div>
                  )}
                </GenericCard>
              </div>
            )}
          />
        </div>
      </div>

      {!loading && filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            لم يتم العثور على دورات
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
            جرب تعديل معايير البحث أو الفلاتر للعثور على الدورات المناسبة لك
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            إعادة تعيين البحث
          </button>
        </div>
      )}
    </div>
  );
}
