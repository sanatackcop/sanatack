import Api, { API_METHODS } from "./api";

export interface SubmitFeedbackPayload {
  subject: string;
  message: string;
}

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  try {
    const response = await Api({
      method: API_METHODS.POST,
      url: `study-ai/feedback`,
      data: payload,
    });

    return response.data as unknown;
  } catch (error) {
    console.error("submitFeedback error:", error);
    throw error;
  }
};
