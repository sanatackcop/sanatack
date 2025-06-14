import React, { useEffect, useMemo, useState } from "react";
import { Lesson, Material, SideNavbar } from "./_Sidebar";
import { MaterialViewer } from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";
import { getSingleCoursesApi } from "@/utils/_apis/courses-apis";
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
      ),
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

  return (
    <div
      className={`h-screen flex flex-col ${darkMode ? "dark" : ""}`}
      dir="rtl"
    >
      <NavigationPlayground
        courseData={courseData}
        sidebarOpen={sidebarOpen}
        prevMaterial={prevMaterial}
        nextMaterial={nextMaterial}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={currentIndex}
        totalMaterials={flatMaterials?.length}
        setSidebarOpen={setSidebarOpen}
        currentMaterial={currentMaterial}
        handleComplete={function (): void {
          throw new Error("Function not implemented.");
        }}
        handleRestart={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {
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
        }

        <main className="flex-1 flex flex-col">
          <MaterialViewer material={currentMaterial} />
        </main>
      </div>
    </div>
  );
};

export default CoursePlayground;
