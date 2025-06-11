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
  order: string;
};

export declare type LinkedVideo = Video & {
  order: string;
};

export declare type LinkedResource = Resource & {
  order: string;
};

export enum MaterialType {
  Resource = "resource",
  Video = "video",
  Quiz = "quiz",
}
export declare type Material = Resource | Video | Quiz;

export interface LessonInput {
  id: string;
  name: string;
  description: string;
  order: number;
  isExisting: boolean;
  videos: Video[];
  resources: Resource[];
  quizzes: Quiz[];
}

export interface ModuleInput {
  id: string;
  title: string;
  description: string;
  lessons: LessonInput[];
  isExisting: boolean;
}

export interface CourseForm {
  title: string;
  description: string;
  level: Level;
  tags: string[];
  isPublish: boolean;
  modules: ModuleInput[];
}

export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type Action =
  | { type: "UPDATE_FIELD"; key: keyof Omit<CourseForm, "modules">; value: any }
  | { type: "ADD_TAG"; tag: string }
  | { type: "REMOVE_TAG"; tag: string }
  | { type: "ADD_MODULE"; module: ModuleInput }
  | { type: "REMOVE_MODULE"; moduleId: string }
  | { type: "UPDATE_MODULE"; moduleId: string; data: Partial<ModuleInput> }
  | { type: "ADD_LESSON"; moduleId: string; lesson: LessonInput }
  | { type: "REMOVE_LESSON"; moduleId: string; lessonId: string }
  | {
      type: "UPDATE_LESSON";
      moduleId: string;
      lessonId: string;
      data: Partial<LessonInput>;
    }
  | { type: "RESET" };

export interface CreateNewCourseDto {
  title: string;
  description?: string;
  level: Level;
  tags?: any[];
  isPublish: boolean;
  modules: CreateModuleDto[];
}

export interface CreateModuleDto {
  id?: string;
  title: string;
  lessons: CreateLessonDto[];
  isExisting?: boolean;
}

export interface CreateQuizDto {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  isExisting?: boolean;
}

export interface CreateLessonDto {
  id?: string;
  name: string;
  description?: string;
  order?: number;
  videoUrl?: string;
  resources?: CreateResourceDto[];
  quizzes?: CreateQuizDto[];
  isExisting?: boolean;
}

export interface CreateResourceDto {
  id?: string;
  title: string;
  description?: string;
  type: "video" | "document" | "link" | "code";
  url?: string;
  content?: string;
  isExisting?: boolean;
}
export interface MaterialLessonLink {
  lesson_id: string;
  material_id: string;
  type: MaterialType;
  order: number;
}
