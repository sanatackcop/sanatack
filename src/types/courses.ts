import { Level } from "@/utils/types/adminTypes";

export interface CourseInterface {
  englishTitle: string;
  arabicTitle: string;
  description: string;
  unitesNum: number;
  level: Level;
  durition: string;
  courseType: string;
}

export enum LevelEnum {
  'BEGINNER' = 'BEGINNER',
  'INTERMEDIATE' = 'INTERMEDIATE',
  'ADVANCED' = 'ADVANCED',
}