import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Check, 
  Moon,
  Sun
} from "lucide-react";

// Mock useSettings hook since it's not available
const useSettings = () => {
  const [darkMode, setDarkMode] = useState(true);
  return { darkMode, setDarkMode };
};

const ArabicFooterSection = () => {
  const { darkMode, setDarkMode } = useSettings();

  const pricingPlans = [
    {
      name: "Free",
      nameAr: "مجاني",
      price: "0",
      currency: "ريال",
      period: "/شهر",
      buttonText: "ابدأ مجاناً",
      buttonStyle: "outline",
      popular: false,
      features: [
        "حتى 5 أعضاء مشروع",
        "مهام ومشاريع غير محدودة", 
        "تخزين 2GB",
        "التكاملات",
        "الدعم الأساسي"
      ]
    },
    {
      name: "Pro",
      nameAr: "برو",
      price: "99",
      currency: "ريال",
      period: "/شهر",
      buttonText: "اشترك الآن",
      buttonStyle: "primary",
      popular: true,
      bestValue: "أفضل قيمة",
      features: [
        "حتى 50 عضو مشروع",
        "مهام ومشاريع غير محدودة",
        "تخزين 500GB", 
        "التكاملات",
        "دعم الأولوية",
        "الدعم المتقدم",
        "دعم التصدير"
      ]
    }
  ];

  const footerLinks = [
    {
      title: "المنتج",
      links: ["الميزات", "التسعير", "الأمان", "التكاملات"]
    },
    {
      title: "الشركة", 
      links: ["معلومات عنا", "المدونة", "الوظائف", "اتصل بنا"]
    },
    {
      title: "الموارد",
      links: ["المساعدة", "الدعم", "الشروط", "الخصوصية"]
    },
    {
      title: "المطورين",
      links: ["API", "الوثائق", "SDK", "الأدوات"]
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? 'dark bg-black text-white' : 'bg-white text-black'
    } relative overflow-hidden`} dir="rtl">
      
      {/* Toggle Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          onClick={() => setDarkMode(!darkMode)}
          size="sm"
          variant="outline"
          className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            darkMode 
              ? 'border-white bg-transparent hover:bg-white hover:text-black' 
              : 'border-black bg-transparent hover:bg-black hover:text-white'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className={`inline-block px-4 py-2 rounded-full border-2 mb-6 ${
            darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
          }`}>
            <span className="text-sm font-medium">عزز معرفتك</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            اختر الخطة التي تناسبك
          </h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? (darkMode ? 'bg-gray-900 border-white shadow-2xl' : 'bg-gray-50 border-black shadow-2xl')
                  : (darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200')
              } ${darkMode ? 'dark:bg-gray-900' : ''}`}
            >
              {plan.popular && (
                <div className={`absolute -top-4 right-6 px-4 py-2 rounded-full text-sm font-bold ${
                  darkMode ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {plan.bestValue}
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{plan.nameAr}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={`text-lg ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {plan.currency}{plan.period}
                    </span>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    plan.buttonStyle === 'primary'
                      ? (darkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900')
                      : (darkMode 
                          ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black' 
                          : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white'
                        )
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Links */}
        <div className="border-t-2 border-current pt-16 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button className={`text-right hover:underline transition-colors ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                      }`}>
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Bottom Footer */}
          <div className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className={`text-sm mb-4 md:mb-0 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2024 منصة التعلم. جميع الحقوق محفوظة.
            </div>
            
            <div className="flex items-center gap-6">
              <button className={`text-sm hover:underline ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
                الشروط والأحكام
              </button>
              <button className={`text-sm hover:underline ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
                سياسة الخصوصية
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements - Matching the image design */}
      <div className="absolute bottom-0 left-0 w-80 h-40 opacity-90">
        <div className={`w-full h-full rounded-tr-[120px] ${
          darkMode ? 'bg-blue-600' : 'bg-blue-500'
        }`} />
        <div className={`absolute bottom-0 left-8 w-64 h-32 rounded-tr-[100px] ${
          darkMode ? 'bg-gray-900' : 'bg-gray-800'
        }`} />
      </div>
      
      <div className="absolute bottom-0 right-0 w-80 h-40 opacity-90">
        <div className={`w-full h-full rounded-tl-[120px] ${
          darkMode ? 'bg-orange-500' : 'bg-orange-400'
        }`} />
        <div className={`absolute bottom-0 right-8 w-64 h-32 rounded-tl-[100px] ${
          darkMode ? 'bg-gray-900' : 'bg-gray-800'
        }`} />
      </div>
    </div>
  );
};

export default ArabicFooterSection;