import { CourseDetails } from "@/types/courses";
import { MaterialType } from "@/utils/types/adminTypes";
import {
  ChevronUp,
  ChevronDown,
  Video,
  PenTool,
  FileText,
  CheckCircle,
  Lock,
  Timer,
  Play,
} from "lucide-react";

export default function ModulesPreviewer({
  course,
  expandedModules,
  toggleModule,
}: {
  course: CourseDetails;
  expandedModules: Set<string>;
  toggleModule: (id: string) => void;
}) {
  // Helper function to get all materials in order across all modules/lessons
  const getAllMaterialsInOrder = () => {
    const allMaterials: Array<{
      id: string;
      moduleId: string;
      lessonId: string;
    }> = [];
    course?.modules?.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        lesson.materials?.forEach((material) => {
          allMaterials.push({
            id: material.id,
            moduleId: module.id,
            lessonId: lesson.id,
          });
        });
      });
    });
    return allMaterials;
  };

  // Get the index of current material to determine completion status
  const allMaterials = getAllMaterialsInOrder();

  const currentMaterialIndex = allMaterials.findIndex(
    (m) => m.id === course.current_material
  );
  // Helper function to determine material status
  const getMaterialStatus = (materialId: string) => {
    const materialIndex = allMaterials.findIndex((m) => m.id === materialId);

    if (materialIndex < currentMaterialIndex) {
      return "completed";
    } else if (materialIndex === currentMaterialIndex) {
      return "current";
    } else {
      return "locked";
    }
  };

  const getModulesProgress = () => {
    //! fix this
    const result = [];
    let lockedFlag = false;
    let percentageFinished = 0;
    for (const module of course.modules) {
      let totalMaterials = 0;
      totalMaterials += module.lessons.reduce(
        (ac, les) => (ac += les.materials.length),
        0
      );
      for (const lesson of module.lessons) {
        for (const [mt, material] of lesson.materials.entries()) {
          if (material.id == course.current_material) {
            result.push(Math.floor(((mt + 1) / totalMaterials) * 100));
            lockedFlag = true;
            percentageFinished = -1;
          }
        }
      }
      if (lockedFlag && percentageFinished == -1) result.push(0);
      else result.push(100);
    }
    return result;
  };

  return (
    <>
      {course?.modules?.map((module, moduleIndex) => {
        const isExpanded = expandedModules.has(module.id);
        const modulesProgress = getModulesProgress();
        return (
          <div
            key={module.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-bold text-sm">
                  {moduleIndex + 1}
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span>{module.lessons?.length || 0} دروس</span>
                    <span>•</span>
                    <span>{course.material_count} عنصر</span>
                    {course.isEnrolled && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400">
                          {modulesProgress[moduleIndex]}% مكتمل
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {course.isEnrolled && (
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                      style={{ width: `${modulesProgress[moduleIndex]}%` }}
                    />
                  </div>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="p-6 space-y-4">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium text-sm">
                          {lessonIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {lesson.name}
                          </h4>
                          {lesson.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {lesson.materials?.map((material) => {
                          const materialStatus = getMaterialStatus(material.id);

                          const typeConfig: Record<MaterialType, any> = {
                            video: {
                              label: "فيديو",
                              color:
                                "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                              icon: <Video className="w-4 h-4" />,
                            },
                            quiz_group: {
                              label: "اختبار",
                              color:
                                "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                              icon: <PenTool className="w-4 h-4" />,
                            },
                            article: {
                              label: "نص",
                              color:
                                "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                              icon: <FileText className="w-4 h-4" />,
                            },
                            [MaterialType._QUIZ]: undefined,
                          };

                          const config =
                            typeConfig[
                              material.type as keyof typeof typeConfig
                            ] || typeConfig.article;

                          return (
                            <button
                              key={material.id}
                              disabled={
                                materialStatus === "locked" &&
                                !course.isEnrolled
                              }
                              className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group ${
                                materialStatus === "completed"
                                  ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                                  : materialStatus === "current"
                                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800"
                                  : materialStatus === "locked" &&
                                    !course.isEnrolled
                                  ? "opacity-50 cursor-not-allowed dark:bg-slate-800/50"
                                  : "bg-blue-50 dark:bg-blue-900/20 border-2 border-transparent border-blue-200 dark:border-blue-800 hover:border-blue-400"
                              }`}
                            >
                              <div
                                className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                                  materialStatus === "completed"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : materialStatus === "current"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                                    : materialStatus === "locked" &&
                                      !course.isEnrolled
                                    ? "bg-slate-100 dark:bg-slate-700"
                                    : "bg-white dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                                }`}
                              >
                                {materialStatus === "completed" ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : materialStatus === "locked" &&
                                  !course.isEnrolled ? (
                                  <Lock className="w-5 h-5 text-slate-400" />
                                ) : (
                                  config.icon
                                )}
                              </div>

                              <div className="flex-1 text-right min-w-0">
                                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {material.title}
                                </p>
                                <div className="flex items-center justify-end gap-3 mt-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}
                                  >
                                    {config.label}
                                  </span>
                                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Timer className="w-3 h-3" />
                                    {material.duration || "5 دقائق"}
                                  </div>
                                  {materialStatus === "completed" && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                      مكتمل
                                    </span>
                                  )}
                                  {materialStatus === "current" && (
                                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                      الحالي
                                    </span>
                                  )}
                                </div>
                              </div>

                              {material.type === "video" &&
                                materialStatus !== "locked" && (
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                      <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                  </div>
                                )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
