import GenericTabs from "@/components/tabs";
import { CoursesContext } from "@/types/courses";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { Search, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import GenericSection from "./section";
import { ProfessionalCourseCard } from "@/pages/dashboard/home/Index";

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
    <div>
      <GenericSection
        showDecorations={false}
        title="مكتبة الدورات التعليمية"
        description="استكشف مجموعة شاملة من الدورات المتخصصة في هندسة البرمجيات وعلوم البيانات والذكاء الاصطناعي. طور مهاراتك مع أحدث التقنيات والأدوات المطلوبة في سوق العمل."
      />

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
            renderItem={(course) => (
              <ProfessionalCourseCard
                key={course.id}
                course={course}
                isCurrentCourse={false}
              />
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
