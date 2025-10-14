import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CoursesContext } from "@/utils/types";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import Recent from "@/pages/dashboard/workspaces/Index";
import Spaces from "@/pages/dashboard/spaces/Index";

export default function LearningDashboard() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [, setCourses] = useState<CoursesContext[]>([]);
  const [, setError] = useState("");

  const fetchAllCourses = async () => {
    try {
      const res = await getAllCoursesApi();
      setCourses(res);
    } catch (err) {
      setError(t("dashboard.errors.loadCourses"));
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAllCourses()]);
    };
    fetchData();
  }, []);

  return (
    <>
      <section className="px-32  py-4">
        <header className="mb-2">
          <h1 className={`text-left text-xl md:text-[24px] font-medium my-5`}>
            Recent Learning Playgrounds 🧠
          </h1>
        </header>
        <Recent isRTL={isRTL} />
        <Spaces isRTL={isRTL} />
      </section>
    </>
  );
}
