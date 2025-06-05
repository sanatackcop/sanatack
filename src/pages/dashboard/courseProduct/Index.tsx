import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaterialViewer from "./_MaterialViewer";
import { getSingleCoursesApi } from "@/utils/_apis/courses-apis";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Course, Material } from "@/utils/types";
import CourseSidebar from "./_Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CourseLearningPage() {
  const { id: course_id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flatMaterials = useMemo(
    () =>
      course?.modules?.flatMap((m) => m.lessons.flatMap((l) => l.materials)) ??
      [],
    [course?.modules]
  );

  useEffect(() => {
    if (course?.modules?.length || !course_id) return;
    setLoading(true);
    let mounted = true;

    Promise.all([getSingleCoursesApi({ course_id })])
      .then(([course]: [Course]) => {
        if (!mounted) return;

        setCourse(course);
        setCurrentMaterial(
          course.modules?.[0]?.lessons?.[0]?.materials?.[0] ?? null
        );
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
  }, [course_id, course?.modules]);

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

  if (!course?.modules?.length) {
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eaeaea] dark:bg-[#0C0C0C] text-gray-900 dark:text-white">
      <SidebarProvider>
        <CourseSidebar
        // course={course}
        // currentMaterial={currentMaterial}
        // setCurrentMaterial={setCurrentMaterial}
        // iconMap={iconMap}
        />
        <main className="relative flex flex-1 flex-col overflow-auto p-4 pt-0 bg-white dark:bg-[#131313] gap-4">
          <MaterialViewer
            material={currentMaterial}
            onComplete={(e) => console.log(e)}
          />

          <div className="absolute bottom-10 left-10">
            <Button
              disabled={!nextMaterial}
              onClick={() => nextMaterial && setCurrentMaterial(nextMaterial)}
            >
              التالي
            </Button>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
