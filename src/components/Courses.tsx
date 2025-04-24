import GenericTabs from "@/components/tabs";
import GenericCard from "@/components/card";
import GenericSection from "@/components/section";
import { Hourglass } from "lucide-react";
import { CourseInterface } from "@/types/courses";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { TabType, Tab } from "@/utils/types";
export default function CoursesCard() {
  const [tab, setTab] = useState<TabType>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Record<TabType, CourseInterface[]>>({
    all: [],
    started: [],
    done: [],
  });
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCoursesApi();
      setCourses((prev) => ({
        ...prev,
        [tab]: response,
      }));
      console.log(response);
    } catch (err) {
      setError("فشل في تحميل الدورات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const tabs: Tab[] = [
    { label: "تصفح", value: "all", count: courses.all.length },
    { label: "بدأت", value: "started", count: courses.started.length },
    { label: "اكتملت", value: "done", count: courses.done.length },
  ];

  return (
    <div className="overflow-y-auto">
      <GenericSection
        title="الدورات"
        description="حسّن مهاراتك في هندسة البرمجيات وبيانات باستخدام مجموعة متنوعة من اللغات والأطر، بما في ذلك HTML، CSS، JavaScript، React، TypeScript، وطرق الذكاء الاصطناعي المتقدمة."
      />

      <GenericTabs
        tabs={tabs}
        activeTab={tab}
        onChange={(value: TabType) => setTab(value)}
        data={courses}
        loading={loading}
        error={error}
        renderItem={(course, id) => (
          <GenericCard
            key={id}
            title={course.title}
            description={course.description?.substring(0, 100) || ""}
            className={id === 0 ? "md:col-span-2 sm:col-span-1 " : ""}
            footerItems={[
              {
                icon: <Hourglass className="h-3 w-3 text-gray-500" />,
                text: `${course.tags?.durtionsHours ?? 0} ساعة`,
              },
            ]}
          />
        )}
      />
    </div>
  );
}
