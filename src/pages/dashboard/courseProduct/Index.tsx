import React, { useEffect, useState, useContext } from "react";
import { SideNavbar } from "./_Sidebar";
import UserContext from "@/context/UserContext";
import MaterialViewer from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import { patchCourseProgressApi } from "@/utils/_apis/courses-apis";
import { useParams } from "react-router-dom";
import { MaterialType } from "@/utils/types/adminTypes";
import { useCourseData } from "@/hooks/useCourseData";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);

  const {
    darkMode,
    currentCheck,
    updateCurrentCheck: updateCurrentMaterial,
  } = useSettings();

  const { id } = useParams();
  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) return null;
  const user = userContext.auth.user;

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

  useEffect(() => {
    if (currentMaterial) {
      updateCurrentMaterial(
        currentMaterial.type === MaterialType.ARTICLE
          ? { ...currentMaterial, total_read: 0 }
          : currentMaterial.type === MaterialType.QUIZ_GROUP
          ? { ...currentMaterial, result: 0 }
          : currentMaterial
      );
    }
  }, [currentMaterial]);

  const handleComplete = async () => {
    if (!user?.id || !currentCheck || !course) return;

    try {
      await patchCourseProgressApi({
        userId: user.id,
        courseId: course.id,
        materialId: nextMaterial ? nextMaterial.id : currentMaterial!.id,
        material: {
          type: currentMaterial!.type,
          ...(currentMaterial!.type === MaterialType.QUIZ_GROUP &&
          currentCheck.type === MaterialType.QUIZ_GROUP
            ? {
                quizGroup_id: currentMaterial!.id,
                result: currentCheck.result,
              }
            : {}),
        },
      });

      const updatedCourseData = {
        ...course,
        modules: course.modules.map((module: any) => ({
          ...module,
          lessons: module.lessons.map((lesson: any) => ({
            ...lesson,
            materials: lesson.materials.map((material: any) =>
              material.id === currentMaterial.id
                ? { ...material, completed: true }
                : material
            ),
          })),
        })),
      };

      setCourseData(updatedCourseData);
    } catch (err) {
      console.error("PATCH complete error:", err);
    }
  };

  const handleNext = async () => {
    if (!nextMaterial || !currentMaterial || !course) return;

    if (!currentMaterial.isFinished) {
      await handleComplete();
    }

    setCurrentMaterial(nextMaterial);
    updateCurrentMaterial(
      nextMaterial.type === MaterialType.ARTICLE
        ? { ...nextMaterial, total_read: 0 }
        : nextMaterial.type === MaterialType.QUIZ_GROUP
        ? { ...nextMaterial, result: 0 }
        : nextMaterial
    );
  };

  const handlePrev = () => {
    if (!prevMaterial) return;

    setCurrentMaterial(prevMaterial);
    updateCurrentMaterial(
      prevMaterial.type === MaterialType.ARTICLE
        ? { ...prevMaterial, total_read: 0 }
        : prevMaterial.type === MaterialType.QUIZ_GROUP
        ? { ...prevMaterial, result: 0 }
        : prevMaterial
    );
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (!course || !materials || !currentMaterial) {
    return <p>Loading course material...</p>;
  }

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
        currentIndex={currentIndex}
        currentMaterial={currentMaterial}
        handlePrev={handlePrev}
        handleNext={handleNext}
        setSidebarOpen={setSidebarOpen}
        handleComplete={handleComplete}
        handleRestart={function (): void {
          throw new Error("Function not implemented.");
        }}
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
