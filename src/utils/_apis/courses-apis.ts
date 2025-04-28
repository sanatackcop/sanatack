/* eslint-disable no-unused-vars */
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { CourseInterface } from "@/types/courses";

export const getAllCoursesApi = async (): Promise<CourseInterface[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "admin/courses",
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

export const getSingleCoursesApi = async ({
  courseId,
}: {
  courseId: string;
}): Promise<CourseInterface> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `courses/${courseId}`,
        withCredentials: false,
      }) as Promise<{ data: CourseInterface }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const enrollCoursesApi = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}): Promise<CourseInterface> => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: `courses/enroll/${courseId}`,
        withCredentials: false,
        params: {
          user_id: userId,
        },
      }) as Promise<{ data: CourseInterface }>
    );
    return response.data;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e);
    throw e;
  }
};
