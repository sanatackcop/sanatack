import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GitBranchPlus, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  enrollCoursesApi,
  getSingleCoursesApi,
} from "@/utils/_apis/courses-apis";
import AppLayout from "@/components/layout/Applayout";
import { CourseDetails } from "@/types/courses";
import GenericSection from "@/components/section";
import GenericTabs from "@/components/tabs";
import CourseDetailsContent from "./_course_content";
import { CourseTags } from "@/components/tagsList";
import { Tab } from "@/utils/types";

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnroll, setIsEnroll] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("content");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getSingleCoursesApi({ course_id: id });
      setIsEnroll(false); //! Need Fix
      setCourse(response);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء جلب بيانات الدورة، حاول مجددًا.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleStartCourse = async () => {
    try {
      await enrollCoursesApi({ courseId: id as string });
      navigate(`${location.pathname}/${course.title}`);
    } catch (error) {
      console.log(error);
      console.error("Error starting course:", error);
    }
  };

  const data = {
    content: course ? [course] : [],
    started: [],
    done: [],
  };

  const tabs: Tab[] = [
    { label: "المحتوى", value: "content" },
    { label: "حول", value: "about" },
    { label: "المهارات التي سوف تتعلمها", value: "skills" },
  ];

  return (
    <AppLayout>
      <GenericSection title={course?.title} description={course?.description}>
        {course?.tags && (
          <CourseTags
            duration={course?.tags.durtionsHours}
            unitesNum={course?.tags.unitesNum}
            level={course?.level}
            courseType={course?.tags.courseType}
            className="mr-2"
          />
        )}
      </GenericSection>

      <div className="w-full mt-5 mb-5">
        <div className="flex flex-wrap sm:justify-between sm:gap-4 md:gap-6 gap-1 sm-gap-3">
          <Button
            onClick={handleStartCourse}
            className={`gap-2 px-2 py-2 sm:px-4 sm:py-4 sm:text-lg font-medium duration-500 transition-all ease-in-out
    ${
      isEnroll
        ? "text-white bg-[#2c32d1] hover:bg-[#16185c]"
        : "text-[#2CD195] bg-[#1B3731] bg-opacity-80 hover:bg-white hover:bg-opacity-45 hover:text-black"
    }`}
          >
            {isEnroll ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <GitBranchPlus className="w-4 h-4" />
            )}
            {isEnroll ? "أكمل الدوره" : "ابدأ الدورة"}
          </Button>
          <div className="flex flex-wrap justify-end gap-1 sm:gap-4">
            <Button className="bg-[#999999] dark:bg-[#0C0C0C] dark:border-2 dark:border-gray-700 px-2 py-2 sm:px-4 sm:py-4 sm:text-md text-[#34363F] dark:text-white font-medium">
              <Play style={{ fill: "#34363F" }} className="w-4 h-4" />
              مشاهدة نبذة
            </Button>
            <Button className="bg-[#999999] dark:bg-[#0C0C0C] dark:border-2 dark:border-gray-700 px-2 py-2 sm:px-4 sm:py-4 sm:text-md text-[#34363F] dark:text-white font-medium">
              تحميل المنهج
            </Button>
          </div>
        </div>
      </div>

      <GenericTabs
        tabs={tabs}
        activeTab={selectedTab}
        onChange={setSelectedTab}
        onRetry={fetchCourse}
        loading={loading}
        error={error}
        data={data}
        renderItem={(course: CourseDetails, index: number) => (
          <CourseDetailsContent
            course={course}
            key={index}
            className={
              index === 0
                ? "relative flex flex-col justify-between md:col-span-5 sm:col-span-1"
                : ""
            }
          />
        )}
      />
    </AppLayout>
  );
}
