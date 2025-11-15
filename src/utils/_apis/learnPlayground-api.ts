import { FlashcardDeck } from "@/lib/flashcards/types";
import { WorkspaceContext, WorkspaceContextInput } from "@/lib/types";
import Api, { API_METHODS, baseURL } from "./api";

export type DocumentStatus = "pending" | "uploading" | "uploaded" | "failed";
export type GenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface GenerationJobResponse {
  jobId: string;
  type: "quiz" | "flashcards" | "summary" | "explanation";
  status: GenerationStatus;
  message: string;
  workspaceId?: string;
}

export interface QuizStatusResponse {
  id: string;
  status: GenerationStatus;
  failureReason: string | null;
  payload: any | null;
  workspaceId: string | null;
  videoId: string | null;
  createdAt: string;
}

export interface FlashcardDeckStatusResponse {
  id: string;
  status: GenerationStatus;
  failureReason: string | null;
  payload: any | null;
  createdAt: string;
  updatedAt?: string;
}

export interface SummaryStatusResponse {
  id: string;
  status: GenerationStatus;
  failureReason: string | null;
  payload: any | null;
  workspaceId: string | null;
  videoId: string | null;
  videoMaterialId: string | null;
  documentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExplanationStatusResponse extends SummaryStatusResponse {}

export interface DocumentUploadResponse {
  documentId: string;
  status: DocumentStatus;
  message: string;
}

export interface DocumentResponse {
  id: string;
  fileName: string;
  sizeInBytes: number | null;
  status: DocumentStatus;
  url: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export const youtubeUrlPastApi = async ({ url }: { url: string }) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/transcript`,
      data: {
        youtubeUrl: url,
      },
      withCredentials: false,
    });

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const createNewWorkSpace = async ({
  workspaceName,
  youtubeVideoId,
  documentId,
}: {
  youtubeVideoId?: string;
  documentId?: string;
  workspaceName: string;
}) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/workspaces`,
      data: {
        workspaceName,
        documentId,
        youtubeVideoId,
      },
    });

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const createNewQuizApi = async ({
  id,
  language = "en",
  question_types,
  count,
  difficulty,
  focus,
}: {
  id: string;
  language?: "en" | "ar";
  question_types?: string[];
  count?: number;
  difficulty?: string;
  focus: string | null;
}): Promise<GenerationJobResponse> => {
  try {
    const response = await Api<GenerationJobResponse>({
      method: API_METHODS.POST,
      url: `study-ai/workspaces/${id}/generate/quiz`,
      data: {
        language,
        question_types,
        count,
        difficulty,
        ...(focus ? { focus } : {}),
      },
    });

    return response.data;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const createNewDeepExplanationApi = async ({
  id,
  language,
}: {
  id: string;
  language: "en" | "ar";
}): Promise<GenerationJobResponse> => {
  try {
    const response = await Api<GenerationJobResponse>({
      method: API_METHODS.POST,
      url: `study-ai/workspaces/${id}/generate/explanation`,
      data: {
        language,
      },
    });

    return response.data;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const uploadDocumentApi = async ({
  file,
}: {
  file: File;
}): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await Api<DocumentUploadResponse>({
      method: API_METHODS.POST,
      url: `study-ai/documents/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e: any) {
    console.error("uploadDocumentApi error:", e.message);
    throw e;
  }
};

export const getDocumentApi = async (id: string): Promise<DocumentResponse> => {
  try {
    const response = await Api<DocumentResponse>({
      method: API_METHODS.GET,
      url: `study-ai/documents/${id}`,
    });

    return response.data;
  } catch (e: any) {
    console.error("getDocumentApi error:", e.message);
    throw e;
  }
};

export interface RunCodeRequest {
  code: string;
  language: string;
  stdin?: string;
}

export interface RunCodeResponse {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
  memoryUsage: number | null;
  status: string;
}

export const runWorkspaceCode = async (
  payload: RunCodeRequest
): Promise<RunCodeResponse> => {
  try {
    const response = await Api<RunCodeResponse>({
      method: API_METHODS.POST,
      url: `study-ai/code/run`,
      data: payload,
    });

    return response.data;
  } catch (e: any) {
    console.error("runWorkspaceCode error:", e.message ?? e);
    throw e;
  }
};

export const createNewSummaryApi = async ({
  id,
  language,
}: {
  id: string;
  language: "ar" | "en";
}): Promise<GenerationJobResponse> => {
  try {
    const response = await Api<GenerationJobResponse>({
      method: API_METHODS.POST,
      url: `study-ai/workspaces/${id}/generate/summary`,
      data: {
        language,
      },
    });

    return response.data;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const getWorkSpace = async (id: string) => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces/${id}`,
    });

    return response.data as any;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const getAllWorkSpace = async ({ spaceId }: { spaceId?: string }) => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces`,
      params: {
        space_id: spaceId,
      },
    });

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const sendChatMessage = async () => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces`,
    });

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

import Storage from "@/lib/Storage";

const getAuth = (): any => Storage.get("auth");

export const sendWorkspaceChatMessage = async (
  workspaceId: string,
  message: string,
  language: "en" | "ar" = "en",
  options: {
    model?: string;
    contexts?: WorkspaceContextInput[];
    autoContext?: boolean;
    attachments?: File[];
  } = {},
  onChunk?: (chunk: any) => void
): Promise<void> => {
  try {
    const auth: any = await getAuth();

    const formData = new FormData();
    formData.append("message", message);
    formData.append("language", language);
    formData.append("autoContext", options.autoContext ? "true" : "false");

    if (options.model) {
      formData.append("model", options.model);
    }

    if (options.contexts && options.contexts.length > 0) {
      formData.append("contexts", JSON.stringify(options.contexts));
    }

    if (options.attachments && options.attachments.length > 0) {
      options.attachments.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await fetch(
      `${baseURL}/study-ai/workspaces/${workspaceId}/chat`,
      {
        method: "POST",
        headers: {
          user_id: auth.user.id,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No readable stream");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (onChunk) {
              onChunk(data);
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("sendWorkspaceChatMessage error:", error);
    throw error;
  }
};

export const getWorkSpaceChatHistory = async (id: string) => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces/${id}/chat/history`,
    });

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const getWorkspaceContexts = async (
  workspaceId: string
): Promise<WorkspaceContext[]> => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces/${workspaceId}/contexts`,
    });

    const data = response.data as { contexts?: WorkspaceContext[] };
    return (data.contexts ?? []) as WorkspaceContext[];
  } catch (e: any) {
    console.error("getWorkspaceContexts error:", e.message);
    throw e;
  }
};

export const generateWorkspaceAutoContext = async (
  workspaceId: string,
  force?: boolean
): Promise<WorkspaceContext[]> => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/workspaces/${workspaceId}/contexts/auto`,
      data: {
        force: !!force,
      },
    });

    const data = response.data as { contexts?: WorkspaceContext[] };
    return (data.contexts ?? []) as WorkspaceContext[];
  } catch (e: any) {
    console.error("generateWorkspaceAutoContext error:", e.message);
    throw e;
  }
};

export const createFlashcard = async (
  workspaceId: string,
  count: number,
  language: "en" | "ar",
  focus: string | null
): Promise<GenerationJobResponse> => {
  try {
    const response = await Api<GenerationJobResponse>({
      method: API_METHODS.POST,
      data: {
        count,
        language,
        ...(focus && focus?.length > 5 ? { focus } : null),
      },
      url: `study-ai/workspaces/${workspaceId}/generate/flashcards`,
    });

    return response.data;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const getWorkSpaceContent = async (
  workspaceId: string
): Promise<{
  flashcards: FlashcardDeck[];
  quizzes: any;
  explanations: any;
  summaries: any;
}> => {
  try {
    const response = await Api({
      method: API_METHODS.GET,
      url: `study-ai/workspaces/${workspaceId}/content`,
    });

    return response.data as any;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const startWorkspaceQuizAttempt = async (
  workspaceId: string,
  quizId: string,
  payload?: { restart?: boolean }
) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/workspaces/${workspaceId}/quizzes/${quizId}/attempts`,
      data: payload ?? {},
    });
    return response.data as any;
  } catch (e: any) {
    console.error("startWorkspaceQuizAttempt error:", e.message);
    throw e;
  }
};

export const answerWorkspaceQuizQuestion = async (
  attemptId: string,
  payload: { questionId: string; selectedOption?: string | null }
) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/quizzes/attempts/${attemptId}/answer`,
      data: payload,
    });
    return response.data as any;
  } catch (e: any) {
    console.error("answerWorkspaceQuizQuestion error:", e.message);
    throw e;
  }
};

export const submitWorkspaceQuizAttempt = async (attemptId: string) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/quizzes/attempts/${attemptId}/submit`,
    });
    return response.data as any;
  } catch (e: any) {
    console.error("submitWorkspaceQuizAttempt error:", e.message);
    throw e;
  }
};
