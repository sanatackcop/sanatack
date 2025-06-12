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
    unitesNum?: number;
    courseType?: string;
  };
  isEnrolled?: boolean;
}
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
  modules: ModuleDetailsDto[];
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
  title: string;
  description: string;
  url: string;
  content: string;
}

export interface QuizDto {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
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

export interface tagsInterface {
  unitesNum?: number;
  level?: Level;
  duration?: number;
  courseType?: string;
  className?: string;
}
export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}
