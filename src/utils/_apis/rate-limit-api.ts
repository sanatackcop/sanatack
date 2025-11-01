import Api from "./api";
import {
  RateLimitCatalogItem,
  RateLimitSummaryResponse,
} from "@/types/rateLimit";

export const fetchRateLimitSummary = async () => {
  const response = await Api({
    method: "get",
    url: "rate-limit/summary",
  });

  return response.data as RateLimitSummaryResponse;
};

export const fetchRateLimitCatalog = async () => {
  const response = await Api({
    method: "get",
    url: "rate-limit/catalog",
  });

  return response.data as RateLimitCatalogItem[];
};
