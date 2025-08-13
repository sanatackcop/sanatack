import GenericTabs from "@/components/tabs";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { BookOpen, Sparkles, TrendingUp, Bot, Zap, Stars } from "lucide-react";
import GenericSection from "./section";
import { CoursesContext } from "@/utils/types";
import { ProfessionalCourseCard } from "@/pages/dashboard/home/components/course.helpers";
import { Button } from "@/components/ui/button";
import AiCourseGeneration from "@/pages/dashboard/ai/course-creation/Index";

export default function CoursesCard() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CoursesContext[]>([]);
  const [searchQuery] = useState("");
  const [selectedFilter] = useState("all");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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
      (course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);
    const matchesFilter =
      selectedFilter === "all" || course.level === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const started = filteredCourses.filter((course) => course.progress != 100);
  const done = filteredCourses.filter((course) => course.progress == 100);

  const data = {
    all: filteredCourses,
    started,
    done,
  };

  const tabs = [
    {
      label: "تصفح الكل",
      value: "all",
      count: filteredCourses.length,
      icon: BookOpen,
    },
    {
      label: "بدأت",
      value: "started",
      count: started.length,
      icon: TrendingUp,
    },
    { label: "اكتملت", value: "done", count: done.length, icon: Sparkles },
  ];

  return (
    <div>
      <GenericSection
        showDecorations={false}
        title="مكتبة الدورات التعليمية"
        description="استكشف مجموعة شاملة من الدورات المتخصصة في هندسة البرمجيات وعلوم البيانات والذكاء الاصطناعي. طور مهاراتك مع أحدث التقنيات والأدوات المطلوبة في سوق العمل."
        extraContent={
          <div className="flex justify-center lg:justify-start">
            <Button
              onClick={() => setIsAiModalOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 border-0"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

              {/* Sparkle effects */}
              <div className="absolute -top-1 -right-1 w-3 h-3">
                <Stars className="w-3 h-3 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2">
                <Sparkles className="w-2 h-2 text-blue-300 animate-bounce" />
              </div>

              {/* Button content */}
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                </div>
                <span className="relative">صناعة كورس</span>
                <Zap className="w-4 h-4 group-hover:animate-pulse" />
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </Button>
          </div>
        }
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

      {/* AI Course Generation Component with its own modal */}
      <AiCourseGeneration
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCourseCreated={(course) => {
          console.log("Course created:", course);
          // Handle course creation here
          setIsAiModalOpen(false);
        }}
      />
    </div>
  );
}
