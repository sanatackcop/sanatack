import { CoursesContext } from "@/utils/types";
import { ArticleDto, MaterialType, QuizGroup } from "@/utils/types/adminTypes";
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
  totalMaterials: number;
  modules: ModuleDetailsContext[];
}

export interface ModuleDetails {
  id: string;
  title: string;
  lessons: LessonDetails[];
}

export interface ModuleDetailsContext {
  id: string;
  title: string;
  lessons: LessonDetailsContext[];
  progress: number;
  completedMaterials: number;
  totalMaterials: number;
}

export declare type MaterialContext =
  | ArticleContext
  | VideoContext
  | QuizGroupContext
  | CodeMaterial;

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

export interface InfoCardProps {
  title?: string;
  content: string;
  type: "info" | "tip" | "warning" | "success" | "error";
}

export interface MaterialData {
  id: number;
  type: string;
  title: string;
  description: string;
  body: string;
  code?: { code: string; language: string };
  quote?: { text: string; author?: string };
  info?: InfoCardProps;
  image?: string;
}
// export interface Article {
//   id: string;
//   created_at: string;
//   updated_at: string;
//   title: string;
//   data: {
//     [key: string]: MaterialData;
//   };
//   description: string;
//   order: number;
//   duration: number;
//   type: MaterialType.ARTICLE;
// }

export declare type ArticleContext = Article & {
  isFinished: boolean;
};

export declare type VideoContext = Video & {
  isFinished: boolean;
};

export declare type BaseMaterial = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  order: number;
  duration: number;
  completed: boolean;
  type: MaterialType;
  isCurrent: boolean;
  locked: boolean;
};

export type Material = Article | Video | QuizMaterial | CodeMaterial;

export interface InfoCardProps {
  type: "info" | "tip" | "warning" | "success" | "error";
  title?: string;
  content: string;
}

export interface Article extends BaseMaterial {
  type: MaterialType.ARTICLE;
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    data: {
      [key: string]: MaterialData;
    };
    description: string;
    order: number;
    duration: number;
  };
}

export interface Video extends BaseMaterial {
  type: MaterialType.VIDEO;
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    youtubeId: string;
    duration: number;
    description: string;
    order: number;
  };
}
export interface CodeMaterial extends BaseMaterial {
  type: MaterialType.CODE;
  title: string;
  data: {
    id: number | string;
  };
}

export interface QuizMaterial extends BaseMaterial {
  type: MaterialType.QUIZ_GROUP;
  quizzes: Quiz[];
  data?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
}
export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  duration: number;
  order: number;
}

// export interface LinkMaterial extends BaseMaterial {
//   type: "link";
//   data: {
//     url: string;
//     title?: string;
//     description?: string;
//   };
// }

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

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  level?: LevelEnum;
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
  material: {
    type: MaterialType;
    quizGroup_id?: string;
    result?: number;
  };
}
