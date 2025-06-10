import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  GitBranchPlus,
  Play,
  Download,
  Clock,
  BookOpen,
  Trophy,
  Users,
  Star,
  PlayCircle,
  Award,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Smartphone,
  Globe,
  Heart,
  Share2,
  Bookmark,
  Timer,
  BarChart3,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  enrollCoursesApi,
  getSingleCoursesApi,
} from "@/utils/_apis/courses-apis";
import AppLayout from "@/components/layout/Applayout";
import { CourseDetails } from "@/types/courses";
import GenericTabs from "@/components/tabs";
import CourseDetailsContent from "./_course_content";
import { Tab } from "@/utils/types";

export default function CourseView() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnroll, setIsEnroll] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(48 * 60 * 60);
  const [currentViewers, setCurrentViewers] = useState<number>(47);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const viewerTimer = setInterval(() => {
      setCurrentViewers((prev) => {
        const change = Math.floor(Math.random() * 6) - 2;
        return Math.max(35, Math.min(65, prev + change));
      });
    }, 8000);
    return () => clearInterval(viewerTimer);
  }, []);

  const fetchCourse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getSingleCoursesApi({ course_id: id });
      setIsEnroll(response?.isEnrolled || false);
      setCourse(response);
      setLoading(false);
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

  const data = {
    overview: course ? [course] : [],
    content: course ? [course] : [],
    reviews: [],
    instructor: [],
  };

  const tabs: Tab[] = [
    { label: "نظرة عامة", value: "overview" },
    { label: "المحتوى", value: "content" },
    { label: "التقييمات", value: "reviews" },
    { label: "المدرب", value: "instructor" },
  ];

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Dashboard Statistics
  const courseStats = [
    {
      title: "إجمالي الساعات",
      value: course?.tags?.durtionsHours || 0,
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
      value: "15,427",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-500",
      trend: "+18%",
    },
    {
      title: "معدل الإكمال",
      value: "94%",
      icon: <Trophy className="w-5 h-5" />,
      color: "bg-orange-500",
      trend: "+2%",
    },
  ];

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
      {/* Dashboard Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>{currentViewers} يشاهدون الآن</span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium">
                <Timer className="w-4 h-4" />
                <span>العرض ينتهي: {formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Course Information (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Course Header Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium">
                    الأكثر مبيعاً
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                    محدث 2024
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      4.9
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      (2,847)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-6">
                  {course?.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {course?.description}
                </p>

                {/* Instructor Card */}
                <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 rounded-xl flex items-center justify-center">
                    <span className="text-white dark:text-slate-900 font-bold text-lg">
                      د.أ
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      د. أحمد سعد
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      خبير تطوير الويب • 10+ سنوات خبرة • 50,000+ طالب
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      4.8
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {courseStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
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

            {/* Learning Outcomes Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-500" />
                أهداف التعلم
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningOutcomes.map((outcome, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Progress Section */}
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

            {/* Career Impact Section */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-100 dark:to-slate-200 rounded-xl p-8 text-white dark:text-slate-900">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6" />
                تأثير على مسيرتك المهنية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 dark:text-emerald-600 mb-2">
                    95%
                  </div>
                  <div className="text-sm opacity-90">حصلوا على وظائف</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 dark:text-blue-600 mb-2">
                    €45K
                  </div>
                  <div className="text-sm opacity-90">متوسط الراتب</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 dark:text-purple-600 mb-2">
                    6 شهور
                  </div>
                  <div className="text-sm opacity-90">للإتقان الكامل</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment Card (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Video Preview Card */}
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
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                    مباشر
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                {/* Progress Section for Enrolled Users */}
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

                {/* Pricing Section */}
                {!isEnroll && (
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-5xl font-bold text-slate-900 dark:text-slate-100">
                        مجاني
                      </div>
                      <div className="text-lg text-slate-400 line-through">
                        999 ريال
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium mb-4">
                      <Zap className="w-4 h-4" />
                      وفر 100% - عرض محدود
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        ⏰ العرض ينتهي قريباً!
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        باقي {Math.floor(timeLeft / 3600)} ساعة
                      </div>
                    </div>
                  </div>
                )}

                {/* Main CTA Button */}
                <Button
                  onClick={handleStartCourse}
                  disabled={enrolling}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 mb-4 ${
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

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    variant="outline"
                    className="py-3 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    المنهج
                  </Button>
                  <Button
                    variant="outline"
                    className="py-3 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                </div>

                {/* Features List */}
                <div className="space-y-3 text-sm">
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
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  إحصائيات سريعة
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      آخر تحديث
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      ديسمبر 2024
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      اللغة
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      العربية
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
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

        {/* Course Content Tabs */}
        <div className="mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <GenericTabs
              tabs={tabs}
              activeTab={selectedTab}
              onChange={setSelectedTab}
              onRetry={fetchCourse}
              loading={loading}
              error={error}
              data={data}
              renderItem={(course: CourseDetails, index: number) => (
                <div className="p-8">
                  <CourseDetailsContent
                    course={course}
                    key={index}
                    className="space-y-8"
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {!isEnroll && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                مجاني
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-through">
                999 ريال
              </div>
            </div>
            <Button
              onClick={handleStartCourse}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 font-semibold rounded-xl"
            >
              ابدأ الآن
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
