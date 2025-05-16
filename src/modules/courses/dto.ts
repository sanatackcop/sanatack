import { IsNotEmpty, IsString } from 'class-validator';

export enum Level {
  'BEGINNER' = 'BEGINNER',
  'INTERMEDIATE' = 'INTERMEDIATE',
  'ADVANCED' = 'ADVANCED',
}

export interface CreateResourceDto {
  id?: string;
  title: string;
  description?: string;
  type: 'video' | 'document' | 'link' | 'code';
  url?: string;
  content?: string;
  isExisting?: boolean;
}

export interface VideoInput {
  url: string;
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
  order: number;
  videos?: VideoInput[];
  resources?: CreateResourceDto[];
  quizzes?: CreateQuizDto[];
  isExisting?: boolean;
}

export interface CreateModuleDto {
  id?: string;
  title: string;
  lessons: CreateLessonDto[];
  isExisting?: boolean;
}

export class CreateNewCourseDto {
  @IsNotEmpty({ message: 'Please Provide A Title' })
  title: string;

  description?: string;
  level: any;
  tags?: { durtionsHours: number };
  isPublish: boolean;
  modules: CreateModuleDto[];
}

export class CoursesContext {
  id: string;
  title: string;
  description: string;
  level: Level;
  tags: {
    durtionsHours: number;
  };
  isPublished?: boolean;
}

export class CourseDetails extends CoursesContext {
  isEnrolled?: boolean;
  modules: ModuleDetailsDto[];
}

export class ModuleDetailsDto {
  id: string;
  title: string;
  lessons: LessonDetailsDto[];
}

export class LessonDetailsDto {
  id: string;
  name: string;
  description?: string;
  order: number;
  resources?: ResourceDto[];
  quizzes?: QuizDto[];
  videos?: VideoDto[];
}

export class ResourceDto {
  id: string;
  title: string;
  description?: string;
  url?: string;
  content?: string;
}

export class QuizDto {
  id: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export class VideoDto {
  id: string;
  youtubeId?: string;
  title?: string;
  description?: string;
  duration?: number;
}

export interface User {
  id: string;
}

export interface RequestType {
  user: User;
}
