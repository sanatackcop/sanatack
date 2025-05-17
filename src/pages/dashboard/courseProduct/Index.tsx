import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/SettingsContexts";
import { useParams, useNavigate } from "react-router-dom";
import MaterialViewer from "./_MaterialViewer";
import {
  getCourseProgressApi,
  getSingleCoursesApi,
  updateCourseProgressApi,
} from "@/utils/_apis/courses-apis";
import LogoDark from "@/assets/dark_logo.svg";
import LogoLight from "../../../assets/logo.svg";
import { iconMap } from "./const";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseLearningPageProps, CourseMaterial, CourseModule } from "./type";
import Sidebar from "./_Sidebar";

const mapApiToModules = (apiCourse: any): CourseModule[] => {
  if (!apiCourse?.modules) return [];
  return apiCourse.modules.map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    lessons: (mod.lessons ?? []).map((les: any) => ({
      id: les.id,
      title: les.name || les.title || "",
      materials: (les.materials ?? []).map((item: any) => {
        switch (item.type) {
          case "video": {
            const v = item.video;
            return {
              id: v.id,
              title: v.title,
              type: "video",
              duration: v.duration,
              url: v.youtubeId,
            } as CourseMaterial;
          }
          case "reading": {
            const r = item.resource || item.reading;
            return {
              id: r.id,
              title: r.title || r.name,
              type: "reading",
              duration: r.duration,
              url: r.link || r.url,
            } as CourseMaterial;
          }
          case "quiz": {
            const q = item.quiz;
            return {
              id: q.id,
              title: q.title || q.name,
              type: "quiz",
            } as CourseMaterial;
          }
          default:
            return {
              id: item.id,
              title: item.title || item.name || "",
              type: item.type,
            } as CourseMaterial;
        }
      }),
    })),
  }));
};

export default function CourseLearningPage({
  modules: initialModules,
  courseId: explicitCourseId,
  onBack,
}: CourseLearningPageProps) {
  const { id: routeCourseId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useSettings();
  const courseId = explicitCourseId ?? routeCourseId!;

  const [modules, setModules] = useState<CourseModule[] | null>(
    initialModules?.length ? initialModules : null
  );
  const [currentMaterial, setCurrentMaterial] = useState<CourseMaterial | null>(
    null
  );
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const raw = localStorage.getItem(`course-progress-ids-${courseId}`);
    return raw ? JSON.parse(raw) : [];
  });
  const [serverProgress, setServerProgress] = useState<number>(0);
  const [loading, setLoading] = useState(!initialModules?.length);
  const [error, setError] = useState<string | null>(null);

  const flatMaterials = useMemo(
    () => modules?.flatMap((m) => m.lessons.flatMap((l) => l.materials)) ?? [],
    [modules]
  );
  const totalCount = flatMaterials.length;
  const progressPercent = totalCount
    ? Math.round((completedIds.length / totalCount) * 100)
    : 0;

  const saveCompletedIds = (ids: string[]) => {
    localStorage.setItem(
      `course-progress-ids-${courseId}`,
      JSON.stringify(ids)
    );
  };

  useEffect(() => {
    if (modules || !courseId) return;
    setLoading(true);
    let mounted = true;

    Promise.all([
      getSingleCoursesApi({ courseId }),
      getCourseProgressApi({ courseId }),
    ])
      .then(([apiCourse, serverRes]: any) => {
        if (!mounted) return;

        // map payload into typed modules
        const mapped = mapApiToModules(apiCourse);
        setModules(mapped);
        setCurrentMaterial(mapped?.[0]?.lessons?.[0]?.materials?.[0] ?? null);

        if (typeof serverRes?.progress === "number")
          setServerProgress(serverRes.progress);
      })
      .catch((err) => {
        if (!mounted) return;
        console.error(err);
        setError("تعذر تحميل محتوى الدورة، يرجى المحاولة لاحقًا.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [courseId, modules]);

  const markComplete = (mat: CourseMaterial) => {
    if (completedIds.includes(mat.id)) return;

    const updated = [...completedIds, mat.id];
    setCompletedIds(updated);
    saveCompletedIds(updated);

    const newPercent = totalCount
      ? Math.round((updated.length / totalCount) * 100)
      : 0;
    if (newPercent > serverProgress) {
      setServerProgress(newPercent);
      updateCourseProgressApi({ courseId, progress: newPercent }).catch(
        () => null
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> جاري التحميل…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>
    );
  }

  if (!modules?.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-muted-foreground">
        لا يوجد محتوى متاح.
      </div>
    );
  }

  const courseSummary = {
    title: initialModules?.[0]?.title || "الدورة",
    completedCount: completedIds.length,
    totalCount,
    duration: `${Math.ceil(
      flatMaterials.reduce((sum, m) => sum + (Number(m.duration) || 0), 0) / 60
    )}h`,
  };

  const currentIndex = currentMaterial
    ? flatMaterials.findIndex((m) => m.id === currentMaterial.id)
    : -1;
  const nextMaterial =
    currentIndex > -1 ? flatMaterials[currentIndex + 1] : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaeaea] dark:bg-[#0C0C0C] text-gray-900 dark:text-white">
      <Sidebar
        course={courseSummary}
        modules={modules}
        currentMaterial={currentMaterial}
        setCurrentMaterial={setCurrentMaterial}
        completedIds={completedIds}
        progressPercent={progressPercent}
        darkMode={darkMode}
        onBack={onBack}
        iconMap={iconMap}
        LogoLight={LogoLight}
        LogoDark={LogoDark}
      />
      <main className="relative flex flex-1 flex-col overflow-auto p-4 pt-0 bg-white dark:bg-[#131313] gap-4">
        <MaterialViewer material={currentMaterial} onComplete={markComplete} />

        <div className="absolute bottom-10 left-10">
          <Button
            disabled={!nextMaterial}
            onClick={() => nextMaterial && setCurrentMaterial(nextMaterial)}
          >
            التالي
          </Button>
        </div>
      </main>
    </div>
  );
}
