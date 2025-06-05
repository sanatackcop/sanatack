import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { MaterialType } from './material-mapper';

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
  level: Level;
  tags?: { durtionsHours: number };
  isPublish: boolean;
  modules: CreateModuleDto[];
}

export class CreateRoadmapDto {
  title: string;
  description?: string;
  existingCourseIds?: string[];
  newCourses?: CreateNewCourseDto[];
}

export class CreateCareerPathDto {
  title: string;
  description: string;
  existingRoadmapIds?: string[];
  newRoadmaps?: CreateRoadmapDto[];
}

export class CareerPathContext {
  id: string;
  title: string;
  description?: string;
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
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'نوع المورد مطلوب' })
  @IsLowercase()
  @IsEnum(MaterialType, { message: 'نوع المورد غير صالح' })
  type: MaterialType;

  @IsUrl({}, { message: 'الرابط غير صالح' })
  url?: string;

  @IsString()
  content?: string;
}

export class QuizDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  explanation?: string;

  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true }) // validate that each element is a string
  options: string[];
}

export class VideoDto {
  @IsNotEmpty({ message: 'رابط الفيديو مطلوب' })
  @IsUrl({}, { message: 'رابط YouTube غير صالح' })
  youtubeId: string; // full embed URL expected

  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @IsString({ message: 'العنوان يجب أن يكون نصًا' })
  title: string;

  @IsOptional()
  @IsString({ message: 'الوصف يجب أن يكون نصًا' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'المدة يجب أن تكون رقمًا' })
  @Min(0, { message: 'المدة يجب أن تكون رقمًا موجبًا' })
  duration?: number;
}

export interface User {
  id: string;
}

export interface RequestType {
  user: User;
}

export class RoadmapDetails {
  id: string;
  title: string;
  description?: string;
  courses: CourseDetails[];
  isEnrolled?: boolean;
}

export class CareerPathDetails extends CareerPathContext {
  roadmaps: RoadmapDetails[];
  isEnrolled?: boolean;
}
