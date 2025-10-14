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
import { CourseDetailsContext } from "@/types/courses";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const { id } = useParams();
  const {
    course,
    currentMaterial,
    sortedMaterials,
    materials,
    materialsCount,
    completedMaterials,
    materialsDuration,
    nextMaterial,
    prevMaterial,
    currentIndex,
    setCourseData,
    setCurrentMaterial,
  } = useCourseData(id as string);
  const { darkMode, currentCheck, updateCurrentCheck } = useSettings();
  const userContext = useContext(UserContext);
  if (!userContext || !userContext.auth?.user) return null;
  const user = userContext.auth.user;

  useEffect(() => {
    if (sortedMaterials.length) {
      const curMaterial =
        sortedMaterials.find((m) => m.id === course?.current_material) ??
        sortedMaterials[0];

      setCurrentMaterial(curMaterial);
      if (curMaterial) {
        updateCurrentCheck(
          curMaterial.type === MaterialType.ARTICLE
            ? { ...curMaterial, duration: 0, total_read: 0 }
            : curMaterial.type === MaterialType.QUIZ_GROUP
            ? { ...curMaterial, duration: 0, result: 0 }
            : curMaterial.type == MaterialType.VIDEO
            ? { ...curMaterial, duration: 0 }
            : curMaterial
        );
      }
    }
  }, [sortedMaterials]);

  const handleComplete = async () => {
    if (!user?.id || !currentCheck || !currentMaterial || !course) return;

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

      const updatedCourseData: CourseDetailsContext = {
        ...course,
        progress: Math.min(
          100,
          Math.round(course.progress! + 100 / course.material_count!)
        ),
        current_material: nextMaterial?.id,
        modules: course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            materials: lesson.materials.map((material) =>
              material.id === currentMaterial.id
                ? {
                    ...material,
                    isFinished: true,
                    ...(material.type == MaterialType.QUIZ_GROUP &&
                    currentCheck.type == MaterialType.QUIZ_GROUP
                      ? {
                          old_result: currentCheck.result,
                        }
                      : {}),
                  }
                : material
            ),
          })),
        })),
      };

      if (
        currentCheck.type == MaterialType.QUIZ_GROUP &&
        currentMaterial.type == MaterialType.QUIZ_GROUP
      )
        updatedCourseData.enrollment_info.quizzes_result[currentMaterial.id] =
          currentCheck.result;

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
    updateCurrentCheck(
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
    updateCurrentCheck(
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

  if (!course || !materials || !currentMaterial)
    return <p>Loading course material...</p>;

  return (
    <div className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <NavigationPlayground
        courseData={course}
        completedLessons={completedMaterials}
        totalLessons={materialsCount}
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
        <SideNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          courseData={course}
          materials={Array.from(materials.values())}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          currentMaterial={currentMaterial}
          completedMaterials={completedMaterials}
          totalDuration={materialsDuration}
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
``;

export default CoursePlayground;
