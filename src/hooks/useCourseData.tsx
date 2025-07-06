import { useEffect, useMemo, useState } from "react";
import { getSingleCoursesApi } from "@/utils/_apis/courses-apis";

export const useCourseData = (courseId: string) => {
  const [course, setCourseData] = useState<any>({});
  const [currentMaterial, setCurrentMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSingleCoursesApi({ course_id: courseId });
        setCourseData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  const sortedMaterials = useMemo(() => {
    return (
      course?.modules?.flatMap((m: any) =>
        m?.lessons?.flatMap((l: any) => l?.materials)
      ) ?? []
    ).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  }, [course]);

  const currentId = course?.current_material;
  const curIndex = useMemo(
    () => sortedMaterials.findIndex((m: any) => m.id === currentId),
    [sortedMaterials, currentId]
  );
  const materials = useMemo(() => {
    const map = new Map();
    sortedMaterials.forEach((m: any, i: number) => {
      map.set(m.id, {
        isCurrent: i === curIndex,
        completed: i < curIndex,
        locked: i > curIndex,
      });
    });
    return map;
  }, [sortedMaterials, curIndex]);
  const materialsCount = sortedMaterials.length;
  const completedMaterials = sortedMaterials.filter(
    (i: number) => i < curIndex
  ).length;
  const progress =
    materialsCount > 0
      ? Math.round((completedMaterials / materialsCount) * 100)
      : 0;

  const materialsDuration = sortedMaterials.reduce(
    (sum: any, material: any) => sum + Number(material.duration || 0),
    0
  );

  const currentIndex = currentMaterial
    ? sortedMaterials.findIndex((m: any) => m.id === currentMaterial.id)
    : -1;

  const nextMaterial =
    currentIndex > -1 ? sortedMaterials[currentIndex + 1] : null;
  const prevMaterial =
    currentIndex > 0 ? sortedMaterials[currentIndex - 1] : null;

  const getTotalLessons = () => {
    return course?.modules?.reduce(
      (total: number, module: any) => total + (module?.lessons?.length || 0),
      0
    );
  };
  const getCompletedLessonsCount = () => {
    let completedCount = 0;
    course?.modules?.forEach((module: any) => {
      module?.lessons?.forEach((lesson: any) => {
        if (
          lesson?.materials?.some(
            (m: any) => m?.id === course?.current_material
          )
        ) {
          completedCount++;
        }
      });
    });
    return completedCount;
  };

  const getTotalDuration = () => {
    return course?.modules?.reduce((total: number, module: any) => {
      return (
        total +
        module?.lessons?.reduce((lessonTotal: number, lesson: any) => {
          return (
            lessonTotal +
            lesson.materials.reduce((materialTotal: number, material: any) => {
              const duration = Number(material.duration || 0);
              return materialTotal + duration;
            }, 0)
          );
        }, 0)
      );
    }, 0);
  };

  return {
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
    getTotalDuration,
    getCompletedLessonsCount,
    getTotalLessons,
    loading,
    error,
  };
};
