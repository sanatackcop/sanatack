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
export interface CoursesContext {
  id: string;
  title: string;
  description: string;
  level: LevelEnum;
  course_info: {
    durationHours: number;
    tags: string[];
    new_skills_result: string[];
    learning_outcome: { [key: string]: number };
    prerequisites: string[];
  };
  projectsCount: number;
  isPublished: boolean;
  isEnrolled: boolean;
  enrolledCount: number;
  completionRate: number;
  progress?: number;
  current_material?: string;
}
export interface CourseDetails extends CoursesContext {
  modules: ModuleDetails[];
}

export interface ModuleDetails {
  id: string;
  title: string;
  lessons: LessonDetails[];
}

export declare type Material = Resource | Video | Quiz;

export interface LessonDetails {
  id: string;
  name: string;
  description?: string;
  order: number;
  materials: Material[];
}

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

export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}

export interface CoursesReport {
  completedCourses: number;
  totalHours: number;
  streakDays: number;
  certifications: number;
}
