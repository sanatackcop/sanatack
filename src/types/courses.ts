import { Level } from "@/utils/types/adminTypes";

export interface CourseInterface {
  title: string;
  description: string;
  unitesNum: number;
  level: Level;
  duration: string;
  courseType: string;
}

export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}
