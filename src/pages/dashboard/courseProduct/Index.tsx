import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSettings } from "@/context/SettingsContexts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import LogoDark from "@/assets/dark_logo.svg";

import {
  getCourseProgressApi,
  getSingleCoursesApi,
  updateCourseProgressApi,
} from "@/utils/_apis/courses-apis";

import LogoLight from "../../../assets/logo.svg";
import { Progress } from "@/components/ui/progress";
import { CourseLearningPageProps, CourseMaterial, CourseModule } from "./type";
import MaterialViewer from "./_MaterialViewer";
import { iconMap } from "./const";

const mapApiToModules = (apiCourse: any): CourseModule[] => {
  if (!apiCourse?.modules) return [];
  return apiCourse.modules.map((mod: any) => ({
    id: mod.id,
    title: mod.title,
    lessons: (mod.lessons ?? []).map((les: any) => {
      const materials: CourseMaterial[] = [];

      (les.videos ?? []).forEach((v: any) => {
        materials.push({
          id: v.id,
          title: v.title ?? "Video",
          type: "video",
          duration: v.duration,
          url: v.url ?? null,
        });
      });

      (les.resources ?? []).forEach((r: any) => {
        materials.push({
          id: r.id,
          title: r.title ?? r.name ?? "Resource",
          type: "reading",
          duration: r.duration ?? null,
          url: r.url ?? r.link ?? null,
        });
      });

      (les.quizzes ?? []).forEach((q: any) => {
        materials.push({
          id: q.id,
          title: q.title ?? q.name ?? "Quiz",
          type: "quiz",
        });
      });

      return {
        id: les.id,
        title: les.name ?? les.title ?? "Lesson",
        materials,
      };
    }),
  }));
};

export default function CourseLearningPage({
  modules: initialModules,
  courseId: explicitCourseId,
  onBack,
}: CourseLearningPageProps) {
  const { id: routeCourseId } = useParams();
  const navigate = useNavigate();
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

        const mapped = mapApiToModules(apiCourse);
        setModules(mapped);
        setCurrentMaterial(mapped?.[0]?.lessons?.[0]?.materials?.[0] ?? null);

        if (typeof serverRes?.progress === "number")
          setServerProgress(serverRes?.progress);
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

    const updatedIds = [...completedIds, mat.id];
    setCompletedIds(updatedIds);
    saveCompletedIds(updatedIds);

    const newPercent = totalCount
      ? Math.round((updatedIds.length / totalCount) * 100)
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

  const currentIndex = currentMaterial
    ? flatMaterials.findIndex((m) => m.id === currentMaterial.id)
    : -1;
  const nextMaterial =
    currentIndex > -1 ? flatMaterials[currentIndex + 1] : null;

  const { darkMode } = useSettings();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaeaea] dark:bg-[#0C0C0C] text-white">
      <aside className="hidden md:flex w-96 shrink-0 flex-col border-l border-white/10 bg-[#eaeaea] dark:bg-[#0C0C0C]">
        <div className="flex items-center justify-between p-4">
          <img
            src={darkMode ? String(LogoLight) : String(LogoDark)}
            alt="logo"
            className="w-24 transition-all duration-300 hover:opacity-90"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack ?? (() => navigate(-1))}
            className="text-black dark:text-white hover:text-black"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <Separator className="bg-white/10" />

        <div className="px-4 py-3 space-y-2">
          <span className="text-sm text-muted-foreground block text-black dark:text-white text-right">
            التقدم: {progressPercent}%
          </span>
          <Progress value={progressPercent} className="h-2 dark:bg-white/20" />
        </div>
        <Separator className="bg-white/10" />

        <nav className="flex-1 overflow-y-auto" dir="rtl">
          <Accordion type="multiple" className="space-y-2">
            {modules.map((mod) => (
              <AccordionItem
                key={mod.id}
                value={mod.id}
                className="bg-none border-none"
              >
                <div className="border-t border-b border-white/5 text-[#34363F] dark:text-white">
                  <AccordionTrigger className="px-3 h-14 text-right font-medium hover:bg-white/5">
                    {mod.title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-2 px-3 space-y-1">
                    <Accordion type="multiple">
                      {mod.lessons.map((lesson) => (
                        <AccordionItem
                          key={lesson.id}
                          value={lesson.id}
                          className="bg-none border-none"
                        >
                          <AccordionTrigger className="px-2 py-1 text-sm font-semibold hover:bg-white/10 rounded-md">
                            {lesson.title}
                          </AccordionTrigger>
                          <AccordionContent className="pt-1 space-y-0.5">
                            {lesson.materials.map((mat) => {
                              const Icon = iconMap[mat.type];
                              const active = currentMaterial?.id === mat.id;
                              const done = completedIds.includes(mat.id);
                              return (
                                <Button
                                  key={mat.id}
                                  variant="ghost"
                                  onClick={() => setCurrentMaterial(mat)}
                                  className={`w-full flex flex-row-reverse items-center gap-2 px-3 py-1.5 text-sm justify-between ${
                                    active
                                      ? "bg-[#293546]/40 text-white"
                                      : "text-white/70 hover:bg-white/10"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="text-right whitespace-pre-wrap">
                                      {mat.title}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    {mat.duration && (
                                      <span className="text-xs opacity-60 rtl:text-left ltr:text-right">
                                        {mat.duration}
                                      </span>
                                    )}
                                    {done && (
                                      <span className="text-green-400 text-xs">
                                        ✓
                                      </span>
                                    )}
                                  </span>
                                </Button>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center overflow-auto p-4 bg-white dark:bg-[#131313] gap-4">
        <MaterialViewer material={currentMaterial} onComplete={markComplete} />

        <div className="flex justify-end w-full max-w-4xl">
          <Button
            disabled={!nextMaterial}
            className=" text-[#34363F]  dark:text-white bg-[#999999] dark:bg-white/10"
            onClick={() => nextMaterial && setCurrentMaterial(nextMaterial)}
          >
            التالي
          </Button>
        </div>
      </main>
    </div>
  );
}
