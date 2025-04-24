import { Level } from "@/utils/types/adminTypes";

export interface CourseInterface {
  id: number;
  title: string;
  description: string;
  level: Level;
  tags: {
    durtionsHours: number;
  };
}

export enum LevelEnum {
  "BEGINNER" = "BEGINNER",
  "INTERMEDIATE" = "INTERMEDIATE",
  "ADVANCED" = "ADVANCED",
}
