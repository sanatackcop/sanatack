// import { useState, useEffect } from "react";
// import {
//   Sparkles,
//   ArrowRight,
//   ArrowLeft,
//   Clock,
//   Book,
//   Code,
//   FileText,
//   HelpCircle,
//   CheckCircle,
//   X,
//   Bot,
//   Wand2,
//   Settings,
//   Check,
//   Brain,
//   Cpu,
//   Globe,
//   CreditCard,
//   BookOpen,
//   Youtube,
//   Archive,
//   FlaskConical,
//   Target,
//   Trophy,
//   Gauge,
//   Palette,
//   Shield,
//   Rocket,
// } from "lucide-react";

// const TOPIC_OPTIONS = {
//   AI: { label: "الذكاء الاصطناعي", icon: Brain },
//   ML: { label: "التعلم الآلي", icon: Cpu },
//   BACKEND: { label: "تطوير الخادم", icon: Shield },
//   FRONTEND: { label: "واجهة المستخدم", icon: Palette },
//   MOBILE: { label: "تطبيقات الجوال", icon: Globe },
//   DATA: { label: "علوم البيانات", icon: FlaskConical },
// };

// const LEVEL_OPTIONS = {
//   BEGINNER: { label: "مبتدئ", icon: Target },
//   INTERMEDIATE: { label: "متوسط", icon: Gauge },
//   ADVANCED: { label: "متقدم", icon: Rocket },
//   EXPERT: { label: "خبير", icon: Trophy },
// };

// const CONTENT_FEATURES = [
//   { key: "include_code_lessons", label: "دروس برمجية", icon: Code },
//   { key: "include_quizzes", label: "اختبارات", icon: HelpCircle },
//   { key: "include_articles", label: "مقالات", icon: FileText },
//   { key: "include_flashcards", label: "بطاقات تعليمية", icon: CreditCard },
//   { key: "include_summary", label: "ملخصات", icon: BookOpen },
//   { key: "include_youtube", label: "فيديوهات", icon: Youtube },
//   { key: "include_archive", label: "أرشيف", icon: Archive },
//   { key: "include_research", label: "أبحاث", icon: FlaskConical },
// ];

// function StepIndicator({ step, title, icon: Icon, isActive, isCompleted }) {
//   return (
//     <div className="flex flex-col items-center gap-2 min-w-0">
//       <div
//         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
//           isCompleted
//             ? "bg-emerald-500 text-white shadow-lg"
//             : isActive
//             ? "bg-blue-500 text-white shadow-lg"
//             : "bg-gray-200 dark:bg-gray-700 text-gray-400"
//         }`}
//       >
//         {isCompleted ? (
//           <Check className="w-5 h-5" />
//         ) : (
//           <Icon className="w-5 h-5" />
//         )}
//       </div>
//       <div className="text-center">
//         <div className="text-xs text-gray-500">الخطوة {step}</div>
//         <div
//           className={`text-sm font-medium ${
//             isActive || isCompleted
//               ? "text-gray-900 dark:text-white"
//               : "text-gray-400"
//           }`}
//         >
//           {title}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AiCourseGeneration({
//   isOpen = true,
//   onClose,
//   onCourseCreated,
// }) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [prompt, setPrompt] = useState("");
//   const [settings, setSettings] = useState({
//     level: "BEGINNER",
//     topic: "AI",
//     duration_hours: 10,
//     language: "ar",
//     max_modules: 5,
//     max_lessons_per_module: 6,
//     include_code_lessons: true,
//     include_quizzes: true,
//     include_articles: true,
//     include_flashcards: false,
//     include_summary: false,
//     include_youtube: false,
//     include_archive: false,
//     include_research: false,
//   });
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedCourse, setGeneratedCourse] = useState(null);
//   const [generationProgress, setGenerationProgress] = useState(0);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "Escape" && onClose) onClose();
//     };
//     document.addEventListener("keydown", handleKeyPress);
//     return () => document.removeEventListener("keydown", handleKeyPress);
//   }, [onClose]);

//   const handleNext = () => {
//     if (currentStep === 1 && prompt.trim()) setCurrentStep(2);
//     else if (currentStep === 2) handleGenerate();
//   };

//   const handleBack = () => {
//     if (currentStep === 3) {
//       setGeneratedCourse(null);
//       setCurrentStep(2);
//       setGenerationProgress(0);
//     } else if (currentStep === 2) {
//       setCurrentStep(1);
//     }
//   };

//   const handleGenerate = () => {
//     setIsGenerating(true);
//     setCurrentStep(3);
//     setGenerationProgress(0);

//     const interval = setInterval(() => {
//       setGenerationProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(interval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 200);

//     setTimeout(() => {
//       clearInterval(interval);
//       setGenerationProgress(100);
//       setGeneratedCourse({
//         title: "دورة الذكاء الاصطناعي المتقدمة",
//         description:
//           "دورة شاملة في الذكاء الاصطناعي مع تطبيقات عملية ومشاريع حقيقية",
//         modules: [
//           {
//             title: "أساسيات الذكاء الاصطناعي",
//             lessons: [
//               "المفاهيم الأساسية",
//               "تاريخ AI",
//               "التطبيقات الحديثة",
//               "الأخلاقيات",
//             ],
//           },
//           {
//             title: "التعلم الآلي",
//             lessons: [
//               "الخوارزميات الأساسية",
//               "التدريب والاختبار",
//               "التقييم",
//               "التطبيقات",
//             ],
//           },
//           {
//             title: "التعلم العميق",
//             lessons: [
//               "الشبكات العصبية",
//               "CNN للرؤية",
//               "RNN للنصوص",
//               "Transformers",
//             ],
//           },
//           {
//             title: "مشاريع عملية",
//             lessons: ["تصنيف الصور", "معالجة اللغة", "التنبؤ", "نموذج متكامل"],
//           },
//         ],
//       });
//       setIsGenerating(false);
//     }, 2500);
//   };

//   const handleReset = () => {
//     setCurrentStep(1);
//     setPrompt("");
//     setGeneratedCourse(null);
//     setIsGenerating(false);
//     setGenerationProgress(0);
//     setSettings((prev) => ({ ...prev, level: "BEGINNER", topic: "AI" }));
//   };

//   const toggleFeature = (key) => {
//     setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const selectedLevel = LEVEL_OPTIONS[settings.level];
//   const selectedTopic = TOPIC_OPTIONS[settings.topic];
//   const activeFeatures = CONTENT_FEATURES.filter((f) => settings[f.key]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700">
//         <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-2xl">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
//                 <Brain className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                   مُولد الدورات الذكي
//                 </h2>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   مدعوم بالذكاء الاصطناعي
//                 </p>
//               </div>
//             </div>
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>

//           <div className="flex items-center justify-center gap-8">
//             <StepIndicator
//               step={1}
//               title="الوصف"
//               icon={Sparkles}
//               isActive={currentStep === 1}
//               isCompleted={currentStep > 1}
//             />
//             <div
//               className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${
//                 currentStep > 1 ? "bg-emerald-500" : "bg-gray-300"
//               }`}
//             />
//             <StepIndicator
//               step={2}
//               title="الإعدادات"
//               icon={Settings}
//               isActive={currentStep === 2}
//               isCompleted={currentStep > 2}
//             />
//             <div
//               className={`flex-1 h-0.5 rounded-full transition-colors duration-500 ${
//                 currentStep > 2 ? "bg-emerald-500" : "bg-gray-300"
//               }`}
//             />
//             <StepIndicator
//               step={3}
//               title="النتيجة"
//               icon={CheckCircle}
//               isActive={currentStep === 3}
//               isCompleted={false}
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-6">
//             {/* Step 1: Prompt */}
//             {currentStep === 1 && (
//               <div className="max-w-3xl mx-auto space-y-6">
//                 <div className="text-center">
//                   <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                     ماذا تريد أن تتعلم؟
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 text-lg">
//                     اكتب وصفاً مفصلاً للدورة التي تحلم بها
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
//                   <div className="mb-4">
//                     <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-2">
//                       <Wand2 className="w-4 h-4" />
//                       <span>كن محدداً في وصفك للحصول على أفضل النتائج</span>
//                     </div>
//                     <textarea
//                       value={prompt}
//                       onChange={(e) => setPrompt(e.target.value)}
//                       placeholder="مثال: أريد دورة شاملة في تطوير تطبيقات الويب باستخدام React و TypeScript، تبدأ من الأساسيات وتصل للمستوى المتقدم، مع مشاريع عملية وأمثلة من العالم الحقيقي..."
//                       className="w-full h-40 p-4 text-base border-2 border-blue-200 dark:border-blue-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-900 placeholder-gray-400 transition-all"
//                       maxLength={1000}
//                     />
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
//                       <span className="flex items-center gap-1">
//                         <Target className="w-4 h-4" />
//                         كن واضحاً
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Book className="w-4 h-4" />
//                         حدد الأهداف
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         اذكر المدة المفضلة
//                       </span>
//                     </div>
//                     <span className="text-sm font-medium text-gray-500">
//                       {prompt.length}/1000
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 2: Settings */}
//             {currentStep === 2 && (
//               <div className="max-w-4xl mx-auto space-y-6">
//                 {/* Basic Settings */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
//                   <h4 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
//                     <Settings className="w-6 h-6 text-blue-500" />
//                     الإعدادات الأساسية
//                   </h4>

//                   <div className="grid grid-cols-1 gap-8">
//                     {/* Level Selection */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                         مستوى الدورة
//                       </label>
//                       <div className="grid grid-cols-2 gap-3">
//                         {Object.entries(LEVEL_OPTIONS).map(([key, level]) => (
//                           <button
//                             key={key}
//                             onClick={() =>
//                               setSettings({ ...settings, level: key })
//                             }
//                             className={`p-4 rounded-xl border-2 transition-all duration-200 ${
//                               settings.level === key
//                                 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md scale-105"
//                                 : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                             }`}
//                           >
//                             <level.icon className="w-6 h-6 mx-auto mb-2" />
//                             <span className="text-sm font-medium">
//                               {level.label}
//                             </span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Structure Settings */}
//                   <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                         <Clock className="w-4 h-4" />
//                         المدة (ساعات)
//                       </label>
//                       <input
//                         type="number"
//                         value={settings.duration_hours}
//                         onChange={(e) =>
//                           setSettings({
//                             ...settings,
//                             duration_hours: parseInt(e.target.value) || 1,
//                           })
//                         }
//                         className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 transition-all"
//                         min="1"
//                         max="200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                         <Book className="w-4 h-4" />
//                         عدد الوحدات
//                       </label>
//                       <input
//                         type="number"
//                         value={settings.max_modules}
//                         onChange={(e) =>
//                           setSettings({
//                             ...settings,
//                             max_modules: parseInt(e.target.value) || 1,
//                           })
//                         }
//                         className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 transition-all"
//                         min="1"
//                         max="20"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         دروس لكل وحدة
//                       </label>
//                       <div className="space-y-2">
//                         <input
//                           type="range"
//                           value={settings.max_lessons_per_module}
//                           onChange={(e) =>
//                             setSettings({
//                               ...settings,
//                               max_lessons_per_module: parseInt(e.target.value),
//                             })
//                           }
//                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                           min="3"
//                           max="15"
//                         />
//                         <div className="flex justify-between text-sm text-gray-500">
//                           <span>3</span>
//                           <span className="font-semibold text-blue-600">
//                             {settings.max_lessons_per_module} دروس
//                           </span>
//                           <span>15</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Course Preview */}
//                   <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-blue-600" />
//                         <span className="font-medium">
//                           {settings.duration_hours} ساعة
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Book className="w-4 h-4 text-purple-600" />
//                         <span className="font-medium">
//                           {settings.max_modules} وحدات
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <FileText className="w-4 h-4 text-green-600" />
//                         <span className="font-medium">
//                           {settings.max_modules *
//                             settings.max_lessons_per_module}{" "}
//                           درس
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Content Features */}
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
//                   <h4 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
//                     <Sparkles className="w-6 h-6 text-green-500" />
//                     محتوى الدورة التفاعلي
//                   </h4>

//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {CONTENT_FEATURES.map((feature) => (
//                       <button
//                         key={feature.key}
//                         onClick={() => toggleFeature(feature.key)}
//                         className={`p-4 rounded-xl border-2 transition-all duration-200 group ${
//                           settings[feature.key]
//                             ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-md scale-105"
//                             : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                         }`}
//                       >
//                         <feature.icon className="w-6 h-6 mx-auto mb-2" />
//                         <span className="text-sm font-medium block">
//                           {feature.label}
//                         </span>
//                         {settings[feature.key] && (
//                           <Check className="w-4 h-4 mx-auto mt-2 text-green-500" />
//                         )}
//                       </button>
//                     ))}
//                   </div>

//                   {activeFeatures.length > 0 && (
//                     <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800">
//                       <div className="flex items-center gap-2 mb-2">
//                         <CheckCircle className="w-5 h-5 text-green-600" />
//                         <span className="text-sm font-medium text-green-800 dark:text-green-200">
//                           محتوى محدد ({activeFeatures.length})
//                         </span>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {activeFeatures.map((feature) => (
//                           <span
//                             key={feature.key}
//                             className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
//                           >
//                             {feature.label}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Generation & Results */}
//             {currentStep === 3 && (
//               <div className="max-w-4xl mx-auto">
//                 {isGenerating ? (
//                   <div className="text-center space-y-8">
//                     <div className="relative">
//                       <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
//                         <Bot className="w-12 h-12 text-white animate-pulse" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse" />
//                     </div>

//                     <div>
//                       <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
//                         جاري إنشاء دورتك المخصصة
//                       </h3>
//                       <p className="text-gray-600 dark:text-gray-400 text-lg">
//                         يعمل الذكاء الاصطناعي على تصميم محتوى تعليمي متخصص لك
//                       </p>
//                     </div>

//                     <div className="max-w-md mx-auto">
//                       <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
//                         <span>التقدم</span>
//                         <span>{generationProgress}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out relative"
//                           style={{ width: `${generationProgress}%` }}
//                         >
//                           <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       {[
//                         {
//                           icon: Brain,
//                           label: "تحليل المتطلبات",
//                           completed: generationProgress > 30,
//                         },
//                         {
//                           icon: Wand2,
//                           label: "توليد المحتوى",
//                           completed: generationProgress > 60,
//                         },
//                         {
//                           icon: CheckCircle,
//                           label: "مراجعة النتائج",
//                           completed: generationProgress >= 100,
//                         },
//                       ].map((step, index) => (
//                         <div
//                           key={index}
//                           className={`p-6 rounded-xl border-2 transition-all duration-500 ${
//                             step.completed
//                               ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600 scale-105"
//                               : "border-gray-200 dark:border-gray-700 text-gray-400"
//                           }`}
//                         >
//                           <step.icon className="w-8 h-8 mx-auto mb-3" />
//                           <span className="text-sm font-medium block">
//                             {step.label}
//                           </span>
//                           {step.completed && (
//                             <Check className="w-5 h-5 mx-auto mt-2 text-green-500" />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ) : generatedCourse ? (
//                   <div className="space-y-8">
//                     {/* Course Header */}
//                     <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h3 className="text-3xl font-bold mb-3">
//                             {generatedCourse.title}
//                           </h3>
//                           <p className="text-blue-100 mb-6 text-lg">
//                             {generatedCourse.description}
//                           </p>
//                           <div className="flex flex-wrap gap-6 text-sm">
//                             <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                               <Clock className="w-4 h-4" />
//                               <span>{settings.duration_hours} ساعة</span>
//                             </div>
//                             <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                               <Book className="w-4 h-4" />
//                               <span>
//                                 {generatedCourse.modules.length} وحدات
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                               <selectedLevel.icon className="w-4 h-4" />
//                               <span>{selectedLevel.label}</span>
//                             </div>
//                             <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
//                               <selectedTopic.icon className="w-4 h-4" />
//                               <span>{selectedTopic.label}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="ml-6">
//                           <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
//                             <Trophy className="w-10 h-10 text-white" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Course Modules */}
//                     <div className="space-y-6">
//                       <h4 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
//                         <Book className="w-6 h-6 text-blue-500" />
//                         محتوى الدورة
//                       </h4>

//                       <div className="grid gap-6">
//                         {generatedCourse.modules.map((module, moduleIndex) => (
//                           <div
//                             key={moduleIndex}
//                             className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
//                           >
//                             <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
//                               <div className="flex items-center gap-4">
//                                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
//                                   {moduleIndex + 1}
//                                 </div>
//                                 <div className="flex-1">
//                                   <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
//                                     {module.title}
//                                   </h5>
//                                   <span className="text-sm text-gray-500 bg-white dark:bg-gray-700 px-3 py-1 rounded-full inline-block mt-2">
//                                     {module.lessons.length} دروس
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="p-6">
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {module.lessons.map((lesson, lessonIndex) => (
//                                   <div
//                                     key={lessonIndex}
//                                     className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-100 dark:border-gray-700"
//                                   >
//                                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                                     <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
//                                       {lesson}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Content Features Preview */}
//                       {activeFeatures.length > 0 && (
//                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//                           <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                             <Sparkles className="w-6 h-6 text-green-500" />
//                             المحتوى التفاعلي المتضمن
//                           </h4>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             {activeFeatures.map((feature) => (
//                               <div
//                                 key={feature.key}
//                                 className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
//                               >
//                                 <feature.icon className="w-6 h-6 mx-auto mb-2" />
//                                 <span className="text-xs font-medium block text-center">
//                                   {feature.label}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ) : null}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {currentStep > 1 && !isGenerating && (
//                 <button
//                   onClick={handleBack}
//                   className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 font-medium"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   السابق
//                 </button>
//               )}

//               {generatedCourse && (
//                 <button
//                   onClick={handleReset}
//                   className="px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
//                 >
//                   <Sparkles className="w-4 h-4" />
//                   إنشاء دورة جديدة
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               {currentStep === 1 && (
//                 <button
//                   onClick={handleNext}
//                   disabled={!prompt.trim()}
//                   className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
//                 >
//                   التالي
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               )}

//               {currentStep === 2 && (
//                 <button
//                   onClick={handleGenerate}
//                   disabled={isGenerating}
//                   className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
//                 >
//                   <Wand2 className="w-4 h-4" />
//                   إنشاء الدورة
//                 </button>
//               )}

//               {generatedCourse && currentStep === 3 && (
//                 <button
//                   onClick={() => {
//                     if (onCourseCreated) onCourseCreated(generatedCourse);
//                     if (onClose) onClose();
//                   }}
//                   className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   حفظ الدورة
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
