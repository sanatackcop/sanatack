import React, { useEffect, useMemo, useState } from "react";
import { Lesson, Material, SideNavbar } from "./_Sidebar";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { MaterialViewer } from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import {
  getSingleCoursesApi,
  patchCourseProgressApi,
} from "@/utils/_apis/courses-apis";
import { useParams } from "react-router-dom";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const { darkMode } = useSettings();
  const { id } = useParams();

  const [courseData, setCourseData] = useState<any>({});

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
  const allMaterials = flatMaterials ?? [];

  const totalMaterials = allMaterials.length;

  const completedMaterials = allMaterials.filter(
    (m: any) => m.completed
  ).length;

  const progress =
    totalMaterials > 0
      ? Math.round((completedMaterials / totalMaterials) * 100)
      : 0;

  const totalDuration = allMaterials.reduce(
    (sum: any, material: any) => sum + Number(material.duration || 0),
    0
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
  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) {
    return null;
  }
  const user = userContext.auth.user;

  const handleComplete = async () => {
    if (!currentMaterial || !user?.id) return;

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
    setCurrentMaterial({ ...currentMaterial, completed: true });

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
    if (!currentMaterial || !user?.id) return;

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
    setCurrentMaterial({ ...currentMaterial, completed: false });

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
        courseData={{
          ...courseData,
          completedLessons: completedMaterials,
          totalLessons: totalMaterials,
          progress: progress,
        }}
        totalMaterials={totalMaterials}
        totalDuration={totalDuration}
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

      <div className="flex flex-1 overflow-hidden pt-16 pb-16">
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
