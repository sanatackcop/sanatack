/* eslint-disable no-unused-vars */
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import {
  CareerPathInterface,
  CourseDetails,
  CoursesReport,
  RoadMapInterface,
  PatchCourseProgressParams,
  CodeExecutionResponse,
  CodeCheckResponse,
  Space,
} from "@/types/courses"; /*  */
import { CoursesContext } from "../types";

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
        url: "/courses/list/",
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
  course_id,
}: {
  course_id: string;
}): Promise<CourseDetails> => {
  try {
    const response = await trackPromise(
      Api<CourseDetails>({
        method: "get",
        url: `courses/${course_id}`,
        withCredentials: false,
      })
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

export const getCourseReportApi = async (): Promise<CoursesReport> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "courses/report",
        withCredentials: false,
      }) as Promise<{ data: CoursesReport }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getCourseReportApi error:", e);
    throw e;
  }
};

export const patchCourseProgressApi = async (
  params: PatchCourseProgressParams
): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `courses/progress/${params.courseId}/${params.materialId}`,
        params: {
          userId: params.userId,
          courseId: params.courseId,
          materialId: params.materialId,
        },
        data: params.material,
        withCredentials: false,
      }) as Promise<{ data: any }>
    );

    return response.data;
  } catch (e: any) {
    console.error("patchCourseProgressApi error:", e);
    throw e;
  }
};

export const codeExecutionApi = async (data: {
  code: string;
  language: string;
  stdin: string;
}): Promise<CodeExecutionResponse> => {
  try {
    const response = await Api<CodeExecutionResponse>({
      method: "post",
      url: `courses/code/run`,
      withCredentials: false,
      data: {
        code: data.code,
        language: data.language,
        stdin: data.stdin || "",
      },
    });

    return response.data;
  } catch (e: any) {
    console.error("codeExecutionApi error:", e.message);
    throw e;
  }
};

export const codeCheckApi = async (data: {
  code: string;
  language: string;
  lessonId: string;
}): Promise<CodeCheckResponse> => {
  try {
    const response = await Api<CodeCheckResponse>({
      method: "post",
      url: `courses/code/check`,
      withCredentials: false,
      data,
    });

    return response.data;
  } catch (e: any) {
    console.error("codeCheckApi error:", e.message);
    throw e;
  }
};

export const aiCourseGenerator = async (
  payload: any
): Promise<CodeCheckResponse> => {
  try {
    const response = await Api<CodeCheckResponse>({
      method: "post",
      url: `courses/aicourses`,
      withCredentials: false,
      data: payload,
    });

    return response.data;
  } catch (e: any) {
    console.error("codeCheckApi error:", e.message);
    throw e;
  }
};

export const getAllSpacesApi = async (): Promise<{ data: Space[] }> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "spaces/",
      }) as Promise<{ data: Space[] }>
    );
    return response.data as any;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const createSpacesApi = async ({
  name,
}: {
  name: string;
}): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "post",
        url: "spaces/",
        data: {
          name,
        },
        withCredentials: false,
      }) as Promise<{ data: Space[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const deleteSpacesApi = async (id: string): Promise<Space[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `spaces/${id}`,
        withCredentials: false,
      }) as Promise<{ data: Space[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const getSingleSpaceApi = async (id: string): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `spaces/${id}`,
        withCredentials: false,
      }) as Promise<{ data: any }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const updateSpaceApi = async (id: string, dto: any): Promise<any> => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `spaces/${id}`,
        data: dto,
        withCredentials: false,
      }) as Promise<{ data: Space[] }>
    );
    return response.data;
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const getAllSpaces = async (): Promise<Space[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: "spaces",
      })
    );
    return (response.data as any)?.data as Space[];
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const linkWorkspaceToSpace = async (
  space_id: string,
  workspace_id: string
): Promise<Space[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "put",
        url: `study-ai/workspaces/${workspace_id}`,
        data: {
          space: { id: space_id },
        },
      })
    );
    return (response.data as any)?.data as Space[];
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const unlinkWorkspaceFromSpace = async (
  workspace_id: string
): Promise<Space[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "put",
        url: `study-ai/workspaces/${workspace_id}`,
        data: {
          space: { id: null },
        },
      })
    );
    return (response.data as any)?.data as Space[];
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};

export const deleteWorkspace = async (
  workspace_id: string
): Promise<Space[]> => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `study-ai/workspaces/${workspace_id}`,
      })
    );
    return (response.data as any)?.data as Space[];
  } catch (e: any) {
    console.error("getAllCoursesApi error:", e);
    throw e;
  }
};
