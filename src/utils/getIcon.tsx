import {
  Triangle,
  Signal,
  Mountain,
  Code2,
  Brain,
  Database,
  FileText,
  Play,
  Files,
} from "lucide-react";
import { LevelEnum } from "@/types/courses";

const levelIcons: Record<LevelEnum, JSX.Element> = {
  [LevelEnum.BEGINNER]: <Triangle className="h-3 w-3 text-yellow-500" />,
  [LevelEnum.INTERMEDIATE]: <Signal className="h-3 w-3 text-yellow-500" />,
  [LevelEnum.ADVANCED]: <Mountain className="h-3 w-3 text-yellow-500" />,
};

export const getLevelIcon = (level: LevelEnum) => {
  return levelIcons[level] || null;
};

const courseTypeIcons: Record<string, JSX.Element> = {
  frontend: <Code2 className="h-4 w-4 text-blue-500" />,
  backend: <Database className="h-4 w-4 text-blue-500" />,
  ai: <Brain className="h-4 w-4 text-blue-500" />,
};

export const getCourseTypeIcon = (type: string) => {
  if (!type) return;
  return (
    courseTypeIcons[type.toLowerCase()] || (
      <Code2 className="h-4 w-4 text-blue-400" />
    )
  );
};

const lessonResourceIcons: Record<string, { icon: JSX.Element; bg: string }> = {
  video: {
    icon: (
      <Play
        style={{ fill: "white" }}
        className="h-3 w-3 sm:h-5 sm:w-5 text-white"
      />
    ),
    bg: "bg-[#05192D]",
  },
  resource: {
    icon: <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />,
    bg: "bg-[#05192D]",
  },
  quiz: {
    icon: <Files className="h-3 w-3 sm:h-5 sm:w-5 text-white" />,
    bg: "bg-[#05192D]",
  },
};

export const getLessonResourceIcon = (type: string) => {
  const data = lessonResourceIcons[type.toLowerCase()];
  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-2 mx-2 rounded-full  ${
        data?.bg || "bg-[#05192D]"
      }`}
    >
      {data?.icon || <FileText className="h-3 w-3 sm:h-5 sm:w-5text-white" />}
    </div>
  );
};
