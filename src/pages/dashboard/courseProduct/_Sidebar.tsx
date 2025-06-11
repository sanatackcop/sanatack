// import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
// import { Material } from "@/utils/types";
// import { Course } from "@/utils/types";
import SanatackLogo from "../../../assets/logo.svg";
import SanatackDarkLogo from "../../../assets/dark_logo.svg";
import { useSettings } from "@/context/SettingsContexts";
import { Home, Sun } from "lucide-react";

// interface SidebarProps {
//   course: Course;
//   currentMaterial: Material | null;
//   setCurrentMaterial: (mat: Material) => void;
//   iconMap?: Record<string, React.ComponentType<any>>;
// }

// {
//   course,
//   currentMaterial,
//   setCurrentMaterial,
//   iconMap = {},
// }: SidebarProps

export default function CourseSidebar() {
  const { darkMode, toggleDarkMode } = useSettings();
  return (
    <Sidebar side="right">
      <SidebarHeader className="mt-8 h-fit">
        <div className="flex justify-between">
          <img
            src={darkMode ? SanatackDarkLogo : SanatackLogo}
            alt="Image"
            className=" w-20 h-10 object-cover"
          />
          <Home className=" ml-4 relative top-1" />
          <Sun
            className=" ml-4 relative top-1"
            onClick={() => toggleDarkMode()}
          />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
    </Sidebar>
  );
}

// export default function Sidebar({
//   course,
//   modules,
//   currentMaterial,
//   setCurrentMaterial,
//   completedIds,
//   progressPercent,
//   darkMode,
//   onBack,
//   iconMap = {},
//   LogoLight,
//   LogoDark,
// }: SidebarProps) {
//   const navigate = useNavigate();
//   return (
//     <>
//       <aside
//         dir="rtl"
//         className="hidden md:flex w-80 flex-col border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#0C0C0C]"
//       >
//         <div className="flex items-center justify-between px-6 py-4">
//           <img
//             src={darkMode ? LogoLight : LogoDark}
//             alt="logo"
//             className="w-24 hover:opacity-90 transition-opacity"
//           />
//           <Button
//             size="icon"
//             variant="ghost"
//             onClick={onBack ?? (() => navigate(-1))}
//             className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
//           >
//             <PanelLeft className="h-5 w-5" />
//           </Button>
//         </div>
//         <Separator className="bg-gray-200 dark:bg-white/10" />

//         <div className="px-6 py-4 text-right">
//           <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             التقدم: {progressPercent}%
//           </span>
//           <Progress
//             value={progressPercent}
//             className="mt-2 h-2 bg-[#19D38C] dark:bg-white/20 rounded-full"
//           />
//         </div>
//         <Separator className="bg-gray-200 dark:bg-white/10" />

//         <div className="px-6 py-4 text-right">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
//             {course.title}
//           </h2>
//           <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">
//             {course.completedCount}/{course.totalCount} • {course.duration}
//           </p>
//         </div>
//         <Separator className="bg-gray-200 dark:bg-white/10" />

//         <nav dir="rtl" className="flex-1 overflow-y-auto scrollbar-thin">
//           <Accordion type="multiple" className="space-y-1 p-0">
//             {modules.map((mod: Module) => {
//               const modDone = mod.completedCount === mod.totalCount;
//               console.log({ mod });
//               const modIntent = modDone ? "completed" : "default";
//               return (
//                 <AccordionItem
//                   key={mod.id}
//                   value={mod.id}
//                   className="border-none"
//                 >
//                   <AccordionTrigger
//                     intent={modIntent}
//                     subtitle={`${mod.completedCount}/${mod.totalCount}`}
//                   >
//                     {mod.title}
//                   </AccordionTrigger>

//                   <AccordionContent className="px-0 py-2 space-y-1 text-right">
//                     <Accordion type="multiple" className="space-y-1 p-0">
//                       {mod.lessons?.map((lesson) => {
//                         const lessonDone =
//                           lesson.completedCount === lesson.totalCount;
//                         const lessonIntent = lessonDone
//                           ? "completed"
//                           : "default";
//                         return (
//                           <AccordionItem
//                             key={lesson.id}
//                             value={lesson.id}
//                             className="border-none"
//                           >
//                             <AccordionTrigger
//                               intent={lessonIntent}
//                               subtitle={`${lesson.completedCount}/${lesson.totalCount} • ${lesson.duration}`}
//                             >
//                               {lesson.title}
//                             </AccordionTrigger>

//                             <AccordionContent className="px-0 py-1 space-y-1 text-right">
//                               {lesson.materials.map((mat) => {
//                                 const Icon = iconMap[mat.type] ?? FileText;
//                                 const active = currentMaterial?.id === mat.id;
//                                 const done = completedIds.includes(mat.id);
//                                 return (
//                                   <button
//                                     key={mat.id}
//                                     onClick={() => setCurrentMaterial(mat)}
//                                     className={clsx(
//                                       "flex w-full flex-col justify-between rounded-md px-6 py-2 mb-1 text-right",
//                                       active &&
//                                         "border-r-4 border-[#19D38C] bg-transparent",
//                                       done &&
//                                         !active &&
//                                         "bg-[#19D38C]/10 dark:bg-[#0A1F15] text-gray-400 dark:text-white",
//                                       !active &&
//                                         !done &&
//                                         "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
//                                     )}
//                                   >
//                                     <div className="flex items-center justify-between">
//                                       <div className="flex items-center gap-2">
//                                         <Icon className="h-4 w-4" />
//                                         <span className="font-medium text-sm truncate text-right">
//                                           {mat.title}
//                                         </span>
//                                       </div>
//                                       {done && (
//                                         <CheckCircle className="h-4 w-4 text-[#19D38C]" />
//                                       )}
//                                       {!done && mat.locked && (
//                                         <Lock className="h-4 w-4 opacity-50" />
//                                       )}
//                                     </div>
//                                     <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate text-right">
//                                       {done
//                                         ? "اكتمل"
//                                         : mat.duration
//                                         ? `${mat.duration}min`
//                                         : ""}
//                                     </div>
//                                   </button>
//                                 );
//                               })}
//                             </AccordionContent>
//                           </AccordionItem>
//                         );
//                       })}
//                     </Accordion>
//                   </AccordionContent>
//                 </AccordionItem>
//               );
//             })}
//           </Accordion>
//         </nav>
//       </aside>

//       <div className="md:hidden flex items-center justify-start p-4 bg-white dark:bg-[#0C0C0C] text-right">
//         <Button
//           size="icon"
//           variant="ghost"
//           onClick={onBack ?? (() => navigate(-1))}
//           className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
//         >
//           <PanelLeft className="h-5 w-5" />
//         </Button>
//       </div>
//     </>
//   );
// }
