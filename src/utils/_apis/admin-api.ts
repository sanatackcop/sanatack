import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { CreateNewCourseDto } from "../types/adminTypes";

export const getListCoursesApi = async ({}) => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "admin/courses",
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("login error", { e });
    throw e;
  }
};

export const createNewCourseApi = async ({
  title,
  description,
  level,
  tags,
  isPublish,
  modules,
}: CreateNewCourseDto) => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "admin/courses/new-course",
        data: {
          title,
          description,
          level,
          tags,
          isPublish,
          modules,
        },
        headers: {
          "Keep-Alive": "timeout=30, max=1000",
        },
      })
    );
    return response.data;
  } catch (e: any) {
    console.error("Course creation failed:", {
      error: e?.error || e,
      config: e?.config,
    });
    throw e;
  }
};
