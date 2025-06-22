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
