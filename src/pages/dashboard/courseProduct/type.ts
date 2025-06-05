import { Module, Material } from "@/utils/types";

export interface CourseLearningPageProps {
  logoSrc?: string;
  modules?: Module[];
  courseId?: string;
  onBack?: () => void;
}

export interface MaterialViewerProps {
  material: Material | null;
  onComplete: (material: Material) => void;
}

export enum PlaygroundType {
  courses = `courses`,
  roadMap = `roadMap`,
  careerPath = `careerPath`,
}
