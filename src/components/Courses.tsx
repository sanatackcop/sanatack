import GenericTabs from "@/components/tabs";
import GenericCard from "@/components/card";
import GenericSection from "@/components/section";
import { CourseInterface } from "@/types/courses";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import { useEffect, useState } from "react";
import { CourseTags } from "./tagsList";

export default function CoursesCard() {
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseInterface[]>([]);

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

  const data = {
    all: courses,
    started: [],
    done: [],
  };

  const tabs = [
    { label: "تصفح", value: "all", count: courses.length },
    { label: "بدأت", value: "started", count: 0 },
    { label: "اكتملت", value: "done", count: 0 },
  ];

  return (
    <div className="overflow-y-auto">
      <GenericSection
        title="الدورات"
        description="حسّن مهاراتك في هندسة البرمجيات و بيانات باستخدام مجموعة متنوعة من اللغات والأطر، بما في ذلك HTML، CSS، JavaScript، React، TypeScript، وطرق الذكاء الاصطناعي المتقدمة."
      />

      <GenericTabs
        tabs={tabs}
        activeTab={tab}
        onChange={setTab}
        data={data}
        onRetry={fetchCourses}
        loading={loading}
        error={error}
        renderItem={(course, index) => (
          <GenericCard
            id={`${course.id}`}
            key={index}
            title={course.title}
            description={course.description}
            className={index === 0 ? "md:col-span-2 sm:col-span-1" : ""}
            link={`/dashboard/courses/${course.id}`}
          >
            <CourseTags
              duration={course?.duration}
              unitesNum={course?.unitesNum}
              level={course?.level}
              courseType={course?.courseType}
            />
          </GenericCard>
        )}
      />
    </div>
  );
}
