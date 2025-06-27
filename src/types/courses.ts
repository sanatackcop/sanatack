import { ArticleDto, Level } from "@/utils/types/adminTypes";

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

export declare type Material = Article | Video | QuizGroup;

export interface LessonDetails {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: Material[];
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  duration: number;
  type: MaterialType.ARTICLE;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  description: string;
  type: MaterialType.VIDEO;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  duration: number;
  type: MaterialType.QUIZ;
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
