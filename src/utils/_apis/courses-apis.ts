/* eslint-disable no-unused-vars */
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import {
  CareerPathInterface,
  CourseDetails,
  CoursesContext,
  RoadMapInterface,
} from "@/types/courses";

export const getCareerPathApi = async (): Promise<CareerPathInterface[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "/courses/list/careerpath",
        withCredentials: false,
      }) as Promise<{ data: CareerPathInterface[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCareerPathApi error:", e);
    throw e;
  }
};

export const getSingleCareerPathApi = async ({
  careerPathId,
}: {
  careerPathId: string;
}): Promise<CareerPathInterface> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `/courses/careerpath/${careerPathId}`,
        withCredentials: false,
      }) as Promise<{ data: CareerPathInterface }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getSingleCareerPathApi error:", e);
    throw e;
  }
};
export const getRoadMapApi = async (): Promise<RoadMapInterface[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "/courses/list/roadmap",
        withCredentials: false,
      }) as Promise<{ data: RoadMapInterface[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getRoadMapApi error:", e);
    throw e;
  }
};
export const getSingleRoadMapApi = async ({
  RoadMapId,
}: {
  RoadMapId: string;
}): Promise<RoadMapInterface> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `/courses/roadmap/${RoadMapId}`,
        withCredentials: false,
      }) as Promise<{ data: RoadMapInterface }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getSingleRoadMapApi error:", e);
    throw e;
  }
};

export const getAllCoursesApi = async (): Promise<CoursesContext[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "admin/courses",
        withCredentials: false,
      }) as Promise<{ data: CoursesContext[] }>
    );
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
}): Promise<CourseDetails> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `courses/${courseId}`,
        withCredentials: false,
      }) as Promise<{ data: CourseDetails }>
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
export const enrollRoadMapApi = async ({
  RoadMapId,
}: {
  RoadMapId: string;
}) => {
  try {
    const response = await Api({
      method: "post",
      url: `courses/enroll/roadmap/${RoadMapId}`,
      withCredentials: false,
    });

    return response;
  } catch (e: any) {
    console.error("enrollRoadMapApi error:", e.message);
    throw e;
  }
};

export const enrollCareerPathApi = async ({
  careerPathId,
}: {
  careerPathId: string;
}) => {
  try {
    const response = await Api({
      method: "post",
      url: `courses/enroll/careerpath/${careerPathId}`,
      withCredentials: false,
    });

    return response;
  } catch (e: any) {
    console.error("enrollCareerPathApi error:", e.message);
    throw e;
  }
};

interface UpdateCourseProgressArgs {
  courseId: string;
  progress: number;
}

interface GetCourseProgressArgs {
  courseId: string;
}

export const updateCourseProgressApi = async ({
  courseId,
  progress,
}: UpdateCourseProgressArgs) => {
  try {
    const { data } = await Api({
      method: "patch",
      url: `courses/progress/${courseId}`,
      data: { progress },
      withCredentials: false,
    });

    return data;
  } catch (e: any) {
    console.error("updateCourseProgressApi error:", e.message);
    throw e;
  }
};

export const getCourseProgressApi = async ({
  courseId,
}: GetCourseProgressArgs) => {
  try {
    const { data } = await Api({
      method: "get",
      url: `courses/progress/${courseId}`,
      withCredentials: false,
    });

    return data;
  } catch (e: any) {
    console.error("getCourseProgressApi error:", e.message);
    throw e;
  }
};

export const getCurrentCoursesApi = async (): Promise<CoursesContext[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "courses/current",
        withCredentials: false,
      }) as Promise<{ data: CoursesContext[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const getCoursesContentApi = async ({ id }: CourseDetails) => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `courses/${id}`,
        withCredentials: false,
      }) as Promise<{ data: CourseDetails[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getCourseContentApi error:", e);
    throw e;
  }
};
