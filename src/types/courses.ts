import { Workspace } from "@/lib/types";
import { CoursesContext } from "@/utils/types";
import { MaterialType } from "@/utils/types/adminTypes";

export type TabType = "all" | "started" | "done";

export interface CareerPathInterface {
  id: string;
  title: string;
  description: string;
  roadmaps?: RoadMapInterface[];
  isEnrolled?: boolean;
}

export interface RoadMapInterface {
  id: string;
  title: string;
  description?: string;
  order?: number;
  isEnrolled?: boolean;
  courses: CourseDetails[];
}

export interface CourseDetails extends CoursesContext {
  modules: ModuleDetails[];
}

export interface CourseDetailsContext extends CoursesContext {
  completedMaterials: number;
  modules: ModuleDetailsContext[];
}

export interface ModuleDetails {
  id: string;
  title: string;
  lessons: LessonDetails[];
  order: number;
}

export interface ModuleDetailsContext {
  id: string;
  title: string;
  lessons: LessonDetailsContext[];
  progress: number;
  completedMaterials: number;
  totalMaterials: number;
  order: number;
}

export interface LessonDetails {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: Material[];
}

export interface LessonDetailsContext {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: MaterialContext[];
}

export declare type Material = Article | Video | QuizGroup | CodeMaterial;

export declare type MaterialContext =
  | ArticleContext
  | VideoContext
  | QuizGroupContext
  | CodeMaterialContext;

export interface InfoCardProps {
  type: "info" | "tip" | "warning" | "success" | "error";
  title: string;
  content: string;
}

export interface MaterialData {
  article_id: number;
  type: "hero" | "section" | "conclusion";
  title: string;
  description: string;
  body: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  info?: InfoCardProps;
  image?: string;
  order: number;
}

export interface Article {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  data: MaterialData[];
  duration: number;
  order: number;
  type: MaterialType.ARTICLE;
}

export declare type ArticleContext = Article & {
  isFinished: boolean;
};

export interface Video {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  order: number;
  youtubeId: string;
  duration: number;
  type: MaterialType.VIDEO;
}

export declare type VideoContext = Video & {
  isFinished: boolean;
};

export interface Quiz {
  id: string;
  created_at: string;
  updated_at: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  order: number;
  type: string;
}

export interface QuizGroup {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  order: number;
  quizzes: Quiz[];
  duration: number;
  type: MaterialType.QUIZ_GROUP;
}

export declare type QuizGroupContext = QuizGroup & {
  isFinished: boolean;
  old_result?: number;
};

export enum LevelEnum {
  BEGINNER = "مبتدئ",
  INTERMEDIATE = "متوسط",
  ADVANCED = "متقدم",
}

export const LevelArray = ["مبتدئ", "متوسط", "متقدم"];

export interface CoursesReport {
  completedCourses: number;
  totalHours: number;
  streakDays: number;
  certifications: number;
}

export interface PatchCourseProgressParams {
  userId: string;
  courseId: string;
  materialId: string;
  material: {
    type: MaterialType;
    quizGroup_id?: string;
    result?: number;
  };
}

export interface CodeMaterial {
  id: string;
  created_at: string;
  updated_at: string;
  order: number;
  duration: number;
  isCurrent: boolean;
  locked: boolean;
  type: MaterialType.CODE;
  title: string;
  initialCode: string;
  data: {
    id: number | string;
  };
}

export interface CodeMaterialContext {
  id: string;
  created_at: string;
  updated_at: string;
  order: number;
  duration: number;
  isCurrent: boolean;
  locked: boolean;
  type: MaterialType.CODE;
  title: string;
  initialCode: string;
  isFinished: boolean;
  data: {
    id: number | string;
  };
}

export interface CodeExecutionResponse {
  output: string;
  error?: string;
  executionTime: number;
  success: boolean;
}

export interface CodeCheckResponse {
  passed: number;
  total: number;
  results: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    success: boolean;
    error?: string;
  }[];
}

export type SpaceMember = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  displayName: string;
  initials: string;
};

export type Space = {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  created_at: string;
  updated_at: string;
  deletedAt?: Date | null;
  coverImageUrl?: string | null;
  icon?: string | null;
  members?: SpaceMember[];
  memberCount?: number;
  workspaceCount?: number;
  lastActivity?: string | null;
  workspaces: Workspace[];
};
