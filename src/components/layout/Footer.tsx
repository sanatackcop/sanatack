import { useSettings } from "@/context/SettingsContexts";
import { Check, Star, Zap, Shield } from "lucide-react";

const ArabicFooterSection = () => {
  const { darkMode } = useSettings();

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? "bg-gray-950" : "bg-gradient-to-br from-slate-50 to-blue-50"
      } flex flex-col justify-center items-center px-4 py-16`}
      dir="rtl"
    >
      <div className="text-center mb-16 w-full max-w-4xl">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            darkMode
              ? "bg-blue-900/20 text-blue-400 border border-blue-800/30"
              : "bg-blue-100 text-blue-700 border border-blue-200"
          }`}
        >
          <Zap className="w-4 h-4" />
          عزز معرفتك
        </div>
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          اختر الخطة التي
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            تناسبك
          </span>
        </h1>
        <p
          className={`text-xl ${
            darkMode ? "text-gray-400" : "text-slate-600"
          } max-w-2xl mx-auto`}
        >
          ابدأ رحلتك مع خطة مجانية أو احصل على جميع الميزات المتقدمة مع الخطة
          الاحترافية
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mb-20">
        <div
          className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 flex-1 ${
            darkMode
              ? "bg-gray-900/50 border-gray-800 hover:border-gray-700 backdrop-blur-sm"
              : "bg-white/80 border-gray-200 hover:border-gray-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
          }`}
        >
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              مجاني
            </h3>
            <p
              className={`text-sm mb-6 ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              للمشاريع الصغيرة والاستخدام الشخصي
            </p>
            <div className="flex items-baseline justify-center mb-8">
              <span
                className={`text-5xl font-bold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                0
              </span>
              <span
                className={`text-lg mr-2 ${
                  darkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                ريال/شهر
              </span>
            </div>
            <button
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              ابدأ مجاناً
            </button>
          </div>

          <div className="space-y-4">
            {[
              "حتى 5 أعضاء في المشروع",
              "مهام ومشاريع غير محدودة",
              "2 جيجابايت تخزين",
              "التكاملات الأساسية",
              "الدعم عبر المجتمع",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span
                  className={`${darkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 relative flex-1 ${
            darkMode
              ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/50 backdrop-blur-sm"
              : "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl hover:shadow-2xl"
          }`}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              الأكثر شعبية ⭐
            </div>
          </div>

          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Pro
            </h3>
            <p
              className={`text-sm mb-6 ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              للفرق والمشاريع الاحترافية
            </p>
            <div className="flex items-baseline justify-center mb-2">
              <span
                className={`text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                99
              </span>
              <span
                className={`text-lg mr-2 ${
                  darkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                ريال/شهر
              </span>
            </div>
            <p
              className={`text-xs mb-6 ${
                darkMode ? "text-gray-500" : "text-slate-500"
              }`}
            >
              يُدفع سنوياً • وفر 20%
            </p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              اشترك الآن
            </button>
          </div>

          <div className="space-y-4">
            {[
              "حتى 50 عضو في المشروع",
              "مهام ومشاريع غير محدودة",
              "500 جيجابايت تخزين",
              "جميع التكاملات المتقدمة",
              "دعم الأولوية على مدار الساعة",
              "تحليلات وتقارير متقدمة",
              "إدارة الأذونات المتقدمة",
              "النسخ الاحتياطي التلقائي",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span
                  className={`${darkMode ? "text-gray-300" : "text-slate-700"}`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-4xl mb-16 p-8 rounded-2xl ${
          darkMode
            ? "bg-gray-900/30 border border-gray-800"
            : "bg-white/60 border border-gray-200"
        } backdrop-blur-sm`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              +10,000
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              فريق نشط
            </div>
          </div>
          <div>
            <div
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              99.9%
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              وقت التشغيل
            </div>
          </div>
          <div>
            <div
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              4.9/5
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              تقييم المستخدمين
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full max-w-6xl">
        <div
          className={`border-t pt-12 ${
            darkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                <span
                  className={`text-xl font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Sandstck
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed max-w-md ${
                  darkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                منصة إدارة المشاريع الرائدة التي تساعد الفرق على تحقيق أهدافها
                بكفاءة وسهولة. نحن نؤمن بقوة التعاون والإنتاجية.
              </p>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                روابط سريعة
              </h4>
              <ul className="space-y-2">
                {["حول الشركة", "المميزات", "الأسعار", "المدونة"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-sm hover:text-blue-600 transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-slate-600"
                        }`}
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                الدعم
              </h4>
              <ul className="space-y-2">
                {["مركز المساعدة", "اتصل بنا", "الحالة", "سياسة الخصوصية"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={`text-sm hover:text-blue-600 transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-slate-600"
                        }`}
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div
            className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t ${
              darkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div
              className={`text-sm mb-4 md:mb-0 ${
                darkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              © 2025 Sandstck Inc. جميع الحقوق محفوظة.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-sm font-bold">X</span>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-sm font-bold">@</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArabicFooterSection;
