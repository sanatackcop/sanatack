import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Lock,
  Video,
  Code,
  PenTool,
  FileText,
  X,
  ChevronLeft,
  Clock,
} from "lucide-react";
import LogoLight from "@/assets/logo.svg";
import LogoDark from "@/assets/logo_black.svg";
import { useNavigate } from "react-router-dom";

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: "video" | "code" | "quiz" | "text" | "article";
  duration: string;
  completed: boolean;
  locked: boolean;
  current?: boolean;
  url?: string;
}

export interface Lesson {
  id: string;
  title: string;
  materials: Material[];
  completedCount: number;
  totalCount: number;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completedCount: number;
  totalCount: number;
  progress: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  modules: Module[];
  progress: number;
  totalLessons: number;
  completedLessons: number;
  completedCount: number;
  totalCount: number;
  duration: string;
}

export interface TopNavbarProps {
  courseData: Course;
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  prevMaterial: Material | null;
  nextMaterial: Material | null;
  handlePrev: () => void;
  handleNext: () => void;
  currentIndex: number;
  totalMaterials: number;
  setSidebarOpen: any;
  currentMaterial: Material | null;
  handleComplete: () => void;
  handleRestart: () => void;
}

interface SideNavbarProps {
  sidebarOpen: boolean;
  courseData: Course;
  expandedModules: string[];
  toggleModule: (id: string) => void;
  currentMaterial: Material | null;
  setCurrentMaterial: (m: Material) => void;
  setSidebarOpen: any;
  darkMode: any;
}

const iconMap = {
  video: Video,
  code: Code,
  quiz: PenTool,
  text: FileText,
};

export const getIcon = (type: string) =>
  iconMap[type as keyof typeof iconMap] || FileText;

export const SideNavbar: React.FC<SideNavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  courseData,
  expandedModules,
  toggleModule,
  currentMaterial,
  setCurrentMaterial,
  darkMode,
}) => {
  const [searchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredModules = courseData.modules
    .map((module) => ({
      ...module,
      lessons: module.lessons
        .map((lesson) => ({
          ...lesson,
          materials: lesson.materials.filter((material) =>
            material.title.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((lesson) => lesson.materials.length > 0),
    }))
    .filter((module) => module.lessons.length > 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  const nav = useNavigate();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50  z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-transform duration-300 z-50 w-96 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } overflow-hidden flex flex-col shadow-xl`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-[60px] flex justify-normal items-center overflow-hidden">
            <img
              src={darkMode ? String(LogoDark) : String(LogoLight)}
              alt="logo"
              onClick={() => nav("/")}
              className="h-full w-auto object-contain transform scale-[2] pr-6 pt-1"
            />
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-7 left-4 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {courseData.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {courseData.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {courseData.progress}%
              </span>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {courseData.completedLessons} من {courseData.totalLessons}{" "}
                  دروس
                </div>
                <div className="text-xs text-gray-500">
                  المدة الإجمالية: {courseData.duration}
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 relative"
                style={{ width: `${courseData.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 mb-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      module.progress === 100
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {module.progress}%
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      expandedModules.includes(module.id) ? "rotate-90" : ""
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="text-right flex-1 mx-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    {module.title}
                  </h3>
                  <div className="flex items-center justify-start gap-3 text-xs text-gray-500">
                    <span>{module.lessons.length} دروس</span>
                    <span>
                      {module.completedCount}/{module.totalCount}
                    </span>
                  </div>
                </div>
              </button>

              {expandedModules.includes(module.id) && (
                <div className="pb-4 px-4 space-y-3">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-right text-sm">
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {lesson.materials.map((material) => {
                          const Icon = getIcon(material.type);
                          const isActive = material.id === currentMaterial?.id;

                          return (
                            <button
                              key={material.id}
                              onClick={() => {
                                if (!material.locked) {
                                  setCurrentMaterial(material);
                                  setSidebarOpen(false);
                                }
                              }}
                              disabled={material.locked}
                              className={`w-full p-3 rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-sm"
                                  : material.locked
                                  ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-right flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      isActive
                                        ? "text-blue-900 dark:text-blue-100"
                                        : "text-gray-900 dark:text-white"
                                    }`}
                                  >
                                    {material.title}
                                  </p>
                                  <div className="flex items-center justify-start gap-2 mt-1">
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
                                      : isActive
                                      ? "bg-blue-100 dark:bg-blue-900/20"
                                      : "bg-gray-100 dark:bg-gray-800"
                                  }`}
                                >
                                  {material.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : material.locked ? (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <Icon
                                      className={`w-4 h-4 ${
                                        isActive
                                          ? "text-blue-600"
                                          : "text-gray-600 dark:text-gray-400"
                                      }`}
                                    />
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-white dark:bg-gray-900 rounded-xl">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {courseData.completedLessons}
              </div>
              <div className="text-xs text-gray-500">دروس مكتملة</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-900 rounded-xl">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {courseData.totalLessons - courseData.completedLessons}
              </div>
              <div className="text-xs text-gray-500">متبقية</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
