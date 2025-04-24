import {
  Triangle,
  Signal,
  Mountain,
  Code2,
  Brain,
  Database,
} from "lucide-react";
import { LevelEnum } from "@/types/courses";

// Displaying Course level icon
const levelIcons: Record<LevelEnum, JSX.Element> = {
  [LevelEnum.BEGINNER]: <Triangle className="h-3 w-3 text-yellow-500" />,
  [LevelEnum.INTERMEDIATE]: <Signal className="h-3 w-3 text-yellow-500" />,
  [LevelEnum.ADVANCED]: <Mountain className="h-3 w-3 text-yellow-500" />,
};

export const getLevelIcon = (level: LevelEnum) => {
  return levelIcons[level] || null;
};

// Displaying Course Type Icon
const courseTypeIcons: Record<string, JSX.Element> = {
  frontend: <Code2 className="h-4 w-4 text-blue-500" />,
  backend: <Database className="h-4 w-4 text-blue-500" />,
  ai: <Brain className="h-4 w-4 text-blue-500" />,
};

export const getCourseTypeIcon = (type: string) => {
  return (
    courseTypeIcons[type.toLowerCase()] || (
      <Code2 className="h-4 w-4 text-blue-400" />
    )
  );
};
