import Api from "./api";
import { RateLimitSummaryResponse } from "@/types/rateLimit";

export const fetchRateLimitSummary = async () => {
  const response = await Api({
    method: "get",
    url: "rate-limit/summary",
  });

  return response.data as RateLimitSummaryResponse;
};
