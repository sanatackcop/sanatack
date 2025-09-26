import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CoursesContext } from "@/utils/types";
import { getAllCoursesApi } from "@/utils/_apis/courses-apis";
import AppLayout from "@/components/layout/Applayout";
import Recent from "@/components/Recent";
import Spaces from "@/components/Spaces";
import AiCardActions from "@/shared/ai/LearnPlayground/AiCardActions";

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
    <AppLayout className="mx-20">
      <AiCardActions />
      <Recent isRTL={isRTL} />
      <Spaces isRTL={isRTL} />
      {/* <Explore /> */}
    </AppLayout>
  );
}
