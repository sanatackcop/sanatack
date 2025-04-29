import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCcw, GitBranchPlus, Play } from "lucide-react";
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

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-700/40 ${className}`} />
);

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | any>();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("content");

  const fetchCourse = async () => {
    if (!id) return;

    try {
      setStatus("loading");
      const response = await getSingleCoursesApi({ courseId: id });
      setCourse(response);
      setStatus("success");
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء جلب بيانات الدورة، حاول مجددًا.");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleStartCourse = async () => {
    try {
      const response = await enrollCoursesApi({
        courseId: `36ef47f6-8042-42e7-a11f-fc83b407f55d`,
      });
      console.log("Start Course Response:", response);
    } catch (error) {
      console.error("Error starting course:", error);
    }
  };

  if (status === "loading") {
    return (
      <AppLayout>
        <section className="bg-[#0f0f0f] min-h-screen flex items-center justify-center px-4">
          <Skeleton className="w-full max-w-4xl h-72" />
        </section>
      </AppLayout>
    );
  }

  if (status === "error") {
    return (
      <AppLayout>
        <section
          className="bg-[#0f0f0f] min-h-screen flex flex-col gap-6 items-center justify-center text-white px-4"
          dir="rtl"
        >
          <p className="text-lg text-center max-w-lg leading-8">{error}</p>
          <Button
            onClick={fetchCourse}
            className="rounded-2xl px-6 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500"
          >
            حاول مرة أخرى <RefreshCcw size={18} className="mr-2" />
          </Button>
        </section>
      </AppLayout>
    );
  }

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
        <CourseTags
          duration={course?.duration}
          unitesNum={course?.unitesNum}
          level={course?.level}
          courseType={course?.type}
        />
      </GenericSection>

      <div className="w-full mt-5 mb-5 ">
        <div className="flex flex-wrap sm:justify-between sm:gap-4 md:gap-6 gap-1 sm-gap-3">
          <Button
            className="gap-2 px-2 py-2 sm:px-4 sm:py-4  sm:text-lg text-[#2CD195] font-medium bg-[#1B3731] bg-opacity-80 hover:bg-white hover:bg-opacity-45 hover:text-black duration-500 transition-all ease-in-out"
            onClick={handleStartCourse}
          >
            <GitBranchPlus className="w-4 h-4" />
            ابدأ الدورة
          </Button>

          <div className="flex flex-wrap justify-end gap-1 sm:gap-4">
            <Button className="bg-[#0C0C0C] px-2 py-2 sm:px-4 sm:py-4 sm:text-md text-white font-medium border-[#282D3D] border-2">
              <Play style={{ fill: "white" }} className="w-4 h-4" />
              مشاهدة نبذة
            </Button>
            <Button className="bg-[#0C0C0C] px-2 py-2 sm:px-4 sm:py-4  sm:text-md text-white font-medium border-[#282D3D] border-2">
              تحميل المنهج
            </Button>
          </div>
        </div>
      </div>

      <GenericTabs
        tabs={tabs}
        activeTab={selectedTab}
        onChange={setSelectedTab}
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
