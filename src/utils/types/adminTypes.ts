import { LevelEnum } from "@/types/courses";

export interface Article {
  id: string;
  title: string;
  description?: string;
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
  order: number;
  type: MaterialType._QUIZ;
}

export interface QuizGroup {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  order: number;
  type: MaterialType.QUIZ_GROUP;
  quizzes: Quiz[];
}

export declare type LinkedVideo = Video & {
  order: number;
};

export enum MaterialType {
  VIDEO = "video",
  ARTICLE = "article",
  QUIZ_GROUP = "quiz_group",
  _QUIZ = "quiz",
  CODE = "code",
}
export declare type Material = Article | Video | QuizGroup;

export interface MaterialLessonLink {
  lesson_id: string;
  material_id: string;
  type: MaterialType;
  order: number;
}

export interface LessonModuleLink {
  lesson_id: string;
  order: number;
}

export interface CourseModuleLink {
  module_id: string;
  order: number;
}

export type ArticleTypes = "hero" | "section" | "conclusion";

export type CodeDto = {
  code: string;
  language: string;
};

export type QuoteDto = {
  text: string;
  author?: string;
};

export type ArticleDto = {
  id?: string;
  type: ArticleTypes;
  title?: string;
  image?: string;
  description?: string;
  body?: string;
  code?: CodeDto;
  quote?: QuoteDto;
  order?: number;
};

export type EditableArticle = {
  id: string;
  duration?: number;
  data: ArticleDto[];
};
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
