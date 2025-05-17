import React, { forwardRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger as RadixTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  PanelLeft,
  CheckCircle,
  FileText,
  Lock,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cva, cx } from "class-variance-authority";

// Types
interface Material {
  id: string;
  type: string;
  title: string;
  duration?: number;
  locked?: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completedCount: number;
  totalCount: number;
  materials: Material[];
}

interface Module {
  id: string;
  title: string;
  completedCount: number;
  totalCount: number;
  lessons?: Lesson[];
}

interface Course {
  title: string;
  completedCount: number;
  totalCount: number;
  duration: string;
}

interface SidebarProps {
  course: Course;
  modules: Module[];
  currentMaterial: Material | null;
  setCurrentMaterial: (mat: Material) => void;
  completedIds: string[];
  progressPercent: number;
  darkMode: boolean;
  onBack?: () => void;
  iconMap?: Record<string, React.ComponentType<any>>;
  LogoLight: string;
  LogoDark: string;
}

const triggerStyles = cva(
  "flex flex-row-reverse w-full items-center justify-between px-6 py-3 transition-colors duration-150",
  {
    variants: {
      intent: {
        default:
          "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10",
        active: "bg-[#E5F8F2] dark:bg-[#0A1F15] text-gray-900 dark:text-white",
        completed: "opacity-60",
      },
    },
    defaultVariants: { intent: "default" },
  }
);

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof RadixTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixTrigger> & {
    subtitle?: string;
    intent?: "default" | "active" | "completed";
  }
>(({ children, subtitle, intent = "default", className, ...props }, ref) => (
  <RadixTrigger
    ref={ref}
    {...props}
    className={cx(
      triggerStyles({ intent }),
      "text-right font-medium",
      className
    )}
  >
    <div className="flex flex-col items-end flex-1 gap-1">
      <span className="truncate text-right">{children}</span>
      {subtitle && (
        <span className="text-xs opacity-60 text-right">{subtitle}</span>
      )}
    </div>
    <ChevronDown
      className={cx(
        "h-4 w-4 transform transition-transform duration-200",
        props["data-state"] === "open" && "rotate-180"
      )}
    />
  </RadixTrigger>
));
AccordionTrigger.displayName = "AccordionTrigger";

export default function Sidebar({
  course,
  modules,
  currentMaterial,
  setCurrentMaterial,
  completedIds,
  progressPercent,
  darkMode,
  onBack,
  iconMap = {},
  LogoLight,
  LogoDark,
}: any) {
  const navigate = useNavigate();
  return (
    <>
      <aside
        dir="rtl"
        className="hidden md:flex w-80 flex-col border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#0C0C0C]"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <img
            src={darkMode ? LogoLight : LogoDark}
            alt="logo"
            className="w-24 hover:opacity-90 transition-opacity"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack ?? (() => navigate(-1))}
            className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        <Separator className="bg-gray-200 dark:bg-white/10" />

        <div className="px-6 py-4 text-right">
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            التقدم: {progressPercent}%
          </span>
          <Progress
            value={progressPercent}
            className="mt-2 h-2 bg-[#19D38C] dark:bg-white/20 rounded-full"
          />
        </div>
        <Separator className="bg-gray-200 dark:bg-white/10" />

        <div className="px-6 py-4 text-right">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {course.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">
            {course.completedCount}/{course.totalCount} • {course.duration}
          </p>
        </div>
        <Separator className="bg-gray-200 dark:bg-white/10" />

        <nav dir="rtl" className="flex-1 overflow-y-auto scrollbar-thin">
          <Accordion type="multiple" className="space-y-1 p-0">
            {modules.map((mod) => {
              const modDone = mod.completedCount === mod.totalCount;
              const modIntent = modDone ? "completed" : "default";
              return (
                <AccordionItem
                  key={mod.id}
                  value={mod.id}
                  className="border-none"
                >
                  <AccordionTrigger
                    intent={modIntent}
                    subtitle={`${mod.completedCount}/${mod.totalCount}`}
                  >
                    {mod.title}
                  </AccordionTrigger>

                  <AccordionContent className="px-0 py-2 space-y-1 text-right">
                    <Accordion type="multiple" className="space-y-1 p-0">
                      {mod.lessons?.map((lesson) => {
                        const lessonDone =
                          lesson.completedCount === lesson.totalCount;
                        const lessonIntent = lessonDone
                          ? "completed"
                          : "default";
                        return (
                          <AccordionItem
                            key={lesson.id}
                            value={lesson.id}
                            className="border-none"
                          >
                            <AccordionTrigger
                              intent={lessonIntent}
                              subtitle={`${lesson.completedCount}/${lesson.totalCount} • ${lesson.duration}`}
                            >
                              {lesson.title}
                            </AccordionTrigger>

                            <AccordionContent className="px-0 py-1 space-y-1 text-right">
                              {lesson.materials.map((mat) => {
                                const Icon = iconMap[mat.type] ?? FileText;
                                const active = currentMaterial?.id === mat.id;
                                const done = completedIds.includes(mat.id);
                                return (
                                  <button
                                    key={mat.id}
                                    onClick={() => setCurrentMaterial(mat)}
                                    className={clsx(
                                      "flex w-full flex-col justify-between rounded-md px-6 py-2 mb-1 text-right",
                                      active &&
                                        "border-r-4 border-[#19D38C] bg-transparent",
                                      done &&
                                        !active &&
                                        "bg-[#19D38C]/10 dark:bg-[#0A1F15] text-gray-400 dark:text-white",
                                      !active &&
                                        !done &&
                                        "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span className="font-medium text-sm truncate text-right">
                                          {mat.title}
                                        </span>
                                      </div>
                                      {done && (
                                        <CheckCircle className="h-4 w-4 text-[#19D38C]" />
                                      )}
                                      {!done && mat.locked && (
                                        <Lock className="h-4 w-4 opacity-50" />
                                      )}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate text-right">
                                      {done
                                        ? "اكتمل"
                                        : mat.duration
                                        ? `${mat.duration}min`
                                        : ""}
                                    </div>
                                  </button>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </nav>
      </aside>

      <div className="md:hidden flex items-center justify-start p-4 bg-white dark:bg-[#0C0C0C] text-right">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack ?? (() => navigate(-1))}
          className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
