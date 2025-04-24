/* eslint-disable no-unused-vars */
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { CourseInterface } from "@/types/courses";

export const getAllCoursesApi = async (): Promise<CourseInterface[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "courses/list",
        withCredentials: false,
      }) as Promise<{ data: CourseInterface[] }>
    );
    console.log(response.data);
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};
