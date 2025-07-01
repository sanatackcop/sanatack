import { ReactNode } from "react";
import { LevelEnum } from "@/types/courses";
import { MaterialType } from "./types/adminTypes";

export type navItem = {
  cta?: string;
  title: string;
  isActive?: boolean;
  icon?: any;
  href: string;
  description?: string;
};

export type FooterItem = {
  icon?: React.ReactNode;
  text: string;
};

export type GenericCardProps = {
  type?: string;
  id?: string;
  title?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  progress?: number;
  link?: string;
};

export type Tab = {
  label: string;
  value: string;
  count?: number;
};
export type GenericTabsProps<T> = {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  data: Record<string, T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

export interface Roadmap {
  id: string;
  description: string;
  title: string;
}
export interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  level: LevelEnum;
  topic: CourseTopic;
  course_info: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  material_count: number;
  projectsCount: number;
  isPublished: boolean;
}

export interface CoursesContext {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  level: LevelEnum;
  topic: CourseTopic;
  course_info: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  material_count: number;
  projectsCount: number;
  isPublished: boolean;
  isEnrolled: boolean;
  enrolledCount: number;
  completionRate: number;
  progress?: number;
  current_material?: string;
}

export interface Module {
  id: string;
  description: string;
  title: string;
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  duration?: string | null;
  description?: string;
  content?: React.ReactNode;
  url?: string | null;
}

export interface ResourceDto {
  title: string;
  description: string;
  url: string;
  content: string;
}

export interface QuizDto {
  question: string;
  options: string[];
  correctAnswer: string;
  order: number;
  explanation?: string | undefined;
}

export interface QuizGroupDto {
  title: string;
  quizzes: QuizDto[];
}

export interface VideoDto {
  youtubeId: string;
  title: string;
  description: string;
  duration: number;
}

export interface LessonDto {
  name: string;
  description: string;
}

export interface ModuleDto {
  title: string;
  description: string;
}

export enum CourseTopic {
  Artificial_Intelligence = "ذكاء اصطناعي",
  MACHINE_LEARNING = "تعلم الآلة",
  BACKEND = "الخلفية",
  FRONTEND = "الواجهة الأمامية",
}

export interface CourseDto {
  title: string;
  description: string;
  level: LevelEnum;
  topic: CourseTopic;
  course_info: {
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  isPublish: boolean;
}
