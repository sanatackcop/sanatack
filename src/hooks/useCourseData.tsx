import { useEffect, useMemo, useState } from "react";
import { getSingleCoursesApi } from "@/utils/_apis/courses-apis";
import { MaterialType } from "@/utils/types/adminTypes";
import { CourseDetailsContext, MaterialContext } from "@/types/courses";

export const useCourseData = (courseId: string) => {
  const [course, setCourseData] = useState<CourseDetailsContext | undefined>();
  const [currentMaterial, setCurrentMaterial] = useState<
    MaterialContext | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSingleCoursesApi({ course_id: courseId });

        const flatMaterialList: string[] = [];
        data.modules.forEach((module) =>
          module.lessons.forEach((lesson) =>
            lesson.materials.forEach((material) =>
              flatMaterialList.push(material.id)
            )
          )
        );

        const currentMaterialIndex = flatMaterialList.indexOf(
          data.current_material ?? ""
        );

        const courseDetails: CourseDetailsContext = {
          ...data,
          modules: data.modules.map((module) => {
            let moduleCompleted = 0;
            let moduleTotal = 0;

            const mod = {
              ...module,
              lessons: module.lessons.map((lesson) => {
                return {
                  ...lesson,
                  materials: lesson.materials.map((material) => {
                    const indexInFlat = flatMaterialList.indexOf(material.id);
                    const isFinished = indexInFlat < currentMaterialIndex;

                    moduleTotal++;
                    if (isFinished) moduleCompleted++;

                    if (material.type === MaterialType.QUIZ_GROUP) {
                      return {
                        ...material,
                        isFinished,
                        old_result:
                          data?.enrollment_info?.quizzes_result[material.id] ??
                          0,
                      };
                    } else {
                      return {
                        ...material,
                        isFinished,
                      };
                    }
                  }),
                };
              }),
              totalMaterials: moduleTotal,
              completedMaterials: moduleCompleted,
              progress: moduleTotal
                ? Math.floor((moduleCompleted / moduleTotal) * 100)
                : 0,
            };

            return mod;
          }),
          completedMaterials: flatMaterialList.slice(0, currentMaterialIndex)
            .length,
          totalMaterials: flatMaterialList.length,
        };

        setCourseData(courseDetails);
      } catch (err: any) {
        console.log({ err });
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  const sortedMaterials = useMemo(() => {
    if (!course?.modules) return [];
    const result: any[] = [];
    course.modules.forEach((module, moduleIdx) => {
      module.lessons.forEach((lesson) => {
        // Sort materials by their order within the lesson
        const sorted = [...lesson.materials].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        sorted.forEach((material) => {
          // Attach module and material order for reference if needed
          result.push({
            ...material,
            moduleNumber: moduleIdx + 1,
            materialNumber:
              result.filter((m) => m.moduleNumber === moduleIdx + 1).length + 1,
          });
        });
      });
    });
    return result;
  }, [course]);

  useEffect(() => {
    if (!loading && sortedMaterials.length > 0) {
      const current =
        sortedMaterials.find((m: any) => m.id === course?.current_material) ||
        sortedMaterials[0];

      setCurrentMaterial(current);
    }
  }, [loading, course, sortedMaterials]);

  const currentId = course?.current_material;
  const curIndex = useMemo(
    () => sortedMaterials.findIndex((m) => m.id === currentId),
    [sortedMaterials, currentId]
  );

  const materials = useMemo(() => {
    return sortedMaterials.map((material, index: number) => ({
      ...material,
      isCurrent: index === curIndex,
      completed: index < curIndex,
      locked: index > curIndex,
    }));
  }, [sortedMaterials, curIndex]);

  const materialsCount = sortedMaterials.length;

  const completedMaterials = sortedMaterials.filter(
    (_, i: number) => i < curIndex
  ).length;

  const progress =
    materialsCount > 0
      ? Math.round((completedMaterials / materialsCount) * 100)
      : 0;
  const materialsDuration = sortedMaterials.reduce(
    (sum, material) => sum + Number(material.duration || 0),
    0
  );

  const currentIndex = currentMaterial
    ? sortedMaterials.findIndex((m) => m.id === currentMaterial.id)
    : -1;

  const nextMaterial =
    currentIndex > -1 ? sortedMaterials[currentIndex + 1] : null;
  const prevMaterial =
    currentIndex > 0 ? sortedMaterials[currentIndex - 1] : null;

  const getTotalLessons = () => {
    return course?.modules?.reduce(
      (total: number, module) => total + (module?.lessons?.length || 0),
      0
    );
  };

  const getCompletedLessonsCount = () => {
    let completedCount = 0;
    course?.modules?.forEach((module) => {
      module?.lessons?.forEach((lesson) => {
        if (
          lesson?.materials?.some((m) => m?.id === course?.current_material)
        ) {
          completedCount++;
        }
      });
    });
    return completedCount;
  };

  const getTotalDuration = () => {
    return course?.modules?.reduce((total: number, module) => {
      return (
        total +
        module?.lessons?.reduce((lessonTotal: number, lesson) => {
          return (
            lessonTotal +
            lesson.materials.reduce((materialTotal: number, material) => {
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
    currentMaterial,
    sortedMaterials,
    materials,
    materialsCount,
    completedMaterials,
    progress,
    materialsDuration,
    nextMaterial,
    prevMaterial,
    currentIndex,
    loading,
    error,
    setCourseData,
    setCurrentMaterial,
    getTotalDuration,
    getCompletedLessonsCount,
    getTotalLessons,
  };
};
