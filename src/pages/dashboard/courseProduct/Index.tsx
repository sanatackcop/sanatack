import React, { useEffect, useMemo, useState } from "react";
import { Lesson, SideNavbar } from "./_Sidebar";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import MaterialViewer from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import {
  getSingleCoursesApi,
  patchCourseProgressApi,
} from "@/utils/_apis/courses-apis";
import { useParams } from "react-router-dom";
import { CourseDetails, Material } from "@/types/courses";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const { darkMode } = useSettings();
  const { id } = useParams();

  const [courseData, setCourseData] = useState<CourseDetails | null>(null);

  const fetchCourseData = async () => {
    const data = await getSingleCoursesApi({ course_id: id as string });
    setCourseData(data);
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const flatMaterials = useMemo(
    () =>
      courseData?.modules?.flatMap((m: any) =>
        m?.lessons.flatMap((l: Lesson) => l?.materials)
      ) ?? [],
    [courseData?.modules]
  );

  useEffect(() => {
    if (!currentMaterial && flatMaterials?.length > 0) {
      const firstMaterial =
        flatMaterials?.find((m: any) => m.current) || flatMaterials[0];
      setCurrentMaterial(firstMaterial);
    }
  }, [flatMaterials, currentMaterial]);

  const currentIndex = currentMaterial
    ? flatMaterials.findIndex((m: any) => m.id === currentMaterial.id)
    : -1;
  const nextMaterial =
    currentIndex > -1 ? flatMaterials[currentIndex + 1] : null;
  const prevMaterial =
    currentIndex > 0 ? flatMaterials[currentIndex - 1] : null;

  const handleNext = () => {
    if (nextMaterial && !nextMaterial.locked) setCurrentMaterial(nextMaterial);
  };
  const handlePrev = () => {
    if (prevMaterial) setCurrentMaterial(prevMaterial);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (!currentMaterial) return <p>There is no current Material</p>;

  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) return null;

  if (!courseData) return;

  const user = userContext.auth.user;

  const handleComplete = async () => {
    if (!user?.id) return;

    const updatedCourseData = {
      ...courseData,
      modules: courseData.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons.map((lesson: Lesson) => ({
          ...lesson,
          materials: lesson.materials.map((material: Material) =>
            material.id === currentMaterial.id
              ? { ...material, completed: true }
              : material
          ),
        })),
      })),
    };
    setCourseData(updatedCourseData);
    setCurrentMaterial({ ...currentMaterial });

    try {
      await patchCourseProgressApi({
        userId: user.id,
        courseId: courseData.id,
        materialId: currentMaterial.id,
      });
    } catch (err) {
      console.error("خطأ في PATCH complete:", err);
      setCourseData(courseData);
      setCurrentMaterial(currentMaterial);
    }
  };

  const handleRestart = async () => {
    if (!user?.id) return;

    const updatedCourseData = {
      ...courseData,
      modules: courseData.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons.map((lesson: Lesson) => ({
          ...lesson,
          materials: lesson.materials.map((material: Material) =>
            material.id === currentMaterial.id
              ? { ...material, completed: false }
              : material
          ),
        })),
      })),
    };
    setCourseData(updatedCourseData);
    setCurrentMaterial({ ...currentMaterial });

    try {
      await patchCourseProgressApi({
        userId: user.id,
        courseId: courseData.id,
        materialId: currentMaterial.id,
      });
    } catch (err) {
      console.error("خطأ في PATCH restart:", err);
      setCourseData(courseData);
      setCurrentMaterial(currentMaterial);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <NavigationPlayground
        courseData={courseData}
        sidebarOpen={sidebarOpen}
        prevMaterial={prevMaterial}
        nextMaterial={nextMaterial}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={currentIndex}
        setSidebarOpen={setSidebarOpen}
        currentMaterial={currentMaterial}
        handleComplete={handleComplete}
        handleRestart={handleRestart}
      />

      <div className="flex flex-1 overflow-hidden">
        <SideNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          courseData={courseData}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          currentMaterial={currentMaterial}
          setCurrentMaterial={setCurrentMaterial}
          darkMode={darkMode}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <MaterialViewer material={currentMaterial} />
        </main>
      </div>
    </div>
  );
};

export default CoursePlayground;
