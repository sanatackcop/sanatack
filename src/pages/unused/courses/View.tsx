import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  GitBranchPlus,
  Play,
  Clock,
  PlayCircle,
  Award,
  Target,
  TrendingUp,
  Smartphone,
  Globe,
  BarChart3,
  CheckCircle2,
  Lock,
  Tag,
  Calendar,
  Download,
  Languages,
  Code,
  Rocket,
  BookOpen,
  Trophy,
  Users,
  Plus,
  Minus,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Headphones,
  PenTool,
  Timer,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { enrollCoursesApi } from "@/utils/_apis/courses-apis";
import AppLayout from "@/components/layout/Applayout";
import { useCourseData } from "@/hooks/useCourseData";
import { DateDisplay } from "@/lib/utils";
import LoadingScreen from "@/components/LoadingScreen";

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    course,
    setCurrentMaterial,
    materials,
    getTotalLessons,
    getCompletedLessonsCount,
    materialsDuration,
    loading,
  } = useCourseData(id as string);
  const materialStatusMap = useMemo(() => {
    return new Map(materials.map((m: any) => [m.id, m]));
  }, [materials]);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    if (!course) return;
    if (course.modules?.length > 0)
      setExpandedModules(new Set([course.modules[0].id]));
  }, [course]);

  const expandAllModules = () => {
    if (course?.modules) {
      setExpandedModules(new Set(course.modules.map((m: any) => m.id)));
    }
  };
  const collapseAllModules = () => {
    setExpandedModules(new Set());
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!course) {
    return <h1 className="text-center">Loading Course</h1>;
  }

  const handleStartCourse = async () => {
    if (course.isEnrolled) {
      navigate(`${location.pathname}/learn`);
      return;
    }

    try {
      await enrollCoursesApi({ courseId: id as string });
      setTimeout(() => {
        navigate(`${location.pathname}/learn`);
      }, 1000);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setEnrolling(false);
    }
  };
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };
  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const courseStats = [
    {
      title: "إجمالي الساعات",
      value: `${Math.round((materialsDuration / 60) * 100) / 100} ساعة`,
      icon: <Clock className="w-5 h-5" />,
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      title: "عدد الدروس",
      value: getTotalLessons(),
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-green-500",
      trend: "+5%",
    },
    {
      title: "الطلاب المسجلين",
      value: course.enrolledCount,
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-500",
      trend: "+18%",
    },
    {
      title: "معدل الإكمال",
      value: course.completionRate,
      icon: <Trophy className="w-5 h-5" />,
      color: "bg-orange-500",
      trend: "+2%",
    },
  ]; 

  return (
    <AppLayout>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    محدث 2025
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {course.level}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
                  {course.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {course.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    المهارات والتقنيات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.course_info?.tags.map((tag: any, index: any) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tag.color ||
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {tag.name || tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        مستوى المهارة
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {course.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        وقت الإكمال
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {Math.round((materialsDuration / 60) * 100) / 100} ساعة
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Rocket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        المشاريع
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {course.projectsCount} مشروع
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {courseStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.color} rounded-lg shadow-sm`}>
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {stat.trend}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-500" />
                مخرجات الدورة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.course_info?.new_skills_result.map(
                  (outcome: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {outcome}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                المهارات المكتسبة
              </h2>
              <div className="space-y-6">
                {Object.entries(
                  course?.course_info?.learning_outcome ?? {}
                ).map(([skill, level], index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {skill}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {level}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-[#4F46E5] h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                {course.isEnrolled && (
                  <div className="mb-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                        {course.progress}%
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                        تقدمك في الدورة
                      </div>
                      <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-3 mb-4">
                        <div
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-emerald-500 dark:text-emerald-400">
                        {getCompletedLessonsCount()} من {getTotalLessons()} درس
                        مكتمل
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleStartCourse}
                  disabled={enrolling}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 mb-6 ${
                    course.isEnrolled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                  }`}
                >
                  {enrolling ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التسجيل...
                    </div>
                  ) : course.isEnrolled ? (
                    <div className="flex items-center justify-center gap-3">
                      <PlayCircle className="w-5 h-5" />
                      متابعة التعلم
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <GitBranchPlus className="w-5 h-5" />
                      ابدأ التعلم مجاناً
                    </div>
                  )}
                </Button>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      شهادة معتمدة
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      وصول مدى الحياة
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      متاح على الجوال
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Download className="w-5 h-5 text-indigo-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      تحميل للمشاهدة دون اتصال
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  تفاصيل الدورة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      مستوى الصعوبة
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      وقت الإكمال
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {Math.round((materialsDuration / 60) * 100) / 100} ساعة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      المشاريع
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {course.projectsCount} مشروع
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      آخر تحديث
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {DateDisplay(course.updated_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      اللغة
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      العربية
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      الترجمة
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      متوفرة
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {course.modules?.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mt-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    محتوى الدورة
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {course?.modules?.length || 0} وحدات • {getTotalLessons()}{" "}
                    درس •{" "}
                    {Math.round((materialsDuration / 60) * 100) / 100 || 0} ساعة
                    إجمالية
                  </p>
                </div>
                <div className="flex gap-2 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={expandAllModules}
                    className="text-xs bg-white dark:bg-gray-900"
                  >
                    <Plus className="w-3 h-3 mr-1 " />
                    توسيع الكل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={collapseAllModules}
                    className="text-xs bg-white dark:bg-gray-900"
                  >
                    <Minus className="w-3 h-3 mr-1" />
                    طي الكل
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {course?.modules?.map((module: any, moduleIndex: number) => {
                  const isExpanded = expandedModules.has(module.id);
                  const moduleProgress =
                    module.lessons?.reduce((acc: number, lesson: any) => {
                      return (
                        acc +
                        lesson.materials.filter((m: any) => m.completed).length
                      );
                    }, 0) || 0;
                  const progressPercent =
                    course.material_count! > 0
                      ? Math.round(
                          (moduleProgress / course.material_count!) * 100
                        )
                      : 0;

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
                                    {progressPercent}% مكتمل
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
                                style={{ width: `${progressPercent}%` }}
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
                            {module.lessons?.map(
                              (lesson: any, lessonIndex: number) => {
                                const isLessonExpanded = expandedLessons.has(
                                  lesson.id
                                );

                                return (
                                  <div
                                    key={lesson.id}
                                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                                  >
                                    <button
                                      onClick={() => toggleLesson(lesson.id)}
                                      className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium">
                                          {lessonIndex + 1}
                                        </div>
                                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                          {lesson.name}
                                        </h4>
                                      </div>

                                      {isLessonExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                      ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                      )}
                                    </button>

                                    {isLessonExpanded && (
                                      <div className="p-5 space-y-3 border-t border-slate-200 dark:border-slate-700">
                                        {(lesson.materials ?? []).map(
                                          (material: any) => {
                                            const state =
                                              materialStatusMap?.get(
                                                material.id
                                              ) || {};
                                            const fullMaterial = {
                                              ...material,
                                              ...state,
                                            };

                                            const typeConfig = {
                                              video: {
                                                label: "فيديو",
                                                color:
                                                  "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
                                                icon: (
                                                  <Video className="w-4 h-4" />
                                                ),
                                              },
                                              code: {
                                                label: "كود",
                                                color:
                                                  "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                                                icon: (
                                                  <Code className="w-4 h-4" />
                                                ),
                                              },
                                              quiz: {
                                                label: "اختبار",
                                                color:
                                                  "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                                                icon: (
                                                  <PenTool className="w-4 h-4" />
                                                ),
                                              },
                                              text: {
                                                label: "نص",
                                                color:
                                                  "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                                                icon: (
                                                  <FileText className="w-4 h-4" />
                                                ),
                                              },
                                              audio: {
                                                label: "صوت",
                                                color:
                                                  "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
                                                icon: (
                                                  <Headphones className="w-4 h-4" />
                                                ),
                                              },
                                            };

                                            const config =
                                              typeConfig[
                                                fullMaterial.type as keyof typeof typeConfig
                                              ] || typeConfig.text;

                                            return (
                                              <button
                                                onClick={() => {
                                                  if (
                                                    !fullMaterial.locked ||
                                                    course.isEnrolled
                                                  ) {
                                                    setCurrentMaterial(
                                                      fullMaterial
                                                    );
                                                  }
                                                }}
                                                key={fullMaterial.id}
                                                disabled={
                                                  fullMaterial.locked ||
                                                  !course.isEnrolled
                                                }
                                                className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 group ${
                                                  fullMaterial.completed
                                                    ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                                                    : fullMaterial.locked ||
                                                      !course.isEnrolled
                                                    ? "opacity-50 cursor-default dark:bg-slate-800/50"
                                                    : "bg-blue-50 dark:bg-blue-900/20 border-2 border-transparent border-blue-200 dark:border-blue-800 hover:border-blue-400"
                                                }`}
                                              >
                                                <div
                                                  className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                                                    fullMaterial.completed
                                                      ? "bg-green-100 dark:bg-green-900/30"
                                                      : fullMaterial.locked &&
                                                        !course.isEnrolled
                                                      ? "bg-slate-100 dark:bg-slate-700"
                                                      : "bg-white dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                                                  }`}
                                                >
                                                  {fullMaterial.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                  ) : fullMaterial.locked ||
                                                    !course.isEnrolled ? (
                                                    <Lock className="w-5 h-5 text-slate-400" />
                                                  ) : (
                                                    config.icon
                                                  )}
                                                </div>

                                                <div className="flex justify-between items-center gap-4 w-full">
                                                  <div className="flex items-center gap-2 text-right">
                                                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                                      {fullMaterial.title ||
                                                        fullMaterial?.main_title}
                                                    </p>
                                                  </div>
                                                  <div className="flex flex-wrap items-center justify-end gap-2 text-left">
                                                    <span
                                                      className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}
                                                    >
                                                      {config.label}
                                                    </span>

                                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                      <Timer className="w-3 h-3" />
                                                      {fullMaterial.duration}{" "}
                                                      دقيقة
                                                    </div>

                                                    {fullMaterial.completed && (
                                                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                        مكتمل
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>

                                                {fullMaterial.type ===
                                                  "video" &&
                                                  !fullMaterial.locked && (
                                                    <div className="flex-shrink-0">
                                                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                        <Play className="w-4 h-4 text-white fill-white" />
                                                      </div>
                                                    </div>
                                                  )}
                                              </button>
                                            );
                                          }
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {!course.isEnrolled && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {course.course_info?.durationHours} ساعة • {course.level}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {course.projectsCount} مشروع عملي
              </div>
            </div>
            <Button
              onClick={handleStartCourse}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 font-semibold rounded-xl flex items-center gap-2"
            >
              <GitBranchPlus className="w-4 h-4" />
              ابدأ الآن
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
