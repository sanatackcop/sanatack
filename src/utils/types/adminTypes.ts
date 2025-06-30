export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: "resource";
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  description: string;
  type: "video";
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  duration: number;
  type: "quiz";
}

export declare type LinkedQuiz = Quiz & {
  order: number;
};

export declare type LinkedVideo = Video & {
  order: number;
};

export enum MaterialType {
  Resource = "resource",
  Video = "video",
  ARTICLE = "article",
  Quiz = "quiz",
  CODE = "code",
}
export declare type Material = Resource | Video | Quiz;

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
