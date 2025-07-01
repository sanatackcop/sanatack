import { ArticleDto, Level } from "@/utils/types/adminTypes";

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
export interface CoursesContext {
  id: string;
  title: string;
  description: string;
  level: LevelEnum;
  course_info: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  projectsCount: number;
  isPublished: boolean;
  isEnrolled: boolean;
  enrolledCount: number;
  completionRate: number;
  progress?: number;
  current_material?: string;
}
export interface CourseDetails extends CoursesContext {
  modules: ModuleDetails[];
}

export interface ModuleDetails {
  id: string;
  title: string;
  lessons: LessonDetails[];
}

export interface LessonDetails {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: Material[];
}
export type MaterialType =
  | "article"
  | "code"
  | "video"
  | "quiz"
  | "resource"
  | "link";

interface BaseMaterial {
  id: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
  duration?: number;
  completed?: boolean;
  type: MaterialType;
  isCurrent?: boolean;
  locked?: boolean;
}

export type Material =
  | ArticleMaterial
  | VideoMaterial
  | QuizMaterial
  | ResourceMaterial
  | LinkMaterial;

interface InfoCardProps {
  type: "info" | "tip" | "warning" | "success" | "error";
  title?: string;
  content: string;
}
export interface ArticleMaterial extends BaseMaterial {
  type: "article";
  data: {
    id: number;
    type: string;
    title: string;
    description: string;
    body: string;
    code?: { code: string; language: string };
    quote?: { text: string; author?: string };
    info?: InfoCardProps;
    image?: string;
  };
}

export interface VideoMaterial extends BaseMaterial {
  type: "video";
  data: {
    id: number | string;
    title?: string;
    youtubeId?: string;
    duration?: number;
    description?: string;
  };
}

export interface QuizMaterial extends BaseMaterial {
  type: "quiz";
  data: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
}

export interface ResourceMaterial extends BaseMaterial {
  type: "resource";
  data: {
    title: string;
    description?: string;
  };
}

export interface LinkMaterial extends BaseMaterial {
  type: "link";
  data: {
    url: string;
    title?: string;
    description?: string;
  };
}

export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}

export interface CoursesReport {
  completedCourses: number;
  totalHours: number;
  streakDays: number;
  certifications: number;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  level?: Level;
  course_info?: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  isPublished?: boolean;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;
}

export interface UpdateLessonDto {
  name?: string;
  description?: string;
}

export interface UpdateArticleDto {
  data?: ArticleDto[];
  duration?: number;
}

export interface UpdateQuizDto {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  duration?: number;
}

export interface UpdateResourceDto {
  title?: string;
  description?: string;
  url?: string;
  content?: string;
  duration?: number;
}

export interface UpdateVideoDto {
  title?: string;
  youtubeId?: string;
  description?: string;
  duration?: number;
}

export interface PatchCourseProgressParams {
  userId: string;
  courseId: string;
  materialId: string;
}
