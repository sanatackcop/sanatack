import Api from "./api";
import { LearningHabitProgress } from "@/types/dashboard";
import { CoursesReport } from "@/types/courses";

export const getLearningHabitsApi = async (): Promise<LearningHabitProgress> => {
  try {
    const response = await Api<LearningHabitProgress>({
      method: "get",
      url: "/dashboard/learning-habits",
      withCredentials: false,
    });

    return response.data;
  } catch (error) {
    console.error("getLearningHabitsApi error:", error);
    throw error;
  }
};

export const getStreakReportApi = async (): Promise<CoursesReport> => {
  try {
    const response = await Api<CoursesReport>({
      method: "get",
      url: "/dashboard/streak-report",
      withCredentials: false,
    });

    return response.data;
  } catch (error) {
    console.error("getStreakReportApi error:", error);
    throw error;
  }
};
