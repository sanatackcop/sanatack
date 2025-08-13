import { useState, memo, useEffect } from "react";
import {
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Settings,
  Calendar,
  Target,
  Crown,
  Check,
  Edit,
  Save,
  GraduationCap,
  Users,
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  LucideIcon,
  UserRound,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProfileApi, updateProfileApi } from "@/utils/_apis/user-api";
import { UpdateProfileDto, UserProfileDto } from "@/types/user";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  trend?: string;
  color?: string;
}

interface CourseData {
  title: string;
  progress: number;
  lessons: number;
  duration: string;
  level: string;
  isCompleted: boolean;
  instructor?: string;
  category?: string;
}

interface Achievement {
  icon: LucideIcon;
  title: string;
  date: string;
  type: "premium" | "regular";
  description?: string;
}

interface SubscriptionPlan {
  plan: string;
  price: string;
  isActive: boolean;
  features: string[];
  popular?: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  joinDate: string;
  email: string;
  phone: string;
  bio: string;
  subscription: string;
  company?: string;
  location?: string;
  stats: {
    coursesCompleted: number;
    hoursLearned: number;
    certificates: number;
    currentStreak: number;
  };
  currentCourses: CourseData[];
  recentAchievements: Achievement[];
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  company?: string;
  location?: string;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const StatCard = memo<StatCardProps>(({ icon: Icon, value, label, trend }) => (
  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent" />

    <div className="relative flex items-center justify-between">
      <div className="text-right">
        <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
          {value}
        </div>
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          {label}
        </div>
        {trend && (
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-2 font-medium">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-xl">
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

const CourseCard = memo<CourseData>(
  ({
    title,
    progress,
    lessons,
    duration,
    level,
    isCompleted,
    instructor = "فريق التدريس",
    category = "تقنية",
  }) => (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent dark:from-blue-900/30 rounded-bl-full" />

      <div className="relative flex items-start gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300">
          {title.charAt(0)}
        </div>

        <div className="flex-1 text-right space-y-4">
          <div className="flex items-center gap-3 justify-end">
            {isCompleted && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  مكتمل
                </span>
              </div>
            )}
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 font-medium">
              {level}
            </span>
            <span className="text-xs bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 font-medium">
              {category}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">
            {title}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{instructor}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {progress}%
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {lessons} درس • {duration}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 h-4 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

CourseCard.displayName = "CourseCard";

const AchievementBadge = memo<Achievement>(
  ({ icon: Icon, title, date, type, description }) => (
    <div className="flex items-start gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
      <div
        className={`p-4 rounded-2xl ${
          type === "premium"
            ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"
        } group-hover:scale-105 transition-transform duration-300`}
      >
        <Icon
          className={`w-6 h-6 ${
            type === "premium"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
        />
      </div>
      <div className="text-right flex-1 space-y-2">
        <div className="font-bold text-gray-900 dark:text-white text-lg">
          {title}
        </div>
        {description && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </div>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {date}
        </div>
      </div>
    </div>
  )
);

AchievementBadge.displayName = "AchievementBadge";

const SubscriptionCard = memo<SubscriptionPlan & { onUpgrade: () => void }>(
  ({ plan, isActive, features, price, onUpgrade, popular = false }) => (
    <div
      className={`rounded-3xl p-8 border-2 transition-all duration-500 relative overflow-hidden ${
        isActive
          ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-700 text-white shadow-2xl scale-105"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-xl hover:shadow-2xl hover:scale-102"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold">
            الأكثر شعبية
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          {plan === "Premium" && <Crown className="w-6 h-6" />}
          <h3 className="text-2xl font-black">{plan}</h3>
        </div>
        <div className="text-4xl font-black mb-2">{price}</div>
        <div
          className={`text-sm font-medium ${
            isActive ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          شهرياً
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <Check
              className={`w-5 h-5 ${
                isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
              }`}
            />
            <span className="text-sm font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {!isActive && (
        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
        >
          ترقية الآن
        </button>
      )}
      {isActive && (
        <div className="w-full bg-white/20 text-white py-4 rounded-2xl text-center font-bold text-lg">
          الخطة الحالية
        </div>
      )}
    </div>
  )
);

SubscriptionCard.displayName = "SubscriptionCard";

function getChangedFields<T extends object>(
  original: T,
  updated: T
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      result[key] = updated[key];
    }
  }
  return result;
}
const ProfileForm = memo<{
  userData: UserData;
  onSave: (data: Partial<FormData>) => void;
}>(({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    company: userData.company || "غير معروف",
    location: userData.location || "الرياض، المملكة العربية السعودية",
  });

  const handleSave = (): void => {
    const changed = getChangedFields(userData, formData);
    if (Object.keys(changed).length > 0) {
      onSave(changed);
    }
    setIsEditing(false);
  };

  const handleInputChange = (key: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const inputFields: Array<{
    key: keyof FormData;
    label: string;
    type: string;
    icon: LucideIcon;
  }> = [
    { key: "firstName", label: "الاسم الأول", type: "text", icon: User },
    { key: "lastName", label: "اسم العائلة", type: "text", icon: User },
    { key: "email", label: "البريد الإلكتروني", type: "email", icon: Mail },
    { key: "phone", label: "رقم الهاتف", type: "tel", icon: Phone },
    { key: "company", label: "الجامعة/المؤسسة", type: "text", icon: Building2 },
    { key: "location", label: "الموقع", type: "text", icon: MapPin },
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg md:text-3xl font-black text-gray-900 dark:text-white">
          معلومات الملف الشخصي
        </h2>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-3 px-3 py-1 md:px-6 md:py-3 text-xs md:text-lg bg-blue-600 dark:bg-blue-500 text-white rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
        >
          {isEditing ? (
            <Save className="w-5 h-5" />
          ) : (
            <Edit className="w-5 h-5" />
          )}
          {isEditing ? "حفظ التغييرات" : "تعديل المعلومات"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {inputFields.map(({ key, label, type, icon: Icon }) => (
          <div key={key} className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              <Icon className="w-4 h-4" />
              {label}
            </label>
            {isEditing ? (
              <input
                type={type}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 font-medium shadow-inner"
                placeholder={`أدخل ${label}`}
              />
            ) : (
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-600 font-medium">
                {formData[key] || "غير محدد"}
              </div>
            )}
          </div>
        ))}

        {/* Bio Field - Full Width */}
        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            <FileText className="w-4 h-4" />
            نبذة شخصية
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 resize-none font-medium shadow-inner"
              placeholder="اكتب نبذة مختصرة عن نفسك وأهدافك التعليمية"
            />
          ) : (
            <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-600 min-h-[100px] font-medium">
              {formData.bio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ProfileForm.displayName = "ProfileForm";

export default function UserProfile(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("settings");
  const [showUpgradeAlert, setShowUpgradeAlert] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  //const auth = Storage.get("auth");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfileApi();

        setUserData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
          avatar: profile.firstName[0] + profile.lastName[0],
          joinDate: profile.created_at,
          email: profile.email,
          phone: profile.phone || "غير معروف",
          bio: profile.attributes?.bio || "",
          company: profile.attributes?.organization || "غير معروف",
          location: "الرياض، المملكة العربية السعودية",
          subscription: "Premium",
          stats: {
            coursesCompleted: 0,
            hoursLearned: 0,
            certificates: 0,
            currentStreak: 0,
          },
          currentCourses: [
            {
              title: "هندسة البرمجيات المتقدمة والأنماط المعمارية",
              progress: 87,
              lessons: 32,
              duration: "12 ساعة",
              level: "متقدم",
              isCompleted: false,
              instructor: "د. محمد العبدالله",
              category: "هندسة برمجيات",
            },
            {
              title: "الذكاء الاصطناعي وتعلم الآلة التطبيقي",
              progress: 100,
              lessons: 28,
              duration: "16 ساعة",
              level: "خبير",
              isCompleted: true,
              instructor: "د. سارة الحربي",
              category: "ذكاء اصطناعي",
            },
            {
              title: "تصميم واجهات المستخدم وتجربة المستخدم",
              progress: 65,
              lessons: 20,
              duration: "8 ساعات",
              level: "متوسط",
              isCompleted: false,
              instructor: "أ. فهد المطيري",
              category: "تصميم",
            },
          ],
          recentAchievements: [
            {
              icon: Crown,
              title: "باحث متميز في الذكاء الاصطناعي",
              date: "منذ 3 أيام",
              type: "premium",
              description: "حصل على أعلى الدرجات في برنامج الذكاء الاصطناعي",
            },
            {
              icon: GraduationCap,
              title: "شهادة معتمدة في هندسة البرمجيات",
              date: "منذ أسبوع",
              type: "premium",
              description: "إتمام برنامج متقدم مع تقدير امتياز",
            },
            {
              icon: Target,
              title: "إنجاز هدف 300 ساعة تعلم",
              date: "منذ أسبوعين",
              type: "regular",
              description: "تحقيق الهدف السنوي للتعلم المستمر",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) {
    return <div>جاري تحميل الملف الشخصي...</div>;
  }

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      plan: "Basic",
      price: "مجاني",
      isActive: userData.subscription === "Basic",
      features: [
        "الوصول لـ 5 دورات أساسية",
        "شهادة إتمام رقمية",
        "منتدى المجتمع التعليمي",
        "دعم عبر البريد الإلكتروني",
      ],
    },
    {
      plan: "Premium",
      price: "199 ريال",
      isActive: userData.subscription === "Premium",
      popular: true,
      features: [
        "الوصول لجميع الدورات والبرامج",
        "شهادات معتمدة من الجامعات",
        "دعم أولوية 24/7",
        "محتوى حصري ومتقدم",
        "جلسات إرشاد فردية",
        "أدوات تحليل متقدمة",
        "وصول مبكر للمحتوى الجديد",
      ],
    },
  ];

  const tabs: TabItem[] = [
    // { id: "overview", label: "النظرة العامة", icon: User },
    // { id: "courses", label: "الدورات التدريبية", icon: BookOpen },
    // { id: "achievements", label: "الإنجازات والشهادات", icon: Award },
    // { id: "subscription", label: "خطة الاشتراك", icon: Crown },
    { id: "settings", label: "إعدادات الحساب", icon: Settings },
  ];

  const handleUpgrade = (): void => {
    setShowUpgradeAlert(true);
    setTimeout(() => setShowUpgradeAlert(false), 4000);
  };

  const handleProfileSave = async (
    formData: UpdateProfileDto
  ): Promise<void> => {
    try {
      const updatedUser = (await updateProfileApi(formData)) as UserProfileDto;

      setUserData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          firstName: updatedUser.firstName ?? prev.firstName,
          lastName: updatedUser.lastName ?? prev.lastName,
          phone: updatedUser.phone ?? prev.phone,
          bio: updatedUser.attributes?.bio ?? prev.bio,
          company: updatedUser.attributes?.organization ?? prev.company,
        };
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20`}
      dir="rtl"
    >
      {showUpgradeAlert && (
        <div className="fixed top-6 left-6 z-50 animate-in slide-in-from-left duration-500">
          <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-2xl">
            <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 font-semibold">
              تم إرسال طلب الترقية بنجاح! سيتم التواصل معك خلال 24 ساعة.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 p-5 md:p-10 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative flex flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
              <div className="w-16 h-16 md:w-28 md:h-28 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center text-2xl md:text-4xl font-black backdrop-blur-sm border border-white/20 shadow-2xl">
                {userData.avatar}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-md md:text-4xl font-black tracking-tight">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  {/* {userData.subscription === "Premium" && (
                    <div className="flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full">
                      <Crown className="w-5 h-5 text-white" />
                      <span className="text-xs md:text-sm  font-bold text-white">
                        عضو مميز
                      </span>
                    </div>
                  )} */}
                </div>
                <div className="flex items-center">
                  <UserRound className="w-4 h-4" />
                  <p className="text-sm md:text-xl text-blue-100 font-semibold px-2">
                    {userData.role}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-4 text-blue-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm md:text-xl">
                      {new Date(userData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm md:text-xl ">
                      {userData.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm md:text-xl ">
                      {userData.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block sm:hidden px-4 py-4">
            <select
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-64 mx-auto block rounded-md
               bg-white dark:bg-gray-800 font-bold
               text-blue-600 dark:text-blue-400 shadow-md"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block">
            <div className="flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-10 py-6 text-sm font-bold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                icon={BookOpen}
                value={userData.stats.coursesCompleted}
                label="دورة مكتملة"
                trend="+4 هذا الشهر"
              />
              <StatCard
                icon={Clock}
                value={userData.stats.hoursLearned}
                label="ساعة تعلم"
                trend="+24 هذا الأسبوع"
              />
              <StatCard
                icon={Award}
                value={userData.stats.certificates}
                label="شهادة معتمدة"
                trend="+2 هذا الشهر"
              />
              <StatCard
                icon={TrendingUp}
                value={userData.stats.currentStreak}
                label="يوم متتالي"
                trend="رقم قياسي جديد!"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    الدورات الحالية
                  </h2>
                </div>
                <div className="space-y-8">
                  {userData.currentCourses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                  ))}
                </div>
              </div>

              {/* <div className="space-y-8">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                  الإنجازات الأخيرة
                </h2>
                <div className="space-y-6">
                  {userData.recentAchievements.map((achievement, index) => (
                    <AchievementBadge key={index} {...achievement} />
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                جميع الدورات التدريبية
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {userData.currentCourses.length} دورات نشطة
                </span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="grid gap-8">
              {userData.currentCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                الإنجازات والشهادات
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  {userData.recentAchievements.length} إنجازات حديثة
                </span>
                <Award className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {userData.recentAchievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                اختر الخطة المناسبة لك
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                استثمر في مستقبلك التعليمي واحصل على أفضل المحتوى والخدمات
                التعليمية
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {subscriptionPlans.map((plan, index) => (
                <SubscriptionCard
                  key={index}
                  {...plan}
                  onUpgrade={() => handleUpgrade()}
                />
              ))}
            </div>

            {userData.subscription === "Premium" && (
              <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/20 dark:to-blue-900/20 rounded-3xl p-10 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
                <div className="flex items-center gap-6 text-center justify-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      مرحباً بك كعضو مميز
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
                      استمتع بجميع المزايا الحصرية والمحتوى المتقدم
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <ProfileForm userData={userData} onSave={handleProfileSave} />
        )}
      </div>
    </div>
  );
}
