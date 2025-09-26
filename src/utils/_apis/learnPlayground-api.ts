import Api, { API_METHODS, baseURL } from "./api";

export const youtubeUrlPastApi = async ({ url }: { url: string }) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/transcribe`,
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

// Recent
export const createNewWorkSpace = async ({
  workspaceName,
  youtubeVideoId,
}: {
  youtubeVideoId?: string;
  workspaceName: string;
}) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/workspaces`,
      data: {
        workspaceName,
        youtubeVideoId,
      },
    });

    return response.data as unknown;
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

    return response.data as unknown;
  } catch (e: any) {
    console.error("enrollCoursesApi error:", e.message);
    throw e;
  }
};

export const getAllWorkSpace = async () => {
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
  model?: string,
  onChunk?: (chunk: any) => void
): Promise<void> => {
  try {
    const auth: any = await getAuth();

    const response = await fetch(
      `${baseURL}/study-ai/workspaces/${workspaceId}/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: auth.user.id,
        },
        body: JSON.stringify({
          message,
          language,
          model,
        }),
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
