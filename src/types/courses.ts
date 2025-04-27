import { Level } from "@/utils/types/adminTypes";

export interface CourseInterface {
  title: string;
  description: string;
  unitesNum: number;
  level: Level;
  duration: string;
  courseType: string;
}

export interface CoursesContext {
  id: number;
  title: string;
  description: string;
  level: Level;
  tags: {
    durtionsHours: number;
  };
}

export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}

export interface CourseDetails extends CoursesContext {
  modules: ModuleDetailsDto[];
}

export interface ModuleDetailsDto {
  id: string;
  title: string;
  lessons: LessonDetailsDto[];
}

export interface LessonDetailsDto {
  id: string;
  name: string;
  description?: string;
  order: number;
  resources?: ResourceDto[];
  quizzes?: QuizDto[];
  videos?: VideoDto[];
}

export interface ResourceDto {
  id: string;
  title: string;
  description?: string;
  url?: string;
  content?: string;
}

export interface QuizDto {
  id: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export interface VideoDto {
  id: string;
  url?: string;
  title?: string;
  description?: string;
  duration?: number;
}
