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
  AppWindow,
  Code,
  Server,
} from "lucide-react";
import { LevelEnum } from "@/types/courses";
import { JSX } from "react";

const levelIcons: Record<LevelEnum, JSX.Element> = {
  [LevelEnum.BEGINNER]: <Triangle className="h-3 w-3 text-yellow-500 mx-1" />,
  [LevelEnum.INTERMEDIATE]: <Signal className="h-3 w-3 text-yellow-500 mx-1" />,
  [LevelEnum.ADVANCED]: <Mountain className="h-3 w-3 text-yellow-500 mx-1" />,
};

export const getLevelIcon = (level: LevelEnum) => {
  return (
    levelIcons[level] || <AppWindow className="h-3 w-3 text-yellow-500 mx-1" />
  );
};

const courseTypeIcons: Record<string, JSX.Element> = {
  frontend: <Code2 className="h-4 w-4 text-blue-500 mx-1" />,
  backend: <Database className="h-4 w-4 text-blue-500 mx-1" />,
  ai: <Brain className="h-4 w-4 text-blue-500 mx-1" />,
};

export const getCourseTypeIcon = (type: string) => {
  if (!type) return;
  return (
    courseTypeIcons[type.toLowerCase()] || (
      <Code2 className="h-4 w-4 text-blue-400 mx-1" />
    )
  );
};

interface CareerIconProps {
  title: string;
  size?: number;
  className?: string;
}

export const CareerIcon: React.FC<CareerIconProps> = ({
  title,
  size = 18,
  className = "text-white-400",
}) => {
  const iconsMap: Record<string, JSX.Element> = {
    "Frontend Developer": <Code size={size} className={className} />,
    "Backend Developer": <Server size={size} className={className} />,
  };

  return iconsMap[title] || <Code size={size} className={className} />;
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
      className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 mx-2 rounded-full ${
        data?.bg || "bg-[#05192D]"
      }`}
    >
      {data?.icon || <FileText className="h-3 w-3 sm:h-5 sm:w-5 text-white" />}
    </div>
  );
};
