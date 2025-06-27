import {
  CourseDto,
  Lesson,
  LessonDto,
  Module,
  ModuleDto,
  QuizGroupDto,
  ResourceDto,
  VideoDto,
} from "../types";
import {
  CourseModuleLink,
  EditableArticle,
  LessonModuleLink,
  MaterialLessonLink,
  Quiz,
  Video,
} from "../types/adminTypes";
import { trackPromise } from "react-promise-tracker";
import Api from "./api";
import { ArticleCardDto } from "@/admin/components/article.create";
import {
  UpdateArticleDto,
  UpdateCourseDto,
  UpdateLessonDto,
  UpdateModuleDto,
  UpdateQuizDto,
  UpdateResourceDto,
  UpdateVideoDto,
} from "@/types/courses";

export const getAllRoadmaps = async <T>({}) => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/roadmaps",
    })
  );
  return response.data as T;
};

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

export const getQuizList = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/quizzes",
    })
  );
  return response.data as T;
};

export const createNewQuiz = async (quiz: QuizGroupDto) => {
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

export const getArticlesList = async <T>() => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: "admin/articles",
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

export const createNewArticleApi = async (article: ArticleCardDto[]) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/article",
      data: article,
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

export const getSingleModule = async ({
  module_id,
}: {
  module_id: string;
}): Promise<Module> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `admin/modules/${module_id}`,
      }) as Promise<{ data: Module }>
    );
    return response.data;
  } catch (e) {
    console.error("getSingleModule error:", e);
    throw e;
  }
};

export const getSingleLesson = async ({
  lesson_id,
}: {
  lesson_id: string;
}): Promise<Lesson> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `admin/lessons/${lesson_id}`,
      }) as Promise<{ data: Lesson }>
    );
    return response.data;
  } catch (e) {
    console.error("getSingleLesson error:", e);
    throw e;
  }
};

export const getSingleQuiz = async ({
  quiz_id,
}: {
  quiz_id: string;
}): Promise<Quiz> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `admin/quizzes/${quiz_id}`,
      }) as Promise<{ data: Quiz }>
    );
    return response.data;
  } catch (e) {
    console.error("getSingleQuiz error:", e);
    throw e;
  }
};

export const getSingleVideo = async ({
  video_id,
}: {
  video_id: string;
}): Promise<Video> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `admin/videos/${video_id}`,
      }) as Promise<{ data: Video }>
    );
    return response.data;
  } catch (e) {
    console.error("getSingleVideo error:", e);
    throw e;
  }
};

export const getSingleArticle = async ({
  article_id,
}: {
  article_id: string;
}): Promise<EditableArticle> => {
  try {
    const response = await trackPromise(
      Api({
        method: "get",
        url: `admin/articles/${article_id}`,
      }) as Promise<{ data: EditableArticle }>
    );
    return response.data;
  } catch (e) {
    console.error("getSingleArticle error:", e);
    throw e;
  }
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

export const createNewCourse = async (course: CourseDto) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: "admin/courses/new-course",
      data: course,
    })
  );
  return response.data;
};

export const getLinkedModulesCourses = async <T>(course_id: string) => {
  const response = await trackPromise(
    Api({
      method: "get",
      url: `admin/mapper/${course_id}/modules`,
    })
  );
  return response.data as T;
};

export const linkModuleToCourse = async (
  link: CourseModuleLink,
  course_id: string
) => {
  const response = await trackPromise(
    Api({
      method: "post",
      url: `admin/mapper/${course_id}/modules`,
      data: link,
    })
  );
  return response.data;
};

export const deleteCourse = async (course_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/courses/${course_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting course", { e });
    throw e;
  }
};

export const deleteLesson = async (lesson_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/lessons/${lesson_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting lesson", { e });
    throw e;
  }
};

export const deleteQuiz = async (quiz_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/quizzes/${quiz_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting quiz", { e });
    throw e;
  }
};

export const deleteArticle = async (article_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/articles/${article_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting article", { e });
    throw e;
  }
};

export const deleteVideo = async (video_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/videos/${video_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting video", { e });
    throw e;
  }
};

export const deleteModule = async (module_id: string) => {
  try {
    const response = await trackPromise(
      Api({
        method: "delete",
        url: `admin/modules/${module_id}`,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while deleting module", { e });
    throw e;
  }
};

export const updateCourse = async (
  course_id: string,
  data: UpdateCourseDto
) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/courses/${course_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating course", { e });
    throw e;
  }
};

export const updateModule = async (
  module_id: string,
  data: UpdateModuleDto
) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/modules/${module_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating module", { e });
    throw e;
  }
};

export const updateLesson = async (
  lesson_id: string,
  data: UpdateLessonDto
) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/lessons/${lesson_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating lesson", { e });
    throw e;
  }
};

export const updateArticle = async (
  article_id: string,
  data: UpdateArticleDto
) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/articles/${article_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating article", { e });
    throw e;
  }
};

export const updateQuiz = async (quiz_id: string, data: UpdateQuizDto) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/quizzes/${quiz_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating quiz", { e });
    throw e;
  }
};

export const updateResource = async (
  resource_id: string,
  data: UpdateResourceDto
) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/resources/${resource_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating resource", { e });
    throw e;
  }
};

export const updateVideo = async (video_id: string, data: UpdateVideoDto) => {
  try {
    const response = await trackPromise(
      Api({
        method: "patch",
        url: `admin/videos/${video_id}`,
        data,
      })
    );
    return response.data;
  } catch (e: any) {
    console.log("error while updating video", { e });
    throw e;
  }
};
