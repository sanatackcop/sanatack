import GenericTabs from "@/components/tabs";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import GenericSection from "./section";
import { CoursesContext } from "@/utils/types";
import { ProfessionalCourseCard } from "@/pages/dashboard/home/components/course.helpers";

export default function CoursesCard() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CoursesContext[]>([]);
  const [searchQuery] = useState("");
  const [selectedFilter] = useState("all");

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
              <ProfessionalCourseCard key={course.id} course={course} />
            )}
          />
        </div>
      </div>
    </div>
  );
}
