import React, { useState } from "react";
import { SideNavbar } from "./_Sidebar";
import { Material, LessonDetails } from "@/types/courses";
import UserContext from "@/context/UserContext";
import { useContext } from "react";
import { MaterialViewer } from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import { patchCourseProgressApi } from "@/utils/_apis/courses-apis";
import { useParams } from "react-router-dom";
import { useCourseData } from "@/hooks/useCourseData";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const { darkMode } = useSettings();
  const { id } = useParams();

  const {
    course,
    setCourseData,
    currentMaterial,
    setCurrentMaterial,
    materials,
    materialsCount,
    completedMaterials,
    progress,
    materialsDuration,
    nextMaterial,
    prevMaterial,
    currentIndex,
  } = useCourseData(id as string);

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

  if (!materials) return <p>There is no current Material</p>;

  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) return null;

  if (!course) return;

  const user = userContext.auth.user;

  const handleComplete = async () => {
    if (!user?.id) return;

    const updatedCourseData = {
      ...course,
      modules: course.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons.map((lesson: LessonDetails) => ({
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
        courseId: course.id,
        materialId: currentMaterial.id,
      });
    } catch (err) {
      console.error("خطأ في PATCH complete:", err);
      setCourseData(course);
      setCurrentMaterial(currentMaterial);
    }
  };

  const handleRestart = async () => {
    if (!user?.id) return;

    const updatedCourseData = {
      ...course,
      modules: course.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons.map((lesson: LessonDetails) => ({
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
        courseId: course.id,
        materialId: currentMaterial.id,
      });
    } catch (err) {
      console.error("خطأ في PATCH restart:", err);
      setCourseData(course);
      setCurrentMaterial(currentMaterial);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <NavigationPlayground
        courseData={course}
        completedLessons={completedMaterials}
        totalLessons={materialsCount}
        progress={progress}
        totalDuration={materialsDuration}
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
        {
          <SideNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            courseData={course}
            materials={materials}
            expandedModules={expandedModules}
            toggleModule={toggleModule}
            currentMaterial={currentIndex}
            totalMaterials={materialsCount}
            completedMaterials={completedMaterials}
            progress={progress}
            totalDuration={materialsDuration}
            setCurrentMaterial={setCurrentMaterial}
            darkMode={darkMode}
          />
        }

        <main className="flex-1 flex flex-col overflow-hidden">
          <MaterialViewer material={currentMaterial} />
        </main>
      </div>
    </div>
  );
};

export default CoursePlayground;
