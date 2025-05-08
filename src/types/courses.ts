import { Level } from "@/utils/types/adminTypes";
export type TabType = "all" | "started" | "done";
export interface CourseInterface {
  id: number;
  title: string;
  description: string;
  unitesNum: number;
  level: Level;
  duration: string;
  courseType: string;
  isEnrolled?: boolean;
}
export interface CoursesContext {
  id: string;
  title: string;
  description: string;
  level: Level;
  tags: {
    durtionsHours: number;
  };
  isEnrolled?: boolean;
}
export interface CourseDetails extends CoursesContext {
  modules: ModuleDetailsDto[];
}
export interface tagsInterface {
  unitesNum?: number;
  level?: Level;
  duration?: string;
  courseType?: string;
}
export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}
export interface MaterialDto {
  type: "quiz" | "video" | "resource";
  order?: number;
  quiz?: QuizDto;
  video?: VideoDto;
  resource?: ResourceDto;
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
  materials: MaterialDto[];
}

export interface ResourceDto {
  id: string;
  title?: string;
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
  youtubeId?: string;
  title?: string;
  description?: string;
  duration?: number;
}
