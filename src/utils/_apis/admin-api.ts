import {
  LessonDto,
  ModuleDto,
  QuizDto,
  ResourceDto,
  VideoDto,
} from "./../../types/courses";
import { LessonModuleLink, MaterialLessonLink } from "../types/adminTypes";
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

export const getQuizList = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/quizzes",
    })
  );
  return response.data as T;
};

export const createNewQuiz = async (quiz: QuizDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/quizzes",
      data: quiz,
    })
  );
  return response.data;
};

export const getVideosList = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/videos",
    })
  );
  return response.data as T;
};

export const createNewVideo = async (quiz: VideoDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/videos",
      data: quiz,
    })
  );
  return response.data;
};

export const getResourcesList = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/resources",
    })
  );
  return response.data as T;
};

export const createNewResource = async (quiz: ResourceDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/resources",
      data: quiz,
    })
  );
  return response.data;
};

export const createNewLesson = async (lesson: LessonDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/lessons",
      data: lesson,
    })
  );
  return response.data;
};

export const fetchAllLesson = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/lessons",
    })
  );
  return response.data as T;
};

export const linkLessonMaterial = async (link: MaterialLessonLink) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/mapper/material",
      data: link,
    })
  );
  return response.data;
};

export const getLinkedLessonMaterials = async <T>(lesson_id: string) => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: `admin/mapper/${lesson_id}/materials`,
    })
  );
  return response.data as T;
};

export const fetchAllModules = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/modules",
    })
  );
  return response.data as T;
};

export const createNewModule = async (module: ModuleDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/modules",
      data: module,
    })
  );
  return response.data;
};

export const linkModuleLesson = async (
  link: LessonModuleLink,
  module_id: string
) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: `admin/mapper/${module_id}/lesson`,
      data: link,
    })
  );
  return response.data;
};

export const getLinkedLessonsModules = async <T>(module_id: string) => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: `admin/mapper/${module_id}/lessons`,
    })
  );
  return response.data as T;
};
