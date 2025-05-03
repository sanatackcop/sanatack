export type MaterialType = "video" | "reading" | "quiz";

export interface CourseMaterial {
  id: string;
  title: string;
  type: MaterialType;
  duration?: string | null;
  content?: React.ReactNode;
  url?: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  materials: CourseMaterial[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseLearningPageProps {
  logoSrc?: string;
  modules?: CourseModule[];
  courseId?: string;
  onBack?: () => void;
}

export interface MaterialViewerProps {
  material: CourseMaterial | null;
  onComplete: (material: CourseMaterial) => void;
}
