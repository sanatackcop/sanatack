import React, { useEffect, useMemo, useState } from "react";
import { Course, Material, SideNavbar } from "./_Sidebar";
import { MaterialViewer } from "./_MaterialViewer";
import NavigationPlayground from "./_TopNav";
import { useSettings } from "@/context/SettingsContexts";

export const CoursePlayground: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(["basics"]);
  const { darkMode } = useSettings();

  const [courseData] = useState<Course>({
    id: "1",
    title: "أساسيات الجافاسكريبت",
    subtitle: "تعلم أساسيات البرمجة بالجافاسكريبت",
    progress: 25,
    totalLessons: 12,
    completedLessons: 3,
    completedCount: 3,
    totalCount: 12,
    duration: "4 ساعات",
    modules: [
      {
        id: "basics",
        title: "وحدة التحكم",
        progress: 60,
        completedCount: 3,
        totalCount: 5,
        lessons: [
          {
            id: "lesson-1",
            title: "الدرس الأول",
            completedCount: 2,
            totalCount: 2,
            duration: "25 دقيقة",
            materials: [
              {
                id: "01-setting-up",
                title: "الإعداد الأولي",
                description:
                  "تعلم كيفية إعداد بيئة التطوير للجافاسكريبت واستخدام وحدة التحكم لكتابة أول برنامج لك.",
                completed: true,
                duration: "5 دقائق",
                type: "text",
                locked: false,
              },
              {
                id: "02-console",
                title: "وحدة التحكم",
                description:
                  "مقدمة شاملة عن وحدة التحكم في المتصفح وكيفية استخدامها لتنفيذ أوامر الجافاسكريبت وعرض النتائج.",
                completed: true,
                duration: "8 دقائق",
                type: "video",
                locked: false,
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              },
            ],
          },
          {
            id: "lesson-2",
            title: "الدرس الثاني",
            completedCount: 1,
            totalCount: 3,
            duration: "35 دقيقة",
            materials: [
              {
                id: "03-letter-tree",
                title: "شجرة الحروف",
                description:
                  "تمرين عملي على البرمجة باستخدام الحلقات والشروط لإنشاء أشكال وأنماط من الحروف والرموز.",
                completed: false,
                duration: "12 دقيقة",
                type: "code",
                current: true,
                locked: false,
              },
              {
                id: "06-letter-tree",
                title: "شجرة الحروف",
                description:
                  "تمرين عملي على البرمجة باستخدام الحلقات والشروط لإنشاء أشكال وأنماط من الحروف والرموز.",
                completed: false,
                duration: "12 دقيقة",
                type: "quiz",
                current: false,
                locked: false,
              },
              {
                id: "06-letter-tree",
                title: "شجرة الحروف",
                description:
                  "تمرين عملي على البرمجة باستخدام الحلقات والشروط لإنشاء أشكال وأنماط من الحروف والرموز.",
                completed: false,
                duration: "12 دقيقة",
                type: "article",
                current: false,
                locked: false,
              },
              {
                id: "04-secret-recipe",
                title: "الوصفة السرية",
                description:
                  "تمرين متقدم لحل المشاكل البرمجية باستخدام المتغيرات والدوال للوصول إلى الحل الصحيح.",
                completed: false,
                duration: "15 دقيقة",
                type: "code",
                locked: true,
              },
              {
                id: "05-receipt",
                title: "الإيصال",
                description:
                  "اختبار شامل للمفاهيم المتعلمة في هذه الوحدة مع تطبيق عملي لإنشاء إيصال حسابي.",
                completed: false,
                duration: "10 دقائق",
                type: "quiz",
                locked: true,
              },
            ],
          },
        ],
      },
    ],
  });

  const flatMaterials = useMemo(
    () =>
      courseData.modules.flatMap((m) => m.lessons.flatMap((l) => l.materials)),
    [courseData.modules]
  );

  useEffect(() => {
    if (!currentMaterial && flatMaterials.length > 0) {
      const firstMaterial =
        flatMaterials.find((m) => m.current) || flatMaterials[0];
      setCurrentMaterial(firstMaterial);
    }
  }, [flatMaterials, currentMaterial]);

  const currentIndex = currentMaterial
    ? flatMaterials.findIndex((m) => m.id === currentMaterial.id)
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
        totalMaterials={flatMaterials.length}
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

        <main className="flex-1 flex flex-col">
          <MaterialViewer material={currentMaterial} />
        </main>
      </div>
    </div>
  );
};

export default CoursePlayground;
