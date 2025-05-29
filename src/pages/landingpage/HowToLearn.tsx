import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Settings,
  Command,
  CreditCard,
  DollarSign,
  MessageSquare,
  Search,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContexts";

const HowToLearn = () => {
  const { darkMode } = useSettings();

  const dashboardCards = [
    {
      title: "رؤى في متناول يدك",
      description:
        "جميع بياناتك ومالياتك في مكان واحد لتقديم إجابات سريعة واتخاذ قرارات فورية.",
      image: "insights",
      stats: {
        today: "اليوم",
        revenue: "68%",
        growth: "+34 يوم",
        metrics: ["المبيعات", "الأرباح", "العملاء", "النمو"],
      },
    },
    {
      title: "إدارة في الوقت الفعلي",
      description:
        "تحكم كامل في أعمالك المالية أثناء التنقل باستخدام تطبيقاتنا المحمولة لنظامي iOS/Android.",
      image: "mobile",
      features: ["البطاقات", "نظرة عامة", "الملخصات", "التقارير"],
    },
    {
      title: "تنبيهات الأعمال المهمة",
      description:
        "اختر التنبيهات التي تحتاجها واستقبلها عبر البريد الإلكتروني أو الجوال أو Slack. راجع واتخذ إجراء بنقرة واحدة.",
      image: "alerts",
      actions: ["موافق", "رفض", "تعديل"],
    },
  ];

  const integrationApps = [
    { name: "Slack", icon: "💬", color: "bg-purple-500" },
    { name: "Xero", icon: "🔵", color: "bg-blue-500" },
    { name: "Amazon", icon: "📦", color: "bg-orange-500" },
    { name: "Figma", icon: "🎨", color: "bg-pink-500" },
    { name: "Citi", icon: "🏦", color: "bg-red-500" },
    { name: "Sage", icon: "🟢", color: "bg-green-500" },
    { name: "Bank of America", icon: "🏛️", color: "bg-red-600" },
    { name: "QuickBooks", icon: "💚", color: "bg-green-600" },
    { name: "Coinbase", icon: "₿", color: "bg-orange-600" },
    { name: "Dropbox", icon: "📁", color: "bg-blue-600" },
    { name: "Shopify", icon: "🛒", color: "bg-green-700" },
    { name: "Stripe", icon: "💳", color: "bg-purple-600" },
    { name: "Microsoft", icon: "🏢", color: "bg-blue-700" },
    { name: "PayPal", icon: "💰", color: "bg-blue-800" },
  ];

  const shortcuts = [
    { title: "عرض البطاقات النشطة", icon: CreditCard, shortcut: "⌘" },
    { title: "عرض جميع التقارير الملخصة", icon: BarChart3, shortcut: "⌘ ⇧" },
    { title: "إدارة المصروفات", icon: DollarSign, shortcut: "⌘" },
    { title: "إدارة الإعدادات", icon: Settings, shortcut: "⌘ ⇧" },
    { title: "اتصل بالدعم", icon: MessageSquare, shortcut: "?" },
  ];

  const MockChart = () => (
    <div className="h-24 w-full relative">
      <svg className="w-full h-full" viewBox="0 0 200 100">
        <path
          d="M10,80 Q50,20 100,40 T190,30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-blue-500 dark:text-blue-400"
        />
        <circle
          cx="190"
          cy="30"
          r="3"
          className="fill-blue-500 dark:fill-blue-400"
        />
      </svg>
    </div>
  );

  const MockMobile = () => (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-4 w-full max-w-[200px] mx-auto">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            البطاقات
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">(3)</span>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          نظرة عامة
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );

  const MockAlert = () => (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 w-full">
      <div className="space-y-3 p-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            CoGrArt • منذ 12 ساعة
          </span>
        </div>
        <div className="text-sm text-gray-900 dark:text-white">
          زيادة 29% في الإيرادات هذا الشهر
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="text-xs bg-green-600 hover:bg-green-700 text-white"
          >
            موافق
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-gray-400 dark:border-gray-600"
          >
            رفض
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-gray-400 dark:border-gray-600"
          >
            تعديل
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      dir="rtl"
    >
      <div className="container mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6">طريقة التعلم</h1>
          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            منصة شاملة لإدارة التعلم والتطوير مع أدوات ذكية ومتقدمة
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {/* Insights Card */}
          <Card
            className={`${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            } transition-colors`}
          >
            <CardHeader>
              {/* Mock Chart */}
              <div
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg p-4`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold">اليوم</span>
                  <span className="text-2xl font-bold">68%</span>
                </div>
                <MockChart />
                <div className="flex justify-between text-xs mt-2">
                  <span
                    className={darkMode ? "text-gray-500" : "text-gray-400"}
                  >
                    +34 يوم ↗
                  </span>
                  <span
                    className={darkMode ? "text-gray-500" : "text-gray-400"}
                  >
                    النمو
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-2">
              <CardTitle className="text-xl font-bold">
                {dashboardCards[0].title}
              </CardTitle>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {dashboardCards[0].description}
              </p>
            </CardContent>
          </Card>

          {/* Mobile Management Card */}
          <Card
            className={`${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            } transition-colors`}
          >
            <CardHeader>
              <MockMobile />
            </CardHeader>
            <CardContent className="space-y-6 p-2">
              <CardTitle className="text-xl font-bold">
                {dashboardCards[1].title}
              </CardTitle>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {dashboardCards[1].description}
              </p>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card
            className={`${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            } transition-colors`}
          >
            <CardHeader className="h-[230px]">
              <MockAlert />
            </CardHeader>
            <CardContent className="space-y-6 p-2">
              <CardTitle className="text-xl font-bold">
                {dashboardCards[2].title}
              </CardTitle>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {dashboardCards[2].description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Integration Apps Section */}
        <div className="mb-16">
          <Card
            className={`${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            } transition-colors`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                ربط جميع تطبيقاتك
              </CardTitle>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                اربط بياناتك مع تكاملاتنا المدمجة للمحاسبة وأدوات الإيرادات
                والبنوك.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-14 gap-4 p-4">
                {integrationApps.map((app, index) => (
                  <div
                    key={index}
                    className={`${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } w-12 h-12 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                    title={app.name}
                  >
                    <span className="text-lg">{app.icon}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shortcuts Section */}
        <div>
          <Card
            className={`${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-50 border-gray-200"
            } transition-colors`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">أنت المتحكم</CardTitle>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                سريع البرق. اختصارات لكل شيء. Command+K على Mac. Ctrl+K على
                Windows. الوضع المظلم.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => {
                  const IconComponent = shortcut.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        darkMode
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-white hover:bg-gray-100"
                      } transition-colors cursor-pointer border ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {shortcut.title}
                        </span>
                      </div>
                      <kbd
                        className={`px-2 py-1 text-xs rounded ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {shortcut.shortcut}
                      </kbd>
                    </div>
                  );
                })}
              </div>

              {/* Command Palette Mockup */}
              <div
                className={`mt-6 p-4 rounded-lg border-2 border-dashed ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Command className="w-4 h-4" />
                  <span className="text-sm font-medium">لوحة الأوامر</span>
                </div>
                <div
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-lg p-3 border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ماذا تريد أن تفعل؟
                    </span>
                    <kbd
                      className={`mr-auto py-1 text-xs rounded ${
                        darkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      K
                    </kbd>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowToLearn;
