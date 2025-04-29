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

export const enrollCoursesApi = async ({ courseId }: { courseId: string }) => {
  try {
    const response = await Api({
      method: "post",
      url: `courses/enroll/${courseId}`,
      withCredentials: false,
    });

    return response;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};
