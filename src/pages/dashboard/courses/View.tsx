import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  GitBranchPlus,
  Play,
  Clock,
  BookOpen,
  Trophy,
  Users,
  PlayCircle,
  Award,
  Target,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  BarChart3,
  CheckCircle2,
  CheckCircle,
  Tag,
  Calendar,
  Download,
  Languages,
  Monitor,
  Code,
  Brain,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  enrollCoursesApi,
  getSingleCoursesApi,
} from "@/utils/_apis/courses-apis";
import AppLayout from "@/components/layout/Applayout";
import { CourseDetails } from "@/types/courses";
import { getIcon } from "../courseProduct/_Sidebar";

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnroll, setIsEnroll] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [timeLeft] = useState<number>(48 * 60 * 60);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getSingleCoursesApi({ course_id: id });
      setIsEnroll(response?.isEnrolled || false);
      setCourse(response);
      setLoading(false);
      console.log(loading, error, timeLeft);
    } catch (err: any) {
      setError(err?.message || "حدث خطأ أثناء جلب بيانات الدورة، حاول مجددًا.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleStartCourse = async () => {
    if (isEnroll) {
      navigate(`${location.pathname}/learn`);
      return;
    }

    try {
      setEnrolling(true);
      await enrollCoursesApi({ courseId: id as string });
      setIsEnroll(true);
      setTimeout(() => {
        navigate(`${location.pathname}/learn`);
      }, 1000);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const getTotalLessons = () => {
    if (!course?.modules) return 0;
    return course.modules.reduce(
      (total: number, module: any) => total + (module.lessons?.length || 0),
      0
    );
  };

  const getCompletedLessons = () => {
    return course?.progress?.completedLessons || 0;
  };

  const progressPercentage =
    getTotalLessons() > 0
      ? Math.round((getCompletedLessons() / getTotalLessons()) * 100)
      : 0;

  // Enhanced course stats with better data handling
  const courseStats = [
    {
      title: "إجمالي الساعات",
      value: `${course?.tags?.durtionsHours || course?.duration || 23} ساعة`,
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
      value: course?.enrolledCount || "15,427",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-500",
      trend: "+18%",
    },
    {
      title: "معدل الإكمال",
      value: course?.completionRate || "94%",
      icon: <Trophy className="w-5 h-5" />,
      color: "bg-orange-500",
      trend: "+2%",
    },
  ];

  // Sample course tags - you can replace with actual course tags from API
  const courseTags = course?.tags?.skills || [
    {
      name: "React.js",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      name: "JavaScript",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    },
    {
      name: "Frontend",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      name: "Web Development",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      name: "مطور مبتدئ",
      color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    },
    {
      name: "مشاريع عملية",
      color:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    },
  ];

  // Course difficulty and level info
  const courseLevel = course?.level || "مبتدئ";
  const courseProjects = course?.projectsCount || 13;
  const coursePrerequisites = course?.prerequisites || "لا يوجد";

  const learningOutcomes = [
    "إتقان React.js و Redux للتطبيقات الحديثة",
    "بناء 12+ مشروع عملي احترافي",
    "فهم أساسيات تطوير الواجهات الأمامية",
    "استخدام أدوات التطوير الحديثة",
    "تطبيق أفضل الممارسات في البرمجة",
    "التحضير لسوق العمل التقني",
  ];

  const skillsGained = [
    { skill: "React.js", level: 95, color: "bg-blue-500" },
    { skill: "JavaScript ES6+", level: 90, color: "bg-yellow-500" },
    { skill: "CSS & Styling", level: 85, color: "bg-pink-500" },
    { skill: "Git & GitHub", level: 80, color: "bg-gray-500" },
    { skill: "API Integration", level: 88, color: "bg-green-500" },
    { skill: "Project Management", level: 75, color: "bg-purple-500" },
  ];

  return (
    <AppLayout>
      <div className="">
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
                    {courseLevel}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
                  {course?.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {course?.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    المهارات والتقنيات
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {courseTags.map((tag: any, index: any) => (
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
                        {courseLevel}
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
                        {course?.tags?.durtionsHours || course?.duration || 23}{" "}
                        ساعة
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
                        {courseProjects} مشروع
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
                أهداف التعلم
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                المهارات المكتسبة
              </h2>
              <div className="space-y-6">
                {skillsGained.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {skill.skill}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div
                        className={`${skill.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="relative bg-slate-900 aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6 transition-all duration-300 transform hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm">
                    معاينة مجانية • 5:42
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                {isEnroll && (
                  <div className="mb-6 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                        {progressPercentage}%
                      </div>
                      <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                        تقدمك في الدورة
                      </div>
                      <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-3 mb-4">
                        <div
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-emerald-500 dark:text-emerald-400">
                        {getCompletedLessons()} من {getTotalLessons()} درس مكتمل
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleStartCourse}
                  disabled={enrolling}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 mb-6 ${
                    isEnroll
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                  }`}
                >
                  {enrolling ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التسجيل...
                    </div>
                  ) : isEnroll ? (
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
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300">
                      ضمان استرداد 30 يوم
                    </span>
                  </div>
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
                      {courseLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      وقت الإكمال
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {course?.tags?.durtionsHours || course?.duration || 23}{" "}
                      ساعة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      المشاريع
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {courseProjects} مشروع
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      المتطلبات
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {coursePrerequisites}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      آخر تحديث
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      ديسمبر 2024
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
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      الترجمة
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      متوفرة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 mt-8">
          {course?.modules.map((module: any) => (
            <div
              key={module.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {module.title}
                </h3>
              </div>

              <div className="pb-4 px-4 space-y-4">
                {module.lessons.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-right text-sm">
                          {lesson.name}
                        </h4>
                        {lesson.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {lesson.materials.map((material: any) => {
                        const Icon = getIcon(material.type);

                        return (
                          <button
                            key={material.id}
                            disabled={material.locked}
                            className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                              true
                                ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-sm"
                                : material.locked
                                ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            }`}
                          >
                            <div className="flex-1 text-right min-w-0">
                              <p
                                className={`text-sm font-medium truncate text-blue-900 dark:text-blue-100"
                                `}
                              >
                                {material.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {material.completed
                                    ? "مكتمل"
                                    : material.duration}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    material.type === "video"
                                      ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                      : material.type === "code"
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                      : material.type === "quiz"
                                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                      : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  }`}
                                >
                                  {material.type === "video"
                                    ? "فيديو"
                                    : material.type === "code"
                                    ? "كود"
                                    : material.type === "quiz"
                                    ? "اختبار"
                                    : "نص"}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-2 rounded-xl flex-shrink-0 ${
                                material.completed
                                  ? "bg-green-100 dark:bg-green-900/20"
                                  : true
                                  ? "bg-blue-100 dark:bg-blue-900/20"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {material.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : material.locked ? null : (
                                <Icon
                                  className={`w-4 h-4 ${
                                    true
                                      ? "text-blue-600"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {!isEnroll && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {course?.tags?.durtionsHours || course?.duration || 23} ساعة •{" "}
                {courseLevel}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {courseProjects} مشروع عملي
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
